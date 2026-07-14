import type { ExperienceType } from "./programs";

export type ReviewStatus =
  | "draft" | "pending_verification" | "pending_moderation"
  | "approved" | "rejected" | "flagged" | "removed";

export type ReviewerRelationship =
  | "student" | "intern" | "alumni" | "parent" | "career_switcher" | "mentor" | "other";

export interface CategoryRating { categoryKey: string; value: number; }

export interface CompanyResponse { body: string; authorName: string; respondedAt: string; }

export interface Review {
  id: string;
  slug: string;
  experienceType: ExperienceType;
  /** verified program/course/internship slug, or null for a general review */
  programSlug: string | null;
  title: string;
  body: string;
  overallRating: number;               // 1..5
  categoryRatings: CategoryRating[];
  pros: string[];
  improvements: string[];
  /** what happened afterwards, in the reviewer's words */
  outcome?: string;
  wouldRecommend: boolean | null;
  reviewerDisplayName: string;
  /** never exposed publicly */
  reviewerEmailHash?: string;
  relationship: ReviewerRelationship;
  batch?: string;                      // e.g. "2025 Cohort 3"
  experienceDate: string;              // ISO date
  verified: boolean;
  status: ReviewStatus;
  helpfulCount: number;
  reportCount: number;
  companyResponse?: CompanyResponse;
  isSample: boolean;
  submittedAt: string;
  verifiedAt?: string;
  publishedAt?: string;
  lastEditedAt?: string;
  moderatedAt?: string;
  removedAt?: string;
}

/** Public-safe projection: no email hash, no internal fields. */
export type PublicReview = Omit<Review, "reviewerEmailHash">;

export interface RatingDistribution { 1: number; 2: number; 3: number; 4: number; 5: number; }

export interface RatingSummary {
  average: number | null;   // null when there are no approved reviews — never 0
  count: number;
  distribution: RatingDistribution;
  categoryAverages: { categoryKey: string; average: number; count: number }[];
  verifiedCount: number;
  recommendPercent: number | null;
}
