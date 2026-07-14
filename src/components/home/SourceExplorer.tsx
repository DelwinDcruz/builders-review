import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { CSSProperties } from "react";
import { getSourceOverviews } from "@/lib/data/sources-repo";
import { sourceBrand } from "@/lib/sources/branding";
import { SourceMark } from "@/components/sources/SourceMark";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { STATUS_LABELS } from "@/lib/sources/status";
import { formatDate, formatNumber } from "@/lib/format";

/** Review-source explorer. Only CONNECTED sources show a rating. */
export async function SourceExplorer() {
  const sources = await getSourceOverviews();
  const connected = sources.filter((s) => s.connected);
  const rest = sources.filter((s) => !s.connected);

  return (
    <Section eyebrow="Review platforms" title="Review-source explorer"
      description="A platform only shows a rating when Portfolio Builders has a genuine, admin-verified profile on it. Everything else is listed honestly as not connected."
      moreHref="/review-platforms" moreLabel="All platforms">
      {connected.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {connected.map((s, i) => {
            const b = sourceBrand(s.def.slug);
            const style = { ["--sa" as string]: b.accent } as CSSProperties;
            const href = s.def.slug === "google" ? "/google-reviews" : "/review-platforms";
            return (
              <Reveal key={s.def.slug} delay={i * 50} className="h-full">
                <div style={style} className="card card-lift group flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <SourceMark slug={s.def.slug} size={48} />
                    <Badge tone={s.def.group === "employer" ? "info" : "success"}>
                      {s.def.group === "employer" ? "Employee reviews" : STATUS_LABELS[s.status]}
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-card font-bold">{s.def.name}</h3>
                  <div className="mt-3 flex-1">
                    {s.normalized !== null ? (
                      <>
                        <StarRating value={s.normalized} size="sm" />
                        <p className="mt-1 text-meta text-muted">
                          {formatNumber(s.platformCount)} ratings on {s.def.name}
                          {s.def.group === "employer" && " · not included in learner scores"}
                        </p>
                      </>
                    ) : (
                      <p className="text-meta-lg text-muted">
                        {s.def.ratingType === "recommendation_pct" ? "Recommendations, not stars — never converted."
                          : s.def.ratingType === "letter_grade" ? "Letter grade, not stars — never converted."
                          : "No rating available."}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-meta">
                    <span className="text-muted">{s.lastUpdated ? `Verified ${formatDate(s.lastUpdated)}` : "Not verified"}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[rgb(var(--sa))]">
                      <Link href={href}>Explore</Link>
                      <ArrowRight size={13} className="transition-transform duration-fast group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                  {s.profile?.externalProfileUrl.startsWith("http") && (
                    <a href={s.profile.externalProfileUrl} target="_blank" rel="noopener noreferrer nofollow"
                      className="mt-2 inline-flex items-center gap-1 text-meta text-muted hover:text-fg">
                      Open profile on {s.def.name} <ExternalLink size={11} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border bg-surface p-6">
        <h3 className="text-card font-bold">Not connected yet</h3>
        <p className="mt-1 text-meta-lg text-muted">
          We list these platforms transparently. None shows a rating, because no verified Portfolio Builders profile has been connected — we never display “0 reviews” for a profile that doesn't exist.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {rest.map((s) => (
            <li key={s.def.slug} className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 py-1.5 pl-1.5 pr-3 text-meta font-medium text-muted">
              <SourceMark slug={s.def.slug} size={26} /> {s.def.name}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
