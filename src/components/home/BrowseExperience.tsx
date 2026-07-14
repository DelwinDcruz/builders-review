import { getSummaryByExperience, getSummaryByProgram, getRecentReviews } from "@/lib/data/repo";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ExperienceCard } from "@/components/reviews/ExperienceCard";
import type { ExpKey } from "@/lib/sources/branding";

const TILES: { type: ExpKey; href: string; label?: string; program?: string }[] = [
  { type: "course", href: "/courses" },
  { type: "internship", href: "/internships" },
  { type: "program", href: "/programs" },
  { type: "mentorship", href: "/mentors" },
  { type: "career_support", href: "/career-support" },
  { type: "community", href: "/community" },
  { type: "portfolio_service", href: "/programs?type=portfolio_service", label: "Portfolio-building reviews" },
  { type: "website", href: "/reviews?experience=website" }
];

export async function BrowseExperience() {
  const recent = await getRecentReviews(200);
  const tiles = await Promise.all(TILES.map(async (t) => ({
    ...t,
    summary: t.program ? await getSummaryByProgram(t.program) : await getSummaryByExperience(t.type as never),
    latest: recent.find((r) => r.experienceType === t.type)?.publishedAt
  })));

  return (
    <Section eyebrow="Browse" title="Browse reviews by experience"
      description="A course is not an internship, and mentorship is not placement support. Each is reviewed and scored separately.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t, i) => (
          <Reveal key={t.href} delay={i * 50} className="h-full">
            <ExperienceCard type={t.type} href={t.href} summary={t.summary} latestDate={t.latest} label={t.label} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
