/**
 * Single source of truth.
 *
 * VERIFIED  = confirmed from https://portfoliobuilders.in/ on 2026-07-09.
 * PLACEHOLDER = must be replaced with an official value before launch.
 * Search "PLACEHOLDER" to find everything awaiting sign-off.
 *
 * Deliberately NOT included: the company's marketing claims (placement rate,
 * learners mentored, awards, certifications). Those are company statements, not
 * review data, and republishing them here as proof would be misleading.
 */

export const SITE = {
  name: "builders.review",
  longName: "Builders Review",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://builders.review",
  tagline: "Real Portfolio Builders reviews from students, interns and trusted review platforms — all in one place.",
  description:
    "Read verified Portfolio Builders reviews from students, interns, alumni and career switchers — plus ratings collected legally from Google and other review platforms. Submit your own experience.",
  contactEmail: "info@portfoliobuilders.in", // VERIFIED (company email; a dedicated reviews@ address is PLACEHOLDER)
  locale: "en_IN",
  country: "IN",
  /** Visible on every page. builders.review is NOT an independent third party. */
  ownership:
    "builders.review is operated in connection with Portfolio Builders, the company being reviewed. It is not an independent third-party review organisation. We publish our methodology, never suppress genuine criticism, and never reward positive reviews.",
  editor: { name: "builders.review editorial team", role: "Review moderation & methodology" }
} as const;

export const COMPANY = {
  name: "Portfolio Builders",                                   // VERIFIED
  legalNote: "Part of the Portfolix ecosystem",                 // VERIFIED (stated on portfolix.tech)
  officialUrl: "https://portfoliobuilders.in/",                 // VERIFIED
  logoUrl: "https://portfoliobuilders.in/assets/images/logo.png", // VERIFIED
  ogImage: "https://portfoliobuilders.in/assets/images/fyugp-og-image.png", // VERIFIED
  /** Company self-description, drawn from the official About page. */
  description:
    "Portfolio Builders is a Kochi-based career learning ecosystem helping students and beginners build job-ready skills through UI/UX courses, FYUGP internships, portfolio programs, mentorship and live projects.",
  shortDescription: "Kochi-based career learning ecosystem: UI/UX courses, internships, portfolio programs and mentorship.",
  category: "Education & career-training provider",             // VERIFIED (derived)
  founder: { name: "Athul Anil", role: "Founder & CEO" },       // VERIFIED
  email: "info@portfoliobuilders.in",                           // VERIFIED
  phone: "+91 7994721792",                                      // VERIFIED
  phoneDisplay: "+91 79947 21792",                              // VERIFIED
  hours: "Mon – Sat, 10 AM – 6 PM IST",                         // VERIFIED
  locations: [
    {
      label: "India Office",
      street: "Ground Floor, KUBZ, 2115, Padamugal - Palachuvadu Rd, Satellite Twp, Padamughal, Kakkanad",
      locality: "Kochi", region: "Kerala", postalCode: "682030", country: "IN", verified: true
    },
    {
      label: "UAE Office",
      street: "Royal House Building, 24 Al Wuheida St, Hor Al Anz East, Deira",
      locality: "Dubai", region: "Dubai", postalCode: "", country: "AE", verified: true
    }
  ],
  sameAs: [                                                      // VERIFIED
    "https://www.linkedin.com/company/portfolio-builders-in/",
    "https://www.instagram.com/portfolio.builders.in",
    "https://www.youtube.com/@Portfolio.Builders"
  ],
  community: {
    whatsapp: "https://chat.whatsapp.com/FMWFcRklENNGyhRL8x5eAk", // VERIFIED
    discord: "https://discord.gg/9uMjwurgcz"                      // VERIFIED
  },
  /** Facts on this site were last checked against the official website on: */
  factsCheckedAt: "2026-07-09"
} as const;

// export const USE_SAMPLE_DATA = (process.env.NEXT_PUBLIC_USE_SAMPLE_DATA ?? "true") !== "false";

export const USE_SAMPLE_DATA =
  // process.env.NEXT_PUBLIC_USE_SAMPLE_DATA === "true";
  (process.env.NEXT_PUBLIC_USE_SAMPLE_DATA ?? "true") !== "false";