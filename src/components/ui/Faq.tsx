import { Plus } from "lucide-react";
import type { FaqItem } from "@/lib/content/faqs";
/** Native <details>: answers live in the HTML (crawlable, AEO-safe, keyboard-accessible). */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      {items.map((item, i) => (
        <details key={i} className="group px-6 py-5 open:bg-surface-2/50">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-body-lg font-semibold [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-transform duration-fast group-open:rotate-45 group-open:border-brand/30 group-open:text-brand"><Plus size={16} /></span>
          </summary>
          <p className="mt-3 max-w-3xl text-body text-fg-secondary">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
