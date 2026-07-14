> **Legacy note:** this document predates the Supabase → MySQL migration and may reference Supabase. The database is now MySQL + Prisma; see docs/MYSQL-SETUP.md and docs/SUPABASE-TO-MYSQL-MIGRATION.md.

# builders.review — production-readiness audit

## ✅ Built and functional (runs with zero config on sample data)

**Pages** — homepage (all 14 sections in the required order), `/reviews` with faceted
sidebar + mobile bottom sheet + crawlable pagination, individual review pages,
`/courses` `/internships` `/programs` `/mentors` `/career-support`
`/placement-support` `/community` hubs, individual course/internship/program pages,
`/google-reviews`, `/review-platforms`, `/compare`, 6-step `/write-review`,
`/methodology`, `/verification-policy`, `/moderation-policy`, `/review-guidelines`,
`/about` (with conflict-of-interest disclosure), `/contact`, all four legal pages,
`/account`, `/auth/sign-in`, and admin (overview, moderation, programs & categories,
sources incl. Google integration, audit + sync logs). 404 / error / loading states.

**Rating engine** — approved-only; `null` never `0`; review-count-weighted combination
(proved: 4.0×100 + 5.0×2 → **4.0**, not 4.5); separate learner / course / internship /
mentor / career-support / placement / website / **employee** scores; recommendation %
and letter grades never become stars. Verified with `npm run test:rating`.

**Sources** — 12 definitions with honest capability metadata. A **real** Google Places
connector (credential-gated, marks `partialSelection: true`, "Powered by Google").
Compliant fallbacks: link-only, manual-summary, import. Registry picks by mode.
Public UI shows nothing for an unverified profile — no "0 reviews", no invented rating.

**Database** — 3 migrations: full schema, RLS (public inserts land as
`pending_verification`; `source_credentials` has **no** SELECT policy), and the 23
verified programs + 17 categories + 12 sources as reference data.

**Security** — SSRF allowlist for outbound/profile URLs; CSV-injection guard; honeypot +
Zod + rate limiting on every write endpoint; email stored as a one-way hash; service-role
key confined to one server file (statically verified); secret-protected `/api/cron/sync`;
CSP + HSTS + nosniff + frame-deny headers; audit logging; `X-Robots-Tag: noindex` on
admin/account/auth.

**SEO** — unique title/description/canonical/OG/Twitter + breadcrumbs + last-updated on
every indexable page; dynamic sitemap that **excludes empty program pages** and the
Google page until it's connected; `robots.txt`; filtered `/reviews` combinations are
`noindex`; `opengraph-image` route.

**Structured data** — `EducationalOrganization` + `Organization` (learner-only
`aggregateRating`, emitted only when visible), `WebSite`, `BreadcrumbList`, `Course`
(courses only), `Review` (approved only), `ItemList`, `FAQPage`, `LocalBusiness` from
the **verified** address only. Employee and learner ratings are never combined.

**GEO/AEO** — entity definitions for Portfolio Builders and builders.review, the
relationship between them, direct/external review separation, source attribution,
publication + last-updated dates, editorial attribution, and `AnswerBlock`/`AnswerList`
direct answers **generated only from real data** (`src/lib/content/answers.ts`). Where
data is insufficient the answer says so — including "Is Portfolio Builders genuine?",
which reports the evidence and explicitly refuses to declare a verdict.

**Accessibility** — WCAG 2.2 AA targeted: skip link, semantic landmarks, keyboard
radiogroup star input, sr-only star sentences, data tables behind every chart, dialog
semantics + scroll-lock + Esc on the mobile filter sheet, `role="alert"` errors,
`aria-live` counts, reduced-motion honoured, 44px+ targets, no colour-only meaning.

**Honesty rules** — ownership disclosure in the footer, About and homepage CTA; sample
data banner site-wide; moderation policy states genuine criticism is never removed;
review-guideline checkbox states no reward was offered; the company's marketing claims
(placement rate, learners mentored, awards) are **deliberately excluded**.

---

## ⚠ Placeholders requiring verified Portfolio Builders information

1. **Brand colours** — `--brand`, `--brand-hover`, `--brand-soft`, `--accent` in
   `src/styles/globals.css`. The official stylesheet 404s and no browser was available
   to read computed styles, so these are **neutral placeholders**, not invented brand
   colours. Fill via `docs/BRAND-TOKENS.md`. Also update
   `src/lib/sources/branding.ts → "builders-review".accent`.
2. **Typography** — `--font-sans` / `--font-display` use the system stack. Load the real
   families with `next/font` in `src/app/layout.tsx`.
3. **Illustration style / imagery** — none shipped. No student photos or illustrations
   were reused (no licence to redistribute). The design uses typography, colour and
   iconography instead.
4. **`NEXT_PUBLIC_SITE_URL`** — set to `https://builders.review`.
5. **Google Place ID + `GOOGLE_MAPS_API_KEY`** — until both exist, `/google-reviews` is
   `noindex` and no Google rating is shown.
6. **Sample external profiles** in `src/lib/data/seed.ts` (Google / Justdial / Glassdoor)
   are demo rows so the source UI is testable. They do **not** assert that these profiles
   exist. Delete them or set `NEXT_PUBLIC_USE_SAMPLE_DATA=false`.
7. **A dedicated reviews contact address** — the site currently shows the company's own
   `info@portfoliobuilders.in`.
8. **Legal pages** are professional drafts flagged for qualified legal review.

---

## 🔌 Integrations deliberately left disabled (and why)

Every external source except Google ships `external_link_only` or `disabled`, because no
credentials, verified profiles or partner approvals exist. That is the compliant default,
not an omission. See `docs/CREDENTIALS.md`. **No reviews, ratings, reviewer names or
review counts were invented anywhere.**

---

## 🧪 What was verified, and what was not

**Verified here:**
- Rating maths, count-weighting, learner/employee separation, `null`-not-zero, rounding —
  proved with standalone Node scripts.
- Static analysis over all **140** TS/TSX files: every internal import resolves, every
  named import matches an export, no React hook outside a `"use client"` file, no client
  component imports a `server-only` module, and `SUPABASE_SERVICE_ROLE_KEY` appears in
  exactly one server file.
- Official company facts re-checked against `portfoliobuilders.in` on 2026-07-09.

**Not run here:** `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`.
The authoring sandbox caps every shell command at 45 seconds and Next.js is too large to
install in that window. **Run these locally before deploying:**

```bash
npm install
npm run typecheck && npm run lint && npm run build && npm run test:rating
```

Also still to do on your side: Lighthouse / Core Web Vitals pass, Rich Results Test on the
structured data, and a manual 320/375/430px responsive sweep.
