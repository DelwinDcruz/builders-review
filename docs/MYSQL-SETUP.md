# MySQL setup (Windows + MySQL Workbench)

This project uses **MySQL 8+**, **Prisma ORM** and **Auth.js (NextAuth v5)**.
You only create an *empty database*; Prisma creates every table for you.

## 1. Install
- Install **MySQL 8** (MySQL Installer for Windows) and **MySQL Workbench**.
- Install **Node.js 18.18+** (Node 20 LTS recommended).

## 2. Create the empty database
In MySQL Workbench, open a query tab and run **only** this:

```sql
CREATE DATABASE builders_review
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Do **not** create tables by hand — Prisma does that in step 5.

## 3. Configure environment
Copy `.env.example` to `.env.local` and fill in at least:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/builders_review"
AUTH_SECRET="run: npx auth secret"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_USE_SAMPLE_DATA="false"
# SMTP for magic-link sign-in:
EMAIL_SERVER_HOST="smtp.yourprovider.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="..."
EMAIL_SERVER_PASSWORD="..."
EMAIL_FROM="builders.review <no-reply@builders.review>"
```

- URL-encode special characters in the password (`@`→`%40`, `#`→`%23`, `:`→`%3A`).
- `AUTH_SECRET`: generate with `npx auth secret` (or `openssl rand -base64 32`).

## 4. Install dependencies
```bash
npm install
```
(`postinstall` runs `prisma generate` automatically.)

## 5. Create the tables, generate the client, seed reference data
```bash
npx prisma format          # tidy + validate the schema
npx prisma validate        # confirm the schema is valid
npx prisma generate        # generate the typed client
npx prisma migrate dev     # creates ALL tables from prisma/schema.prisma
npm run db:seed            # programs, categories, review-source catalogue
```
Dev-only demo reviews (never in production):
```bash
SEED_SAMPLE_REVIEWS=true npm run db:seed
```

## 6. Verify + run
```bash
npm run typecheck
npm run lint
npm run test:rating
npm run build
npm run dev            # http://localhost:3000
```

## 7. Inspect the tables in Workbench
Refresh the `builders_review` schema in the left panel. You should see all 26
tables (users, accounts, sessions, verification_tokens, programs, reviews, …).
`npx prisma studio` opens a browser data browser too.

## 8. Create the first administrator (no password)
```bash
npm run create-admin -- you@example.com admin
```
Then sign in at `/auth/sign-in` with that email — the magic link activates the
account. Add moderators the same way with the `moderator` role.

## 9. Production migrations
Never run `migrate dev` in production. Deploy committed migrations with:
```bash
npx prisma migrate deploy
```

## 10. Hosting MySQL (Vercel / other)
- Use a managed MySQL (PlanetScale/Vitess-compatible, Railway, RDS, Aiven…).
  If PlanetScale, set `relationMode = "prisma"` in the datasource (it disallows
  FKs) — otherwise keep native FKs.
- Set `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, the `EMAIL_SERVER_*` vars and
  `NEXT_PUBLIC_USE_SAMPLE_DATA=false` in the host's environment settings.
- Run `prisma migrate deploy` as a release/build step.

## 11. Do NOT expose MySQL publicly
- Bind MySQL to `localhost`/private network; never `0.0.0.0` on a public IP.
- Require TLS for remote connections (`?sslaccept=strict` / provider setting).
- Use a least-privilege app user (SELECT/INSERT/UPDATE/DELETE on this DB only),
  not `root`, in production.

## 12. Backups
```bash
# Backup
mysqldump -u root -p --single-transaction --routines builders_review > backup.sql
# Restore
mysql -u root -p builders_review < backup.sql
```
Schedule regular dumps (or use your managed provider's automated backups).
