"use client";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cx } from "@/lib/format";
type Tone = "success" | "error" | "info";
interface T { id: number; message: string; tone: Tone }
const Ctx = createContext<{ notify: (m: string, t?: Tone) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<T[]>([]);
  const notify = useCallback((message: string, tone: Tone = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);
  const value = useMemo(() => ({ notify }), [notify]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} role={t.tone === "error" ? "alert" : "status"}
            className={cx("pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-xl border bg-surface p-3.5 text-meta-lg shadow-lg animate-fade-up",
              t.tone === "success" && "border-success/30", t.tone === "error" && "border-error/30", t.tone === "info" && "border-border")}>
            <span className="mt-0.5 shrink-0" aria-hidden="true">
              {t.tone === "success" && <CheckCircle2 size={16} className="text-success" />}
              {t.tone === "error" && <AlertTriangle size={16} className="text-error" />}
              {t.tone === "info" && <Info size={16} className="text-muted" />}
            </span>
            <p className="flex-1">{t.message}</p>
            <button onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} aria-label="Dismiss" className="shrink-0 text-muted hover:text-fg"><X size={15} /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
export function useToast() { return useContext(Ctx) ?? { notify: () => {} }; }
