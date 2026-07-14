import "server-only";
import { prisma } from "../db";
import { USE_SAMPLE_DATA } from "../site-config";
import { SAMPLE_REVIEWS } from "./seed";
import { toAppReview, reviewInclude } from "./serialize";
import type { Review, ReviewStatus } from "@/lib/types";

const sampleOn = () => USE_SAMPLE_DATA;

/** Full (non-public) review rows for staff. Includes email hash — staff only. */
export async function getAllReviewsAdmin(status?: ReviewStatus): Promise<Review[]> {
  if (sampleOn()) {
    return status ? SAMPLE_REVIEWS.filter((r) => r.status === status) : SAMPLE_REVIEWS;
  }
  const rows = await prisma.review.findMany({
    where: status ? { status } : {},
    include: reviewInclude,
    orderBy: { submittedAt: "desc" },
  });
  return rows.map(toAppReview);
}

/** A signed-in reviewer's own submissions (any status). */
export async function getReviewsByReviewer(userId: string): Promise<Review[]> {
  if (sampleOn()) return [];
  const profile = await prisma.reviewerProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!profile) return [];
  const rows = await prisma.review.findMany({
    where: { reviewerId: profile.id },
    include: reviewInclude,
    orderBy: { submittedAt: "desc" },
  });
  return rows.map(toAppReview);
}

export interface AdminMetrics {
  pending: number; approved: number; rejected: number; flagged: number;
  reports: number; last7d: number;
}
export async function getAdminMetrics(): Promise<AdminMetrics> {
  const all = await getAllReviewsAdmin();
  const c = (s: ReviewStatus) => all.filter((r) => r.status === s).length;
  const week = 7 * 24 * 60 * 60 * 1000, now = Date.now();
  return {
    pending: all.filter((r) => r.status === "pending_moderation" || r.status === "pending_verification").length,
    approved: c("approved"), rejected: c("rejected"), flagged: c("flagged"),
    reports: all.reduce((a, r) => a + r.reportCount, 0),
    last7d: all.filter((r) => r.status === "approved" && r.publishedAt && now - new Date(r.publishedAt).getTime() < week).length
  };
}
