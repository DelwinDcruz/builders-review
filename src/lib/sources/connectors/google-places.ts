import "server-only";
import crypto from "node:crypto";
import { BaseConnector, NO_RATE, type ConnectorHealth, type FetchResult } from "./adapter";
import type { ExternalProfile, ExternalReview } from "../types";
import { normalizeToFiveStar, originalRatingLabel } from "../normalize";

/**
 * Google Places connector — the documented Place Details endpoint.
 *
 * REQUIRES: GOOGLE_MAPS_API_KEY (server-only) and a real Place ID stored on the
 * profile as `externalProfileId`. Without both, the connector reports
 * "requires credentials" and returns nothing. Nothing is invented.
 *
 * IMPORTANT, ENFORCED HERE AND IN THE UI:
 *  - Place Details returns the overall rating, the TOTAL rating count, and only
 *    a LIMITED SELECTION of reviews (historically up to 5). We therefore set
 *    `partialSelection: true` and the UI must never claim these are all reviews.
 *  - Attribution: display "Powered by Google" and link to the Google profile.
 *  - Verify Google's CURRENT caching/storage terms before enabling scheduled
 *    sync; store only what the terms permit.
 */
const ENDPOINT = "https://maps.googleapis.com/maps/api/place/details/json";
const FIELDS = "rating,user_ratings_total,url,name,reviews";

interface GoogleReview {
  author_name?: string; author_url?: string; profile_photo_url?: string;
  rating?: number; text?: string; time?: number; language?: string;
  relative_time_description?: string;
}
interface GoogleDetails {
  status: string; error_message?: string;
  result?: { rating?: number; user_ratings_total?: number; url?: string; name?: string; reviews?: GoogleReview[] };
}

const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 32);
const apiKey = () => process.env.GOOGLE_MAPS_API_KEY ?? "";

export class GooglePlacesConnector extends BaseConnector {
  // validateConfig(profile: ExternalProfile) {
  //   if (!apiKey()) return { ok: false, error: "GOOGLE_MAPS_API_KEY is not set (server-only env var)." };
  //   if (!profile.externalProfileId) return { ok: false, error: "No Google Place ID stored on this profile." };
  //   return { ok: true };
  // }
  override validateConfig(
  profile?: ExternalProfile
): { ok: boolean; error?: string } {
  if (!apiKey()) {
    return {
      ok: false,
      error: "GOOGLE_MAPS_API_KEY is not set (server-only env var).",
    };
  }

  if (!profile?.externalProfileId) {
    return {
      ok: false,
      error: "No Google Place ID stored on this profile.",
    };
  }

  return { ok: true };
}

  private async call(placeId: string): Promise<GoogleDetails> {
    const url = new URL(ENDPOINT);
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", FIELDS);
    url.searchParams.set("key", apiKey());
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Google Places HTTP ${res.status}`);
    return (await res.json()) as GoogleDetails;
  }

  async health(profile: ExternalProfile): Promise<ConnectorHealth> {
    const cfg = this.validateConfig(profile);
    const checkedAt = new Date().toISOString();
    if (!cfg.ok) return { ok: false, status: cfg.error ?? "Not configured", checkedAt };
    try {
      const data = await this.call(profile.externalProfileId!);
      if (data.status !== "OK") return { ok: false, status: `Google returned ${data.status}${data.error_message ? `: ${data.error_message}` : ""}`, checkedAt };
      return { ok: true, status: `Connected. Rating ${data.result?.rating ?? "—"} from ${data.result?.user_ratings_total ?? 0} ratings.`, checkedAt };
    } catch (e) {
      // Never leak the API key or raw request in errors/logs.
      return { ok: false, status: e instanceof Error ? e.message : "Request failed", checkedAt };
    }
  }

  async fetchProfileSummary(profile: ExternalProfile): Promise<Partial<ExternalProfile>> {
    const cfg = this.validateConfig(profile);
    if (!cfg.ok) throw new Error(cfg.error);
    const data = await this.call(profile.externalProfileId!);
    if (data.status !== "OK") throw new Error(`Google returned ${data.status}`);
    return {
      externalOverallRating: data.result?.rating ?? null,
      externalReviewCount: data.result?.user_ratings_total ?? null,
      externalProfileUrl: data.result?.url ?? profile.externalProfileUrl,
      apiConnectionStatus: "ok",
      lastSyncAt: new Date().toISOString()
    };
  }

  async fetchReviews(profile: ExternalProfile): Promise<FetchResult> {
    const cfg = this.validateConfig(profile);
    if (!cfg.ok) {
      return { reviews: [], contentAvailability: "none", rateLimit: NO_RATE, attribution: this.attribution(), partialSelection: true };
    }
    const data = await this.call(profile.externalProfileId!);
    if (data.status !== "OK") throw new Error(`Google returned ${data.status}`);

    const profileUrl = data.result?.url ?? profile.externalProfileUrl;
    const reviews: ExternalReview[] = (data.result?.reviews ?? []).map((g) => {
      const rating = typeof g.rating === "number" ? g.rating : 0;
      const body = (g.text ?? "").trim();
      return {
        id: `google-${hash(`${profile.externalProfileId}|${g.author_name}|${g.time}`)}`,
        sourceSlug: "google",
        externalProfileId: profile.id,
        externalReviewId: g.time ? String(g.time) : null,
        originalReviewUrl: g.author_url ?? profileUrl,
        authorDisplayName: g.author_name ?? "Google user",
        authorPhotoUrl: g.profile_photo_url ?? null,
        body,
        // Places returns a limited selection and may truncate — treat as excerpt.
        isExcerpt: true,
        originalRating: rating,
        originalScale: { min: 1, max: 5, label: originalRatingLabel("five_star", rating) },
        normalizedRating: normalizeToFiveStar(rating, 1, 5),
        group: "learner",
        publishedDate: g.time ? new Date(g.time * 1000).toISOString() : undefined,
        importedDate: new Date().toISOString(),
        lastSyncedDate: new Date().toISOString(),
        verification: "source_verified",
        attribution: "Originally published on Google · Powered by Google",
        language: g.language,
        companyResponse: null,
        contentHash: hash(`google|${g.author_name}|${body}`),
        importMethod: "official_api",
        visibility: "visible",
        removed: false,
        isSample: false
      };
    });

    return {
      profile: {
        externalOverallRating: data.result?.rating ?? null,
        externalReviewCount: data.result?.user_ratings_total ?? null
      },
      reviews,
      contentAvailability: "excerpt",
      rateLimit: NO_RATE,
      attribution: "Powered by Google",
      // Places never returns every review — the UI must say so.
      partialSelection: true
    };
  }
}
