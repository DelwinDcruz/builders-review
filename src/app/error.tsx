"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning"><AlertTriangle size={30} /></div>
      <h1 className="font-display text-h3 font-bold">Something went wrong</h1>
      <p className="mt-3 text-body-lg text-muted">An unexpected problem occurred. Nothing was lost — you can try again.</p>
      <div className="mt-8 flex justify-center gap-3">
        <button onClick={reset} className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-brand px-6 font-semibold text-brand-fg"><RefreshCw size={16} aria-hidden="true" /> Try again</button>
        <a href="/" className="inline-flex min-h-[48px] items-center rounded-lg border border-border bg-surface px-6 font-semibold">Home</a>
      </div>
    </div>
  );
}
