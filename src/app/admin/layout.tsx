import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert, LayoutDashboard, ClipboardCheck, GraduationCap, Plug, ScrollText } from "lucide-react";
import { getCurrentUser, canModerate } from "@/lib/auth/roles";
import { doSignOut } from "@/app/auth/sign-out-action";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/moderation", label: "Moderation", icon: ClipboardCheck },
  { href: "/admin/programs", label: "Programs & categories", icon: GraduationCap },
  { href: "/admin/sources", label: "Review sources", icon: Plug },
  { href: "/admin/logs", label: "Audit & sync logs", icon: ScrollText }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user.previewMode && !canModerate(user.role)) redirect("/auth/sign-in?next=/admin");

  return (
    <div className="mx-auto max-w-content">
      {user.previewMode && (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-error/30 bg-error/10 p-4 text-meta-lg text-error">
          <ShieldAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span><strong>Preview mode — authentication is NOT enforced.</strong> <code>AUTH_PREVIEW_ADMIN</code> is on, so this admin area is open. Remove it and sign in as a real <code>admin_users</code> record before deploying.</span>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Admin" className="lg:sticky lg:top-20 lg:h-fit">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-meta-lg font-semibold hover:bg-surface-2">
                  <Icon size={16} aria-hidden="true" /> {label}
                </Link>
              </li>
            ))}
          </ul>
          {!user.previewMode && user.id && (
            <form action={doSignOut} className="mt-2">
              <button className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-meta-lg font-semibold text-muted hover:bg-surface-2">Sign out</button>
            </form>
          )}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
