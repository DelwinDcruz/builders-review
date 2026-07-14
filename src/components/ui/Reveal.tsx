"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cx } from "@/lib/format";
/** Progressive enhancement: content is visible without JS (see globals.css). */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }:
  { children: ReactNode; className?: string; delay?: number; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (typeof IntersectionObserver === "undefined") { el.classList.add("is-in"); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: .05 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <Tag ref={ref as never} className={cx("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>;
}
