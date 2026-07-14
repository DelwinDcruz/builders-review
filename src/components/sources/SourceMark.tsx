import type { CSSProperties } from "react";
import { sourceBrand } from "@/lib/sources/branding";
import { getSourceDef } from "@/lib/sources/definitions";
import { cx } from "@/lib/format";

/**
 * Accessible source mark. We ship NO third-party logos (no brand permission):
 * a tinted monogram is used, and the platform NAME is always exposed to screen
 * readers. Drop a permitted SVG at public/platforms/<slug>.svg + set logo:true.
 */
export function SourceMark({ slug, size = 40, className }: { slug: string; size?: number; className?: string }) {
  const b = sourceBrand(slug);
  const name = getSourceDef(slug)?.name ?? slug;
  const style = { ["--sa" as string]: b.accent, width: size, height: size } as CSSProperties;
  return (
    <span role="img" aria-label={`${name} logo`} style={style}
      className={cx("inline-flex shrink-0 items-center justify-center rounded-xl border font-display font-bold",
        "border-[rgb(var(--sa)/0.25)] bg-[rgb(var(--sa)/0.10)] text-[rgb(var(--sa))]", className)}>
      {b.logo
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={`/platforms/${slug}.svg`} alt="" width={size * .6} height={size * .6} className="object-contain" aria-hidden="true" />
        : <span aria-hidden="true" style={{ fontSize: Math.max(11, size * .32) }}>{b.monogram}</span>}
    </span>
  );
}
