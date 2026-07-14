import { BaseConnector, NO_RATE, type FetchResult } from "./adapter";
import type { ExternalProfile } from "../types";

/** Shows the platform name + a verified profile link. Fetches nothing. */
export class LinkOnlyConnector extends BaseConnector {
  async fetchProfileSummary(): Promise<Partial<ExternalProfile>> { return {}; }
  async fetchReviews(): Promise<FetchResult> {
    return { reviews: [], contentAvailability: "none", rateLimit: NO_RATE, attribution: this.attribution(), partialSelection: false };
  }
}

/** Serves an administrator-verified rating summary. Fetches nothing. */
export class ManualSummaryConnector extends BaseConnector {
  async fetchProfileSummary(p: ExternalProfile): Promise<Partial<ExternalProfile>> {
    return { externalOverallRating: p.externalOverallRating, externalReviewCount: p.externalReviewCount, lastVerifiedAt: p.lastVerifiedAt };
  }
  async fetchReviews(): Promise<FetchResult> {
    return { reviews: [], contentAvailability: "summary", rateLimit: NO_RATE, attribution: this.attribution(), partialSelection: true };
  }
}

/** Reviews already in our DB via authorized CSV/JSON import or permitted manual entry. */
export class ImportConnector extends BaseConnector {
  async fetchProfileSummary(p: ExternalProfile): Promise<Partial<ExternalProfile>> {
    return { externalOverallRating: p.externalOverallRating, externalReviewCount: p.externalReviewCount };
  }
  async fetchReviews(): Promise<FetchResult> {
    return { reviews: [], contentAvailability: "full", rateLimit: NO_RATE, attribution: this.attribution(), partialSelection: false };
  }
}
