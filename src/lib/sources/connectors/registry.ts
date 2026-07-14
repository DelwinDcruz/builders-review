import "server-only";
import { getSourceDef } from "../definitions";
import type { ExternalProfile } from "../types";
import type { SourceConnector } from "./adapter";
import { ImportConnector, LinkOnlyConnector, ManualSummaryConnector } from "./fallback";
import { GooglePlacesConnector } from "./google-places";

/**
 * Picks the connector for a profile. Google has a real API connector; every
 * other source falls back to a compliant connector until an official
 * integration + credentials + permission exist.
 */
export function getConnectorForProfile(profile: ExternalProfile): SourceConnector | null {
  const def = getSourceDef(profile.sourceSlug);
  if (!def) return null;

  if (profile.sourceSlug === "google" && profile.integrationMode === "official_api") {
    return new GooglePlacesConnector(def);
  }
  switch (profile.integrationMode) {
    case "official_api":
    case "partner_api":
    case "official_widget":
    case "authorized_import":
      return new ImportConnector(def);
    case "manual_summary":
      return new ManualSummaryConnector(def);
    default:
      return new LinkOnlyConnector(def);
  }
}
