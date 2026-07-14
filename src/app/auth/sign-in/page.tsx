import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";
import { AUTH_ENABLED } from "@/auth";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function Page({ searchParams }: { searchParams: { next?: string } }) {
  const next = searchParams.next?.startsWith("/") ? searchParams.next : "/account";
  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="mb-2 font-display text-h3 font-extrabold">Sign in</h1>
      <p className="mb-6 text-body text-muted">
        Reviewers, moderators and administrators sign in with a secure magic link. No password to remember.
      </p>
      <SignInForm next={next} authEnabled={AUTH_ENABLED} />
    </div>
  );
}
