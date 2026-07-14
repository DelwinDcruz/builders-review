import "server-only";
import { prisma } from "../db";
import { USE_SAMPLE_DATA } from "../site-config";
import { DEFAULT_CATEGORIES } from "../categories";
import { PROGRAMS, getProgram as getProgramDef, type ExperienceType, type Program } from "../programs";
import { summarise } from "../rating/engine";
import type { PublicReview, RatingSummary, Review, ReviewStatus } from "../types";
import type { ReviewCategory } from "../categories";
import { SAMPLE_REVIEWS } from "./seed";
import { toAppReview, reviewInclude } from "./serialize";

/**
 * Public read layer. Returns ONLY approved, public-safe reviews (never the
 * reviewer's email hash or internal moderation fields).
 *
 * Data source:
 *   • NEXT_PUBLIC_USE_SAMPLE_DATA="true"  -> clearly-marked dev/demo sample data
 *   • otherwise                            -> real approved rows from MySQL
 * Production runs with sample data OFF and NEVER falls back to it: a MySQL
 * error propagates instead of silently serving fake reviews.
 */
const sampleOn = () => USE_SAMPLE_DATA;

export const toPublic = (r: Review): PublicReview => {
  const { reviewerEmailHash: _omit, ...rest } = r;
  return rest;
};

/** Every APPROVED, public-safe review from the active data source. */
async function allApproved(): Promise<PublicReview[]> {
  if (sampleOn()) {
    return SAMPLE_REVIEWS.filter((r) => r.status === "approved").map(toPublic);
  }
  const rows = await prisma.review.findMany({
    where: { status: "approved" },
    include: reviewInclude,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(toAppReview).map(toPublic);
}

export async function getCategories(): Promise<ReviewCategory[]> {
  if (!sampleOn()) {
    const rows = await prisma.reviewCategory.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length) {
      return rows.map((c) => ({
        key: c.key, label: c.label, description: c.description, order: c.sortOrder, active: c.active,
      }));
    }
  }
  return DEFAULT_CATEGORIES.filter((c) => c.active).sort((a, b) => a.order - b.order);
}

export async function getPrograms(type?: ExperienceType): Promise<Program[]> {
  if (!sampleOn()) {
    const rows = await prisma.program.findMany({
      where: { active: true, ...(type ? { type } : {}) },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length) {
      return rows.map((p) => ({
        slug: p.slug, title: p.title, type: p.type as ExperienceType,
        officialUrl: p.officialUrl ?? "", summary: p.summary, seoIntro: p.seoIntro, active: p.active,
      }));
    }
  }
  const list = PROGRAMS.filter((p) => p.active);
  return type ? list.filter((p) => p.type === type) : list;
}

export async function getProgram(slug: string): Promise<Program | undefined> {
  if (!sampleOn()) {
    const p = await prisma.program.findUnique({ where: { slug } });
    if (p) return { slug: p.slug, title: p.title, type: p.type as ExperienceType, officialUrl: p.officialUrl ?? "", summary: p.summary, seoIntro: p.seoIntro, active: p.active };
  }
  return getProgramDef(slug);
}

// ---------------------------------------------------------------------------
// Query / sort / paginate
// ---------------------------------------------------------------------------
export type ReviewSort = "newest" | "oldest" | "highest" | "lowest" | "helpful";

export interface ReviewQuery {
  experienceType?: ExperienceType;
  programSlug?: string;
  category?: string;
  minRating?: number;
  verifiedOnly?: boolean;
  recommendedOnly?: boolean;
  search?: string;
  sort?: ReviewSort;
  page?: number;
  pageSize?: number;
}

export interface PagedReviews { reviews: PublicReview[]; total: number; page: number; pageSize: number; totalPages: number; }

const matches = (r: PublicReview, q: ReviewQuery) => {
  if (q.experienceType && r.experienceType !== q.experienceType) return false;
  if (q.programSlug && r.programSlug !== q.programSlug) return false;
  if (q.verifiedOnly && !r.verified) return false;
  if (q.recommendedOnly && r.wouldRecommend !== true) return false;
  if (typeof q.minRating === "number" && r.overallRating < q.minRating) return false;
  if (q.category && !r.categoryRatings.some((c) => c.categoryKey === q.category)) return false;
  if (q.search) {
    const hay = `${r.title} ${r.body} ${r.pros.join(" ")} ${r.improvements.join(" ")}`.toLowerCase();
    if (!hay.includes(q.search.toLowerCase())) return false;
  }
  return true;
};

const when = (r: PublicReview) => new Date(r.publishedAt ?? r.submittedAt).getTime();

function sortReviews(list: PublicReview[], sort: ReviewSort): PublicReview[] {
  const c = [...list];
  switch (sort) {
    case "oldest": return c.sort((a, b) => when(a) - when(b));
    case "highest": return c.sort((a, b) => b.overallRating - a.overallRating || when(b) - when(a));
    case "lowest": return c.sort((a, b) => a.overallRating - b.overallRating || when(b) - when(a));
    case "helpful": return c.sort((a, b) => b.helpfulCount - a.helpfulCount || when(b) - when(a));
    default: return c.sort((a, b) => when(b) - when(a));
  }
}

export async function getReviews(q: ReviewQuery = {}): Promise<PagedReviews> {
  const page = Math.max(1, q.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, q.pageSize ?? 10));
  const filtered = sortReviews((await allApproved()).filter((r) => matches(r, q)), q.sort ?? "newest");
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  return { reviews: filtered.slice(start, start + pageSize), total, page, pageSize, totalPages };
}

export async function getReviewBySlug(slug: string) { return (await allApproved()).find((r) => r.slug === slug); }
export async function getRelatedReviews(r: PublicReview, limit = 3) {
  return (await allApproved()).filter((x) => x.slug !== r.slug && x.experienceType === r.experienceType).slice(0, limit);
}
export async function getRecentReviews(limit = 6) { return sortReviews(await allApproved(), "newest").slice(0, limit); }
export async function getFeaturedReviews(limit = 3) {
  return (await allApproved()).filter((r) => r.verified && r.overallRating >= 4).sort((a, b) => b.helpfulCount - a.helpfulCount).slice(0, limit);
}
export async function getIndexableReviewSlugs() { return (await allApproved()).map((r) => r.slug); }

// ---------------------------------------------------------------------------
// Score groups — employee reviews live in sources-repo and are NEVER mixed here
// ---------------------------------------------------------------------------
/** Everything a learner experiences. Excludes website-experience reviews. */
export async function getLearnerSummary(): Promise<RatingSummary> {
  return summarise((await allApproved()).filter((r) => r.experienceType !== "website"));
}
export async function getSummaryByExperience(type: ExperienceType): Promise<RatingSummary> {
  return summarise((await allApproved()).filter((r) => r.experienceType === type));
}
export async function getSummaryByProgram(slug: string): Promise<RatingSummary> {
  return summarise((await allApproved()).filter((r) => r.programSlug === slug));
}
/** Score for a single category across all approved reviews (e.g. placement_assistance). */
export async function getCategoryScore(categoryKey: string): Promise<{ average: number | null; count: number }> {
  const values = (await allApproved()).flatMap((r) => r.categoryRatings.filter((c) => c.categoryKey === categoryKey).map((c) => c.value));
  if (values.length === 0) return { average: null, count: 0 };
  return { average: values.reduce((a, b) => a + b, 0) / values.length, count: values.length };
}

export interface ProgramPerformance { program: Program; summary: RatingSummary; }
export async function getProgramPerformance(type?: ExperienceType): Promise<ProgramPerformance[]> {
  const programs = await getPrograms(type);
  const all = await allApproved();
  return programs.map((program) => ({
    program,
    summary: summarise(all.filter((r) => r.programSlug === program.slug)),
  }));
}

export const isSampleModeActive = () => sampleOn();
export type { ReviewStatus };
