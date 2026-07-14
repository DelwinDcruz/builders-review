import Link from "next/link";
import { PenLine, Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { SITE, COMPANY } from "@/lib/site-config";
import { EXPERIENCE_NAV, FOOTER_LEGAL, FOOTER_PLATFORM, FOOTER_POLICIES } from "@/lib/nav";
import { isSampleModeActive } from "@/lib/data/repo";

const Column = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
  <div>
    <h2 className="mb-4 text-meta font-bold uppercase tracking-wider text-muted">{title}</h2>
    <ul className="space-y-3">
      {links.map((l) => <li key={l.href}><Link href={l.href} className="text-meta-lg text-fg-secondary transition-colors hover:text-brand">{l.label}</Link></li>)}
    </ul>
  </div>
);

export function Footer() {
  const year = new Date().getFullYear();
  const primary = COMPANY.locations[0];
  const updated = new Date().toISOString().slice(0, 10);

  return (
    <footer className="mt-24 border-t border-border bg-bg-alt">
      <div className="container-app py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 font-display text-body-lg font-extrabold tracking-tight">
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-meta-lg font-extrabold text-brand-fg">BR</span>
              builders<span className="text-muted">.review</span>
            </div>
            <p className="mt-4 text-meta-lg leading-relaxed text-muted">{SITE.tagline}</p>
            <Link href="/write-review" className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent px-5 text-meta-lg font-semibold text-accent-fg transition hover:brightness-105">
              <PenLine size={15} aria-hidden="true" /> Write a Review
            </Link>

            <h3 className="mt-8 text-meta font-bold uppercase tracking-wider text-muted">Portfolio Builders contact</h3>
            <ul className="mt-3 space-y-2 text-meta text-muted">
              <li className="flex items-center gap-2"><Mail size={13} aria-hidden="true" /> <a href={`mailto:${COMPANY.email}`} className="hover:text-fg">{COMPANY.email}</a></li>
              <li className="flex items-center gap-2"><Phone size={13} aria-hidden="true" /> <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-fg">{COMPANY.phoneDisplay}</a></li>
              <li className="flex items-start gap-2"><MapPin size={13} className="mt-0.5" aria-hidden="true" /> {primary?.street}, {primary?.locality}, {primary?.region} {primary?.postalCode}</li>
              <li className="flex items-center gap-2"><Clock size={13} aria-hidden="true" /> {COMPANY.hours}</li>
            </ul>
            <a href={COMPANY.officialUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-meta-lg font-semibold text-brand hover:underline">
              Visit portfoliobuilders.in <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>

          <Column title="Browse reviews" links={EXPERIENCE_NAV} />
          <Column title="Review platforms" links={[{ label: "Google Reviews", href: "/google-reviews" }, { label: "All platforms", href: "/review-platforms" }, { label: "All reviews", href: "/reviews" }]} />
          <Column title="Review policies" links={FOOTER_POLICIES} />
          <Column title="Platform & legal" links={[...FOOTER_PLATFORM, ...FOOTER_LEGAL]} />
        </div>

        <div className="mt-14 grid gap-4 rounded-xl border border-border bg-surface p-6 text-meta-lg text-muted lg:grid-cols-2">
          <p><strong className="text-fg">Ownership & conflict-of-interest disclosure.</strong> {SITE.ownership}</p>
          <p>
            <strong className="text-fg">Data disclosure.</strong> Reviews are either submitted on builders.review or obtained legally from platforms where Portfolio Builders has a verified profile, always attributed with a link to the source. Employee reviews are kept separate from student reviews.{" "}
            {isSampleModeActive() && <strong className="text-warning">Sample data is currently enabled.</strong>}{" "}
            <Link href="/methodology" className="font-semibold text-brand hover:underline">How ratings are calculated</Link>.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-meta-lg text-muted sm:flex-row sm:items-center">
          <p>© {year} {SITE.name}. <span className="text-meta">Company facts checked {COMPANY.factsCheckedAt} · Page updated {updated}</span></p>
          <nav aria-label="Footer utility">
            <ul className="flex flex-wrap gap-6">
              <li><Link href="/sitemap.xml" className="hover:text-brand">Sitemap</Link></li>
              <li><Link href="/contact" className="hover:text-brand">Contact</Link></li>
              <li><Link href="/accessibility" className="hover:text-brand">Accessibility</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
