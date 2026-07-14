import type { ExternalProfile, ReviewSourceDef, SourceStatus } from "./types";

/** Never "connected" merely because a URL was entered. */
export function deriveSourceStatus(def: ReviewSourceDef, profiles: ExternalProfile[]): SourceStatus {
  const active = profiles.filter((p) => p.active);
  if (active.length === 0) {
    if (def.defaultMode === "disabled") return "disabled";
    if (def.integration.partnershipRequired === "yes") return "awaiting_approval";
    return "link_only";
  }
  const apiish = active.some((p) => ["official_api", "partner_api", "official_widget", "authorized_import"].includes(p.integrationMode));
  if (apiish) {
    if (active.some((p) => p.apiConnectionStatus === "error")) return "sync_error";
    const ok = active.some((p) => p.apiConnectionStatus === "ok" && p.verificationStatus === "verified" && p.lastSyncAt);
    return ok ? "connected" : "requires_credentials";
  }
  if (active.some((p) => p.integrationMode === "manual_summary")) return "manual_import";
  if (active.some((p) => p.integrationMode === "external_link_only")) return "link_only";
  return "requires_credentials";
}

export const STATUS_LABELS: Record<SourceStatus, string> = {
  connected: "Connected", requires_credentials: "Requires credentials",
  awaiting_approval: "Awaiting approval", manual_import: "Manual import",
  link_only: "Link only", sync_error: "Sync error", disabled: "Disabled"
};
