import { getCategories, getPrograms } from "@/lib/data/repo";
import { WriteReviewForm } from "@/components/forms/WriteReviewForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Write a Portfolio Builders review",
  description: "Share your genuine experience of a Portfolio Builders course, internship, program, mentor, portfolio service, career support or the community. Verified by email and moderated before publication.",
  path: "/write-review"
});

export default async function WriteReviewPage({ searchParams }: { searchParams: { experience?: string; program?: string } }) {
  const [programs, categories] = await Promise.all([getPrograms(), getCategories()]);
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Write a review" }]} />
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-h2 font-extrabold tracking-tight lg:text-h2-lg">Write a Portfolio Builders review</h1>
        <p className="mt-4 text-body-lg text-muted">
          Honest reviews — positive or critical — help the next student, intern, parent or career switcher decide. Your email is used only to verify the review and is never shown publicly. Nothing is published before a moderator reads it.
        </p>
      </header>
      <WriteReviewForm
        programs={programs.map((p) => ({ slug: p.slug, title: p.title, type: p.type }))}
        categories={categories.map((c) => ({ key: c.key, label: c.label }))}
        initial={{ experience: searchParams.experience, program: searchParams.program }} />
    </>
  );
}
