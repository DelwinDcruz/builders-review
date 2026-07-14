import { NextResponse } from "next/server";
import { getExternalProfiles } from "@/lib/data/sources-repo";
import { getConnectorForProfile } from "@/lib/sources/connectors/registry";

/**
 * Scheduled synchronization. Protected by SYNC_CRON_SECRET.
 * Only verified profiles running a permitted API/import mode are synced;
 * link-only, manual-summary and disabled profiles are skipped.
 * Never logs API keys or raw request URLs.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.SYNC_CRON_SECRET;
  if (!secret) return false;
  const url = new URL(req.url);
  return req.headers.get("authorization") === `Bearer ${secret}` || url.searchParams.get("key") === secret;
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profiles = await getExternalProfiles();
  const results: { source: string; result: string }[] = [];
  let attempted = 0, skipped = 0;

  for (const profile of profiles) {
    const syncable = ["official_api", "partner_api", "official_widget", "authorized_import"].includes(profile.integrationMode);
    if (!syncable || profile.verificationStatus !== "verified") { skipped++; continue; }
    const connector = getConnectorForProfile(profile);
    if (!connector) { skipped++; continue; }
    attempted++;
    try {
      const health = await connector.health(profile);
      results.push({ source: profile.sourceSlug, result: health.ok ? "ok" : "config_error" });
    } catch { results.push({ source: profile.sourceSlug, result: "error" }); }
  }

  return NextResponse.json({
    ok: true, ranAt: new Date().toISOString(), attempted, skipped, results,
    note: "Google syncs only when GOOGLE_MAPS_API_KEY and a real Place ID are configured and the profile is set to official_api. Other sources have no API connector yet."
  });
}
