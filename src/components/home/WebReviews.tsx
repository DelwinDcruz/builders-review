import { Info } from "lucide-react";
import { getUnifiedRecentReviews } from "@/lib/data/sources-repo";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { NoReviewsState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";

export async function WebReviews() {
  const reviews = await getUnifiedRecentReviews(6);
  return (
    <Section bleed tone="band" eyebrow="Across the web" title="Reviews from across the web"
      description="Written here, or collected legally from a platform where Portfolio Builders has a verified profile — always attributed and linked to the source."
      moreHref="/reviews" moreLabel="All reviews">
      <p className="mb-6 flex items-start gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-meta-lg text-muted">
        <Info size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
        Reviews are clearly labelled by origin. We never present an external review as if it were submitted directly to builders.review.
      </p>
      {reviews.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => <Reveal key={r.key} delay={i * 50} className="h-full"><ReviewCard review={r} /></Reveal>)}
        </div>
      ) : <NoReviewsState action={<ButtonLink href="/write-review">Write the first review</ButtonLink>} />}
    </Section>
  );
}
