> **Legacy note:** this document predates the Supabase → MySQL migration and may reference Supabase. The database is now MySQL + Prisma; see docs/MYSQL-SETUP.md and docs/SUPABASE-TO-MYSQL-MIGRATION.md.

# Credentials, approvals and external accounts you still need

Nothing below is invented. Where a platform's terms could not be confirmed, the
source ships **disabled** or **link-only** and displays nothing.

## Required for production

| Credential | Where to get it | What breaks without it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings | No database. App falls back to sample data. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase settings (**server-only**) | Trusted server tasks. Never expose. |
| `NEXT_PUBLIC_SITE_URL` | Your domain (`https://builders.review`) | Canonicals, sitemap and JSON-LD use the wrong origin. |
| `NEXT_PUBLIC_USE_SAMPLE_DATA=false` | — | **Sample data would appear in production.** |
| An `admin_users` row | `insert into admin_users (user_id, role) values ('<uid>','admin');` | No one can moderate. |

## Google Reviews (the only implemented API connector)

| Item | How |
|---|---|
| `GOOGLE_MAPS_API_KEY` | Google Cloud → enable **Places API** → create key → restrict to Places API + your server IPs. |
| **Real Google Place ID** | Google's Place ID Finder. Store on the Google profile in `/admin/sources`. |
| Attribution | "Powered by Google" + link to the Google profile (already implemented). |
| Verify before enabling sync | Google's current caching/storage terms for Places review data. |

Without **both** key and Place ID: source stays `disabled`, `/google-reviews` is
`noindex`, and no Google rating or count is shown anywhere.

**Later:** Google Business Profile API (owner-only) gives access to reviews for a
location you own, and the ability to reply. It requires ownership verification.

## Not implemented — obtain permitted access first

| Platform | What you need | Current state |
|---|---|---|
| Trustpilot | Business account + Business API / TrustBox | `disabled` |
| Facebook | Meta Graph Page access token | `disabled` (recommendations are **not** stars) |
| Justdial, MouthShut | Confirm any official API/widget exists | `external_link_only` |
| Sitejabber, ConsumerAffairs | Business / accredited-brand program | `external_link_only` |
| BBB | Accreditation; letter grades are **not** stars | `disabled` (likely irrelevant for an India-based company) |
| Glassdoor | Restricted partner API | `external_link_only`, **employer group** |
| AmbitionBox, Indeed | Confirm official access | `external_link_only`, **employer group** |

## Optional

| Credential | Purpose |
|---|---|
| `SYNC_CRON_SECRET` | Protects `GET /api/cron/sync`. Required to run scheduled syncs. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Search Console / Bing. |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Enables cookieless analytics beacons. |
| `REVIEW_RATE_LIMIT_PER_HOUR` | Submission rate limit (default 3). |

## Brand assets still needed

- **Official brand hex values and font families** — see `docs/BRAND-TOKENS.md`.
- **Permitted platform logo SVGs** (`public/platforms/<slug>.svg`). Until supplied,
  each platform renders as an accessible monogram with its name.
