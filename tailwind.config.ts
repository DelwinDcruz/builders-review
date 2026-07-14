import type { Config } from "tailwindcss";

/** All values map to CSS variables in globals.css. Never hardcode colours. */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    screens: { xs: "375px", sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
    extend: {
      colors: {
        brand: "rgb(var(--brand) / <alpha-value>)",
        "brand-hover": "rgb(var(--brand-hover) / <alpha-value>)",
        "brand-fg": "rgb(var(--brand-fg) / <alpha-value>)",
        "brand-soft": "rgb(var(--brand-soft) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-fg": "rgb(var(--accent-fg) / <alpha-value>)",

        bg: "rgb(var(--bg) / <alpha-value>)",
        "bg-alt": "rgb(var(--bg-alt) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        "border-strong": "rgb(var(--border-strong) / <alpha-value>)",

        fg: "rgb(var(--fg) / <alpha-value>)",
        "fg-secondary": "rgb(var(--fg-secondary) / <alpha-value>)",
        "fg-inverse": "rgb(var(--fg-inverse) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",

        star: "rgb(var(--star) / <alpha-value>)",
        "star-soft": "rgb(var(--star-soft) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"]
      },
      fontSize: {
        meta: ["0.8125rem", { lineHeight: "1.5" }],
        "meta-lg": ["0.875rem", { lineHeight: "1.5" }],
        body: ["1rem", { lineHeight: "1.65" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        card: ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        "card-lg": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.015em" }],
        h3: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        h2: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "h2-lg": ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        hero: ["3rem", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        "hero-lg": ["4.25rem", { lineHeight: "1.03", letterSpacing: "-0.04em" }]
      },
      borderRadius: { sm: "var(--r-sm)", md: "var(--r-md)", lg: "var(--r-lg)", xl: "var(--r-xl)", "2xl": "var(--r-2xl)", "3xl": "var(--r-3xl)" },
      boxShadow: { xs: "var(--sh-xs)", sm: "var(--sh-sm)", md: "var(--sh-md)", lg: "var(--sh-lg)", xl: "var(--sh-xl)", glow: "var(--sh-glow)" },
      maxWidth: { content: "80rem", prose: "44rem" },
      transitionTimingFunction: { premium: "cubic-bezier(.22,1,.36,1)" },
      transitionDuration: { fast: "140ms", DEFAULT: "220ms", slow: "380ms" },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "none" } },
        "scale-in": { from: { opacity: "0", transform: "scale(.96)" }, to: { opacity: "1", transform: "none" } }
      },
      animation: { "fade-up": "fade-up .38s cubic-bezier(.22,1,.36,1) both", "scale-in": "scale-in .18s cubic-bezier(.22,1,.36,1) both" }
    }
  },
  plugins: []
};
export default config;
