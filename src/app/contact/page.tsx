import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { COMPANY } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Contact builders.review",
  description: "Dispute a review, report a technical issue, make a privacy request or ask a question about Portfolio Builders reviews.",
  path: "/contact"
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-h2 font-extrabold tracking-tight lg:text-h2-lg">Contact us</h1>
        <p className="mt-4 text-body-lg text-muted">
          Dispute a review, report a bug, ask a question or make a privacy request. Disputes and privacy requests are prioritised; most enquiries get a reply within 3 business days.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <ContactForm />
        <aside className="space-y-6">
          <div className="card p-7">
            <h2 className="mb-4 text-card font-bold">Portfolio Builders contact details</h2>
            <p className="mb-4 text-meta-lg text-muted">These are the company's own verified details, taken from its official website. builders.review has no separate postal address.</p>
            <ul className="space-y-3 text-meta-lg text-muted">
              <li className="flex items-center gap-2"><Mail size={15} aria-hidden="true" /> <a href={`mailto:${COMPANY.email}`} className="hover:text-fg">{COMPANY.email}</a></li>
              <li className="flex items-center gap-2"><Phone size={15} aria-hidden="true" /> <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-fg">{COMPANY.phoneDisplay}</a></li>
              <li className="flex items-center gap-2"><Clock size={15} aria-hidden="true" /> {COMPANY.hours}</li>
            </ul>
            <div className="mt-5 space-y-4">
              {COMPANY.locations.map((l) => (
                <div key={l.label} className="flex items-start gap-2 text-meta-lg text-muted">
                  <MapPin size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span><strong className="text-fg">{l.label}:</strong> {l.street}, {l.locality}{l.postalCode ? `, ${l.region} ${l.postalCode}` : `, ${l.region}`}</span>
                </div>
              ))}
            </div>
            <a href={COMPANY.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-meta-lg font-semibold text-brand hover:underline">
              Visit Portfolio Builders <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
          <div className="card p-7 text-meta-lg text-muted">
            <h2 className="mb-2 text-card font-bold text-fg">Disputing a review</h2>
            <p>Tell us the review URL and why you believe it breaches the <a href="/review-guidelines" className="font-semibold text-brand hover:underline">review guidelines</a>. A moderator will assess it. We do not remove a genuine review simply because it is negative.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
