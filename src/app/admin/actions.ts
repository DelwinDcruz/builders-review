"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, canModerate } from "@/lib/auth/roles";
import { getSourceDef } from "@/lib/sources/definitions";
import { urlMatchesSource } from "@/lib/sources/security";
import { getConnectorForProfile } from "@/lib/sources/connectors/registry";
import { rateLimit } from "@/lib/security/rate-limit";
import { getSourceOverviews } from "@/lib/data/sources-repo";
import type { ExternalProfile } from "@/lib/sources/types";
import type { ReviewStatus } from "@/lib/types";

export type ActionResult = { ok: boolean; message: string };

async function requireModerator() {
  const u = await getCurrentUser();
  if (!u.previewMode && !canModerate(u.role)) throw new Error("Unauthorised");
  return u;
}

/** Persist an audit entry. Secrets are never written. */
async function audit(action: string, targetId: string, detail?: string) {
  const u = await getCurrentUser();
  if (u.previewMode) { console.info("[audit:preview]", { action, targetId }); return; }
  try {
    await prisma.auditLog.create({ data: { actorId: u.id, action, targetId, detail: detail ?? null } });
  } catch (e) {
    console.error("[audit] failed", e instanceof Error ? e.message : e);
  }
}

/** Approve / reject / remove a review. Reason recorded for every action. */
export async function setReviewStatus(reviewId: string, status: ReviewStatus, reason?: string): Promise<ActionResult> {
  const u = await requireModerator();
  if (!u.previewMode) {
    const now = new Date();
    try {
      await prisma.$transaction(async (tx) => {
        await tx.review.update({
          where: { id: reviewId },
          data: {
            status,
            moderatedAt: now,
            ...(status === "approved" ? { publishedAt: now } : {}),
            ...(status === "removed" ? { removedAt: now } : {}),
          },
        });
        await tx.moderationAction.create({
          data: { reviewId, actorId: u.id, action: `review.${status}`, reason: reason ?? null },
        });
      });
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : "Update failed." };
    }
  } else console.info("[admin:setReviewStatus:preview]", { reviewId, status, reason });

  await audit(`review.${status}`, reviewId, reason);
  revalidatePath("/admin"); revalidatePath("/admin/moderation"); revalidatePath("/reviews");
  return { ok: true, message: status === "approved" ? "Review approved and published." : `Review ${status}.` };
}

/** Post the single public company response allowed per review. */
export async function setCompanyResponse(reviewId: string, body: string): Promise<ActionResult> {
  const u = await requireModerator();
  if (!u.previewMode) {
    try {
      await prisma.companyResponse.upsert({
        where: { reviewId },
        update: { body, authorName: "Portfolio Builders" },
        create: { reviewId, body, authorName: "Portfolio Builders" },
      });
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : "Could not save response." };
    }
  } else console.info("[admin:setCompanyResponse:preview]", { reviewId });
  await audit("review.company_response", reviewId);
  revalidatePath("/admin/moderation");
  return { ok: true, message: "Response saved. It never changes the review's rating." };
}

async function getTrustedProfile(sourceSlug: string): Promise<ExternalProfile | null> {
  const sources = await getSourceOverviews();
  return sources.find((s) => s.def.slug === sourceSlug)?.profile ?? null;
}

/** Honest connection test — validates config; only Google actually calls an API. */
export async function testConnection(sourceSlug: string): Promise<ActionResult> {
  await requireModerator();
  const def = getSourceDef(sourceSlug);
  if (!def) return { ok: false, message: "Unknown source." };

  const profile = await getTrustedProfile(sourceSlug);
  if (!profile) return { ok: false, message: `Save the ${def.name} profile before testing it.` };

  if (profile.externalProfileUrl && !urlMatchesSource(sourceSlug, profile.externalProfileUrl)) {
    return { ok: false, message: `The saved URL is not on ${def.name}'s domain.` };
  }

  const connector = getConnectorForProfile(profile);
  if (!connector) return { ok: false, message: "No connector is available for this profile." };

  try {
    const health = await connector.health(profile);
    await audit(health.ok ? "source.connection.success" : "source.connection.failed", profile.id, health.status);
    return { ok: health.ok, message: health.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connection test failed.";
    await audit("source.connection.failed", profile.id, message);
    return { ok: false, message };
  }
}

/** Manually trigger a sync. Rate-limited; honest about what is possible. */
export async function triggerSync(profile: ExternalProfile): Promise<ActionResult> {
  const u = await requireModerator();
  const rl = rateLimit(`manual-sync:${profile.id}`, 3, 3600_000);
  if (!rl.ok) return { ok: false, message: "Rate limit reached for manual sync on this profile." };

  const def = getSourceDef(profile.sourceSlug);
  const connector = getConnectorForProfile(profile);
  if (!connector) return { ok: false, message: "No connector for this source." };

  if (profile.integrationMode !== "official_api") {
    return {
      ok: true,
      message: `${def?.name ?? "This source"} has no API connector configured for this profile, so there is nothing to synchronize. Use a manually verified summary, an authorized import, or link-only mode.`,
    };
  }

  try {
    const result = await connector.fetchReviews(profile);
    if (!u.previewMode) {
      await prisma.syncJob.create({
        data: {
          sourceSlug: profile.sourceSlug, externalProfileId: profile.id, jobType: "manual",
          status: "success", fetched: result.reviews.length, endedAt: new Date(),
        },
      });
    }
    await audit("source.sync.manual", profile.id);
    revalidatePath("/admin/sources"); revalidatePath("/reviews");
    revalidatePath("/google-reviews"); revalidatePath("/review-platforms");
    return {
      ok: true,
      message: `Synced. Fetched ${result.reviews.length} review${result.reviews.length === 1 ? "" : "s"}${
        result.partialSelection ? " — note: the platform returns only a limited selection, never every review." : "."
      }`,
    };
  } catch (e) {
    if (!u.previewMode) {
      await prisma.syncJob.create({
        data: {
          sourceSlug: profile.sourceSlug, externalProfileId: profile.id, jobType: "manual",
          status: "failed", errorSummary: e instanceof Error ? e.message : "unknown", endedAt: new Date(),
        },
      }).catch(() => {});
    }
    return { ok: false, message: e instanceof Error ? e.message : "Sync failed." };
  }
}

const sourceProfileSchema = z.object({
  sourceSlug: z.string().trim().min(1).max(60),
  externalProfileId: z.string().trim().min(8).max(255),
  externalProfileUrl: z.string().trim().url().max(2000),
  integrationMode: z.enum([
    "official_api", "official_widget", "partner_api", "authorized_import",
    "manual_summary", "external_link_only", "disabled",
  ]),
});

export async function saveSourceProfile(input: unknown): Promise<ActionResult> {
  const u = await requireModerator();
  const parsed = sourceProfileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid profile details." };

  const { sourceSlug, externalProfileId, externalProfileUrl, integrationMode } = parsed.data;
  const def = getSourceDef(sourceSlug);
  if (!def) return { ok: false, message: "Unknown review source." };

  if (!urlMatchesSource(sourceSlug, externalProfileUrl)) {
    return { ok: false, message: `That URL is not on ${def.name}'s permitted domain.` };
  }
  if (sourceSlug === "google" && !process.env.GOOGLE_MAPS_API_KEY && !process.env.GOOGLE_PLACES_API_KEY) {
    return { ok: false, message: "Google API key is missing." };
  }

  if (u.previewMode) {
    console.info("[admin:saveSourceProfile:preview]", parsed.data);
    return { ok: true, message: "Profile validated in preview mode but was not stored." };
  }

  try {
    const existing = await prisma.externalProfile.findFirst({ where: { sourceSlug }, select: { id: true } });
    if (existing) {
      await prisma.externalProfile.update({
        where: { id: existing.id },
        data: { externalProfileId, externalProfileUrl, integrationMode },
      });
    } else {
      await prisma.externalProfile.create({
        data: { sourceSlug, externalProfileId, externalProfileUrl, integrationMode },
      });
    }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Could not save profile." };
  }

  await audit("source.profile.saved", sourceSlug, `Integration mode: ${integrationMode}`);
  revalidatePath("/admin/sources"); revalidatePath("/google-reviews"); revalidatePath("/review-platforms");
  return { ok: true, message: `${def.name} profile saved. Test the connection before verifying it.` };
}

export async function setSourceEnabled(sourceSlug: string, enabled: boolean): Promise<ActionResult> {
  const u = await requireModerator();
  if (!u.previewMode) {
    try {
      await prisma.reviewSource.update({ where: { slug: sourceSlug }, data: { active: enabled } });
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : "Could not update source." };
    }
  } else console.info("[admin:setSourceEnabled:preview]", { sourceSlug, enabled });
  await audit(`source.${enabled ? "enabled" : "disabled"}`, sourceSlug);
  revalidatePath("/admin/sources");
  return { ok: true, message: `Source ${enabled ? "enabled" : "disabled"}.` };
}
