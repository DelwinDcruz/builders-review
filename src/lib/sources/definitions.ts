/**
 * Review sources for builders.review.
 *
 * HONESTY: a source only appears publicly when Portfolio Builders has a genuine,
 * admin-verified profile on it. Integration facts not confirmable from the
 * platform's CURRENT official docs are marked "requires_verification" and the
 * source defaults to link-only or disabled. No endpoints or credentials invented.
 *
 * Employer platforms (Glassdoor, AmbitionBox, Indeed) are in the `employer`
 * group and NEVER contribute to learner/student scores.
 */
import type { IntegrationMode, ReviewSourceDef, SourceCapabilities, TriState } from "./types";

const RV: TriState = "requires_verification";

const caps = (p: Partial<SourceCapabilities>): SourceCapabilities => ({
  profileLookup: false, aggregateRating: false, fullReviews: false, reviewExcerpts: false,
  pagination: false, companyReplies: false, scheduledSync: false, csvImport: true,
  widgets: false, linkOnly: true, requiresPartnerApproval: false, ...p
});

const integ = (p: Partial<ReviewSourceDef["integration"]>): ReviewSourceDef["integration"] => ({
  officialApi: RV, widgets: RV, individualReviews: RV, excerptsOnly: RV,
  partnershipRequired: RV, dataStorageAllowed: RV, authType: "unknown",
  recommendedFallback: "external_link_only",
  attribution: "Show the platform name and link to the original profile.",
  complianceNotes: "Verify current official docs, display rules and storage terms before activation.",
  ...p
});

export const REVIEW_SOURCES: ReviewSourceDef[] = [
  {
    slug: "builders-review", name: "builders.review", group: "first_party", ratingType: "five_star",
    officialUrl: "/", defaultMin: 1, defaultMax: 5, countsTowardLearnerScore: true,
    integration: integ({
      officialApi: "yes", individualReviews: "yes", excerptsOnly: "no", partnershipRequired: "no",
      dataStorageAllowed: "yes", authType: "first-party (this application)",
      recommendedFallback: "official_api", attribution: "Submitted on builders.review",
      complianceNotes: "Owned data — full control. Verified by email, moderated before publication."
    }),
    capabilities: caps({ profileLookup: true, aggregateRating: true, fullReviews: true, reviewExcerpts: true, pagination: true, companyReplies: true, scheduledSync: true }),
    defaultMode: "official_api"
  },
  {
    slug: "google", name: "Google Reviews", group: "learner", ratingType: "five_star",
    officialUrl: "https://www.google.com/maps/place/Portfolio+Builders/@9.9913162,76.3088804,17z/data=!3m1!4b1!4m6!3m5!1s0x3b080de39107c207:0x569c75484de12d30!8m2!3d9.9913109!4d76.3114553!16s%2Fg%2F11w3tgsqfb", defaultMin: 1, defaultMax: 5, countsTowardLearnerScore: true,
    integration: integ({
      officialApi: "yes", excerptsOnly: "yes", authType: "API key (Google Places API) — a real Place ID is required",
      recommendedFallback: "manual_summary",
      attribution: "Display 'Powered by Google' and link to the original Google profile. Show reviewer name, photo and relative time as returned.",
      complianceNotes: "Places Details returns the rating, total rating count and a LIMITED selection of reviews (historically up to 5). Never claim this selection is every Google review. Google Business Profile API (owner-only) can be added later. Verify current caching/storage limits before enabling sync."
    }),
    capabilities: caps({ profileLookup: true, aggregateRating: true, reviewExcerpts: true, companyReplies: true, scheduledSync: true }),
    defaultMode: "disabled"
  },
  {
    slug: "trustpilot", name: "Trustpilot", group: "learner", ratingType: "five_star",
    officialUrl: "https://www.trustpilot.com", defaultMin: 1, defaultMax: 5, countsTowardLearnerScore: true,
    integration: integ({ authType: "OAuth 2.0 / Business API", widgets: "yes",
      complianceNotes: "Business API + TrustBox widgets require a Trustpilot business account." }),
    capabilities: caps({ profileLookup: true, aggregateRating: true, reviewExcerpts: true, widgets: true, companyReplies: true, requiresPartnerApproval: true }),
    defaultMode: "disabled"
  },
  {
    slug: "facebook", name: "Facebook Recommendations", group: "learner", ratingType: "recommendation_pct",
    officialUrl: "https://www.facebook.com", defaultMin: 0, defaultMax: 100, countsTowardLearnerScore: false,
    integration: integ({ authType: "OAuth 2.0 (Meta Graph — Page access)",
      complianceNotes: "Facebook records recommend / not-recommend, NOT stars. Never convert a recommendation percentage into a star rating." }),
    capabilities: caps({ profileLookup: true, aggregateRating: true, companyReplies: true }),
    defaultMode: "disabled"
  },
  {
    slug: "justdial", name: "Justdial", group: "learner", ratingType: "five_star",
    officialUrl: "https://www.justdial.com", defaultMin: 1, defaultMax: 5, countsTowardLearnerScore: true,
    integration: integ({ authType: "unknown", complianceNotes: "Confirm whether any official API/widget exists; otherwise link-only." }),
    capabilities: caps({ aggregateRating: true }), defaultMode: "external_link_only"
  },
  {
    slug: "mouthshut", name: "MouthShut", group: "learner", ratingType: "five_star",
    officialUrl: "https://www.mouthshut.com", defaultMin: 1, defaultMax: 5, countsTowardLearnerScore: true,
    integration: integ({ authType: "unknown", complianceNotes: "Confirm official access before use; otherwise link-only." }),
    capabilities: caps({ aggregateRating: true }), defaultMode: "external_link_only"
  },
  {
    slug: "sitejabber", name: "Sitejabber", group: "learner", ratingType: "five_star",
    officialUrl: "https://www.sitejabber.com", defaultMin: 1, defaultMax: 5, countsTowardLearnerScore: true,
    integration: integ({ authType: "business program", complianceNotes: "Widgets/API may require a business plan." }),
    capabilities: caps({ aggregateRating: true, widgets: true, requiresPartnerApproval: true }), defaultMode: "external_link_only"
  },
  {
    slug: "consumeraffairs", name: "ConsumerAffairs", group: "learner", ratingType: "five_star",
    officialUrl: "https://www.consumeraffairs.com", defaultMin: 1, defaultMax: 5, countsTowardLearnerScore: true,
    integration: integ({ authType: "brand/partner program", complianceNotes: "Accredited-brand program; verify display rights." }),
    capabilities: caps({ aggregateRating: true, requiresPartnerApproval: true }), defaultMode: "external_link_only"
  },
  {
    slug: "bbb", name: "Better Business Bureau", group: "learner", ratingType: "letter_grade",
    officialUrl: "https://www.bbb.org", defaultMin: 0, defaultMax: 0, countsTowardLearnerScore: false,
    integration: integ({ authType: "accreditation program",
      complianceNotes: "BBB issues letter grades (A+..F) and accreditation, not five stars. Never convert a grade into stars. Likely irrelevant for an India-based company — only enable if a genuine profile exists." }),
    capabilities: caps({ aggregateRating: true }), defaultMode: "disabled"
  },
  // ---- Employer group: NEVER merged into learner scores ----
  {
    slug: "glassdoor", name: "Glassdoor", group: "employer", ratingType: "five_star",
    officialUrl: "https://www.glassdoor.com", defaultMin: 1, defaultMax: 5, countsTowardLearnerScore: false,
    integration: integ({ authType: "partner API (restricted)", partnershipRequired: "yes",
      complianceNotes: "Employee reviews. Displayed only in the separate Employee experience section." }),
    capabilities: caps({ profileLookup: true, aggregateRating: true, requiresPartnerApproval: true }), defaultMode: "external_link_only"
  },
  {
    slug: "ambitionbox", name: "AmbitionBox", group: "employer", ratingType: "five_star",
    officialUrl: "https://www.ambitionbox.com", defaultMin: 1, defaultMax: 5, countsTowardLearnerScore: false,
    integration: integ({ authType: "unknown", complianceNotes: "Employee reviews (India). Kept separate from learner scores." }),
    capabilities: caps({ aggregateRating: true }), defaultMode: "external_link_only"
  },
  {
    slug: "indeed", name: "Indeed Company Reviews", group: "employer", ratingType: "five_star",
    officialUrl: "https://www.indeed.com", defaultMin: 1, defaultMax: 5, countsTowardLearnerScore: false,
    integration: integ({ authType: "unknown/partner", complianceNotes: "Employee reviews. Kept separate from learner scores." }),
    capabilities: caps({ aggregateRating: true }), defaultMode: "external_link_only"
  }
];

export const SOURCE_MAP: Record<string, ReviewSourceDef> = Object.fromEntries(REVIEW_SOURCES.map((s) => [s.slug, s]));
export const getSourceDef = (slug: string): ReviewSourceDef | undefined => SOURCE_MAP[slug];
export const externalSourceDefs = (): ReviewSourceDef[] => REVIEW_SOURCES.filter((s) => s.group !== "first_party");
export const learnerSourceDefs = (): ReviewSourceDef[] => REVIEW_SOURCES.filter((s) => s.group === "learner");
export const employerSourceDefs = (): ReviewSourceDef[] => REVIEW_SOURCES.filter((s) => s.group === "employer");

export const GROUP_LABELS: Record<string, string> = {
  first_party: "Submitted on builders.review",
  learner: "Student & customer review platforms",
  employer: "Employee review platforms"
};

export const RATING_TYPE_LABELS: Record<string, string> = {
  five_star: "Star rating (out of 5)",
  recommendation_pct: "Recommendation percentage",
  letter_grade: "Letter grade / accreditation"
};

export const SOURCE_LABEL: Record<string, string> = {
  official_api: "Official API",
  official_widget: "Official widget",
  partner_api: "Approved partner API",
  authorized_import: "Authorized import",
  manual_summary: "Manually verified summary",
  external_link_only: "External link only",
  disabled: "Disabled"
};
