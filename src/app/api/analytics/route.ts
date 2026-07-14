import { NextResponse } from "next/server";
/** Cookieless analytics sink. Stores nothing by default. Never logs PII. */
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => null);
    if (b && typeof b.event === "string" && process.env.NODE_ENV !== "production") console.debug("[analytics]", b.event);
  } catch {}
  return NextResponse.json({ ok: true });
}
