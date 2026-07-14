export type AnalyticsEvent =
  | "review_form_started" | "review_submitted" | "review_verified"
  | "program_viewed" | "comparison_started" | "filter_used"
  | "official_site_clicked" | "external_source_clicked"
  | "helpful_vote_submitted" | "review_reported";

/** Cookieless, no PII. No-op unless NEXT_PUBLIC_ANALYTICS_DOMAIN is set. */
export function track(event: AnalyticsEvent, props: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN) {
    if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, props);
    return;
  }
  try {
    navigator.sendBeacon?.("/api/analytics", new Blob([JSON.stringify({ event, props, ts: Date.now() })], { type: "application/json" }));
  } catch { /* analytics must never break UX */ }
}
