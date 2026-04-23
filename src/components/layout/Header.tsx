"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OpenStatusBar } from "../home/OpenStatusBar";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const p = (path: string) => `/${locale}${path}`;

  const navLinks = [
    { href: p("/assortiment"), label: t("assortiment") },
    { href: p("/ons-verhaal"), label: t("verhaal") },
    { href: p("/varlaks"), label: t("varlaks") },
    { href: p("/bezoek-ons"), label: t("locaties") },
    { href: p("/contact"), label: t("contact") },
  ];

  return (
    <>
      <OpenStatusBar />
      <header style={{ backgroundColor: "var(--navy)" }}>
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
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:underline underline-offset-4"
                style={{ color: "rgba(247,240,227,0.85)" }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Language + hamburger */}
          <div className="flex items-center gap-4">
            <div
              className="hidden md:block"
              style={{ color: "var(--cream)" }}
            >
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
            {navLinks.map(({ href, label }) => (
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
    </>
  );
}
