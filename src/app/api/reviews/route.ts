import { NextResponse } from "next/server";
import { reviewSubmissionSchema } from "@/lib/validation/review";
import { submitReview } from "@/lib/data/mutations";
import { rateLimit, clientKey } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = Number(process.env.REVIEW_RATE_LIMIT_PER_HOUR ?? "3");
  const rl = rateLimit(clientKey(request.headers, "review-submit"), limit, 3600_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } });

  let json: unknown;
  try { json = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const parsed = reviewSubmissionSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true, status: "pending_verification" }); // honeypot

  try {
    const result = await submitReview(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    const dupe = e instanceof Error && e.message === "duplicate";
    return NextResponse.json(
      { error: dupe ? "You've already reviewed this. Edit your existing review instead." : "Something went wrong submitting your review." },
      { status: dupe ? 409 : 500 }
    );
  }
}
