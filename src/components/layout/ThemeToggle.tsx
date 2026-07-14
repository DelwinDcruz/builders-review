"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); setDark(document.documentElement.classList.contains("dark")); }, []);
  return (
    <button type="button"
      onClick={() => { const n = !dark; setDark(n); document.documentElement.classList.toggle("dark", n); try { localStorage.setItem("theme", n ? "dark" : "light"); } catch {} }}
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-fg-secondary transition-colors hover:bg-surface-2 hover:text-fg"
      aria-label={mounted ? (dark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}>
      {mounted && dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
