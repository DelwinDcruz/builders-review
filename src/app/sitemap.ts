import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";
import { PROGRAMS } from "@/lib/programs";
import { getIndexableReviewSlugs, getSummaryByProgram } from "@/lib/data/repo";
import { getSourceOverviews } from "@/lib/data/sources-repo";
import { programHref } from "@/lib/reviews/links";

/**
 * Only useful, public, canonical URLs. Excludes admin, auth, account, API,
 * filtered/search combinations, and empty program pages (no approved reviews).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  const staticPaths = [
    "", "/reviews", "/courses", "/internships", "/programs", "/mentors",
    "/career-support", "/placement-support", "/community", "/review-platforms",
    "/compare", "/write-review", "/methodology", "/verification-policy",
    "/moderation-policy", "/review-guidelines", "/about", "/contact",
    "/privacy-policy", "/terms", "/cookie-policy", "/accessibility"
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`, lastModified: now,
    changeFrequency: p === "" || p === "/reviews" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7
  }));

  // Google reviews page only when a verified Google profile exists.
  const google = (await getSourceOverviews()).find((s) => s.def.slug === "google");
  if (google?.connected) entries.push({ url: `${base}/google-reviews`, lastModified: now, changeFrequency: "daily", priority: 0.8 });

  // Program pages: include only those with at least one approved review.
  for (const p of PROGRAMS.filter((x) => x.active)) {
    const summary = await getSummaryByProgram(p.slug);
    if (summary.count === 0) continue;   // no thin/empty program pages
    entries.push({ url: `${base}${programHref(p)}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
  }

  for (const slug of await getIndexableReviewSlugs()) {
    entries.push({ url: `${base}/reviews/${slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 });
  }

  return entries;
}
