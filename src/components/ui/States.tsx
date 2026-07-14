import type { ReactNode } from "react";
import Link from "next/link";
import { Inbox, PlugZap, CloudOff, AlertTriangle, SearchX, CheckCircle2, MailCheck, Clock3, RefreshCw, Star } from "lucide-react";
import { Skeleton } from "./Skeleton";

export function EmptyState({ title, description, action, icon, tone = "neutral" }:
  { title: string; description: string; action?: ReactNode; icon?: ReactNode; tone?: "neutral" | "info" | "warning" }) {
  const ring = tone === "warning" ? "bg-warning/10 text-warning" : tone === "info" ? "bg-info/10 text-info" : "bg-surface-2 text-muted";
  return (
    <div className="card flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${ring}`} aria-hidden="true">{icon ?? <Inbox size={24} />}</div>
      <div>
        <h3 className="text-card font-semibold">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-body text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export const NoReviewsState = ({ action }: { action?: ReactNode }) => (
  <EmptyState icon={<Star size={24} />} title="No reviews yet"
    description="There are no approved reviews here yet, so we don't show a rating. Be the first to share a genuine experience."
    action={action} />
);

export const SourceNotConnected = ({ platform }: { platform: string }) => (
  <EmptyState tone="info" icon={<PlugZap size={24} />} title={`${platform} isn't connected`}
    description={`Portfolio Builders has no verified ${platform} profile connected here, so we show no rating and no review count. We never display a profile that doesn't exist.`} />
);

export const SourceUnavailable = ({ platform, lastVerified }: { platform: string; lastVerified?: string }) => (
  <div className="card flex items-start gap-3 p-5" role="status">
    <CloudOff size={20} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
    <div>
      <p className="font-semibold">This source is temporarily unavailable.</p>
      <p className="mt-1 text-meta-lg text-muted">
        {lastVerified ? `Rating last verified on ${lastVerified}. ` : ""}View the latest reviews directly on {platform}.
      </p>
    </div>
  </div>
);

export const StaleDataNotice = ({ lastSynced }: { lastSynced: string }) => (
  <p className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-meta-lg text-warning" role="status">
    <Clock3 size={14} aria-hidden="true" /> Data may be out of date — last synchronized {lastSynced}.
  </p>
);

export const NoSearchResults = ({ resetHref }: { resetHref: string }) => (
  <EmptyState icon={<SearchX size={24} />} title="No reviews match your filters"
    description="Try removing a filter, or search for a program name such as “FYUGP” or “UI/UX”."
    action={<Link href={resetHref} className="inline-flex min-h-[44px] items-center rounded-lg bg-brand px-5 font-semibold text-brand-fg">Reset filters</Link>} />
);

export const SubmittedState = ({ children }: { children?: ReactNode }) => (
  <div className="card p-8 text-center">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success"><CheckCircle2 size={32} /></div>
    <h2 className="font-display text-h3 font-bold">Thank you — your review was submitted</h2>
    {children}
  </div>
);

export const VerificationPending = () => (
  <p className="flex items-center gap-2 rounded-lg border border-info/30 bg-info/10 px-3 py-2 text-meta-lg text-info" role="status">
    <MailCheck size={14} aria-hidden="true" /> Verification pending — check your email to confirm this review.
  </p>
);

export const ErrorState = ({ title = "Something went wrong", description, retryHref }:
  { title?: string; description?: string; retryHref?: string }) => (
  <EmptyState tone="warning" icon={<AlertTriangle size={24} />} title={title}
    description={description ?? "An unexpected problem occurred. Nothing was lost — you can try again."}
    action={retryHref ? <Link href={retryHref} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-brand px-5 font-semibold text-brand-fg"><RefreshCw size={16} /> Try again</Link> : undefined} />
);
