"use client";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Mail } from "lucide-react";
import { sendMagicLink, type SignInState } from "@/app/auth/actions";

const initial: SignInState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-brand font-semibold text-brand-fg transition-opacity disabled:opacity-60"
    >
      {pending && <Loader2 size={16} className="animate-spin" aria-hidden="true" />} Send sign-in link
    </button>
  );
}

export function SignInForm({ next, authEnabled }: { next: string; authEnabled: boolean }) {
  const [state, formAction] = useFormState(sendMagicLink, initial);

  if (!authEnabled) {
    return (
      <div className="card p-7 text-body text-muted">
        <p>
          <strong className="text-fg">Authentication isn&apos;t configured on this environment.</strong>{" "}
          Set <code>AUTH_SECRET</code>, the <code>EMAIL_SERVER_*</code> variables and <code>EMAIL_FROM</code> in{" "}
          <code>.env.local</code> to enable magic-link sign-in for reviewers, moderators and administrators.
        </p>
      </div>
    );
  }

  if (state.sent) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <Mail size={24} />
        </div>
        <h2 className="text-card font-semibold">Check your email</h2>
        <p className="mt-1 text-body text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="card space-y-5 p-7">
      <input type="hidden" name="next" value={next} />
      <label className="block text-meta-lg">
        <span className="mb-1.5 block font-semibold">Email address</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-body outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        />
      </label>
      {state.message && !state.ok && (
        <p role="alert" className="text-meta-lg text-error">{state.message}</p>
      )}
      <SubmitButton />
    </form>
  );
}
