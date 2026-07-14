import "server-only";
import { auth, AUTH_ENABLED } from "@/auth";
import { prisma } from "@/lib/db";

export type Role = "public" | "reviewer" | "moderator" | "admin";
export interface CurrentUser {
  id: string | null;
  email: string | null;
  role: Role;
  previewMode: boolean;
}

/**
 * Real session + `admin_users` lookup via MySQL.
 *
 * A local, NON-PRODUCTION preview admin is available ONLY when
 * AUTH_PREVIEW_ADMIN="true" is set explicitly (never in production). It is
 * flagged `previewMode` so the dashboard shows a loud "auth NOT enforced"
 * banner. Production never grants access without a real signed-in admin.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  const previewAdmin =
    process.env.AUTH_PREVIEW_ADMIN === "true" && process.env.NODE_ENV !== "production";

  const session = await auth().catch(() => null);
  const userId = session?.user?.id ?? null;

  if (!userId) {
    if (previewAdmin) return { id: null, email: null, role: "admin", previewMode: true };
    return { id: null, email: null, role: "public", previewMode: false };
  }

  const admin = await prisma.adminUser.findUnique({ where: { userId }, select: { role: true } });
  return {
    id: userId,
    email: session?.user?.email ?? null,
    role: (admin?.role as Role) ?? "reviewer",
    previewMode: false,
  };
}

export const canModerate = (r: Role) => r === "moderator" || r === "admin";
export const isAdmin = (r: Role) => r === "admin";
export { AUTH_ENABLED };
