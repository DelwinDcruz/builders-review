/** Which audience a source measures. Learner ≠ employee — never combined. */
export type SourceGroup = "first_party" | "learner" | "employer";

export type RatingType = "five_star" | "recommendation_pct" | "letter_grade";

export type IntegrationMode =
  | "official_api" | "official_widget" | "partner_api" | "authorized_import"
  | "manual_summary" | "external_link_only" | "disabled";

export type SourceStatus =
  | "connected" | "requires_credentials" | "awaiting_approval"
  | "manual_import" | "link_only" | "sync_error" | "disabled";

export type TriState = "yes" | "no" | "requires_verification";

export interface SourceCapabilities {
  profileLookup: boolean; aggregateRating: boolean; fullReviews: boolean;
  reviewExcerpts: boolean; pagination: boolean; companyReplies: boolean;
  scheduledSync: boolean; csvImport: boolean; widgets: boolean;
  linkOnly: boolean; requiresPartnerApproval: boolean;
}

export interface ReviewSourceDef {
  slug: string;
  name: string;
  group: SourceGroup;
  ratingType: RatingType;
  officialUrl: string;
  defaultMin: number;
  defaultMax: number;
  /** feeds the combined LEARNER score (star-compatible learner sources only) */
  countsTowardLearnerScore: boolean;
  integration: {
    officialApi: TriState; widgets: TriState; individualReviews: TriState;
    excerptsOnly: TriState; partnershipRequired: TriState; dataStorageAllowed: TriState;
    authType: string; recommendedFallback: IntegrationMode;
    attribution: string; complianceNotes: string;
  };
  capabilities: SourceCapabilities;
  defaultMode: IntegrationMode;
}

/** Verified external profile for Portfolio Builders on a platform. */
export interface ExternalProfile {
  id: string;
  sourceSlug: string;
  externalProfileId: string | null;   // e.g. Google Place ID
  externalProfileUrl: string;
  externalBusinessName: string;
  integrationMode: IntegrationMode;
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  verifiedAt?: string;
  apiConnectionStatus: "n/a" | "ok" | "error";
  lastSyncAt?: string;
  lastVerifiedAt?: string;
  externalOverallRating: number | null;   // ORIGINAL scale
  externalReviewCount: number | null;
  recommendationPct?: number | null;
  letterGrade?: string | null;
  active: boolean;
  isSample: boolean;
}

export interface ExternalReview {
  id: string;
  sourceSlug: string;
  externalProfileId: string;
  externalReviewId: string | null;
  originalReviewUrl: string | null;
  authorDisplayName: string;
  authorPhotoUrl?: string | null;
  title?: string;
  body: string;
  isExcerpt: boolean;
  originalRating: number;
  originalScale: { min: number; max: number; label: string };
  normalizedRating: number | null;
  group: SourceGroup;
  publishedDate?: string;
  importedDate: string;
  lastSyncedDate?: string;
  verification: "source_verified" | "unverified" | "manually_verified";
  attribution: string;
  language?: string;
  companyResponse?: string | null;
  contentHash: string;
  importMethod: IntegrationMode;
  visibility: "visible" | "hidden";
  removed: boolean;
  isSample: boolean;
}

export interface SyncJob {
  id: string; sourceSlug: string; externalProfileId: string;
  jobType: "scheduled" | "manual"; startedAt: string; endedAt?: string;
  status: "queued" | "running" | "success" | "partial" | "failed";
  fetched: number; created: number; updated: number; skipped: number;
  errorSummary?: string; retryCount: number;
}
