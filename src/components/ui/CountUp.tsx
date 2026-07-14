"use client";
import { useEffect, useRef, useState } from "react";
/** Final value is server-rendered (crawler-safe, no CLS). Skipped on reduced motion. */
export function CountUp({ value, formatted }: { value: number; formatted: string }) {
  const [d, setD] = useState<string | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current; if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((es) => {
      if (!es[0]?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 900);
        setD(String(Math.round(value * (1 - Math.pow(1 - p, 3)))));
        if (p < 1) requestAnimationFrame(tick); else setD(null);
      };
      requestAnimationFrame(tick);
    }, { threshold: .4 });
    io.observe(el); return () => io.disconnect();
  }, [value]);
  return <span ref={ref} className="tabular-nums">{d ?? formatted}</span>;
}
