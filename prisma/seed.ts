/**
 * Prisma seed — idempotent.
 *
 *   npm run db:seed                      # reference data only (safe for prod)
 *   SEED_SAMPLE_REVIEWS=true npm run db:seed   # + clearly-marked DEV sample reviews
 *
 * Reference data (programs, categories, review sources) is safe to run in any
 * environment. Sample reviews are DEV-ONLY: they are refused when
 * NODE_ENV=production, and never inserted automatically.
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { DEFAULT_CATEGORIES } from "../src/lib/categories";
import { PROGRAMS } from "../src/lib/programs";
import { SAMPLE_REVIEWS, SAMPLE_EXTERNAL_PROFILES, SAMPLE_EXTERNAL_REVIEWS } from "../src/lib/data/seed";

const prisma = new PrismaClient();

// Canonical review-source catalogue (mirrors supabase 0003_reference_data.sql).
const SOURCES = [
  { slug: "builders-review", name: "builders.review", group: "first_party", ratingType: "five_star", url: "/", min: 1, max: 5, mode: "official_api", counts: true, attr: "Submitted on builders.review", notes: "Owned data; email-verified and moderated." },
  { slug: "google", name: "Google Reviews", group: "learner", ratingType: "five_star", url: "https://www.google.com/maps", min: 1, max: 5, mode: "disabled", counts: true, attr: 'Display "Powered by Google" and link to the Google profile.', notes: "Places Details returns a LIMITED selection of reviews. Never claim it is all of them. Requires a real Place ID + API key." },
  { slug: "trustpilot", name: "Trustpilot", group: "learner", ratingType: "five_star", url: "https://www.trustpilot.com", min: 1, max: 5, mode: "disabled", counts: true, attr: "Link to the Trustpilot profile.", notes: "Business API/TrustBox require a business account." },
  { slug: "facebook", name: "Facebook Recommendations", group: "learner", ratingType: "recommendation_pct", url: "https://www.facebook.com", min: 0, max: 100, mode: "disabled", counts: false, attr: "Link to the Facebook page.", notes: "Recommend/not-recommend, not stars. Never convert to stars." },
  { slug: "justdial", name: "Justdial", group: "learner", ratingType: "five_star", url: "https://www.justdial.com", min: 1, max: 5, mode: "external_link_only", counts: true, attr: "Link to the Justdial listing.", notes: "Confirm official access; otherwise link-only." },
  { slug: "mouthshut", name: "MouthShut", group: "learner", ratingType: "five_star", url: "https://www.mouthshut.com", min: 1, max: 5, mode: "external_link_only", counts: true, attr: "Link to the MouthShut listing.", notes: "Confirm official access; otherwise link-only." },
  { slug: "sitejabber", name: "Sitejabber", group: "learner", ratingType: "five_star", url: "https://www.sitejabber.com", min: 1, max: 5, mode: "external_link_only", counts: true, attr: "Link to the Sitejabber profile.", notes: "Widgets may require a business plan." },
  { slug: "consumeraffairs", name: "ConsumerAffairs", group: "learner", ratingType: "five_star", url: "https://www.consumeraffairs.com", min: 1, max: 5, mode: "external_link_only", counts: true, attr: "Link to the ConsumerAffairs profile.", notes: "Accredited-brand program; verify display rights." },
  { slug: "bbb", name: "Better Business Bureau", group: "learner", ratingType: "letter_grade", url: "https://www.bbb.org", min: 0, max: 0, mode: "disabled", counts: false, attr: "Link to the BBB profile.", notes: "Letter grades, not stars. Never convert. Only enable if a genuine profile exists." },
  { slug: "glassdoor", name: "Glassdoor", group: "employer", ratingType: "five_star", url: "https://www.glassdoor.com", min: 1, max: 5, mode: "external_link_only", counts: false, attr: "Link to the Glassdoor profile.", notes: "EMPLOYEE reviews. Never merged into learner scores." },
  { slug: "ambitionbox", name: "AmbitionBox", group: "employer", ratingType: "five_star", url: "https://www.ambitionbox.com", min: 1, max: 5, mode: "external_link_only", counts: false, attr: "Link to the AmbitionBox profile.", notes: "EMPLOYEE reviews. Never merged into learner scores." },
  { slug: "indeed", name: "Indeed Company Reviews", group: "employer", ratingType: "five_star", url: "https://www.indeed.com", min: 1, max: 5, mode: "external_link_only", counts: false, attr: "Link to the Indeed profile.", notes: "EMPLOYEE reviews. Never merged into learner scores." },
] as const;

async function seedReference() {
  for (const c of DEFAULT_CATEGORIES) {
    await prisma.reviewCategory.upsert({
      where: { key: c.key },
      update: { label: c.label, description: c.description, sortOrder: c.order, active: c.active },
      create: { key: c.key, label: c.label, description: c.description, sortOrder: c.order, active: c.active },
    });
  }
  for (let i = 0; i < PROGRAMS.length; i++) {
    const p = PROGRAMS[i]!;
    const data = { title: p.title, type: p.type as any, officialUrl: p.officialUrl, summary: p.summary, seoIntro: p.seoIntro, sortOrder: i + 1, active: p.active };
    await prisma.program.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
  }
  for (const s of SOURCES) {
    const data = {
      name: s.name, sourceGroup: s.group as any, ratingType: s.ratingType as any, officialUrl: s.url,
      defaultMin: s.min, defaultMax: s.max, integrationMode: s.mode as any,
      countsTowardLearnerScore: s.counts, attributionRequirements: s.attr, complianceNotes: s.notes, active: true,
    };
    await prisma.reviewSource.upsert({ where: { slug: s.slug }, update: data, create: { slug: s.slug, ...data } });
  }
  console.log(`Reference data seeded: ${DEFAULT_CATEGORIES.length} categories, ${PROGRAMS.length} programs, ${SOURCES.length} sources.`);
}

async function seedSampleReviews() {
  if (process.env.NODE_ENV === "production") {
    console.warn("Refusing to seed sample reviews in production. Aborting sample seed.");
    return;
  }
  for (const r of SAMPLE_REVIEWS) {
    const base = {
      slug: r.slug, experienceType: r.experienceType as any, programSlug: r.programSlug ?? null,
      programScope: r.programSlug ?? "", title: r.title, body: r.body, overallRating: r.overallRating,
      categoryRatings: r.categoryRatings as unknown as Prisma.InputJsonValue,
      pros: r.pros as unknown as Prisma.InputJsonValue,
      improvements: r.improvements as unknown as Prisma.InputJsonValue,
      outcome: r.outcome ?? null, wouldRecommend: r.wouldRecommend,
      reviewerDisplayName: r.reviewerDisplayName,
      reviewerEmailHash: r.reviewerEmailHash ?? `sample-${r.id}`,
      relationship: r.relationship, batch: r.batch ?? null,
      experienceDate: new Date(r.experienceDate), verified: r.verified, status: r.status as any,
      helpfulCount: r.helpfulCount, reportCount: r.reportCount, isSample: true,
      submittedAt: new Date(r.submittedAt),
      verifiedAt: r.verifiedAt ? new Date(r.verifiedAt) : null,
      publishedAt: r.publishedAt ? new Date(r.publishedAt) : null,
      moderatedAt: r.moderatedAt ? new Date(r.moderatedAt) : null,
    };
    const review = await prisma.review.upsert({
      where: { slug: r.slug }, update: base, create: { id: r.id, ...base },
    });
    await prisma.categoryRating.deleteMany({ where: { reviewId: review.id } });
    if (r.categoryRatings.length) {
      await prisma.categoryRating.createMany({
        data: r.categoryRatings.map((c) => ({ reviewId: review.id, categoryKey: c.categoryKey, value: c.value })),
        skipDuplicates: true,
      });
    }
    if (r.companyResponse) {
      await prisma.companyResponse.upsert({
        where: { reviewId: review.id },
        update: { body: r.companyResponse.body, authorName: r.companyResponse.authorName },
        create: { reviewId: review.id, body: r.companyResponse.body, authorName: r.companyResponse.authorName },
      });
    }
  }
  for (const p of SAMPLE_EXTERNAL_PROFILES) {
    const data = {
      sourceSlug: p.sourceSlug, externalProfileId: p.externalProfileId, externalProfileUrl: p.externalProfileUrl,
      externalBusinessName: p.externalBusinessName, integrationMode: p.integrationMode as any,
      verificationStatus: p.verificationStatus, apiConnectionStatus: p.apiConnectionStatus,
      externalOverallRating: p.externalOverallRating ?? null, externalReviewCount: p.externalReviewCount ?? null,
      active: p.active, isSample: true,
      verifiedAt: p.verifiedAt ? new Date(p.verifiedAt) : null,
      lastVerifiedAt: p.lastVerifiedAt ? new Date(p.lastVerifiedAt) : null,
    };
    await prisma.externalProfile.upsert({ where: { id: p.id }, update: data, create: { id: p.id, ...data } });
  }
  for (const r of SAMPLE_EXTERNAL_REVIEWS) {
    const data = {
      sourceSlug: r.sourceSlug, externalProfileId: r.externalProfileId, externalReviewId: r.externalReviewId,
      originalReviewUrl: r.originalReviewUrl, authorDisplayName: r.authorDisplayName, body: r.body,
      isExcerpt: r.isExcerpt, originalRating: r.originalRating, originalScaleMin: r.originalScale.min,
      originalScaleMax: r.originalScale.max, originalRatingLabel: r.originalScale.label,
      normalizedRating: r.normalizedRating ?? null, sourceGroup: r.group as any,
      publishedDate: r.publishedDate ? new Date(r.publishedDate) : null,
      importedDate: new Date(r.importedDate), verification: r.verification, attribution: r.attribution,
      language: r.language ?? null, companyResponse: r.companyResponse ?? null, contentHash: r.contentHash,
      importMethod: r.importMethod as any, visibility: r.visibility, removed: r.removed, isSample: true,
    };
    await prisma.externalReview.upsert({ where: { id: r.id }, update: data, create: { id: r.id, ...data } });
  }
  console.log(`Sample data seeded: ${SAMPLE_REVIEWS.length} reviews, ${SAMPLE_EXTERNAL_PROFILES.length} external profiles, ${SAMPLE_EXTERNAL_REVIEWS.length} external reviews.`);
}

async function main() {
  await seedReference();
  if (process.env.SEED_SAMPLE_REVIEWS === "true") await seedSampleReviews();
  else console.log("Skipping sample reviews (set SEED_SAMPLE_REVIEWS=true to include DEV samples).");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
