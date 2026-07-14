import { NextResponse } from "next/server";
import { reportSchema } from "@/lib/validation/review";
import { recordReport, fingerprint } from "@/lib/data/mutations";
import { rateLimit, clientKey } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const rl = rateLimit(clientKey(request.headers, `report:${params.slug}`), 10, 3600_000);
  if (!rl.ok) return NextResponse.json({ error: "Rate limited." }, { status: 429 });

  let json: unknown;
  try { json = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = reportSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 422 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  const reporterHash = fingerprint("report", params.slug, ip, request.headers.get("user-agent"));

  try {
    await recordReport(params.slug, parsed.data.reason, parsed.data.details, reporterHash);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const notFound = e instanceof Error && e.message === "not_found";
    return NextResponse.json(
      { error: notFound ? "Review not found." : "Could not submit report." },
      { status: notFound ? 404 : 500 },
    );
  }
}
