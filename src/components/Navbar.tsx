"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

const localeLabels: Record<string, string> = {
  nl: "🇳🇱 NL",
  en: "🇬🇧 EN",
  de: "🇩🇪 DE",
};

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  const prefix = (path: string) =>
    locale === "nl" ? path : `/${locale}${path}`;

  const otherLocales = ["nl", "en", "de"].filter((l) => l !== locale);

  return (
    <header className="sticky top-0 z-50 bg-[#1B4F72] shadow-md">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={prefix("/")}
          className="text-white font-bold text-xl tracking-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Schaap&apos;s Vis
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href={prefix("/")}
            className="text-white/90 hover:text-[#E8A87C] transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href={prefix("/ons-verhaal")}
            className="text-white/90 hover:text-[#E8A87C] transition-colors"
          >
            {t("verhaal")}
          </Link>
          <Link
            href={prefix("/varlaks-biologische-zalm")}
            className="text-white/90 hover:text-[#E8A87C] transition-colors"
          >
            {t("varlaks")}
          </Link>
          <Link
            href={prefix("/assortiment")}
            className="text-white/90 hover:text-[#E8A87C] transition-colors"
          >
            {t("assortiment")}
          </Link>
          <Link
            href={prefix("/bezoek-ons")}
            className="text-white/90 hover:text-[#E8A87C] transition-colors"
          >
            {t("bezoek")}
          </Link>
          <Link
            href={prefix("/contact")}
            className="text-white/90 hover:text-[#E8A87C] transition-colors"
          >
            {t("contact")}
          </Link>

          {/* Language switcher */}
          <div className="flex items-center gap-2 ml-2 border-l border-white/30 pl-4">
            {otherLocales.map((l) => (
              <Link
                key={l}
                href={l === "nl" ? "/" : `/${l}`}
                className="text-white/70 hover:text-white text-xs transition-colors"
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1B4F72] border-t border-white/20 px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          {[
            { href: prefix("/"), label: t("home") },
            { href: prefix("/ons-verhaal"), label: t("verhaal") },
            {
              href: prefix("/varlaks-biologische-zalm"),
              label: t("varlaks"),
            },
            { href: prefix("/assortiment"), label: t("assortiment") },
            { href: prefix("/bezoek-ons"), label: t("bezoek") },
            { href: prefix("/contact"), label: t("contact") },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-white/90 hover:text-[#E8A87C] py-1 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-white/20">
            {otherLocales.map((l) => (
              <Link
                key={l}
                href={l === "nl" ? "/" : `/${l}`}
                className="text-white/70 hover:text-white text-xs"
                onClick={() => setMenuOpen(false)}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
