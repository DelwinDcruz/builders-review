import "server-only";
import type { Prisma } from "@prisma/client";
import type { CategoryRating, CompanyResponse, Review } from "@/lib/types";
import type { ExperienceType } from "@/lib/programs";

const iso = (d: Date | null | undefined): string | undefined =>
  d ? new Date(d).toISOString() : undefined;

/** experience_date is a DATE — expose as YYYY-MM-DD (UTC), matching the old API. */
const dateOnly = (d: Date): string => new Date(d).toISOString().slice(0, 10);

const asStringArray = (v: Prisma.JsonValue | null | undefined): string[] =>
  Array.isArray(v) ? (v.filter((x) => typeof x === "string") as string[]) : [];

const asCategoryRatings = (v: Prisma.JsonValue | null | undefined): CategoryRating[] =>
  Array.isArray(v)
    ? (v
        .map((x) =>
          x && typeof x === "object" && "categoryKey" in x && "value" in x
            ? { categoryKey: String((x as any).categoryKey), value: Number((x as any).value) }
            : null,
        )
        .filter(Boolean) as CategoryRating[])
    : [];

/** A Prisma review row plus its optional company response. */
export type ReviewRow = {
  id: string;
  slug: string;
  experienceType: string;
  programSlug: string | null;
  title: string;
  body: string;
  overallRating: number;
  categoryRatings: Prisma.JsonValue;
  pros: Prisma.JsonValue;
  improvements: Prisma.JsonValue;
  outcome: string | null;
  wouldRecommend: boolean | null;
  reviewerDisplayName: string;
  reviewerEmailHash: string;
  relationship: string;
  batch: string | null;
  experienceDate: Date;
  verified: boolean;
  status: string;
  helpfulCount: number;
  reportCount: number;
  isSample: boolean;
  submittedAt: Date;
  verifiedAt: Date | null;
  publishedAt: Date | null;
  lastEditedAt: Date | null;
  moderatedAt: Date | null;
  removedAt: Date | null;
  companyResponse?: { body: string; authorName: string; respondedAt: Date } | null;
};

/** Map a DB row to the app `Review` type. Keeps the email hash (server side). */
export function toAppReview(r: ReviewRow): Review {
  const cr: CompanyResponse | undefined = r.companyResponse
    ? {
        body: r.companyResponse.body,
        authorName: r.companyResponse.authorName,
        respondedAt: new Date(r.companyResponse.respondedAt).toISOString(),
      }
    : undefined;

  return {
    id: r.id,
    slug: r.slug,
    experienceType: r.experienceType as ExperienceType,
    programSlug: r.programSlug,
    title: r.title,
    body: r.body,
    overallRating: r.overallRating,
    categoryRatings: asCategoryRatings(r.categoryRatings),
    pros: asStringArray(r.pros),
    improvements: asStringArray(r.improvements),
    outcome: r.outcome ?? undefined,
    wouldRecommend: r.wouldRecommend,
    reviewerDisplayName: r.reviewerDisplayName,
    reviewerEmailHash: r.reviewerEmailHash,
    relationship: r.relationship as Review["relationship"],
    batch: r.batch ?? undefined,
    experienceDate: dateOnly(r.experienceDate),
    verified: r.verified,
    status: r.status as Review["status"],
    helpfulCount: r.helpfulCount,
    reportCount: r.reportCount,
    companyResponse: cr,
    isSample: r.isSample,
    submittedAt: new Date(r.submittedAt).toISOString(),
    verifiedAt: iso(r.verifiedAt),
    publishedAt: iso(r.publishedAt),
    lastEditedAt: iso(r.lastEditedAt),
    moderatedAt: iso(r.moderatedAt),
    removedAt: iso(r.removedAt),
  };
}

/** Standard include to hydrate a review with its company response. */
export const reviewInclude = { companyResponse: true } as const;
