import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cx } from "@/lib/format";
import { Reveal } from "./Reveal";

export function Section({ title, description, eyebrow, moreHref, moreLabel, children, id, className, bleed = false, tone }:
  { title: string; description?: string; eyebrow?: string; moreHref?: string; moreLabel?: string;
    children: ReactNode; id?: string; className?: string; bleed?: boolean; tone?: "band" | "brand" }) {
  const content = (
    <>
      <Reveal>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="mb-3 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-meta font-bold uppercase tracking-wider text-muted">{eyebrow}</p>}
            <h2 className="font-display text-h2 font-extrabold text-fg lg:text-h2-lg">{title}</h2>
            {description && <p className="mt-3 max-w-2xl text-body-lg text-muted">{description}</p>}
          </div>
          {moreHref && (
            <Link href={moreHref} className="group hidden shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-meta-lg font-semibold transition hover:border-border-strong hover:shadow-sm sm:inline-flex">
              {moreLabel ?? "View all"} <ArrowRight size={15} className="transition-transform duration-fast group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </Reveal>
      {children}
    </>
  );
  return (
    <section id={id} className={cx("scroll-mt-24 py-14 sm:py-16",
      bleed && "bleed border-y border-border", bleed && tone === "brand" ? "band-brand" : bleed && "band", className)}>
      {bleed ? <div className="bleed-inner">{content}</div> : content}
    </section>
  );
}
