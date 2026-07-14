import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/format";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-fast ease-premium focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none min-h-[44px] whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-fg shadow-sm hover:bg-brand-hover hover:shadow-md active:translate-y-px",
  accent: "bg-accent text-accent-fg shadow-sm hover:brightness-105 active:translate-y-px",
  secondary: "border border-border bg-surface text-fg hover:border-border-strong hover:bg-surface-2",
  ghost: "text-fg-secondary hover:bg-surface-2 hover:text-fg",
  danger: "border border-error/40 text-error hover:bg-error/10"
};
const sizes: Record<Size, string> = { sm: "px-4 text-meta-lg min-h-[40px]", md: "px-5 text-body", lg: "px-7 text-body-lg min-h-[52px]" };

interface P { variant?: Variant; size?: Size; className?: string; children: ReactNode; }
export function Button({ variant = "primary", size = "md", className, children, ...r }: P & ComponentProps<"button">) {
  return <button className={cx(base, variants[variant], sizes[size], className)} {...r}>{children}</button>;
}
export function ButtonLink({ variant = "primary", size = "md", className, children, href, ...r }: P & ComponentProps<typeof Link>) {
  return <Link href={href} className={cx(base, variants[variant], sizes[size], className)} {...r}>{children}</Link>;
}
