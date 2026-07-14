import type { CSSProperties } from "react";
import { BookOpen, Briefcase, Route, Users, LayoutGrid, Compass, MessagesSquare, Monitor, Star } from "lucide-react";
import { EXPERIENCE_META, type ExpKey } from "@/lib/sources/branding";

const ICONS = { book: BookOpen, briefcase: Briefcase, route: Route, users: Users, layout: LayoutGrid, compass: Compass, messages: MessagesSquare, monitor: Monitor, star: Star };

/** Icon + text label + accent. Meaning never depends on colour alone. */
export function ExperienceBadge({ type, size = "md" }: { type: ExpKey; size?: "sm" | "md" }) {
  const meta = EXPERIENCE_META[type] ?? EXPERIENCE_META.other;
  const Icon = ICONS[meta.icon];
  const style = { ["--ea" as string]: meta.accent } as CSSProperties;
  return (
    <span style={style} title={meta.blurb}
      className={`inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--ea)/0.28)] bg-[rgb(var(--ea)/0.09)] font-semibold text-[rgb(var(--ea))] ${size === "sm" ? "px-2 py-0.5 text-meta" : "px-2.5 py-1 text-meta-lg"}`}>
      <Icon size={size === "sm" ? 12 : 14} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
