// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { ChevronDown, ExternalLink, Menu, PenLine, Search, X } from "lucide-react";
// import { MAIN_NAV, EXPERIENCE_NAV, PLATFORM_NAV } from "@/lib/nav";
// import { COMPANY } from "@/lib/site-config";
// import { cx } from "@/lib/format";
// import { SearchBar } from "./SearchBar";
// import { ThemeToggle } from "./ThemeToggle";

// const DROPDOWNS: Record<string, { label: string; href: string }[]> = {
//   "/courses": EXPERIENCE_NAV,
//   "/review-platforms": PLATFORM_NAV
// };

// export function Header() {
//   const pathname = usePathname();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [drop, setDrop] = useState<string | null>(null);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const navRef = useRef<HTMLDivElement>(null);

//   useEffect(() => { setMenuOpen(false); setDrop(null); setSearchOpen(false); }, [pathname]);
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 8);
//     onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);
//   useEffect(() => {
//     const click = (e: MouseEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setDrop(null); };
//     const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setDrop(null); setSearchOpen(false); setMenuOpen(false); } };
//     document.addEventListener("mousedown", click); document.addEventListener("keydown", esc);
//     return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", esc); };
//   }, []);

//   const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

//   return (
//     <header className={cx("sticky top-0 z-50 transition-all duration-300 ease-premium",
//       scrolled ? "border-b border-border bg-bg/85 shadow-sm backdrop-blur-xl" : "border-b border-transparent bg-bg")}>
//       <div className="container-app flex h-[70px] items-center gap-4" ref={navRef}>
//         <Link href="/" className="flex shrink-0 items-center gap-2.5 font-display font-extrabold tracking-tight">
//           <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-meta-lg font-extrabold text-brand-fg">BR</span>
//           <span className="hidden text-body-lg sm:inline">builders<span className="text-muted">.review</span></span>
//         </Link>

//         <nav aria-label="Primary" className="hidden xl:block">
//           <ul className="flex items-center gap-0.5">
//             {MAIN_NAV.map((item) => {
//               const d = DROPDOWNS[item.href];
//               const on = active(item.href);
//               if (!d) return (
//                 <li key={item.href}>
//                   <Link href={item.href} aria-current={on ? "page" : undefined}
//                     className={cx("relative rounded-lg px-3 py-2 text-meta-lg font-semibold transition-colors hover:bg-surface-2", on ? "text-brand" : "text-fg-secondary hover:text-fg")}>
//                     {item.label}
//                     {on && <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand" />}
//                   </Link>
//                 </li>
//               );
//               const open = drop === item.href;
//               return (
//                 <li key={item.href} className="relative">
//                   <button type="button" onClick={() => setDrop(open ? null : item.href)} aria-expanded={open} aria-haspopup="menu"
//                     className={cx("inline-flex items-center gap-1 rounded-lg px-3 py-2 text-meta-lg font-semibold transition-colors hover:bg-surface-2", on ? "text-brand" : "text-fg-secondary hover:text-fg")}>
//                     {item.label} <ChevronDown size={14} className={cx("transition-transform duration-fast", open && "rotate-180")} aria-hidden="true" />
//                   </button>
//                   {open && (
//                     <div role="menu" className="absolute left-0 top-full mt-2 w-64 animate-scale-in rounded-xl border border-border bg-surface p-2 shadow-xl">
//                       {d.map((x) => <Link role="menuitem" key={x.href} href={x.href} className="block rounded-lg px-3 py-2.5 text-meta-lg text-fg-secondary hover:bg-surface-2 hover:text-fg">{x.label}</Link>)}
//                     </div>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         <div className="ml-auto flex items-center gap-1.5">
//           <a href={COMPANY.officialUrl} target="_blank" rel="noopener noreferrer"
//             className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-meta font-semibold text-fg-secondary transition hover:border-border-strong hover:text-fg lg:inline-flex">
//             Visit Portfolio Builders <ExternalLink size={12} aria-hidden="true" />
//           </a>
//           <button type="button" onClick={() => setSearchOpen((v) => !v)} aria-expanded={searchOpen} aria-controls="header-search"
//             aria-label={searchOpen ? "Close search" : "Open search"}
//             className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-fg-secondary hover:bg-surface-2 hover:text-fg">
//             {searchOpen ? <X size={18} /> : <Search size={18} />}
//           </button>
//           <ThemeToggle />
//           <Link href="/write-review" className="hidden min-h-[44px] items-center gap-2 rounded-lg bg-accent px-4 text-meta-lg font-semibold text-accent-fg shadow-sm transition hover:brightness-105 sm:inline-flex">
//             <PenLine size={15} aria-hidden="true" /> Write a Review
//           </Link>
//           <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-controls="mobile-menu"
//             aria-label={menuOpen ? "Close menu" : "Open menu"}
//             className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-fg hover:bg-surface-2 xl:hidden">
//             {menuOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>
//       </div>

//       {searchOpen && (
//         <div id="header-search" className="animate-fade-up border-t border-border bg-surface">
//           <div className="container-app py-4"><SearchBar autoFocus id="search-header" /></div>
//         </div>
//       )}

//       {menuOpen && (
//         <div id="mobile-menu" className="max-h-[calc(100dvh-70px)] overflow-y-auto border-t border-border bg-surface xl:hidden">
//           <div className="container-app space-y-5 py-5">
//             <SearchBar id="search-mobile" />
//             <nav aria-label="Mobile">
//               <ul className="space-y-1">
//                 {MAIN_NAV.map((i) => (
//                   <li key={i.href}><Link href={i.href} className={cx("block rounded-lg px-3 py-3 text-body font-semibold hover:bg-surface-2", active(i.href) ? "text-brand" : "text-fg")}>{i.label}</Link></li>
//                 ))}
//               </ul>
//               <p className="px-3 pb-2 pt-5 text-meta font-bold uppercase tracking-wider text-muted">Browse by experience</p>
//               <ul className="space-y-1">
//                 {EXPERIENCE_NAV.map((i) => <li key={i.href}><Link href={i.href} className="block rounded-lg px-3 py-2.5 text-body text-fg-secondary hover:bg-surface-2">{i.label}</Link></li>)}
//               </ul>
//             </nav>
//             <Link href="/write-review" className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 font-semibold text-accent-fg">
//               <PenLine size={16} aria-hidden="true" /> Write a Review
//             </Link>
//             <a href={COMPANY.officialUrl} target="_blank" rel="noopener noreferrer"
//               className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-border px-5 font-semibold">
//               Visit Portfolio Builders <ExternalLink size={14} aria-hidden="true" />
//             </a>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }



"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  ExternalLink,
  LoaderCircle,
  Menu,
  PenLine,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  EXPERIENCE_NAV,
  MAIN_NAV,
  PLATFORM_NAV,
} from "@/lib/nav";
import { COMPANY } from "@/lib/site-config";
import { cx } from "@/lib/format";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";

const DROPDOWNS: Record<
  string,
  { label: string; href: string }[]
> = {
  "/courses": EXPERIENCE_NAV,
  "/review-platforms": PLATFORM_NAV,
};

export function Header() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] =
    useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] =
    useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setDesktopDropdown(null);
    setMobileDropdown(null);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setDesktopDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopDropdown(null);
        setMobileDropdown(null);
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const closeDesktopDropdown = () => {
    setDesktopDropdown(null);
  };

  return (
    // <header
    //   ref={headerRef}
    //   className={cx(
    //     "sticky top-0 z-50 w-full transition-all duration-500",
    //     scrolled
    //       ? "bg-bg/80 py-2 backdrop-blur-xl"
    //       : "bg-bg py-3",
    //   )}
    // >
    <header
  ref={headerRef}
  className="sticky top-0 z-50 w-full bg-bg/80 py-2 backdrop-blur-xl transition-all duration-500"
>

      <div className="mx-auto w-[97%] max-w-[1700px] px-2">
        <div
          className={cx(
  "relative flex min-h-[68px] items-center gap-3 overflow-visible rounded-2xl border border-border bg-surface/90 px-3 backdrop-blur-2xl transition-all duration-500 sm:px-4",
  scrolled
    ? "shadow-[0_18px_60px_rgba(15,23,42,0.16)]"
    : "shadow-sm",
)}
        >
          {/* Premium top glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent"
          />

          {/* Logo */}
          <Link
            href="/"
            aria-label="builders.review home"
            className="group flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <Image
  src="/images/builders-review-logo.png"
  alt="Builders Review logo"
  width={40}
  height={40}
  className="h-10 w-10 rounded-xl object-cover shadow-[0_8px_28px_rgba(0,0,0,0.14)] transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.03]"
  priority
/>

            <span className="hidden sm:block">
              <span className="block font-display text-[17px] font-extrabold leading-none tracking-[-0.035em] text-fg">
                builders
                <span className="text-brand">.review</span>
              </span>

              <span className="mt-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">
                <ShieldCheck
                  size={10}
                  aria-hidden="true"
                />
                Verified experiences
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Primary navigation"
            className="ml-2 hidden xl:block"
          >
            <ul className="flex items-center gap-1 rounded-xl border border-border/70 bg-surface-2/70 p-1">
              {MAIN_NAV.map((item) => {
                const dropdownItems =
                  DROPDOWNS[item.href];
                const active = isActive(item.href);

                if (!dropdownItems) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={
                          active ? "page" : undefined
                        }
                        className={cx(
                          "relative inline-flex min-h-10 items-center rounded-lg px-3.5 text-meta-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
                          active
                            ? "bg-surface text-brand shadow-sm"
                            : "text-fg-secondary hover:bg-surface hover:text-fg",
                        )}
                      >
                        {item.label}

                        {active && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-3 -bottom-[5px] h-0.5 rounded-full bg-brand shadow-[0_0_10px_currentColor]"
                          />
                        )}
                      </Link>
                    </li>
                  );
                }

                const open =
                  desktopDropdown === item.href;

                return (
                  <li
                    key={item.href}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setDesktopDropdown(
                          open ? null : item.href,
                        )
                      }
                      aria-expanded={open}
                      aria-controls={`desktop-dropdown-${item.href.replace(
                        "/",
                        "",
                      )}`}
                      className={cx(
                        "relative inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3.5 text-meta-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
                        active || open
                          ? "bg-surface text-brand shadow-sm"
                          : "text-fg-secondary hover:bg-surface hover:text-fg",
                      )}
                    >
                      {item.label}

                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className={cx(
                          "transition-transform duration-300",
                          open && "rotate-180",
                        )}
                      />

                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-3 -bottom-[5px] h-0.5 rounded-full bg-brand"
                        />
                      )}
                    </button>

                    {open && (
                      <div
                        id={`desktop-dropdown-${item.href.replace(
                          "/",
                          "",
                        )}`}
                        className="absolute left-0 top-full z-50 mt-3 w-[290px] animate-scale-in overflow-hidden rounded-2xl border border-border bg-surface/95 p-2 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
                      >
                        <div className="mb-2 rounded-xl border border-brand/15 bg-brand-soft p-3">
                          <p className="text-meta font-bold text-brand">
                            Explore {item.label}
                          </p>

                          <p className="mt-1 text-meta leading-relaxed text-fg-secondary">
                            Discover verified information,
                            ratings and experiences.
                          </p>
                        </div>

                        <Link
                          href={item.href}
                          onClick={closeDesktopDropdown}
                          className="mb-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-meta-lg font-bold text-fg transition hover:bg-surface-2 hover:text-brand"
                        >
                          View all {item.label}

                          <ExternalLink
                            size={13}
                            aria-hidden="true"
                          />
                        </Link>

                        <div className="h-px bg-border" />

                        <div className="mt-1">
                          {dropdownItems.map((entry) => (
                            <Link
                              key={entry.href}
                              href={entry.href}
                              onClick={
                                closeDesktopDropdown
                              }
                              className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-meta-lg text-fg-secondary transition hover:bg-surface-2 hover:text-fg"
                            >
                              <span>{entry.label}</span>

                              <span
                                aria-hidden="true"
                                className="translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                              >
                                →
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1.5">
            <a
              href={COMPANY.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-11 items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 text-meta font-semibold text-fg-secondary shadow-sm transition-all hover:-translate-y-0.5 hover:border-border-strong hover:text-fg lg:inline-flex"
            >
              Portfolio Builders
              <ExternalLink
                size={12}
                aria-hidden="true"
              />
            </a>

            <button
              type="button"
              onClick={() => {
                setSearchOpen((value) => !value);
                setDesktopDropdown(null);
              }}
              aria-expanded={searchOpen}
              aria-controls="header-search"
              aria-label={
                searchOpen
                  ? "Close search"
                  : "Open search"
              }
              className={cx(
                "inline-flex h-11 w-11 items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
                searchOpen
                  ? "border-brand/30 bg-brand-soft text-brand"
                  : "border-transparent text-fg-secondary hover:border-border hover:bg-surface-2 hover:text-fg",
              )}
            >
              {searchOpen ? (
                <X size={18} aria-hidden="true" />
              ) : (
                <Search
                  size={18}
                  aria-hidden="true"
                />
              )}
            </button>

            <ThemeToggle />

            <Link
              href="/write-review"
              className="group relative hidden min-h-11 items-center gap-2 overflow-hidden rounded-xl bg-accent px-4 text-meta-lg font-bold text-accent-fg shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 sm:inline-flex"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />

              <PenLine
                size={15}
                aria-hidden="true"
                className="relative"
              />

              <span className="relative">
                Write a Review
              </span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setMenuOpen((value) => !value);
                setSearchOpen(false);
                setDesktopDropdown(null);
              }}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={
                menuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              className={cx(
                "inline-flex h-11 w-11 items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 xl:hidden",
                menuOpen
                  ? "border-brand/30 bg-brand-soft text-brand"
                  : "border-border text-fg hover:bg-surface-2",
              )}
            >
              {menuOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Search panel */}
        {searchOpen && (
          <div
            id="header-search"
            className="mt-2 animate-fade-up overflow-hidden rounded-2xl border border-border bg-surface/95 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.15)] backdrop-blur-2xl sm:p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-meta-lg font-bold text-fg">
                  Search builders.review
                </p>

                <p className="text-meta text-muted">
                  Find reviews, courses, internships,
                  mentors and programs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <SearchBar
              autoFocus
              id="search-header"
            />
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="mt-2 max-h-[calc(100dvh-100px)] animate-fade-up overflow-y-auto rounded-2xl border border-border bg-surface/98 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl xl:hidden"
          >
            <div className="p-4 sm:p-5">
              <div className="mb-5 rounded-xl border border-brand/15 bg-brand-soft p-4">
                <div className="flex items-center gap-2 text-brand">
                  <ShieldCheck
                    size={16}
                    aria-hidden="true"
                  />

                  <p className="text-meta-lg font-bold">
                    Transparent review platform
                  </p>
                </div>

                <p className="mt-1.5 text-meta leading-relaxed text-fg-secondary">
                  Browse verified learner experiences and
                  independently submitted reviews.
                </p>
              </div>

              <SearchBar id="search-mobile" />

              <nav
                aria-label="Mobile navigation"
                className="mt-5"
              >
                <p className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted">
                  Navigation
                </p>

                <ul className="space-y-1">
                  {MAIN_NAV.map((item) => {
                    const dropdownItems =
                      DROPDOWNS[item.href];
                    const active =
                      isActive(item.href);
                    const open =
                      mobileDropdown === item.href;

                    if (!dropdownItems) {
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={cx(
                              "flex min-h-12 items-center rounded-xl px-3.5 text-body font-semibold transition",
                              active
                                ? "bg-brand-soft text-brand"
                                : "text-fg hover:bg-surface-2",
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <li key={item.href}>
                        <button
                          type="button"
                          onClick={() =>
                            setMobileDropdown(
                              open
                                ? null
                                : item.href,
                            )
                          }
                          aria-expanded={open}
                          className={cx(
                            "flex min-h-12 w-full items-center justify-between rounded-xl px-3.5 text-left text-body font-semibold transition",
                            active || open
                              ? "bg-brand-soft text-brand"
                              : "text-fg hover:bg-surface-2",
                          )}
                        >
                          {item.label}

                          <ChevronDown
                            size={16}
                            aria-hidden="true"
                            className={cx(
                              "transition-transform duration-300",
                              open &&
                                "rotate-180",
                            )}
                          />
                        </button>

                        {open && (
                          <div className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
                            <Link
                              href={item.href}
                              className="block rounded-lg px-3 py-2.5 text-meta-lg font-bold text-brand hover:bg-brand-soft"
                            >
                              View all
                            </Link>

                            {dropdownItems.map(
                              (entry) => (
                                <Link
                                  key={entry.href}
                                  href={entry.href}
                                  className="block rounded-lg px-3 py-2.5 text-meta-lg text-fg-secondary hover:bg-surface-2 hover:text-fg"
                                >
                                  {entry.label}
                                </Link>
                              ),
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-6 grid gap-2">
                <Link
                  href="/write-review"
                  className="group relative inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent px-5 font-bold text-accent-fg shadow-sm"
                >
                  <PenLine
                    size={16}
                    aria-hidden="true"
                  />
                  Write a Review
                </Link>

                <a
                  href={COMPANY.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 font-semibold text-fg transition hover:bg-surface-2"
                >
                  Visit Portfolio Builders

                  <ExternalLink
                    size={14}
                    aria-hidden="true"
                  />
                </a>
              </div>

              <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
                builders.review is operated with clear
                ownership and conflict-of-interest
                disclosure.
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}