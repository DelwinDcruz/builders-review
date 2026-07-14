/**
 * Source visual identity. We ship NO third-party logo files (no brand
 * permission). Each platform renders an accessible monogram tinted with its
 * accent, and the platform NAME is always present — identity is never conveyed
 * by colour alone. To use a permitted logo, drop an SVG at
 * `public/platforms/<slug>.svg` and set `logo: true`.
 */
export interface SourceBrand { accent: string; accent2?: string; monogram: string; logo?: boolean; }

const B: Record<string, SourceBrand> = {
  "builders-review": { accent: "17 45 78", monogram: "BR" },   // uses --brand placeholder value
  google:            { accent: "66 133 244", accent2: "234 67 53", monogram: "G" },
  trustpilot:        { accent: "0 182 122", monogram: "Tp" },
  facebook:          { accent: "24 119 242", monogram: "Fb" },
  justdial:          { accent: "37 99 235", accent2: "234 88 12", monogram: "Jd" },
  mouthshut:         { accent: "220 38 38", monogram: "Ms" },
  sitejabber:        { accent: "41 128 185", monogram: "Sj" },
  consumeraffairs:   { accent: "0 122 135", monogram: "Ca" },
  bbb:               { accent: "12 74 110", monogram: "BBB" },
  glassdoor:         { accent: "12 179 134", monogram: "Gd" },
  ambitionbox:       { accent: "234 88 12", monogram: "Ab" },
  indeed:            { accent: "37 99 235", monogram: "In" }
};
const FALLBACK: SourceBrand = { accent: "100 105 116", monogram: "•" };
export const sourceBrand = (slug: string): SourceBrand => B[slug] ?? FALLBACK;

/** Experience identity: icon + text label + accent (never colour-only). */
export type ExpKey = "course" | "internship" | "program" | "mentorship" | "portfolio_service" | "career_support" | "community" | "website" | "other";

export interface ExpMeta { label: string; plural: string; accent: string; icon: "book" | "briefcase" | "route" | "users" | "layout" | "compass" | "messages" | "monitor" | "star"; blurb: string; }

export const EXPERIENCE_META: Record<ExpKey, ExpMeta> = {
  course:            { label: "Course review",            plural: "Course reviews",            accent: "37 99 235",  icon: "book",      blurb: "Teaching quality, curriculum, projects and value." },
  internship:        { label: "Internship review",        plural: "Internship reviews",        accent: "13 148 136", icon: "briefcase", blurb: "Credit support, documentation, guidance and real work." },
  program:           { label: "Program review",           plural: "Program reviews",           accent: "124 58 237", icon: "route",     blurb: "Structure, mentor feedback and portfolio outcomes." },
  mentorship:        { label: "Mentor review",            plural: "Mentor reviews",            accent: "217 119 6",  icon: "users",     blurb: "Mentor availability, expertise and feedback quality." },
  portfolio_service: { label: "Portfolio service review", plural: "Portfolio-building reviews", accent: "219 39 119", icon: "layout",    blurb: "Audits, tools and portfolio-building support." },
  career_support:    { label: "Career support review",    plural: "Career support reviews",    accent: "5 150 105",  icon: "compass",   blurb: "Career guidance and placement assistance." },
  community:         { label: "Community review",         plural: "Community reviews",         accent: "234 88 12",  icon: "messages",  blurb: "The WhatsApp and Discord community, jobs and events." },
  website:           { label: "Website review",           plural: "Website reviews",           accent: "100 105 116",icon: "monitor",   blurb: "Using portfoliobuilders.in: clarity, speed, mobile." },
  other:             { label: "Other review",             plural: "Other reviews",             accent: "100 105 116",icon: "star",      blurb: "Everything else." }
};
