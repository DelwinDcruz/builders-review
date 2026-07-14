import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROGRAMS, getProgram } from "@/lib/programs";
import { ProgramPage } from "@/components/content/ProgramPage";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;
export function generateStaticParams() { return PROGRAMS.filter((p) => p.type === "internship").map((p) => ({ slug: p.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProgram(params.slug);
  if (!p || p.type !== "internship") return {};
  return pageMetadata({
    title: `${p.title} review — Portfolio Builders`,
    description: p.seoIntro,
    path: `/internships/${p.slug}`
  });
}

export default function Page({ params }: { params: { slug: string } }) {
  const program = getProgram(params.slug);
  if (!program || program.type !== "internship") notFound();
  return <ProgramPage program={program} hub={{ label: "Internship reviews", href: "/internships" }} />;
}
