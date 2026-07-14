/**
 * Create (or promote) the first administrator — safely, with no hard-coded password.
 *
 *   npm run create-admin -- admin@example.com            # role: admin
 *   npm run create-admin -- mod@example.com moderator    # role: moderator
 *
 * This pre-creates the user + admin_users record. When that person signs in
 * with a magic link using the SAME email, Auth.js links to this user and they
 * gain admin access immediately. No password is ever stored.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const email = (process.argv[2] ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const role = (process.argv[3] ?? "admin").trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    console.error("Usage: npm run create-admin -- <email> [admin|moderator]");
    process.exit(1);
  }
  if (role !== "admin" && role !== "moderator") {
    console.error('Role must be "admin" or "moderator".');
    process.exit(1);
  }

  const user = await prisma.user.upsert({
    where: { email }, update: {}, create: { email },
  });
  await prisma.adminUser.upsert({
    where: { userId: user.id },
    update: { role: role as any },
    create: { userId: user.id, role: role as any },
  });

  console.log(`OK: ${email} is now "${role}". Sign in at /auth/sign-in with this email to activate.`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
