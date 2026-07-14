import Link from "next/link";
import { Scale, Users, Briefcase, Percent } from "lucide-react";
import { Section } from "@/components/ui/Section";

const POINTS = [
  { icon: Scale, title: "Count-weighted, never averaged", body: "When we combine our reviews with a platform's rating, we weight by how many reviews sit behind each figure. We never average platform averages." },
  { icon: Users, title: "Learner scores stay learner scores", body: "Course, internship, mentor, career-support and website scores are all computed separately, so a strong course can't hide a weak mentor score." },
  { icon: Briefcase, title: "Employee reviews stay separate", body: "Glassdoor, AmbitionBox and Indeed measure what it's like to work here — not learn here. They're shown apart and never merged in." },
  { icon: Percent, title: "Nothing becomes a fake star", body: "Facebook recommendation percentages and BBB letter grades are never converted into star ratings. They're shown in their original form or not at all." }
];

export function MethodologyTeaser() {
  return (
    <Section eyebrow="Methodology" title="How we calculate ratings"
      description="Published in full, so you can check our arithmetic." moreHref="/methodology" moreLabel="Read the methodology">
      <div className="grid gap-6 md:grid-cols-2">
        {POINTS.map((p) => (
          <div key={p.title} className="card flex gap-4 p-6">
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><p.icon size={20} /></span>
            <div>
              <h3 className="text-card font-bold">{p.title}</h3>
              <p className="mt-1.5 text-body text-fg-secondary">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-meta-lg text-muted">
        Want the full detail? Read the <Link href="/methodology" className="font-semibold text-brand hover:underline">review methodology</Link>, the{" "}
        <Link href="/verification-policy" className="font-semibold text-brand hover:underline">verification policy</Link> and our{" "}
        <Link href="/about" className="font-semibold text-brand hover:underline">conflict-of-interest disclosure</Link>.
      </p>
    </Section>
  );
}
