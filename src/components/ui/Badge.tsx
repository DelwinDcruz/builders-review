import type { ReactNode } from "react";
import { cx } from "@/lib/format";
type Tone = "neutral" | "success" | "warning" | "error" | "brand" | "info";
const tones: Record<Tone, string> = {
  neutral: "border-border bg-surface-2 text-fg-secondary",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  error: "border-error/30 bg-error/10 text-error",
  brand: "border-brand/30 bg-brand/10 text-brand",
  info: "border-info/30 bg-info/10 text-info"
};
export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-meta font-semibold", tones[tone], className)}>{children}</span>;
}
