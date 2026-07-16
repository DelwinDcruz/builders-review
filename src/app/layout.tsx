import type { Metadata } from "next";
import "@/styles/globals.css";
import { SITE, COMPANY } from "@/lib/site-config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SampleDataBanner } from "@/components/ui/SampleBadge";
import { ToastProvider } from "@/components/ui/Toast";
import { themeInitScript } from "@/components/layout/theme";
import { publisherJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { safeJsonLd } from "@/lib/seo/serialize";
import Script from "next/script";


/*
 * FONTS — PLACEHOLDER.
 * The official Portfolio Builders typography could not be confirmed (no access
 * to the live stylesheet). We use the system UI stack, which is fast and
 * neutral. Once the official families are known, load them here with
 * `next/font` and set --font-sans / --font-display in globals.css.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Portfolio Builders Reviews — real student & intern reviews | builders.review",
    template: `%s · ${SITE.name}`
  },
  description: SITE.description,
  applicationName: SITE.longName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", siteName: SITE.name, locale: SITE.locale, url: SITE.url,
    title: "Portfolio Builders Reviews — real student & intern reviews",
    description: SITE.description, images: [{ url: COMPANY.ogImage }]
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description, images: [COMPANY.ogImage] },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined
  }
};

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en-IN" suppressHydrationWarning>
//       <head>
        
//         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(publisherJsonLd()) }} />
//         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd()) }} />
//       </head>
//       <body className="min-h-dvh">
//         <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
//         <a href="#main" className="skip-link">Skip to main content</a>
//         <ToastProvider>
//           <SampleDataBanner />
//           <Header />
//           <main id="main" className="container-app py-10 md:py-14">{children}</main>
//           <Footer />
//         </ToastProvider>
//       </body>
//     </html>
//   );
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(publisherJsonLd()),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(websiteJsonLd()),
          }}
        />
      </head>

      <body className="min-h-dvh">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />

        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <ToastProvider>
          <SampleDataBanner />
          <Header />

          <main id="main" className="container-app py-10 md:py-14">
            {children}
          </main>

          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}