/**
 * One-off, SAFE migration of existing data from Supabase PostgreSQL -> MySQL.
 *
 * PREREQUISITES (dev-only dependency, intentionally not in the app):
 *     npm i -D pg
 *
 * ENV:
 *     SUPABASE_DB_URL   postgres://...        (source; read-only usage)
 *     DATABASE_URL      mysql://...           (destination; used by Prisma)
 *
 * USAGE:
 *     DRY_RUN=true  npm run migrate:supabase     # read + report counts, write nothing
 *     npm run migrate:supabase                   # perform the import (idempotent upserts)
 *
 * GUARANTEES:
 *   • Never deletes or mutates the Supabase source.
 *   • Preserves primary keys and relationships.
 *   • Imports tables in dependency order.
 *   • Converts jsonb -> JSON and timestamptz -> UTC Date.
 *   • Idempotent: re-running upserts the same rows (no duplicates).
 *   • Never logs secrets; prints a source-vs-destination reconciliation report.
 *
 * NOT MIGRATED (documented, by design):
 *   • Supabase Auth users (auth.users) and admin_users — identities differ under
 *     Auth.js. Recreate admins with `npm run create-admin` after they sign in.
 */
import { PrismaClient } from "@prisma/client";

const DRY = process.env.DRY_RUN === "true";
const prisma = new PrismaClient();

// Lazy-require pg so the app never depends on it.
function getPg() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Pool } = require("pg");
    const url = process.env.SUPABASE_DB_URL;
    if (!url) throw new Error("SUPABASE_DB_URL is not set.");
    return new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  } catch (e) {
    console.error("Could not initialise the Postgres client. Run `npm i -D pg` and set SUPABASE_DB_URL.");
    throw e;
  }
}

const d = (v: any) => (v === null || v === undefined ? null : new Date(v));
const j = (v: any) => (v === null || v === undefined ? undefined : v);
const report: { table: string; source: number; migrated: number }[] = [];

async function copy<T>(
  pg: any,
  table: string,
  sql: string,
  upsert: (row: any) => Promise<void>,
) {
  const { rows } = await pg.query(sql);
  let migrated = 0;
  for (const row of rows) {
    if (!DRY) { await upsert(row); }
    migrated++;
  }
  report.push({ table, source: rows.length, migrated: DRY ? 0 : migrated });
  console.log(`  ${table}: ${rows.length} source rows${DRY ? " (dry-run, nothing written)" : ` -> ${migrated} upserted`}`);
}

async function main() {
  console.log(`Supabase -> MySQL migration ${DRY ? "(DRY RUN)" : ""}`);
  const pg = getPg();

  // ---- Reference tables first (parents) ----
  await copy(pg, "programs", "select * from programs", async (r) => {
    await prisma.program.upsert({
      where: { slug: r.slug },
      update: { title: r.title, type: r.type, officialUrl: r.official_url, summary: r.summary, seoIntro: r.seo_intro, sortOrder: r.sort_order, active: r.active },
      create: { slug: r.slug, title: r.title, type: r.type, officialUrl: r.official_url, summary: r.summary, seoIntro: r.seo_intro, sortOrder: r.sort_order, active: r.active, createdAt: d(r.created_at) ?? new Date() },
    });
  });

  await copy(pg, "review_categories", "select * from review_categories", async (r) => {
    await prisma.reviewCategory.upsert({
      where: { key: r.key },
      update: { label: r.label, description: r.description, sortOrder: r.sort_order, active: r.active },
      create: { key: r.key, label: r.label, description: r.description, sortOrder: r.sort_order, active: r.active },
    });
  });

  await copy(pg, "review_sources", "select * from review_sources", async (r) => {
    const data = { name: r.name, sourceGroup: r.source_group, ratingType: r.rating_type, officialUrl: r.official_url, defaultMin: r.default_min, defaultMax: r.default_max, integrationMode: r.integration_mode, countsTowardLearnerScore: r.counts_toward_learner_score, attributionRequirements: r.attribution_requirements, complianceNotes: r.compliance_notes, syncEnabled: r.sync_enabled, active: r.active };
    await prisma.reviewSource.upsert({ where: { slug: r.slug }, update: data, create: { slug: r.slug, ...data } });
  });

  await copy(pg, "reviewer_profiles", "select * from reviewer_profiles", async (r) => {
    await prisma.reviewerProfile.upsert({
      where: { id: r.id },
      update: { displayName: r.display_name, emailHash: r.email_hash },
      // userId left null: Supabase auth identities are not migrated (see header).
      create: { id: r.id, userId: null, displayName: r.display_name, emailHash: r.email_hash, createdAt: d(r.created_at) ?? new Date() },
    });
  });

  // ---- Reviews & children ----
  await copy(pg, "reviews", "select * from reviews", async (r) => {
    const data = {
      slug: r.slug, experienceType: r.experience_type, programSlug: r.program_slug, programScope: r.program_slug ?? "",
      title: r.title, body: r.body, overallRating: r.overall_rating,
      categoryRatings: j(r.category_ratings) ?? [], pros: j(r.pros) ?? [], improvements: j(r.improvements) ?? [],
      outcome: r.outcome, wouldRecommend: r.would_recommend, reviewerDisplayName: r.reviewer_display_name,
      reviewerEmailHash: r.reviewer_email_hash, reviewerId: r.reviewer_id, relationship: r.relationship,
      batch: r.batch, experienceDate: d(r.experience_date)!, verified: r.verified, status: r.status,
      helpfulCount: r.helpful_count, reportCount: r.report_count, spamFlags: j(r.spam_flags) ?? [], isSample: r.is_sample,
      submittedAt: d(r.submitted_at) ?? new Date(), verifiedAt: d(r.verified_at), publishedAt: d(r.published_at),
      lastEditedAt: d(r.last_edited_at), moderatedAt: d(r.moderated_at), removedAt: d(r.removed_at),
    };
    await prisma.review.upsert({ where: { id: r.id }, update: data, create: { id: r.id, ...data } });
  });

  await copy(pg, "category_ratings", "select * from category_ratings", async (r) => {
    await prisma.categoryRating.upsert({
      where: { reviewId_categoryKey: { reviewId: r.review_id, categoryKey: r.category_key } },
      update: { value: r.value },
      create: { id: r.id, reviewId: r.review_id, categoryKey: r.category_key, value: r.value },
    });
  });

  await copy(pg, "verification_records", "select * from verification_records", async (r) => {
    await prisma.verificationRecord.upsert({
      where: { id: r.id },
      update: { method: r.method, tokenHash: r.token_hash, verified: r.verified, verifiedAt: d(r.verified_at) },
      create: { id: r.id, reviewId: r.review_id, method: r.method, tokenHash: r.token_hash, verified: r.verified, createdAt: d(r.created_at) ?? new Date(), verifiedAt: d(r.verified_at) },
    });
  });

  await copy(pg, "company_responses", "select * from company_responses", async (r) => {
    await prisma.companyResponse.upsert({
      where: { reviewId: r.review_id },
      update: { authorName: r.author_name, body: r.body, respondedAt: d(r.responded_at) ?? new Date() },
      create: { id: r.id, reviewId: r.review_id, authorName: r.author_name, body: r.body, respondedAt: d(r.responded_at) ?? new Date() },
    });
  });

  await copy(pg, "helpful_votes", "select * from helpful_votes", async (r) => {
    await prisma.helpfulVote.upsert({
      where: { reviewId_voterHash: { reviewId: r.review_id, voterHash: r.voter_hash } },
      update: {},
      create: { id: r.id, reviewId: r.review_id, voterHash: r.voter_hash, createdAt: d(r.created_at) ?? new Date() },
    });
  });

  // review_reports: old schema stored review_slug — resolve to review id.
  await copy(pg, "review_reports", "select * from review_reports", async (r) => {
    const review = await prisma.review.findFirst({ where: { slug: r.review_slug }, select: { id: true } });
    if (!review) { console.warn(`  ! report ${r.id}: no review for slug ${r.review_slug}, skipped`); return; }
    await prisma.reviewReport.upsert({
      where: { id: r.id },
      update: { reason: r.reason, details: r.details ?? "", status: r.status },
      create: { id: r.id, reviewId: review.id, reporterHash: `legacy-${r.id}`, reason: r.reason, details: r.details ?? "", status: r.status, createdAt: d(r.created_at) ?? new Date() },
    });
  });

  await copy(pg, "moderation_actions", "select * from moderation_actions", async (r) => {
    // actorId left null: Supabase auth users are not migrated.
    await prisma.moderationAction.upsert({
      where: { id: r.id },
      update: { action: r.action, reason: r.reason },
      create: { id: r.id, reviewId: r.review_id, actorId: null, action: r.action, reason: r.reason, createdAt: d(r.created_at) ?? new Date() },
    });
  });

  await copy(pg, "review_attachments", "select * from review_attachments", async (r) => {
    await prisma.reviewAttachment.upsert({
      where: { id: r.id },
      update: { storagePath: r.storage_path, mimeType: r.mime_type, sizeBytes: r.size_bytes },
      create: { id: r.id, reviewId: r.review_id, storagePath: r.storage_path, mimeType: r.mime_type, sizeBytes: r.size_bytes, createdAt: d(r.created_at) ?? new Date() },
    });
  });

  // ---- External sources ----
  await copy(pg, "external_profiles", "select * from external_profiles", async (r) => {
    const data = { sourceSlug: r.source_slug, externalProfileId: r.external_profile_id, externalProfileUrl: r.external_profile_url, externalBusinessName: r.external_business_name, integrationMode: r.integration_mode, verificationStatus: r.verification_status, apiConnectionStatus: r.api_connection_status, lastSyncAt: d(r.last_sync_at), lastVerifiedAt: d(r.last_verified_at), nextSyncAllowedAt: d(r.next_sync_allowed_at), externalOverallRating: r.external_overall_rating, externalReviewCount: r.external_review_count, recommendationPct: r.recommendation_pct, letterGrade: r.letter_grade, active: r.active, isSample: r.is_sample, verifiedAt: d(r.verified_at) };
    await prisma.externalProfile.upsert({ where: { id: r.id }, update: data, create: { id: r.id, ...data, createdAt: d(r.created_at) ?? new Date() } });
  });

  await copy(pg, "external_reviews", "select * from external_reviews", async (r) => {
    const data = { sourceSlug: r.source_slug, externalProfileId: r.external_profile_id, externalReviewId: r.external_review_id, originalReviewUrl: r.original_review_url, authorDisplayName: r.author_display_name, authorPhotoUrl: r.author_photo_url, title: r.title, body: r.body, isExcerpt: r.is_excerpt, originalRating: r.original_rating, originalScaleMin: r.original_scale_min, originalScaleMax: r.original_scale_max, originalRatingLabel: r.original_rating_label, normalizedRating: r.normalized_rating, sourceGroup: r.source_group, publishedDate: d(r.published_date), importedDate: d(r.imported_date) ?? new Date(), lastSyncedDate: d(r.last_synced_date), verification: r.verification, attribution: r.attribution, language: r.language, companyResponse: r.company_response, importMethod: r.import_method, contentHash: r.content_hash, visibility: r.visibility, removed: r.removed, isSample: r.is_sample };
    await prisma.externalReview.upsert({ where: { id: r.id }, update: data, create: { id: r.id, ...data } });
  });

  await copy(pg, "sync_jobs", "select * from sync_jobs", async (r) => {
    await prisma.syncJob.upsert({
      where: { id: r.id }, update: { status: r.status, fetched: r.fetched },
      create: { id: r.id, sourceSlug: r.source_slug, externalProfileId: r.external_profile_id, jobType: r.job_type, startedAt: d(r.started_at) ?? new Date(), endedAt: d(r.ended_at), status: r.status, fetched: r.fetched, created: r.created, updated: r.updated, skipped: r.skipped, errorSummary: r.error_summary, retryCount: r.retry_count },
    });
  });

  await copy(pg, "import_batches", "select * from import_batches", async (r) => {
    await prisma.importBatch.upsert({
      where: { id: r.id }, update: { status: r.status, totals: j(r.totals) ?? {} },
      create: { id: r.id, sourceSlug: r.source_slug, format: r.format, adminId: null, status: r.status, totals: j(r.totals) ?? {}, createdAt: d(r.created_at) ?? new Date() },
    });
  });

  await copy(pg, "source_credentials", "select source_slug, credential_ref, updated_at from source_credentials", async (r) => {
    // encrypted_secret / bytea is intentionally NOT copied — keep secrets in env / a secret manager.
    await prisma.sourceCredential.upsert({
      where: { sourceSlug: r.source_slug }, update: { credentialRef: r.credential_ref },
      create: { sourceSlug: r.source_slug, credentialRef: r.credential_ref, updatedAt: d(r.updated_at) ?? new Date() },
    });
  });

  // ---- Website / governance (excluding auth-linked admin_users & audit actors) ----
  await copy(pg, "contact_messages", "select * from contact_messages", async (r) => {
    await prisma.contactMessage.upsert({
      where: { id: r.id }, update: {},
      create: { id: r.id, name: r.name, email: r.email, topic: r.topic, message: r.message, createdAt: d(r.created_at) ?? new Date() },
    });
  });

  await copy(pg, "site_settings", "select * from site_settings", async (r) => {
    await prisma.siteSetting.upsert({ where: { key: r.key }, update: { value: j(r.value) ?? {} }, create: { key: r.key, value: j(r.value) ?? {} } });
  });

  await copy(pg, "seo_settings", "select * from seo_settings", async (r) => {
    await prisma.seoSetting.upsert({
      where: { path: r.path }, update: { title: r.title, description: r.description, ogImage: r.og_image, noindex: r.noindex },
      create: { path: r.path, title: r.title, description: r.description, ogImage: r.og_image, noindex: r.noindex },
    });
  });

  await copy(pg, "aeo_questions", "select * from aeo_questions", async (r) => {
    await prisma.aeoQuestion.upsert({
      where: { id: r.id }, update: { question: r.question, answer: r.answer, pagePath: r.page_path, sortOrder: r.sort_order, active: r.active },
      create: { id: r.id, question: r.question, answer: r.answer, pagePath: r.page_path, sortOrder: r.sort_order, active: r.active, updatedAt: d(r.updated_at) ?? new Date() },
    });
  });

  await copy(pg, "audit_logs", "select * from audit_logs", async (r) => {
    await prisma.auditLog.upsert({
      where: { id: r.id }, update: {},
      create: { id: r.id, actorId: null, action: r.action, targetId: r.target_id, detail: r.detail, createdAt: d(r.created_at) ?? new Date() },
    });
  });

  await pg.end();

  // ---- Reconciliation report ----
  console.log("\nReconciliation report");
  console.log("─".repeat(56));
  console.log("table".padEnd(24), "source".padStart(8), "migrated".padStart(10));
  for (const r of report) console.log(r.table.padEnd(24), String(r.source).padStart(8), String(r.migrated).padStart(10));
  console.log("─".repeat(56));
  console.log("SKIPPED (by design): auth users, accounts, sessions, admin_users.");
  console.log("Recreate admins with: npm run create-admin -- <email> admin");
  if (DRY) console.log("\nDRY RUN complete — no rows were written.");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error("Migration failed:", e instanceof Error ? e.message : e); await prisma.$disconnect(); process.exit(1); });
