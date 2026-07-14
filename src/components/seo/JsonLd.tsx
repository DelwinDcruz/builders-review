import { safeJsonLd } from "@/lib/seo/serialize";

/** Renders one or more JSON-LD nodes with injection-safe serialization. */
export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const nodes = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (nodes.length === 0) return null;
  return (
    <>
      {nodes.map((n, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(n) }} />
      ))}
    </>
  );
}
