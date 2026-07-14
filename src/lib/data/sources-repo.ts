import "server-only";
import { prisma } from "../db";
import { USE_SAMPLE_DATA } from "../site-config";
import { REVIEW_SOURCES } from "../sources/definitions";
import { normalizedForType } from "../sources/normalize";
import { deriveSourceStatus } from "../sources/status";
import { weightedCombine, type Contribution, type WeightedScore } from "../rating/engine";
import type { ExternalProfile, ExternalReview, ReviewSourceDef, SourceStatus } from "../sources/types";
import { SAMPLE_EXTERNAL_PROFILES, SAMPLE_EXTERNAL_REVIEWS } from "./seed";
import { getLearnerSummary, getRecentReviews } from "./repo";
import { unifyExternal, unifyFirstParty, mergeReviews, type UnifiedReview } from "../reviews/unify";

const sampleOn = () => USE_SAMPLE_DATA;
const num = (d: unknown): number | null => (d === null || d === undefined ? null : Number(d));
const iso = (d: Date | null | undefined): string | undefined => (d ? new Date(d).toISOString() : undefined);

// --- DB row -> app type mappers -------------------------------------------
type ProfileRow = Awaited<ReturnType<typeof prisma.externalProfile.findMany>>[number];
type ExtReviewRow = Awaited<ReturnType<typeof prisma.externalReview.findMany>>[number];

const mapProfile = (p: ProfileRow): ExternalProfile => ({
  id: p.id,
  sourceSlug: p.sourceSlug,
  externalProfileId: p.externalProfileId,
  externalProfileUrl: p.externalProfileUrl,
  externalBusinessName: p.externalBusinessName,
  integrationMode: p.integrationMode,
  verificationStatus: p.verificationStatus as ExternalProfile["verificationStatus"],
  verifiedAt: iso(p.verifiedAt),
  apiConnectionStatus: p.apiConnectionStatus as ExternalProfile["apiConnectionStatus"],
  lastSyncAt: iso(p.lastSyncAt),
  lastVerifiedAt: iso(p.lastVerifiedAt),
  externalOverallRating: num(p.externalOverallRating),
  externalReviewCount: p.externalReviewCount ?? null,
  recommendationPct: num(p.recommendationPct),
  letterGrade: p.letterGrade ?? null,
  active: p.active,
  isSample: p.isSample,
});

const mapExtReview = (r: ExtReviewRow): ExternalReview => ({
  id: r.id,
  sourceSlug: r.sourceSlug,
  externalProfileId: r.externalProfileId,
  externalReviewId: r.externalReviewId,
  originalReviewUrl: r.originalReviewUrl,
  authorDisplayName: r.authorDisplayName,
  authorPhotoUrl: r.authorPhotoUrl,
  title: r.title ?? undefined,
  body: r.body,
  isExcerpt: r.isExcerpt,
  originalRating: Number(r.originalRating),
  originalScale: { min: Number(r.originalScaleMin), max: Number(r.originalScaleMax), label: r.originalRatingLabel },
  normalizedRating: num(r.normalizedRating),
  group: r.sourceGroup,
  publishedDate: iso(r.publishedDate),
  importedDate: new Date(r.importedDate).toISOString(),
  lastSyncedDate: iso(r.lastSyncedDate),
  verification: r.verification as ExternalReview["verification"],
  attribution: r.attribution,
  language: r.language ?? undefined,
  companyResponse: r.companyResponse,
  contentHash: r.contentHash,
  importMethod: r.importMethod,
  visibility: r.visibility as ExternalReview["visibility"],
  removed: r.removed,
  isSample: r.isSample,
});

// --- Data acquisition ------------------------------------------------------
/** Verified, active profiles only — a source is never shown without one. */
export async function getExternalProfiles(): Promise<ExternalProfile[]> {
  if (sampleOn()) {
    return SAMPLE_EXTERNAL_PROFILES.filter((p) => p.active && p.verificationStatus === "verified");
  }
  const rows = await prisma.externalProfile.findMany({
    where: { active: true, verificationStatus: "verified" },
  });
  return rows.map(mapProfile);
}

export async function getProfileForSource(slug: string) {
  return (await getExternalProfiles()).find((p) => p.sourceSlug === slug);
}

async function fetchExternalReviews(): Promise<ExternalReview[]> {
  if (sampleOn()) {
    return SAMPLE_EXTERNAL_REVIEWS.filter((r) => r.visibility === "visible" && !r.removed);
  }
  const rows = await prisma.externalReview.findMany({ where: { visibility: "visible", removed: false } });
  return rows.map(mapExtReview);
}

export async function getExternalReviews(sourceSlug?: string): Promise<ExternalReview[]> {
  const list = await fetchExternalReviews();
  return sourceSlug ? list.filter((r) => r.sourceSlug === sourceSlug) : list;
}

// ---------------------------------------------------------------------------
// Source overview
// ---------------------------------------------------------------------------
export interface SourceOverview {
  def: ReviewSourceDef;
  profile?: ExternalProfile;
  status: SourceStatus;
  normalized: number | null;
  reviewCount: number;
  platformCount: number;
  lastUpdated?: string;
  connected: boolean;
}

export async function getSourceOverviews(): Promise<SourceOverview[]> {
  const [profiles, reviews] = await Promise.all([getExternalProfiles(), fetchExternalReviews()]);
  return REVIEW_SOURCES.filter((d) => d.group !== "first_party").map((def) => {
    const profile = profiles.find((p) => p.sourceSlug === def.slug);
    const normalized =
      profile && profile.externalOverallRating !== null
        ? normalizedForType(def.ratingType, profile.externalOverallRating, def.defaultMin, def.defaultMax)
        : null;
    return {
      def, profile,
      status: deriveSourceStatus(def, profile ? [profile] : []),
      normalized,
      reviewCount: reviews.filter((r) => r.sourceSlug === def.slug).length,
      platformCount: profile?.externalReviewCount ?? 0,
      lastUpdated: profile?.lastVerifiedAt ?? profile?.lastSyncAt,
      connected: Boolean(profile),
    };
  });
}

/** Only sources with a genuine verified profile are shown publicly. */
export async function getConnectedSources(group?: "learner" | "employer"): Promise<SourceOverview[]> {
  const all = (await getSourceOverviews()).filter((s) => s.connected);
  return group ? all.filter((s) => s.def.group === group) : all;
}

// ---------------------------------------------------------------------------
// Combined scores — LEARNER and EMPLOYEE are computed separately, always.
// ---------------------------------------------------------------------------
async function learnerContributions(): Promise<Contribution[]> {
  const out: Contribution[] = [];
  const fp = await getLearnerSummary();
  if (fp.average !== null && fp.count > 0) {
    out.push({ sourceSlug: "builders-review", normalized: fp.average, reviewCount: fp.count, isPlatformSummary: false });
  }
  for (const s of await getConnectedSources("learner")) {
    if (!s.def.countsTowardLearnerScore) continue;
    if (s.normalized === null || !s.platformCount) continue;
    out.push({
      sourceSlug: s.def.slug, normalized: s.normalized, reviewCount: s.platformCount,
      isPlatformSummary: s.profile?.integrationMode !== "official_api",
    });
  }
  return out;
}

/** Combined LEARNER score. Employee reviews can never reach this function. */
export async function getCombinedLearnerScore(): Promise<WeightedScore> {
  return weightedCombine(await learnerContributions());
}

/** Combined EMPLOYEE score, from employer platforms only. Displayed separately. */
export async function getEmployeeScore(): Promise<WeightedScore> {
  const contribs: Contribution[] = [];
  for (const s of await getConnectedSources("employer")) {
    if (s.normalized === null || !s.platformCount) continue;
    contribs.push({ sourceSlug: s.def.slug, normalized: s.normalized, reviewCount: s.platformCount, isPlatformSummary: true });
  }
  return weightedCombine(contribs);
}

// ---------------------------------------------------------------------------
// Feed + totals
// ---------------------------------------------------------------------------
export async function getUnifiedRecentReviews(limit = 6): Promise<UnifiedReview[]> {
  const [recent, external] = await Promise.all([getRecentReviews(limit), fetchExternalReviews()]);
  const fp = recent.map(unifyFirstParty);
  const ex = external.filter((r) => r.group !== "employer").map(unifyExternal);
  return mergeReviews(fp, ex).slice(0, limit);
}

export interface HeroTotals {
  approvedReviews: number;
  connectedSources: number;
  reviewedPrograms: number;
  verifiedReviews: number;
  lastUpdatedLabel: string | null;
  hasAnyData: boolean;
}

export async function getHeroTotals(): Promise<HeroTotals> {
  const [fp, sources, profiles, external, recentAll] = await Promise.all([
    getLearnerSummary(),
    getConnectedSources(),
    getExternalProfiles(),
    fetchExternalReviews(),
    getRecentReviews(1000),
  ]);
  const { PROGRAMS } = await import("../programs");
  const reviewed = new Set(recentAll.map((r) => r.programSlug).filter(Boolean)).size;
  const last = profiles.map((p) => p.lastVerifiedAt).filter(Boolean).sort().pop();
  const approvedReviews = fp.count + external.length;

  return {
    approvedReviews,
    connectedSources: sources.length + 1,
    reviewedPrograms: Math.min(reviewed, PROGRAMS.length),
    verifiedReviews: fp.verifiedCount,
    lastUpdatedLabel: last ? new Date(last).toISOString().slice(0, 10) : null,
    hasAnyData: approvedReviews > 0,
  };
}

export const sourcesSampleActive = () => sampleOn();
