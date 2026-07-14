import { NextResponse } from "next/server";
import { recordHelpful, fingerprint } from "@/lib/data/mutations";
import { rateLimit, clientKey } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const rl = rateLimit(clientKey(request.headers, `helpful:${params.slug}`), 5, 3600_000);
  if (!rl.ok) return NextResponse.json({ error: "Rate limited." }, { status: 429 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  const voterHash = fingerprint("helpful", params.slug, ip, request.headers.get("user-agent"));

  try {
    const result = await recordHelpful(params.slug, voterHash);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const notFound = e instanceof Error && e.message === "not_found";
    return NextResponse.json(
      { error: notFound ? "Review not found." : "Could not record vote." },
      { status: notFound ? 404 : 500 },
    );
  }
}
