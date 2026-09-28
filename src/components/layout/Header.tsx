"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WinkelStatus } from "./WinkelStatus";
import { BEDRIJF, ADRES_REGEL } from "@/lib/bedrijf";
import { BEELD } from "@/lib/beeld";

/**
 * De kop van de site is opgezet als een krantenkop: een smalle informatiebalk
 * met adres, openingsstatus en telefoonnummer, en daaronder de naam met de
 * navigatie. Geen doorzichtige balk met vervaging, geen ronde pillen — dat
 * leest als een sjabloon, en dit is een winkel uit 1938.
 */
export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const p = (pad: string) => `/${locale}${pad}`;

  const links = [
    { href: p("/assortiment"), label: t("assortiment") },
    { href: "/nl/recepten", label: t("recepten") },
    { href: p("/biologische-vis"), label: t("betereVis") },
    { href: "/nl/blog", label: t("blog") },
    { href: p("/bezoek-ons"), label: t("locaties") },
  ];

  const isActief = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // Liefst de liggende variant; anders de ronde badge; anders alleen de naam.
  const logo = BEELD.logoLiggend.bestand || BEELD.logoBadge.bestand;

  return (
    <div className="sticky top-0 z-50">
      {/* ── Informatiebalk ──────────────────────────────────────────────── */}
      <div
        className="text-[0.72rem] tracking-wide"
        style={{ backgroundColor: "var(--navy-dark)", color: "rgba(250,246,239,0.72)" }}
      >
        <div className="max-w-6xl mx-auto px-4 h-8 flex items-center justify-between gap-4">
          <span className="hidden sm:inline">{ADRES_REGEL}</span>
          <WinkelStatus />
          <a
            href={`tel:${BEDRIJF.telefoon.e164}`}
            className="hidden sm:inline hover:text-white transition-colors"
          >
            {BEDRIJF.telefoon.weergave}
          </a>
        </div>
      </div>

      {/* ── Naam en navigatie ───────────────────────────────────────────── */}
      <header
        style={{ backgroundColor: "var(--cream)", borderBottom: "1px solid var(--linen)" }}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-3 lg:gap-6 h-[4.4rem]">
          <Link href={p("")} className="min-w-0 leading-none flex items-center gap-3">
            {/* Het ronde logo, zodra de eigenaar het aanlevert. Klein gehouden:
                een grote badge in de kop duwt de navigatie van de rand en maakt
                de site ouderwets in plaats van herkenbaar. */}
            {logo && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logo}
                alt=""
                aria-hidden
                className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 object-contain"
              />
            )}
            <span className="min-w-0">
              {/* Op een smal scherm moet de naam wijken voor de belknop en het
                  menu — anders wordt de hamburger van de rand geduwd. */}
              <span
                className="block text-[1.25rem] sm:text-[1.45rem] lg:text-[1.65rem] leading-none whitespace-nowrap"
                style={{ fontFamily: "var(--font-display)", color: "var(--navy)", fontWeight: 700 }}
              >
                Schaap&rsquo;s Vishandel
              </span>
              <span
                className="block text-[0.55rem] sm:text-[0.62rem] mt-1 whitespace-nowrap"
                style={{
                  color: "var(--gold)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Leiden &middot; sinds 1938
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[0.9rem]">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors whitespace-nowrap"
                style={{
                  color: isActief(href) ? "var(--navy)" : "var(--charcoal)",
                  fontWeight: isActief(href) ? 600 : 400,
                  borderBottom: isActief(href) ? "2px solid var(--gold)" : "2px solid transparent",
                  paddingBottom: "2px",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:block" style={{ color: "var(--charcoal)" }}>
              <LanguageSwitcher />
            </div>

            <Link href={p("/visschalen")} className="knop knop-rood hidden sm:inline-flex !py-2.5 !px-5 !text-[0.9rem]">
              {t("visschalen")}
            </Link>

            <a
              href={`tel:${BEDRIJF.telefoon.e164}`}
              className="sm:hidden knop knop-rood !py-2.5 !px-3.5 !text-[0.8rem]"
              aria-label={`Bel ${BEDRIJF.telefoon.weergave}`}
            >
              Bellen
            </a>

            <button
              type="button"
              className="lg:hidden p-2 -mr-2"
              style={{ color: "var(--navy)" }}
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Menu"
            >
              {open ? <KruisIcoon /> : <MenuIcoon />}
            </button>
          </div>
        </div>

        {/* ── Uitgeklapt menu ───────────────────────────────────────────── */}
        {open && (
          <div
            className="lg:hidden"
            style={{ backgroundColor: "var(--cream)", borderTop: "1px solid var(--linen)" }}
          >
            <nav className="max-w-6xl mx-auto px-4 py-2">
              <Link
                href={p("/visschalen")}
                onClick={() => setOpen(false)}
                className="knop knop-rood w-full my-3 sm:hidden"
              >
                {t("visschalen")}
              </Link>

              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-lg"
                  style={{
                    borderBottom: "1px solid var(--linen)",
                    color: "var(--navy)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {label}
                </Link>
              ))}

              {[
                // Recepten en blog staan alleen in het Nederlands.
                { href: p("/ons-verhaal"), label: t("verhaal") },
                { href: p("/contact"), label: t("contact") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-[0.95rem]"
                  style={{ color: "var(--charcoal)" }}
                >
                  {label}
                </Link>
              ))}

              <div className="py-4" style={{ color: "var(--charcoal)" }}>
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}

function MenuIcoon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function KruisIcoon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}
