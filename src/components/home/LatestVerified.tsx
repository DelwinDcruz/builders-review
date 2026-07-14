import { getReviews } from "@/lib/data/repo";
import { unifyFirstParty } from "@/lib/reviews/unify";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";

export async function LatestVerified() {
  const { reviews } = await getReviews({ verifiedOnly: true, sort: "newest", pageSize: 3 });
  return (
    <Section eyebrow="Verified" title="Latest verified reviews"
      description="Each of these reviewers confirmed their email address before publication. A badge is only ever shown when it was actually earned."
      moreHref="/reviews?verified=1" moreLabel="All verified reviews">
      {reviews.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => <Reveal key={r.slug} delay={i * 60} className="h-full"><ReviewCard review={unifyFirstParty(r)} /></Reveal>)}
        </div>
      ) : (
        <EmptyState title="No verified reviews yet"
          description="Reviews appear here once a reviewer confirms their email and a moderator approves the review."
          action={<ButtonLink href="/write-review">Write a review</ButtonLink>} />
      )}
    </Section>
  );
}
