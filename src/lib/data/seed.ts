/**
 * DEVELOPMENT SAMPLE DATA — clearly marked, easy to disable.
 * Every review below is fictional and exists only to demonstrate the platform.
 * Served ONLY when NEXT_PUBLIC_USE_SAMPLE_DATA !== "false".
 * Programs are REAL (from the official site); reviews are NOT.
 */
import type { Review } from "../types";
import type { ExternalProfile, ExternalReview } from "../sources/types";

const iso = (daysAgo: number) => {
  const d = new Date("2026-07-09T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString();
};
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

interface D {
  exp: Review["experienceType"]; program: string | null; title: string; body: string;
  overall: number; cats: [string, number][]; pros: string[]; imps: string[];
  outcome?: string; rec: boolean | null; name: string; rel: Review["relationship"];
  batch?: string; date: string; verified: boolean; status: Review["status"];
  helpful: number; response?: string; daysAgo: number;
}

const DRAFTS: D[] = [
  { exp: "course", program: "ui-ux-course", title: "Clear path from zero to a real UI/UX portfolio",
    body: "I joined with no design background. Every topic tied back to a real project, so I finished with an actual portfolio instead of just notes. Mentors reviewed my work weekly and were honest about what wasn't good enough yet.",
    overall: 5, cats: [["course_quality",5],["mentor_support",5],["practical_projects",5],["value_for_money",4],["portfolio_support",5]],
    pros: ["Structured and beginner-friendly","Weekly mentor feedback","Real project work"],
    imps: ["More evening sessions for working students"], outcome: "Started applying for junior UI/UX roles with 3 case studies.",
    rec: true, name: "Agnal M.", rel: "student", batch: "2026 Cohort 1", date: "2026-04-10",
    verified: true, status: "approved", helpful: 14,
    response: "Thank you Agnal — we've added two extra evening mentor slots based on feedback like yours.", daysAgo: 40 },

  { exp: "internship", program: "fyugp-internship", title: "FYUGP documentation support was the highlight",
    body: "The internship gave me structured project work and, importantly, submission-ready documentation for my FYUGP credits. Deadlines were communicated clearly and my mentor checked the report before submission.",
    overall: 4, cats: [["internship_experience",4],["communication",4],["transparency",5],["value_for_money",4],["mentor_support",4]],
    pros: ["Credit-ready documentation","Clear deadlines"], imps: ["Would like more choice of project domains"],
    outcome: "Credits approved by my college.", rec: true, name: "Sreelakshmi R.", rel: "intern",
    date: "2026-03-01", verified: true, status: "approved", helpful: 9, daysAgo: 62 },

  { exp: "internship", program: "aicte-internship", title: "Solid AICTE track, wanted deeper technical review",
    body: "The AICTE internship was well organised and the certificate process was smooth. The project brief was realistic. I would have liked a deeper code review at the end rather than just a submission check.",
    overall: 4, cats: [["internship_experience",4],["practical_projects",4],["mentor_support",3],["support_responsiveness",4]],
    pros: ["Smooth certificate process","Realistic brief"], imps: ["Deeper technical/code review at the end"],
    rec: true, name: "Nikhil P.", rel: "intern", date: "2026-05-20", verified: false, status: "approved", helpful: 4, daysAgo: 20 },

  { exp: "mentorship", program: "mentorship", title: "Mentors are working designers, and it shows",
    body: "My mentor works at a product company and gave feedback that was specific rather than generic. Response time on the community channel was usually within a day. Occasionally slower during busy weeks.",
    overall: 5, cats: [["mentor_support",5],["support_responsiveness",4],["career_guidance",5]],
    pros: ["Specific, actionable feedback","Industry-active mentors"], imps: ["Slower replies in busy weeks"],
    rec: true, name: "Fathima S.", rel: "student", date: "2026-02-15", verified: true, status: "approved", helpful: 11, daysAgo: 80 },

  { exp: "program", program: "switch-careers-to-uiux", title: "Good for switching, but plan for the time commitment",
    body: "I moved from a non-design job. The structure helped me stay accountable and the portfolio reviews were the most useful part. Be realistic: it needs consistent weekly hours alongside a full-time job.",
    overall: 4, cats: [["course_quality",4],["career_guidance",4],["portfolio_support",5],["transparency",4],["value_for_money",4]],
    pros: ["Accountability and structure","Portfolio reviews"], imps: ["Be clearer upfront about weekly hours needed"],
    outcome: "Switched into a design role after 7 months.", rec: true, name: "Rahul K.", rel: "career_switcher",
    date: "2026-01-30", verified: true, status: "approved", helpful: 7, daysAgo: 95 },

  { exp: "career_support", program: "career-support", title: "Career guidance helped, placement support varies",
    body: "The guidance sessions on positioning and interviews were genuinely useful. Placement support depended a lot on how proactive I was — the job postings were plentiful but the applying was on me.",
    overall: 3, cats: [["career_guidance",4],["placement_assistance",3],["communication",3],["transparency",4]],
    pros: ["Useful interview prep","Lots of job postings"], imps: ["Set clearer expectations about placement support"],
    rec: null, name: "Meera J.", rel: "alumni", date: "2026-06-01", verified: false, status: "approved", helpful: 6, daysAgo: 14 },

  { exp: "community", program: "community", title: "Active community, lots of free opportunities",
    body: "The WhatsApp and Discord community is active. Job and internship postings appear regularly and people actually answer questions. Occasionally noisy.",
    overall: 5, cats: [["community_experience",5],["communication",4]],
    pros: ["Regular job postings","People answer questions"], imps: ["Can get noisy"], rec: true,
    name: "Deepak V.", rel: "student", date: "2026-05-02", verified: true, status: "approved", helpful: 8, daysAgo: 30 },

  { exp: "website", program: "website-experience", title: "Site is clear, program pages could show fees",
    body: "portfoliobuilders.in loads quickly and the internship pages explain eligibility well. I had to email to find out fees for one program — showing them on the page would save time.",
    overall: 4, cats: [["website_experience",4],["transparency",3]],
    pros: ["Fast, clear internship pages"], imps: ["Show fees on program pages"], rec: true,
    name: "Anjali T.", rel: "student", date: "2026-06-10", verified: false, status: "approved", helpful: 3, daysAgo: 12 },

  // Moderation-queue demo — excluded from all public figures.
  { exp: "course", program: "web-development-course", title: "Awaiting moderation example review",
    body: "This is a sample pending review used to demonstrate the moderation queue. It must not appear in public listings or affect any rating.",
    overall: 2, cats: [], pros: [], imps: [], rec: null, name: "Pending Sample", rel: "other",
    date: "2026-06-20", verified: false, status: "pending_moderation", helpful: 0, daysAgo: 5 }
];

export const SAMPLE_REVIEWS: Review[] = DRAFTS.map((d, i) => ({
  id: `sample-${i + 1}`,
  slug: `${slugify(d.title)}-${i + 1}`,
  experienceType: d.exp,
  programSlug: d.program,
  title: d.title,
  body: d.body,
  overallRating: d.overall,
  categoryRatings: d.cats.map(([categoryKey, value]) => ({ categoryKey, value })),
  pros: d.pros,
  improvements: d.imps,
  outcome: d.outcome,
  wouldRecommend: d.rec,
  reviewerDisplayName: d.name,
  relationship: d.rel,
  batch: d.batch,
  experienceDate: d.date,
  verified: d.verified,
  status: d.status,
  helpfulCount: d.helpful,
  reportCount: 0,
  companyResponse: d.response ? { body: d.response, authorName: "Portfolio Builders", respondedAt: iso(d.daysAgo - 2) } : undefined,
  isSample: true,
  submittedAt: iso(d.daysAgo + 2),
  verifiedAt: d.verified ? iso(d.daysAgo + 1) : undefined,
  publishedAt: d.status === "approved" ? iso(d.daysAgo) : undefined,
  moderatedAt: d.status === "approved" ? iso(d.daysAgo) : undefined
}));

/**
 * SAMPLE external profiles. NOTE: these do NOT assert that Portfolio Builders
 * actually has these profiles — they are demo rows so the source UI is testable.
 * In production, an administrator must add and verify each real profile.
 */
export const SAMPLE_EXTERNAL_PROFILES: ExternalProfile[] = [
  { id: "extp-google", sourceSlug: "google", externalProfileId: "SAMPLE_PLACE_ID",
    externalProfileUrl: "https://www.google.com/maps/place/?q=place_id:SAMPLE_PLACE_ID",
    externalBusinessName: "Portfolio Builders", integrationMode: "manual_summary",
    verificationStatus: "verified", verifiedAt: iso(6), apiConnectionStatus: "n/a",
    externalOverallRating: 4.7, externalReviewCount: 38, active: true, isSample: true, lastVerifiedAt: iso(6) },
  { id: "extp-justdial", sourceSlug: "justdial", externalProfileId: "SAMPLE_JD",
    externalProfileUrl: "https://www.justdial.com/SAMPLE-portfolio-builders",
    externalBusinessName: "Portfolio Builders", integrationMode: "external_link_only",
    verificationStatus: "verified", verifiedAt: iso(18), apiConnectionStatus: "n/a",
    externalOverallRating: 4.4, externalReviewCount: 11, active: true, isSample: true, lastVerifiedAt: iso(18) },
  { id: "extp-glassdoor", sourceSlug: "glassdoor", externalProfileId: "SAMPLE_GD",
    externalProfileUrl: "https://www.glassdoor.com/Reviews/SAMPLE-portfolio-builders.htm",
    externalBusinessName: "Portfolio Builders", integrationMode: "external_link_only",
    verificationStatus: "verified", verifiedAt: iso(25), apiConnectionStatus: "n/a",
    externalOverallRating: 4.1, externalReviewCount: 7, active: true, isSample: true, lastVerifiedAt: iso(25) }
];

const hash = (s: string) => s.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7).toString(16);

export const SAMPLE_EXTERNAL_REVIEWS: ExternalReview[] = [
  { id: "extr-1", sourceSlug: "google", externalProfileId: "extp-google", externalReviewId: "SAMPLE-g1",
    originalReviewUrl: "https://www.google.com/maps/place/?q=place_id:SAMPLE_PLACE_ID",
    authorDisplayName: "R. Menon", body: "SAMPLE. Genuinely helpful mentors and a clear path to a portfolio.",
    isExcerpt: true, originalRating: 5, originalScale: { min: 1, max: 5, label: "5.0 / 5" }, normalizedRating: 5,
    group: "learner", publishedDate: iso(18), importedDate: iso(17), verification: "manually_verified",
    attribution: "Originally published on Google", language: "en", companyResponse: null,
    contentHash: hash("g1"), importMethod: "manual_summary", visibility: "visible", removed: false, isSample: true },
  { id: "extr-2", sourceSlug: "google", externalProfileId: "extp-google", externalReviewId: "SAMPLE-g2",
    originalReviewUrl: "https://www.google.com/maps/place/?q=place_id:SAMPLE_PLACE_ID",
    authorDisplayName: "A. Thomas", body: "SAMPLE. Practical projects and fair pricing. Would recommend for beginners.",
    isExcerpt: true, originalRating: 4, originalScale: { min: 1, max: 5, label: "4.0 / 5" }, normalizedRating: 4,
    group: "learner", publishedDate: iso(34), importedDate: iso(33), verification: "manually_verified",
    attribution: "Originally published on Google", language: "en", companyResponse: null,
    contentHash: hash("g2"), importMethod: "manual_summary", visibility: "visible", removed: false, isSample: true }
];
