import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Nodemailer from "next-auth/providers/nodemailer";
import { prisma } from "@/lib/db";

/**
 * Auth.js (NextAuth v5) — replaces Supabase magic-link auth.
 * Secure email magic-link sign-in, database sessions (Prisma adapter),
 * verification-token expiry handled by Auth.js. No passwords, no hard-coded
 * admin. The first admin is created with `npm run create-admin` (see docs).
 */
export const AUTH_ENABLED = Boolean(
  process.env.AUTH_SECRET &&
    process.env.EMAIL_SERVER_HOST &&
    process.env.EMAIL_FROM,
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/auth/sign-in", verifyRequest: "/auth/sign-in?sent=1", error: "/auth/sign-in" },
  trustHost: true,
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 30 * 60, // magic link valid for 30 minutes
    }),
  ],
  callbacks: {
    // Expose the user id on the session (database strategy omits it by default).
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
});
