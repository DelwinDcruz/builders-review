import Link from "next/link";
import { Compass } from "lucide-react";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand"><Compass size={30} /></div>
      <p className="font-display text-hero font-extrabold leading-none grad-text">404</p>
      <h1 className="mt-4 font-display text-h3 font-bold">Page not found</h1>
      <p className="mt-3 text-body-lg text-muted">
        This page doesn't exist, or it's a program page with no approved reviews yet — we don't publish empty review pages.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex min-h-[48px] items-center rounded-lg bg-brand px-6 font-semibold text-brand-fg">Back to home</Link>
        <Link href="/reviews" className="inline-flex min-h-[48px] items-center rounded-lg border border-border bg-surface px-6 font-semibold">All reviews</Link>
        <Link href="/courses" className="inline-flex min-h-[48px] items-center rounded-lg border border-border bg-surface px-6 font-semibold">Course reviews</Link>
      </div>
    </div>
  );
}
