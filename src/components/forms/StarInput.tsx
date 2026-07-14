"use client";
import { Star } from "lucide-react";
import { useState } from "react";
import { cx } from "@/lib/format";

/** Accessible radiogroup star input; fully keyboard operable. */
export function StarInput({ value, onChange, label, id, required }:
  { value: number; onChange: (v: number) => void; label: string; id: string; required?: boolean }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div>
      <span id={`${id}-label`} className="mb-1.5 block text-meta-lg font-semibold">
        {label}{required && <span className="text-error" aria-hidden="true"> *</span>}
      </span>
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="inline-flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1,2,3,4,5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            tabIndex={value === n || (value === 0 && n === 1) ? 0 : -1}
            onClick={() => onChange(n)} onMouseEnter={() => setHover(n)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); onChange(Math.min(5, (value || 0) + 1)); }
              if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); onChange(Math.max(1, (value || 1) - 1)); }
            }}
            className="rounded p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">
            <Star width={28} height={28} className={cx(n <= shown ? "fill-star text-star" : "text-border-strong")} />
          </button>
        ))}
        <span className="ml-2 text-meta-lg text-muted" aria-live="polite">{value ? `${value} / 5` : "Not rated"}</span>
      </div>
    </div>
  );
}
