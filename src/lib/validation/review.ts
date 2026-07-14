import { z } from "zod";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { PROGRAMS } from "@/lib/programs";

const categoryKeys = DEFAULT_CATEGORIES.map((c) => c.key) as [string, ...string[]];
const programSlugs = PROGRAMS.map((p) => p.slug) as [string, ...string[]];

export const LIMITS = {
  title: { min: 8, max: 110 },
  body: { min: 40, max: 3000 },
  point: { max: 140 },
  outcome: { max: 300 },
  name: { min: 2, max: 60 }
} as const;

const star = z.number().int().min(1).max(5);

export const reviewSubmissionSchema = z.object({
  experienceType: z.enum(["course","internship","program","mentorship","portfolio_service","career_support","community","website","other"]),
  programSlug: z.enum(programSlugs).nullable().optional(),
  overallRating: star,
  categoryRatings: z.array(z.object({ categoryKey: z.enum(categoryKeys), value: star })).max(categoryKeys.length).default([]),
  title: z.string().trim().min(LIMITS.title.min).max(LIMITS.title.max),
  body: z.string().trim().min(LIMITS.body.min).max(LIMITS.body.max),
  pros: z.array(z.string().trim().max(LIMITS.point.max)).max(5).default([]),
  improvements: z.array(z.string().trim().max(LIMITS.point.max)).max(5).default([]),
  outcome: z.string().trim().max(LIMITS.outcome.max).optional().default(""),
  wouldRecommend: z.boolean().nullable().default(null),
  reviewerName: z.string().trim().min(LIMITS.name.min).max(LIMITS.name.max),
  reviewerEmail: z.string().trim().email().max(254),
  relationship: z.enum(["student","intern","alumni","parent","career_switcher","mentor","other"]),
  batch: z.string().trim().max(60).optional().default(""),
  experienceDate: z.string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date")
    .refine((v) => new Date(v) <= new Date(), "The date can't be in the future"),
  consentPrivacy: z.literal(true, { errorMap: () => ({ message: "You must accept the privacy notice." }) }),
  acceptGuidelines: z.literal(true, { errorMap: () => ({ message: "You must accept the review guidelines." }) }),
  website: z.string().max(0).optional().default("")   // honeypot
}).superRefine((v, ctx) => {
  const needsProgram = ["course","internship","program","portfolio_service"].includes(v.experienceType);
  if (needsProgram && !v.programSlug) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["programSlug"], message: "Select the exact program or course." });
  }
});
export type ReviewSubmission = z.infer<typeof reviewSubmissionSchema>;

export const reportSchema = z.object({
  reason: z.enum(["fake","offensive","conflict","privacy","spam","other"]),
  details: z.string().trim().max(500).optional().default("")
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  topic: z.enum(["dispute","technical","general","privacy"]),
  message: z.string().trim().min(20).max(2000),
  website: z.string().max(0).optional().default("")
});
