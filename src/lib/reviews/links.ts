import type { Program } from "@/lib/programs";
/** Individual pages: courses and internships get their own SEO-friendly paths. */
export function programHref(p: Pick<Program, "slug" | "type">): string {
  if (p.type === "course") return `/courses/${p.slug}`;
  if (p.type === "internship") return `/internships/${p.slug}`;
  return `/programs/${p.slug}`;
}
