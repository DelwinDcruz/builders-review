import { Star } from "lucide-react";
import { cx } from "@/lib/format";
import { roundRating } from "@/lib/rating/engine";

const PX = { xs: 13, sm: 15, md: 19, lg: 26, xl: 34 } as const;

/** Partial-fill stars. Decorative; an sr-only sentence carries the real value. */
export function StarRating({ value, count, size = "md", showNumber = true, className }:
  { value: number | null; count?: number; size?: keyof typeof PX; showNumber?: boolean; className?: string }) {
  const px = PX[size];
  const pct = value === null ? 0 : Math.max(0, Math.min(100, (value / 5) * 100));
  const label = value === null
    ? "No approved reviews yet"
    : `Rated ${roundRating(value)} out of 5${typeof count === "number" ? ` from ${count} review${count === 1 ? "" : "s"}` : ""}`;
  const row = (filled: boolean) => (
    <span className="flex" aria-hidden="true">
      {[0,1,2,3,4].map((i) => (
        <Star key={i} width={px} height={px} strokeWidth={1.75} className={filled ? "fill-star text-star" : "text-border-strong"} />
      ))}
    </span>
  );
  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <span className="relative inline-block" aria-hidden="true">
        {row(false)}
        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>{row(true)}</span>
      </span>
      {showNumber && (
        <span className={cx("font-bold tabular-nums leading-none", size === "lg" || size === "xl" ? "text-card" : "text-meta-lg")} aria-hidden="true">
          {value === null ? "—" : roundRating(value).toFixed(1)}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </span>
  );
}
