# Brand tokens — ⚠ PLACEHOLDERS AWAITING VERIFICATION

## Why these are placeholders

The brief requires reusing Portfolio Builders' **real** brand colours and typography.
I could not read them:

- `https://portfoliobuilders.in/assets/css/style.css` returns the homepage HTML (the path 404s and the server serves the SPA shell), so the stylesheet could not be fetched.
- No browser was connected, so the live page's **computed styles** could not be read either.

Rather than invent brand colours — which the brief explicitly forbids — the tokens in
`src/styles/globals.css` are neutral, clearly-marked placeholders. Nothing else in the
codebase hardcodes a colour.

## What IS verified and already in use

| Asset | Value | Source |
|---|---|---|
| Logo | `https://portfoliobuilders.in/assets/images/logo.png` | official site |
| OG image | `https://portfoliobuilders.in/assets/images/fyugp-og-image.png` | official site |
| Locale | `en_IN` | official `og:locale` |
| Programs | 23 offerings, each with its real `officialUrl` | official nav + footer |
| Contact | `info@portfoliobuilders.in`, `+91 79947 21792`, Mon–Sat 10 AM–6 PM | official site |
| India office | Ground Floor, KUBZ, 2115, Padamugal–Palachuvadu Rd, Kakkanad, Kerala 682030 | official site |
| UAE office | Royal House Building, 24 Al Wuheida St, Deira, Dubai | official site |
| `sameAs` | LinkedIn, Instagram, YouTube | official footer |
| Founder | Athul Anil, Founder & CEO | official About page |

## How to fill in the real tokens (3 steps)

1. **Get the hex values.** Open `https://portfoliobuilders.in/` and run in DevTools:
   ```js
   const s = getComputedStyle(document.documentElement);
   // If they use CSS variables, list them:
   [...document.styleSheets].flatMap(ss => { try { return [...ss.cssRules] } catch { return [] } })
     .filter(r => r.style).flatMap(r => [...r.style]).filter(p => p.startsWith('--'));
   // Otherwise sample the primary button + heading:
   const btn = document.querySelector('a[href*="contact"], button');
   console.log(getComputedStyle(btn).backgroundColor, getComputedStyle(btn).color);
   console.log(getComputedStyle(document.querySelector('h1')).fontFamily);
   ```
2. **Convert to RGB triplets** (e.g. `#112D4E` → `17 45 78`) and paste into
   `src/styles/globals.css` under `:root`:
   - `--brand`, `--brand-hover`, `--brand-fg`, `--brand-soft`
   - `--accent`, `--accent-fg` (keep amber/gold for `--star`)
   - `--bg-brand-soft` (a very light tint of `--brand`)
   Then adjust the `.dark` block so both modes still meet **WCAG AA** contrast.
3. **Fonts.** Add the real families with `next/font` in `src/app/layout.tsx` and set
   `--font-sans` / `--font-display`. Until then the system UI stack is used (fast, neutral).

Also update `src/lib/sources/branding.ts` → `"builders-review".accent` to match `--brand`.

## Deliberately NOT reused

Portfolio Builders' marketing claims — placement rate, learners mentored, awards,
certifications, "Trusted by 10K+ Students" — are **company statements, not review data**.
Republishing them on a review platform as if they were evidence would be misleading, so
they appear nowhere on builders.review.

## Platform logos

We ship **no** third-party logo files (Google, Trustpilot, etc.) — we have no brand
permission. Each renders as an accessible tinted monogram with the platform name always
present. To use a permitted logo, drop an SVG at `public/platforms/<slug>.svg` and set
`logo: true` in `src/lib/sources/branding.ts`.
