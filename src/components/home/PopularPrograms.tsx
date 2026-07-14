import { getProgramPerformance } from "@/lib/data/repo";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProgramCard } from "@/components/reviews/ProgramCard";
import { EmptyState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";

/** Most-reviewed courses and internships. Never invents popularity. */
export async function PopularPrograms() {
  const [courses, internships] = await Promise.all([getProgramPerformance("course"), getProgramPerformance("internship")]);
  const top = [...courses, ...internships]
    .filter((p) => p.summary.count > 0)
    .sort((a, b) => b.summary.count - a.summary.count)
    .slice(0, 6);

  return (
    <Section eyebrow="Courses & internships" title="Most-reviewed courses and internships"
      description="Ranked by how many approved reviews each has — not by anything we decide."
      moreHref="/courses" moreLabel="All courses">
      {top.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {top.map((p, i) => <Reveal key={p.program.slug} delay={i * 50} className="h-full"><ProgramCard program={p.program} summary={p.summary} /></Reveal>)}
        </div>
      ) : (
        <EmptyState title="No programs have reviews yet"
          description="All Portfolio Builders courses and internships are listed and ready to review — none has an approved review yet."
          action={<ButtonLink href="/write-review">Review a course or internship</ButtonLink>} />
      )}
    </Section>
  );
}
