import type { Metadata } from "next";
import { getCategories, getPrograms, getReviews } from "@/lib/data/repo";
import type { ReviewSort } from "@/lib/data/repo";
import { getExternalReviews, getConnectedSources } from "@/lib/data/sources-repo";
import { getSourceDef } from "@/lib/sources/definitions";
import { EXPERIENCE_META, type ExpKey } from "@/lib/sources/branding";
import { getProgram } from "@/lib/programs";
import { unifyExternal, unifyFirstParty, mergeReviews } from "@/lib/reviews/unify";

import { FilterSidebar } from "@/components/reviews/FilterSidebar";
import { SortToolbar } from "@/components/reviews/SortToolbar";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Pagination } from "@/components/reviews/Pagination";
import { NoSearchResults } from "@/components/ui/States";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 120;
const PAGE_SIZE = 12;
const FP_SORTS = ["newest", "oldest", "highest", "lowest", "helpful"];

interface SP {
  experience?: string; program?: string; category?: string; rating?: string;
  verified?: string; recommend?: string; search?: string; sort?: string;
  page?: string; origin?: string; source?: string;
}

export function generateMetadata({ searchParams }: { searchParams: SP }): Metadata {
  const filtered = Object.entries(searchParams).some(([k, v]) => v && !(k === "page" && v === "1"));
  return pageMetadata({
    title: "All Portfolio Builders reviews — students, interns & alumni",
    description: "Every approved Portfolio Builders review in one place: courses, internships, programs, mentors, career support, community and the website — plus reviews from verified external platforms. Filter by program, rating and verification.",
    path: "/reviews",
    index: !filtered   // thin filter combinations are noindexed
  });
}

export default async function ReviewsPage({ searchParams }: { searchParams: SP }) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const [categories, programs, connected] = await Promise.all([getCategories(), getPrograms(), getConnectedSources()]);

  const origin = searchParams.origin ?? "";
  const source = searchParams.source ?? "";
  const externalSelected = !!source && source !== "builders-review";
  const wantFirstParty = origin !== "external" && !externalSelected;
  const wantExternal = origin !== "first" && source !== "builders-review";

  const sort = FP_SORTS.includes(searchParams.sort ?? "") ? (searchParams.sort as ReviewSort) : "newest";

  const fp = wantFirstParty ? await getReviews({
    experienceType: (searchParams.experience as never) || undefined,
    programSlug: searchParams.program || undefined,
    category: searchParams.category || undefined,
    minRating: searchParams.rating ? Number(searchParams.rating) : undefined,
    verifiedOnly: searchParams.verified === "1",
    recommendedOnly: searchParams.recommend === "1",
    search: searchParams.search || undefined,
    sort, page: 1, pageSize: 500
  }) : null;

  let ext = wantExternal ? await getExternalReviews(externalSelected ? source : undefined) : [];
  ext = ext.filter((r) => r.group !== "employer");   // employee reviews are shown only in their own section
  if (searchParams.rating) ext = ext.filter((r) => (r.normalizedRating ?? 0) >= Number(searchParams.rating));
  if (searchParams.verified === "1") ext = ext.filter((r) => r.verification === "source_verified");
  if (searchParams.search) ext = ext.filter((r) => `${r.title ?? ""} ${r.body}`.toLowerCase().includes(searchParams.search!.toLowerCase()));
  if (searchParams.experience || searchParams.program || searchParams.recommend) ext = []; // those facets don't apply to external reviews

  let merged = mergeReviews((fp?.reviews ?? []).map(unifyFirstParty), ext.map(unifyExternal));
  if (sort === "highest") merged = merged.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
  if (sort === "lowest") merged = merged.sort((a, b) => (a.rating ?? 6) - (b.rating ?? 6));

  const total = merged.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const items = merged.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const chips: { key: string; label: string }[] = [];
  if (searchParams.experience) chips.push({ key: "experience", label: EXPERIENCE_META[searchParams.experience as ExpKey]?.plural ?? searchParams.experience });
  if (searchParams.program) chips.push({ key: "program", label: getProgram(searchParams.program)?.title ?? searchParams.program });
  if (origin) chips.push({ key: "origin", label: origin === "first" ? "On builders.review" : "External" });
  if (source) chips.push({ key: "source", label: getSourceDef(source)?.name ?? source });
  if (searchParams.rating) chips.push({ key: "rating", label: `${searchParams.rating}★ & up` });
  if (searchParams.category) chips.push({ key: "category", label: categories.find((c) => c.key === searchParams.category)?.label ?? searchParams.category });
  if (searchParams.verified) chips.push({ key: "verified", label: "Verified only" });
  if (searchParams.recommend) chips.push({ key: "recommend", label: "Would recommend" });
  if (searchParams.search) chips.push({ key: "search", label: `“${searchParams.search}”` });

  const makeHref = (p: number) => {
    const sp = new URLSearchParams(Object.fromEntries(Object.entries(searchParams).filter(([, v]) => typeof v === "string")) as Record<string, string>);
    sp.set("page", String(p));
    return `/reviews?${sp.toString()}#results`;
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "All reviews", path: "/reviews" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All reviews" }]} />

      <header className="mb-8 max-w-3xl">
        <h1 className="font-display text-h2 font-extrabold tracking-tight lg:text-h2-lg">All Portfolio Builders reviews</h1>
        <p className="mt-4 text-body-lg text-muted">
          Reviews submitted on builders.review by students, interns, alumni, parents and career switchers, plus reviews collected legally from platforms with a verified Portfolio Builders profile.
        </p>
      </header>

      <div className="mb-10">
        <AnswerBlock
          question="Where can I read Portfolio Builders reviews?"
          answer="Right here. This page merges reviews written on builders.review with reviews from verified external platforms. Filter by course, internship, program, rating or verification, and follow any external review back to its original source. Employee reviews are kept in a separate section and never mixed into student ratings."
          updated={new Date().toISOString().slice(0, 10)} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar categories={categories} activeCount={chips.length}
          programs={programs.map((p) => ({ slug: p.slug, title: p.title }))}
          connectedSources={connected.map((c) => c.def.slug)} />

        <div id="results" className="min-w-0 scroll-mt-24">
          <SortToolbar total={total} chips={chips} />
          {items.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((r) => <ReviewCard key={r.key} review={r} />)}
              </div>
              <Pagination page={page} totalPages={totalPages} makeHref={makeHref} />
            </>
          ) : <NoSearchResults resetHref="/reviews" />}
        </div>
      </div>
    </>
  );
}
