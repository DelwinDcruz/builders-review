import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/review";
import { recordContact } from "@/lib/data/mutations";
import { rateLimit, clientKey } from "@/lib/security/rate-limit";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request.headers, "contact"), 5, 3600_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  let json: unknown;
  try { json = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  try { await recordContact(parsed.data); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "Could not send your message." }, { status: 500 }); }
}
