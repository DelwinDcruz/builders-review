/**
 * JSON-LD builders. Hard rules enforced here:
 *  - AggregateRating / Review markup ONLY from approved reviews, and ONLY when
 *    the same figure is visible on the page. Otherwise `undefined`.
 *  - Learner and employee ratings are NEVER combined in one AggregateRating.
 *  - Recommendation percentages and letter grades never become star ratings.
 *  - Company promotional statements are never marked up as customer reviews.
 *  - LocalBusiness only from verified addresses.
 */
import { SITE, COMPANY } from "../site-config";
import { roundRating } from "../rating/engine";
import type { PublicReview, RatingSummary } from "../types";
import type { Program } from "../programs";

const SITE_ID = `${SITE.url}/#website`;
const PUBLISHER_ID = `${SITE.url}/#organization`;
const COMPANY_ID = `${COMPANY.officialUrl}#organization`;

/** builders.review itself — the publisher of the reviews. */
export function publisherJsonLd() {
  return {
    "@context": "https://schema.org", "@type": "Organization", "@id": PUBLISHER_ID,
    name: SITE.longName, url: SITE.url, description: SITE.description,
    disambiguatingDescription: SITE.ownership
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org", "@type": "WebSite", "@id": SITE_ID,
    name: SITE.name, url: SITE.url, inLanguage: "en-IN", publisher: { "@id": PUBLISHER_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/reviews?search={query}` },
      "query-input": "required name=query"
    }
  };
}

function aggregateRating(summary: RatingSummary) {
  if (!summary.average || summary.count === 0) return undefined;
  return {
    "@type": "AggregateRating",
    ratingValue: roundRating(summary.average).toFixed(1),
    reviewCount: summary.count, bestRating: "5", worstRating: "1"
  };
}

/**
 * Portfolio Builders as an EducationalOrganization. `aggregateRating` reflects
 * LEARNER reviews only (never employee reviews) and only when visible.
 */
export function companyJsonLd(learnerSummary: RatingSummary, extraSameAs: string[] = []) {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "Organization"],
    "@id": COMPANY_ID,
    name: COMPANY.name,
    url: COMPANY.officialUrl,
    logo: COMPANY.logoUrl,
    description: COMPANY.description,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    founder: { "@type": "Person", name: COMPANY.founder.name },
    sameAs: Array.from(new Set([...COMPANY.sameAs, ...extraSameAs.filter((u) => u.startsWith("http"))])),
    address: COMPANY.locations.filter((l) => l.verified).map((l) => ({
      "@type": "PostalAddress", streetAddress: l.street, addressLocality: l.locality,
      addressRegion: l.region, postalCode: l.postalCode || undefined, addressCountry: l.country
    }))
  };
  const agg = aggregateRating(learnerSummary);
  if (agg) node.aggregateRating = agg;   // learner-only, visible on the page
  return node;
}

/** LocalBusiness — only from verified addresses. */
export function localBusinessJsonLd() {
  const primary = COMPANY.locations[0];
  if (!primary?.verified) return undefined;
  return {
    "@context": "https://schema.org", "@type": "LocalBusiness",
    name: COMPANY.name, url: COMPANY.officialUrl, image: COMPANY.logoUrl,
    telephone: COMPANY.phone, email: COMPANY.email,
    address: {
      "@type": "PostalAddress", streetAddress: primary.street, addressLocality: primary.locality,
      addressRegion: primary.region, postalCode: primary.postalCode, addressCountry: primary.country
    },
    openingHours: "Mo-Sa 10:00-18:00"
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE.url}${it.path}` }))
  };
}

/** Course markup — only for offerings that are genuinely courses. */
export function courseJsonLd(program: Program, summary: RatingSummary, path: string) {
  if (program.type !== "course") return undefined;
  const node: Record<string, unknown> = {
    "@context": "https://schema.org", "@type": "Course",
    name: program.title, description: program.summary,
    url: `${SITE.url}${path}`,
    provider: { "@type": "EducationalOrganization", name: COMPANY.name, sameAs: COMPANY.officialUrl }
  };
  const agg = aggregateRating(summary);
  if (agg) node.aggregateRating = agg;
  return node;
}

/** A single approved review. Never called for pending/rejected reviews. */
export function reviewJsonLd(review: PublicReview, path: string) {
  return {
    "@context": "https://schema.org", "@type": "Review", "@id": `${SITE.url}${path}#review`,
    name: review.title, reviewBody: review.body,
    datePublished: review.publishedAt ?? review.submittedAt,
    reviewRating: { "@type": "Rating", ratingValue: String(review.overallRating), bestRating: "5", worstRating: "1" },
    author: { "@type": "Person", name: review.reviewerDisplayName },
    itemReviewed: { "@type": "EducationalOrganization", name: COMPANY.name, sameAs: COMPANY.officialUrl },
    publisher: { "@id": PUBLISHER_ID }
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  if (faqs.length === 0) return undefined;
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
  };
}

export function itemListJsonLd(name: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "ItemList", name,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: `${SITE.url}${it.path}` }))
  };
}
