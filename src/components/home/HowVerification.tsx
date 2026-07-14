import Link from "next/link";
import { PenLine, MailCheck, ShieldCheck, Link2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  { icon: PenLine, title: "You submit", body: "Pick the exact course, internship, program, mentor, service or the website you experienced, then rate it and write your review." },
  { icon: MailCheck, title: "We verify your email", body: "We send a confirmation link. Only when you click it does the review carry a “Verified reviewer” badge. We never show a badge that wasn't earned." },
  { icon: ShieldCheck, title: "A moderator checks it", body: "Every review is read against the review guidelines before publication. Nothing is auto-published. Genuine criticism is never removed for being negative." },
  { icon: Link2, title: "External reviews are attributed", body: "Reviews collected from Google or another platform name their source, link to the original, and show when they were last synchronized or verified." }
];

export function HowVerification() {
  return (
    <Section bleed eyebrow="Trust" title="How verification works"
      description="No rewards for positive reviews. No suppression of negative ones. No scraping.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 70} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand"><s.icon size={20} /></span>
                <span className="text-meta font-bold uppercase tracking-wider text-muted">Step {i + 1}</span>
              </div>
              <h3 className="text-card font-bold">{s.title}</h3>
              <p className="mt-2 flex-1 text-body text-fg-secondary">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/verification-policy" className="inline-flex min-h-[48px] items-center rounded-lg border border-border bg-surface px-6 font-semibold hover:border-border-strong">Verification policy</Link>
        <Link href="/moderation-policy" className="inline-flex min-h-[48px] items-center rounded-lg border border-border bg-surface px-6 font-semibold hover:border-border-strong">Moderation policy</Link>
      </div>
    </Section>
  );
}
