/** One display shape for first-party + external reviews. Pure, client-safe. */
import type { PublicReview } from "@/lib/types";
import type { ExternalReview } from "@/lib/sources/types";
import { getSourceDef } from "@/lib/sources/definitions";
import { getProgram, EXPERIENCE_LABELS } from "@/lib/programs";
import type { ExpKey } from "@/lib/sources/branding";

export interface UnifiedReview {
  key: string;
  origin: "first_party" | "external";
  sourceSlug: string;
  sourceName: string;
  /** the exact label required by the honesty rules */
  originLabel: string;
  experience: ExpKey;
  programTitle: string | null;
  programSlug: string | null;
  title: string;
  excerpt: string;
  isExcerpt: boolean;
  author: string;
  authorPhotoUrl?: string | null;
  experienceDate?: string;
  publishedDate?: string;
  rating: number | null;      // normalized 0..5, null when not star-compatible
  ratingLabel: string;
  verified: boolean;
  verificationLabel: string;
  pros: string[];
  improvements: string[];
  outcome?: string;
  wouldRecommend: boolean | null;
  companyResponse?: string | null;
  internalHref?: string;
  externalHref?: string | null;
  helpfulCount?: number;
  isSample: boolean;
  /** true when a platform only returned a subset of its reviews */
  partialSelection?: boolean;
}

export function unifyFirstParty(r: PublicReview): UnifiedReview {
  const program = r.programSlug ? getProgram(r.programSlug) : undefined;
  return {
    key: `fp-${r.slug}`,
    origin: "first_party",
    sourceSlug: "builders-review",
    sourceName: "builders.review",
    originLabel: "Submitted on builders.review",
    experience: r.experienceType as ExpKey,
    programTitle: program?.title ?? EXPERIENCE_LABELS[r.experienceType],
    programSlug: r.programSlug,
    title: r.title,
    excerpt: r.body,
    isExcerpt: false,
    author: r.reviewerDisplayName,
    experienceDate: r.experienceDate,
    publishedDate: r.publishedAt ?? r.submittedAt,
    rating: r.overallRating,
    ratingLabel: `${r.overallRating.toFixed(1)} / 5`,
    verified: r.verified,
    verificationLabel: r.verified ? "Verified reviewer" : "Unverified",
    pros: r.pros,
    improvements: r.improvements,
    outcome: r.outcome,
    wouldRecommend: r.wouldRecommend,
    companyResponse: r.companyResponse?.body ?? null,
    internalHref: `/reviews/${r.slug}`,
    externalHref: null,
    helpfulCount: r.helpfulCount,
    isSample: r.isSample
  };
}

export function unifyExternal(r: ExternalReview): UnifiedReview {
  const def = getSourceDef(r.sourceSlug);
  const name = def?.name ?? r.sourceSlug;
  const originLabel =
    r.importMethod === "official_api" ? `Originally published on ${name}`
    : r.importMethod === "authorized_import" ? `Authorized import from ${name}`
    : r.importMethod === "manual_summary" ? `Manually verified summary from ${name}`
    : `Originally published on ${name}`;

  return {
    key: `ex-${r.id}`,
    origin: "external",
    sourceSlug: r.sourceSlug,
    sourceName: name,
    originLabel,
    experience: r.group === "employer" ? "other" : "other",
    programTitle: null,
    programSlug: null,
    title: r.title ?? "",
    excerpt: r.body,
    isExcerpt: r.isExcerpt,
    author: r.authorDisplayName,
    authorPhotoUrl: r.authorPhotoUrl ?? null,
    publishedDate: r.publishedDate ?? r.importedDate,
    rating: r.normalizedRating,
    ratingLabel: r.originalScale.label,
    verified: r.verification === "source_verified",
    verificationLabel:
      r.verification === "source_verified" ? `Verified on ${name}`
      : r.verification === "manually_verified" ? "Manually imported"
      : "Unverified",
    pros: [],
    improvements: [],
    wouldRecommend: null,
    companyResponse: r.companyResponse ?? null,
    externalHref: r.originalReviewUrl,
    isSample: r.isSample,
    partialSelection: r.importMethod === "official_api" && r.sourceSlug === "google"
  };
}

export function mergeReviews(a: UnifiedReview[], b: UnifiedReview[]): UnifiedReview[] {
  const t = (r: UnifiedReview) => (r.publishedDate ? new Date(r.publishedDate).getTime() : 0);
  return [...a, ...b].sort((x, y) => t(y) - t(x));
}
