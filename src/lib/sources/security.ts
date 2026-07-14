/** Outbound-URL allowlist (SSRF protection) + CSV-injection guard. */
import { REVIEW_SOURCES } from "./definitions";

const ALLOWED_HOSTS = new Set<string>([
  "maps.googleapis.com", "places.googleapis.com", "www.google.com", "maps.google.com",
  "api.trustpilot.com", "www.trustpilot.com",
  "graph.facebook.com", "www.facebook.com",
  "www.justdial.com", "www.mouthshut.com", "www.sitejabber.com",
  "www.consumeraffairs.com", "www.bbb.org",
  "www.glassdoor.com", "www.ambitionbox.com", "www.indeed.com"
]);

export interface UrlCheck { ok: boolean; reason?: string; host?: string }

export function validateOutboundUrl(raw: string): UrlCheck {
  let url: URL;
  try { url = new URL(raw); } catch { return { ok: false, reason: "Malformed URL" }; }
  if (url.protocol !== "https:") return { ok: false, reason: "Only HTTPS is allowed" };
  if (url.username || url.password) return { ok: false, reason: "Credentials in URL are not allowed" };
  const host = url.hostname.toLowerCase();
  if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|::1|0\.0\.0\.0)/.test(host)) {
    return { ok: false, reason: "Internal hosts are blocked (SSRF protection)" };
  }
  if (!ALLOWED_HOSTS.has(host)) return { ok: false, reason: `Host not in the approved allowlist: ${host}`, host };
  return { ok: true, host };
}

/** Does a profile URL plausibly belong to the selected platform? */
export function urlMatchesSource(sourceSlug: string, raw: string): boolean {
  const def = REVIEW_SOURCES.find((s) => s.slug === sourceSlug);
  if (!def || !def.officialUrl.startsWith("http")) return false;
  try {
    const host = new URL(raw).hostname.toLowerCase().replace(/^www\./, "");
    const official = new URL(def.officialUrl).hostname.replace(/^www\./, "");
    return host === official || host.endsWith(`.${official}`) || official.endsWith(host);
  } catch { return false; }
}

/** Neutralise spreadsheet formula triggers on CSV import. */
export function sanitizeCsvCell(v: string): string {
  return /^[=+\-@\t\r]/.test(v ?? "") ? `'${v}` : (v ?? "");
}

export const CSV_MAX_ROWS = 5000;
export const CSV_MAX_BYTES = 5 * 1024 * 1024;
