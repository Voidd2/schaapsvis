"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OpenStatusBar } from "../home/OpenStatusBar";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isVarlaks = pathname.includes("/varlaks");
  const p = (path: string) => `/${locale}${path}`;

  const navLinks = [
    { href: p("/assortiment"), label: t("assortiment") },
    { href: p("/visschalen"), label: t("visschalen") },
    { href: p("/biologische-vis"), label: t("betereVis") },
    { href: p("/viskalender"), label: t("viswijzer") },
    { href: p("/blog"), label: t("blog") },
    { href: p("/ons-verhaal"), label: t("verhaal") },
    { href: p("/bezoek-ons"), label: t("locaties") },
    { href: p("/bestellen"), label: t("bestellen") },
  ];

  const wrapperClass = isVarlaks
    ? "fixed top-0 left-0 right-0 z-50 w-full"
    : "sticky top-0 z-50 w-full";

  const statusBg = isVarlaks ? "bg-black/40 backdrop-blur-sm" : "";
  const headerBg = isVarlaks ? "bg-transparent" : "";
  const headerStyle = isVarlaks ? {} : { backgroundColor: "var(--navy)" };

  return (
    <div className={wrapperClass}>
      <div className={statusBg}>
        <OpenStatusBar />
      </div>

      <header className={headerBg} style={headerStyle}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href={p("/")} className="group">
            <div style={{ color: "var(--cream)" }}>
              <span
                className="block text-xl font-bold leading-none"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Schaap&apos;s Vis
              </span>
              <span className="text-xs tracking-[0.15em] uppercase opacity-60">
                Leiden &middot; Est. 1938
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(({ href, label }) => {
              const isBestellen = href.includes("/bestellen");
              if (isBestellen) {
                return (
                  <Link
                    key={href}
                    href={href}
                    className="transition-colors px-4 py-1.5 text-sm"
                    style={{ backgroundColor: "var(--salmon)", color: "white" }}
                  >
                    {label}
                  </Link>
                );
              }
              return (
                <Link
                  key={href}
                  href={href}
                  className="transition-colors hover:underline underline-offset-4"
                  style={{ color: "rgba(246,250,253,0.85)" }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: lang switcher (desktop) + phone CTA (mobile) + hamburger */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block" style={{ color: "var(--cream)" }}>
              <LanguageSwitcher />
            </div>

            {/* Mobile: tap-to-call button */}
            <a
              href="tel:+31715149802"
              className="md:hidden flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--salmon)" }}
              aria-label="Bel ons"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
              Bellen
            </a>

            {/* Hamburger */}
            <button
              className="md:hidden p-3"
              style={{ color: "var(--cream)" }}
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            className="md:hidden border-t pb-5 pt-2 space-y-1"
            style={{ borderColor: "rgba(246,250,253,0.15)", backgroundColor: "var(--navy-dark)" }}
          >
            <Link
              href={p("/bestellen")}
              className="flex items-center justify-center py-4 text-base font-semibold text-white mx-4 mt-2"
              style={{ backgroundColor: "var(--salmon)" }}
              onClick={() => setOpen(false)}
            >
              {t("bestellen")} &rarr;
            </Link>

            {navLinks
              .filter((l) => !l.href.includes("/bestellen"))
              .map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block py-4 px-6 text-lg border-b"
                  style={{ color: "rgba(246,250,253,0.85)", borderColor: "rgba(246,250,253,0.08)" }}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}

            <div
              className="pt-3 px-6 border-t"
              style={{ borderColor: "rgba(246,250,253,0.15)", color: "var(--cream)" }}
            >
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
