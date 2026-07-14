/**
 * One interface for every source. Connectors NEVER scrape: they either call a
 * documented official API with real credentials, serve authorized imports, or
 * report link-only/disabled and return nothing.
 */
import type { ExternalProfile, ExternalReview, ReviewSourceDef, SourceCapabilities } from "../types";

export interface ConnectorHealth { ok: boolean; status: string; checkedAt: string; }
export interface RateLimitInfo { remaining: number | null; resetAt: string | null; }

export interface FetchResult {
  profile?: Partial<ExternalProfile>;
  reviews: ExternalReview[];
  /** what the source actually permitted this run */
  contentAvailability: "full" | "excerpt" | "summary" | "none";
  rateLimit: RateLimitInfo;
  attribution: string;
  /** true when the API returns only a subset of the platform's reviews */
  partialSelection: boolean;
}

export interface SourceConnector {
  readonly def: ReviewSourceDef;
  readonly capabilities: SourceCapabilities;
  validateConfig(profile: ExternalProfile): { ok: boolean; error?: string };
  validateProfile(profile: ExternalProfile): { ok: boolean; error?: string };
  fetchProfileSummary(profile: ExternalProfile): Promise<Partial<ExternalProfile>>;
  fetchReviews(profile: ExternalProfile): Promise<FetchResult>;
  health(profile: ExternalProfile): Promise<ConnectorHealth>;
  attribution(): string;
}

export abstract class BaseConnector implements SourceConnector {
  constructor(public readonly def: ReviewSourceDef) {}
  get capabilities() { return this.def.capabilities; }
  attribution() { return this.def.integration.attribution; }
  validateConfig(): { ok: boolean; error?: string } { return { ok: true }; }
  validateProfile(p: ExternalProfile): { ok: boolean; error?: string } {
    return p.externalProfileUrl ? { ok: true } : { ok: false, error: "Missing external profile URL." };
  }
  abstract fetchProfileSummary(p: ExternalProfile): Promise<Partial<ExternalProfile>>;
  abstract fetchReviews(p: ExternalProfile): Promise<FetchResult>;
  async health(p: ExternalProfile): Promise<ConnectorHealth> {
    const v = this.validateProfile(p);
    return { ok: v.ok, status: v.ok ? "Configuration valid" : (v.error ?? "Invalid"), checkedAt: new Date().toISOString() };
  }
}

export const NO_RATE: RateLimitInfo = { remaining: null, resetAt: null };
