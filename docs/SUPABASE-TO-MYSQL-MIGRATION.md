# Supabase (PostgreSQL) → MySQL migration

## What changed
| Area | Before (Supabase) | After (this project) |
|---|---|---|
| Database | Supabase PostgreSQL | MySQL 8+ |
| Access | `@supabase/ssr` clients + RLS | Prisma ORM + server-side authorization |
| Auth | Supabase magic-link | Auth.js (NextAuth v5) magic-link + Prisma adapter |
| Sessions | Supabase cookies | Auth.js database sessions (`sessions` table) |
| Reads | `// SWAP:` placeholders over sample data | real Prisma queries (`src/lib/data/*`) |
| Secrets | `SUPABASE_*` env | `DATABASE_URL`, `AUTH_*`, `EMAIL_SERVER_*` |

### Type conversions
`uuid`→`CHAR(36)` (Prisma `@default(uuid())`) · `jsonb`→`JSON` · `timestamptz`→
`DATETIME(3)` UTC · `numeric`→`DECIMAL` · `bytea`→`BYTES` (secrets excluded) ·
pg enums→Prisma enums · pg `increment_helpful()` function→Prisma transaction ·
`ON CONFLICT`→Prisma `upsert` · RLS policies→repository filters + `getCurrentUser()`
role checks in server actions/layouts.

### Duplicate-review fix
The old nullable composite unique `(reviewer_email_hash, experience_type,
program_slug)` allowed duplicates when `program_slug` was NULL (MySQL treats
NULLs as distinct). Replaced with a **non-null `programScope`** column
(= `programSlug` or `""`) and unique `(reviewerEmailHash, experienceType,
programScope)`, backed by an explicit pre-check in `submitReview`.

## Files removed / neutralised
`src/lib/supabase/{client,server,env}.ts` (emptied; excluded from the delivered
project), all `@supabase/*` dependencies, all `SUPABASE_*` env vars, the
`connect-src https://*.supabase.co` CSP entry.

## Automated data migration script
`scripts/migrate-supabase-to-mysql.ts` copies existing rows from a live Supabase
database into MySQL.

**Prereqs (dev-only, intentionally not an app dependency):**
```bash
npm i -D pg
```
**Env:** `SUPABASE_DB_URL` (source Postgres URL) and `DATABASE_URL` (MySQL).

**Run:**
```bash
DRY_RUN=true npm run migrate:supabase   # read + count only; writes nothing
npm run migrate:supabase                # perform idempotent upserts
```

**Guarantees:** never deletes/mutates the source · preserves primary keys and
relationships · imports parents-before-children · converts JSON + dates ·
idempotent upserts (safe to re-run) · never logs secrets · prints a
source-vs-destination reconciliation report.

**Not migrated (by design):** Supabase Auth users, `accounts`, `sessions`, and
`admin_users` — identities differ under Auth.js. `review_reports.review_slug`
is resolved to a real `reviewId`. `source_credentials.encrypted_secret` (bytea)
is **not** copied; keep secrets in env / a secret manager. After migrating,
recreate staff with `npm run create-admin -- <email> admin`; they then sign in
by magic link with the same email.

## Honesty note
This repository was prepared without access to a live Supabase database or a
running MySQL server. **No production data has actually been migrated or
verified here.** The script above is provided for you to run against your real
databases; only its execution against your data proves a successful migration.
