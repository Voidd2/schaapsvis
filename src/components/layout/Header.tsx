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
    { href: p("/varlaks"), label: t("varlaks") },
    { href: p("/ons-verhaal"), label: t("verhaal") },
    { href: p("/bezoek-ons"), label: t("locaties") },
    { href: p("/bestellen"), label: t("bestellen") },
    { href: p("/contact"), label: t("contact") },
  ];

  const wrapperClass = isVarlaks
    ? "fixed top-0 left-0 right-0 z-50 w-full"
    : "sticky top-0 z-50 w-full";

  const statusBg = isVarlaks
    ? "bg-black/40 backdrop-blur-sm"
    : "";

  const headerBg = isVarlaks
    ? "bg-transparent"
    : "";

  const headerStyle = isVarlaks
    ? {}
    : { backgroundColor: "var(--navy)" };

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
                Leiden · Est. 1938
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
                    style={{
                      backgroundColor: "var(--salmon)",
                      color: "white",
                    }}
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
                  style={{ color: "rgba(247,240,227,0.85)" }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Language + hamburger */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block" style={{ color: "var(--cream)" }}>
              <LanguageSwitcher />
            </div>
            <button
              className="md:hidden p-1"
              style={{ color: "var(--cream)" }}
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            className="md:hidden border-t px-4 pb-5 pt-4 space-y-3"
            style={{
              borderColor: "rgba(247,240,227,0.15)",
              backgroundColor: "#162843",
            }}
          >
            {/* Mobile bestellen CTA */}
            <Link
              href={p("/bestellen")}
              className="flex items-center justify-center py-2.5 text-sm font-semibold text-white mb-1"
              style={{ backgroundColor: "var(--salmon)" }}
              onClick={() => setOpen(false)}
            >
              {t("bestellen")} →
            </Link>
            {navLinks
              .filter((l) => !l.href.includes("/bestellen"))
              .map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-sm py-1.5"
                  style={{ color: "rgba(247,240,227,0.85)" }}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
            <div
              className="pt-3 border-t"
              style={{
                borderColor: "rgba(247,240,227,0.15)",
                color: "var(--cream)",
              }}
            >
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
