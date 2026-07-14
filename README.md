# builders.review

The dedicated review platform for **Portfolio Builders** — verified first-party
reviews plus ratings collected legally from external platforms. Built with
**Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Zod**,
**MySQL 8 + Prisma ORM**, and **Auth.js (NextAuth v5)** magic-link auth.

> builders.review is operated in connection with Portfolio Builders (the company
> being reviewed). It is not an independent third-party review organisation.
> Learner and employee reviews are always scored and shown **separately**; only
> **approved** reviews appear publicly or affect ratings.

## Quick start

```bash
cp .env.example .env.local     # fill in DATABASE_URL, AUTH_SECRET, EMAIL_SERVER_*
npm install
npx prisma migrate dev         # create all tables
npm run db:seed                # programs, categories, review sources
npm run create-admin -- you@example.com admin
npm run dev                    # http://localhost:3000
```

Dev demo data (never in production):
```bash
SEED_SAMPLE_REVIEWS=true npm run db:seed
# and set NEXT_PUBLIC_USE_SAMPLE_DATA=true to render sample reviews without a DB
```

Full instructions: **docs/MYSQL-SETUP.md**.

## Architecture

| Concern | Implementation |
|---|---|
| Database | MySQL 8+, `prisma/schema.prisma` (26 tables) |
| Data access | Prisma, server-only repositories in `src/lib/data/*` |
| Auth | Auth.js v5, Prisma adapter, magic-link (Nodemailer), DB sessions |
| Authorization | `src/lib/auth/roles.ts` + `admin_users` role checks in server actions/layouts |
| Atomic ops | Prisma transactions (submit, helpful vote, report) |
| Validation | Zod (`src/lib/validation/review.ts`) |
| SEO/AEO/GEO | `src/lib/seo/*`, `src/app/{sitemap,robots}.ts`, `public/llms.txt`, injection-safe JSON-LD |

## Data source switch

- `NEXT_PUBLIC_USE_SAMPLE_DATA=false` (production) → all reads/writes hit MySQL;
  the app never silently falls back to sample data if MySQL is unavailable.
- `NEXT_PUBLIC_USE_SAMPLE_DATA=true` (preview) → clearly-marked sample reviews;
  writes are logged, not persisted.

## Scripts

`dev` · `build` (`prisma generate && next build`) · `start` · `lint` ·
`typecheck` · `test:rating` · `db:migrate` · `db:deploy` · `db:seed` ·
`db:studio` · `create-admin` · `migrate:supabase`.

## Documentation

- **docs/MYSQL-SETUP.md** — Windows + Workbench setup, commands, hosting, backups.
- **docs/MYSQL-TABLES.md** — every table, column, key, index and delete behaviour.
- **docs/mysql-schema.reference.sql** — reference DDL (canonical = Prisma migrations).
- **docs/SUPABASE-TO-MYSQL-MIGRATION.md** — conversion map + data-migration script.
- **docs/AUDIT.md**, **docs/CREDENTIALS.md** — legacy notes (pre-MySQL; see banner).

## Security highlights

Zod validation, honeypots, per-route rate limiting, SHA-256 email hashing,
server-side authorization, audit logging, SSRF/domain checks on source URLs,
strict security headers/CSP, cron-secret-protected sync, injection-safe JSON-LD,
DB-enforced duplicate prevention and one-vote/one-report fingerprints.

> Rate limiting is currently in-memory (per instance). For multi-instance
> serverless, back it with Redis/Upstash — see docs/SUPABASE-TO-MYSQL-MIGRATION.md
> and the note in `src/lib/security/rate-limit.ts`.
