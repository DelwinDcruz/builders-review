import type { Metadata } from "next";
import { SITE, COMPANY } from "../site-config";

interface PageMeta { title: string; description: string; path: string; index?: boolean; ogImage?: string; }

/** Consistent, unique metadata for an indexable page. */
export function pageMetadata({ title, description, path, index = true, ogImage }: PageMeta): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title, description,
    alternates: { canonical: path },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "article", url, siteName: SITE.name, title, description, locale: SITE.locale,
      images: [{ url: ogImage ?? COMPANY.ogImage }]
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage ?? COMPANY.ogImage] }
  };
}
export const noindex: Metadata = { robots: { index: false, follow: false } };
