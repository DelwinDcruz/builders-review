import { Skeleton } from "@/components/ui/Skeleton";
export default function Loading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-11 w-72" />
      <Skeleton className="h-6 w-full max-w-2xl" />
      <Skeleton className="h-32 w-full" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
      </div>
    </div>
  );
}
