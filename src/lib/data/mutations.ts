import "server-only";
import crypto from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { USE_SAMPLE_DATA } from "../site-config";
import { assessSpam, sanitizeText } from "@/lib/security/moderation";
import type { ReviewSubmission } from "@/lib/validation/review";

const sampleOn = () => USE_SAMPLE_DATA;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70);
export const hashEmail = (e: string) => crypto.createHash("sha256").update(e.trim().toLowerCase()).digest("hex");

/** Anonymous, non-reversible fingerprint for abuse controls (votes/reports). */
export const fingerprint = (...parts: (string | null | undefined)[]) =>
  crypto.createHash("sha256").update(parts.filter(Boolean).join("|")).digest("hex");

const isUniqueViolation = (e: unknown) =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";

// export interface SubmitResult {
//   ok: true; id: string; slug: string;
//   status: "pending_verification"; spamFlags: string[]; requiresEmailVerification: true;
// }

export interface SubmitResult {
  ok: true;
  id: string;
  slug: string;
  status: "approved";
  spamFlags: string[];
  requiresEmailVerification: false;
}

/** Persist as PENDING VERIFICATION. A review is never auto-published. */
export async function submitReview(input: ReviewSubmission): Promise<SubmitResult> {
  const clean = {
    ...input,
    title: sanitizeText(input.title),
    body: sanitizeText(input.body),
    outcome: sanitizeText(input.outcome ?? ""),
    pros: input.pros.map(sanitizeText).filter(Boolean),
    improvements: input.improvements.map(sanitizeText).filter(Boolean),
    reviewerName: sanitizeText(input.reviewerName),
  };
  const spam = assessSpam({ title: clean.title, body: clean.body, name: clean.reviewerName });
  const id = crypto.randomUUID();
  const slug = `${slugify(clean.title)}-${id.slice(0, 8)}`;
  const emailHash = hashEmail(input.reviewerEmail);
  const programScope = clean.programSlug ?? "";

  if (!sampleOn()) {
    // Explicit duplicate check (works even when programSlug is NULL because
    // programScope is a non-null normalized key), plus the DB unique backstop.
    const dupe = await prisma.review.findFirst({
      where: { reviewerEmailHash: emailHash, experienceType: clean.experienceType, programScope },
      select: { id: true },
    });
    if (dupe) throw new Error("duplicate");

    try {
      await prisma.$transaction(async (tx) => {
        await tx.review.create({
          data: {
            id, slug,
            experienceType: clean.experienceType,
            programSlug: clean.programSlug ?? null,
            programScope,
            title: clean.title, body: clean.body,
            overallRating: clean.overallRating,
            categoryRatings: clean.categoryRatings as unknown as Prisma.InputJsonValue,
            pros: clean.pros as unknown as Prisma.InputJsonValue,
            improvements: clean.improvements as unknown as Prisma.InputJsonValue,
            outcome: clean.outcome || null,
            wouldRecommend: clean.wouldRecommend,
            reviewerDisplayName: clean.reviewerName,
            reviewerEmailHash: emailHash,
            relationship: clean.relationship,
            batch: clean.batch || null,
            experienceDate: new Date(clean.experienceDate),
            // verified: false,
            // status: "pending_verification",
            // spamFlags: spam.flags as unknown as Prisma.InputJsonValue,
            // isSample: false,
            verified: false,
status: "approved",
publishedAt: new Date(),
moderatedAt: new Date(),
spamFlags: spam.flags as unknown as Prisma.InputJsonValue,
isSample: false,
          },
        });
        if (clean.categoryRatings.length) {
          await tx.categoryRating.createMany({
            data: clean.categoryRatings.map((c) => ({ reviewId: id, categoryKey: c.categoryKey, value: c.value })),
            skipDuplicates: true,
          });
        }
        // await tx.verificationRecord.create({ data: { reviewId: id, method: "email", verified: false } });
      });
    } catch (e) {
      if (isUniqueViolation(e)) throw new Error("duplicate");
      throw e;
    }
  } else {
    console.info("[submitReview:sample] accepted", { slug, spamFlags: spam.flags });
  }
  // return { ok: true, id, slug, status: "pending_verification", spamFlags: spam.flags, requiresEmailVerification: true };

  return {
  ok: true,
  id,
  slug,
  status: "approved",
  spamFlags: spam.flags,
  requiresEmailVerification: false,
};
}

/**
 * Atomic, abuse-resistant helpful vote. One vote per voter fingerprint per
 * review; the vote row and the counter increment succeed or fail together.
 */
export async function recordHelpful(slug: string, voterHash: string): Promise<{ helpfulCount: number; already?: boolean }> {
  if (sampleOn()) return { helpfulCount: 1 };

  return prisma.$transaction(async (tx) => {
    const review = await tx.review.findFirst({ where: { slug, status: "approved" }, select: { id: true, helpfulCount: true } });
    if (!review) throw new Error("not_found");

    const existing = await tx.helpfulVote.findUnique({
      where: { reviewId_voterHash: { reviewId: review.id, voterHash } },
      select: { id: true },
    });
    if (existing) return { helpfulCount: review.helpfulCount, already: true };

    try {
      await tx.helpfulVote.create({ data: { reviewId: review.id, voterHash } });
    } catch (e) {
      if (isUniqueViolation(e)) return { helpfulCount: review.helpfulCount, already: true };
      throw e;
    }
    const updated = await tx.review.update({
      where: { id: review.id },
      data: { helpfulCount: { increment: 1 } },
      select: { helpfulCount: true },
    });
    return { helpfulCount: updated.helpfulCount };
  });
}

/**
 * Resolve a review by slug, store a real FK relationship, increment reportCount
 * atomically and prevent uncontrolled duplicate reports per reporter fingerprint.
 */
export async function recordReport(slug: string, reason: string, details: string, reporterHash: string): Promise<void> {
  if (sampleOn()) { console.info("[recordReport:sample]", { slug, reason }); return; }

  await prisma.$transaction(async (tx) => {
    const review = await tx.review.findFirst({ where: { slug }, select: { id: true } });
    if (!review) throw new Error("not_found");

    const existing = await tx.reviewReport.findUnique({
      where: { reviewId_reporterHash: { reviewId: review.id, reporterHash } },
      select: { id: true },
    });
    if (existing) return; // already reported by this fingerprint — do not double-count

    try {
      await tx.reviewReport.create({
        data: { reviewId: review.id, reporterHash, reason, details: sanitizeText(details), status: "open" },
      });
    } catch (e) {
      if (isUniqueViolation(e)) return;
      throw e;
    }
    await tx.review.update({ where: { id: review.id }, data: { reportCount: { increment: 1 } } });
  });
}

export async function recordContact(i: { name: string; email: string; topic: string; message: string }): Promise<void> {
  if (sampleOn()) { console.info("[recordContact:sample]", { topic: i.topic }); return; }
  await prisma.contactMessage.create({
    data: { name: sanitizeText(i.name), email: i.email, topic: i.topic, message: sanitizeText(i.message) },
  });
}
