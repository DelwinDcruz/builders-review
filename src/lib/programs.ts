/**
 * Verified Portfolio Builders offerings. Every entry below was found on the
 * official website; `officialUrl` links to its real page. Admins manage these
 * in the `programs` table in production — this array is the seed + fallback.
 * Do NOT add an offering that isn't on the official site.
 */
export type ExperienceType =
  | "course" | "internship" | "program" | "mentorship"
  | "portfolio_service" | "career_support" | "community" | "website" | "other";

export interface Program {
  slug: string;
  title: string;
  type: ExperienceType;
  officialUrl: string;
  summary: string;
  /** unique intro copy for the program's review page (SEO) */
  seoIntro: string;
  active: boolean;
}

export const PROGRAMS: Program[] = [
  // ---- Courses ----
  { slug: "ui-ux-course", title: "UI/UX Design Course", type: "course",
    officialUrl: "https://portfoliobuilders.in/courses/ui-uxcourse/",
    summary: "Portfolio-first UI/UX training for students and career switchers, built around real design case studies.",
    seoIntro: "Read verified student reviews of the Portfolio Builders UI/UX Design Course — teaching quality, mentor support, live projects, portfolio outcomes and value for money.", active: true },
  { slug: "web-development-course", title: "Web Development Course", type: "course",
    officialUrl: "https://portfoliobuilders.in/courses/web-development/",
    summary: "Hands-on web development training built around real-world projects.",
    seoIntro: "Read student reviews of the Portfolio Builders Web Development Course — curriculum depth, project work, mentorship and career outcomes.", active: true },
  { slug: "flutter-development", title: "Flutter Development", type: "course",
    officialUrl: "https://portfoliobuilders.in/flutter-development/",
    summary: "Cross-platform mobile app development with Flutter.",
    seoIntro: "Read student reviews of Portfolio Builders Flutter Development — teaching quality, projects and support.", active: true },
  { slug: "free-courses", title: "Free Courses", type: "course",
    officialUrl: "https://portfoliobuilders.in/free-courses/",
    summary: "Free learning paths across design, development, AI, product, marketing and emerging technology.",
    seoIntro: "Read learner reviews of the free Portfolio Builders courses — content quality, usefulness and learning materials.", active: true },

  // ---- Programs ----
  { slug: "ui-ux-portfolio-building-program", title: "UI/UX Portfolio Building Program", type: "program",
    officialUrl: "https://portfoliobuilders.in/ui-ux-portfolio-building-program/",
    summary: "A structured program to build a job-ready UI/UX portfolio with mentor feedback and live projects.",
    seoIntro: "Read reviews of the Portfolio Builders UI/UX Portfolio Building Program — structure, mentor feedback quality, live projects and portfolio outcomes.", active: true },
  { slug: "switch-careers-to-uiux", title: "Switch Careers to UI/UX", type: "program",
    officialUrl: "https://portfoliobuilders.in/switch-careers-to-uiux/",
    summary: "A career-switching pathway into UI/UX for people moving from another field.",
    seoIntro: "Read career-switcher reviews of the Portfolio Builders Switch Careers to UI/UX program — transition support, mentorship and outcomes.", active: true },
  { slug: "senior-ui-ux-portfolio-building-program", title: "Senior UI/UX Portfolio Building Program", type: "program",
    officialUrl: "https://portfoliobuilders.in/senior-ui-ux-portfolio-building-program/",
    summary: "An advanced portfolio program for experienced designers.",
    seoIntro: "Read reviews of the Senior UI/UX Portfolio Building Program from experienced designers — depth, mentorship and career impact.", active: true },

  // ---- Internships ----
  { slug: "fyugp-internship", title: "FYUGP Internship", type: "internship",
    officialUrl: "https://portfoliobuilders.in/fyugp-internship/",
    summary: "Credit-focused internship support for Kerala FYUGP students with project work, documentation and mentor guidance.",
    seoIntro: "Read FYUGP intern reviews of Portfolio Builders — credit support, documentation help, mentor guidance and the overall internship experience.", active: true },
  { slug: "aicte-internship", title: "AICTE Internship — Computer Science", type: "internship",
    officialUrl: "https://portfoliobuilders.in/aicte-internship/",
    summary: "AICTE-aligned internship track for computer science students.",
    seoIntro: "Read AICTE internship reviews from computer science students at Portfolio Builders — project work, mentorship and certification support.", active: true },
  { slug: "aicte-internship-mechanical", title: "AICTE Internship — Mechanical Engineering", type: "internship",
    officialUrl: "https://portfoliobuilders.in/aicte-internship/mechanical-engineering/",
    summary: "AICTE-aligned internship track for mechanical engineering students.",
    seoIntro: "Read AICTE mechanical engineering internship reviews from Portfolio Builders students.", active: true },
  { slug: "aicte-internship-civil", title: "AICTE Internship — Civil Engineering", type: "internship",
    officialUrl: "https://portfoliobuilders.in/aicte-internship/civil-engineering/",
    summary: "AICTE-aligned internship track for civil engineering students.",
    seoIntro: "Read AICTE civil engineering internship reviews from Portfolio Builders students.", active: true },
  { slug: "aicte-internship-ec-eee", title: "AICTE Internship — EC & EEE", type: "internship",
    officialUrl: "https://portfoliobuilders.in/aicte-internship/ec-eee/",
    summary: "AICTE-aligned internship track for EC and EEE students.",
    seoIntro: "Read AICTE EC & EEE internship reviews from Portfolio Builders students.", active: true },
  { slug: "mba-internship", title: "MBA Internship", type: "internship",
    officialUrl: "https://portfoliobuilders.in/mba-internship/",
    summary: "University internship pathway for MBA students.",
    seoIntro: "Read MBA internship reviews from Portfolio Builders students — project relevance, mentorship and documentation support.", active: true },
  { slug: "ktu-internship", title: "KTU Internship", type: "internship",
    officialUrl: "https://portfoliobuilders.in/ktu-internship/",
    summary: "Engineering internship pathway for KTU students with technical tracks, report support and practical learning.",
    seoIntro: "Read KTU internship reviews from Portfolio Builders students — technical tracks, report support and practical learning.", active: true },
  { slug: "cusat-internship", title: "CUSAT Internship", type: "internship",
    officialUrl: "https://portfoliobuilders.in/cusat-internship/",
    summary: "Structured internship support for CUSAT students needing project output and submission-ready documentation.",
    seoIntro: "Read CUSAT internship reviews from Portfolio Builders students — project output and documentation support.", active: true },

  // ---- Portfolio services / resources ----
  { slug: "ux-portfolio-resume-audit", title: "Free UX Portfolio & Resume Audit", type: "portfolio_service",
    officialUrl: "https://portfoliobuilders.in/resources/ux-portfolio-resume-audit/",
    summary: "A free audit of your UX portfolio and resume.",
    seoIntro: "Read reviews of the free Portfolio Builders UX Portfolio & Resume Audit — feedback quality and usefulness.", active: true },
  { slug: "instant-portfolio-builder", title: "Instant Portfolio Builder", type: "portfolio_service",
    officialUrl: "https://portfoliobuilders.in/resources/instant-portfolio-builder/",
    summary: "A tool to assemble a portfolio quickly.",
    seoIntro: "Read reviews of the Instant Portfolio Builder tool from Portfolio Builders.", active: true },
  { slug: "figma-pro-plan", title: "Figma Pro Plan", type: "portfolio_service",
    officialUrl: "https://portfoliobuilders.in/figma-pro-plan/",
    summary: "Figma Pro plan access offered through Portfolio Builders.",
    seoIntro: "Read reviews of the Figma Pro Plan benefit offered by Portfolio Builders.", active: true },
  { slug: "resources", title: "Resource Center", type: "portfolio_service",
    officialUrl: "https://portfoliobuilders.in/resources/",
    summary: "Career and learning resources for students.",
    seoIntro: "Read reviews of the Portfolio Builders Resource Center — usefulness and quality of the learning materials.", active: true },

  // ---- Mentorship / career / community / website ----
  { slug: "mentorship", title: "Mentor Support", type: "mentorship",
    officialUrl: "https://portfoliobuilders.in/about/",
    summary: "Mentorship from working industry professionals across the courses, programs and internships.",
    seoIntro: "Read reviews of Portfolio Builders mentor support — responsiveness, feedback quality and expertise.", active: true },
  { slug: "career-support", title: "Career Guidance & Support", type: "career_support",
    officialUrl: "https://portfoliobuilders.in/",
    summary: "Career guidance offered alongside the courses and programs.",
    seoIntro: "Read reviews of Portfolio Builders career guidance and support — how useful it is for students and career switchers.", active: true },
  { slug: "community", title: "Community", type: "community",
    officialUrl: "https://portfoliobuilders.in/",
    summary: "The free Portfolio Builders community on WhatsApp and Discord: job postings, internships, networking and events.",
    seoIntro: "Read reviews of the Portfolio Builders community — job postings, networking, events and how active it is.", active: true },
  { slug: "website-experience", title: "Website Experience", type: "website",
    officialUrl: "https://portfoliobuilders.in/",
    summary: "The portfoliobuilders.in website itself: clarity, speed and ease of use.",
    seoIntro: "Read reviews of the portfoliobuilders.in website experience — clarity, speed, mobile usability and content quality.", active: true }
];

export const PROGRAM_MAP: Record<string, Program> = Object.fromEntries(PROGRAMS.map((p) => [p.slug, p]));
export function getProgram(slug: string): Program | undefined { return PROGRAM_MAP[slug]; }
export function programsByType(type: ExperienceType): Program[] { return PROGRAMS.filter((p) => p.type === type && p.active); }

export const EXPERIENCE_LABELS: Record<ExperienceType, string> = {
  course: "Course", internship: "Internship", program: "Program", mentorship: "Mentorship",
  portfolio_service: "Portfolio service", career_support: "Career support",
  community: "Community", website: "Website experience", other: "Other"
};
