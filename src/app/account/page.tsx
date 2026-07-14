import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/roles";
import { AUTH_ENABLED } from "@/auth";
import { getReviewsByReviewer } from "@/lib/data/admin";
import { EmptyState, VerificationPending } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { formatDate } from "@/lib/format";
import { doSignOut } from "@/app/auth/sign-out-action";

export const metadata: Metadata = { title: "Your account", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Reviewer account: your submissions and their moderation status. */
export default async function AccountPage() {
  const user = await getCurrentUser();
  if (AUTH_ENABLED && user.role === "public") redirect("/auth/sign-in?next=/account");

  const mine = user.id ? await getReviewsByReviewer(user.id) : [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-h2 font-extrabold tracking-tight">Your account</h1>
          <p className="mt-3 text-body-lg text-muted">Your submitted reviews and their status. Your email is never shown publicly.</p>
        </div>
        {AUTH_ENABLED && user.id && (
          <form action={doSignOut}>
            <button className="rounded-lg border border-border px-4 py-2 text-meta-lg font-semibold hover:bg-surface-2">Sign out</button>
          </form>
        )}
      </div>

      {!AUTH_ENABLED && (
        <p className="mt-6 rounded-xl border border-warning/30 bg-warning/10 p-4 text-meta-lg text-warning">
          Authentication isn&apos;t configured on this environment. Set <code>AUTH_SECRET</code> and the email server variables to enable reviewer accounts.
        </p>
      )}

      <div className="mt-8 space-y-6">
        <VerificationPending />
        {mine.length ? (
          <ul className="space-y-3">
            {mine.map((r) => (
              <li key={r.id} className="card flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{r.title}</p>
                  <p className="text-meta text-muted">{r.experienceType.replace(/_/g, " ")} · {formatDate(r.submittedAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StarRating value={r.overallRating} size="sm" />
                  <span className="rounded-full border border-border px-2 py-0.5 text-meta capitalize text-muted">{r.status.replace(/_/g, " ")}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No submissions yet"
            description="Reviews you submit will appear here with their moderation status: pending verification, pending moderation, approved or rejected — with the reason."
            action={<ButtonLink href="/write-review">Write a review</ButtonLink>} />
        )}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-surface p-6 text-meta-lg text-muted">
        <h2 className="mb-2 text-card font-bold text-fg">Your rights over your review</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Edit a review while it is still pending moderation.</li>
          <li>Request an update to a published review.</li>
          <li>Withdraw your review in line with our <Link href="/moderation-policy" className="font-semibold text-brand hover:underline">moderation policy</Link>.</li>
          <li>Request deletion of your personal data — see the <Link href="/privacy-policy" className="font-semibold text-brand hover:underline">privacy policy</Link>.</li>
        </ul>
      </div>
    </div>
  );
}
