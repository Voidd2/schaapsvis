"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const p = (pad: string) => `/${locale}${pad}`;

  const primaryLinks = [
    { href: p("/feestdagen"), label: locale === "de" ? "Festtage" : locale === "en" ? "Festive season" : "Feestdagen" },
    { href: p("/assortiment"), label: t("assortiment") },
    { href: p("/barbecue-gourmet"), label: locale === "de" ? "Grill & Gourmet" : locale === "en" ? "Barbecue & gourmet" : "Barbecue & gourmet" },
    { href: p("/biologische-vis"), label: locale === "de" ? "Bio, ASC & MSC" : locale === "en" ? "Organic, ASC & MSC" : "Biologische vis" },
    { href: p("/studentenkorting"), label: locale === "de" ? "Studentenrabatt" : locale === "en" ? "Student discount" : "Studentenkorting" },
    { href: p("/visschalen"), label: t("visschalen") },
    { href: p("/recepten"), label: t("recepten") },
    { href: p("/bezoek-ons"), label: t("locaties") },
  ];
  const accountLinks = [
    { href: p("/account"), label: locale === "de" ? "Studentenkonto" : locale === "en" ? "Student account" : "Studentenaccount" },
    { href: p("/account/klant"), label: locale === "de" ? "Kundenkonto" : locale === "en" ? "Customer account" : "Klantaccount" },
  ];
  const extraLinks = [
    { href: p("/relatiegeschenken"), label: locale === "de" ? "Firmengeschenke" : locale === "en" ? "Business gifts" : "Relatiegeschenken" },
    { href: p("/ons-verhaal"), label: t("verhaal") },
    { href: p("/contact"), label: t("contact") },
  ];
  const accountLabel = locale === "de" ? "Konto" : "Account";
  const moreLabel = locale === "de" ? "Mehr" : locale === "en" ? "More" : "Meer";

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
        <div className="max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 h-8 flex items-center justify-between gap-4">
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
        <div className="max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 flex items-center justify-between gap-3 lg:gap-6 min-h-[4.4rem] py-2">
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
                width={48}
                height={48}
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
                Leiden &middot; {locale === "de" ? "seit" : locale === "en" ? "since" : "sinds"} 1938
              </span>
            </span>
          </Link>

          <nav aria-label={locale === "de" ? "Hauptnavigation" : locale === "en" ? "Main navigation" : "Hoofdnavigatie"} className="hidden xl:flex items-center justify-end gap-x-1 text-[0.68rem]">
            {primaryLinks.map(({ href, label }, index) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors whitespace-nowrap px-1.5 py-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${index === 0 ? "hover:brightness-105" : "hover:bg-sky-50"}`}
                style={{
                  color: index === 0 ? "white" : isActief(href) ? "var(--navy)" : "var(--charcoal)",
                  background: index === 0 ? (isActief(href) ? "#8f1722" : "#b32632") : undefined,
                  fontWeight: index === 0 || isActief(href) ? 700 : 400,
                  borderBottom: index === 0 ? "2px solid #ffd98b" : isActief(href) ? "2px solid var(--gold)" : "2px solid transparent",
                  paddingBottom: index === 0 ? "8px" : "3px",
                  paddingInline: index === 0 ? "10px" : undefined,
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden xl:block" style={{ color: "var(--charcoal)" }}>
              <LanguageSwitcher />
            </div>

            <details className="hidden xl:block relative">
              <summary
                className="cursor-pointer list-none whitespace-nowrap border px-2.5 py-2 text-[0.72rem] font-semibold rounded-md hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ color: "var(--navy)", borderColor: "var(--linen)" }}
              >
                {accountLabel}
              </summary>
              <div
                className="absolute right-0 top-full z-50 mt-2 min-w-52 overflow-hidden rounded-md border shadow-lg"
                style={{ backgroundColor: "var(--cream)", borderColor: "var(--linen)" }}
              >
                {accountLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block px-4 py-3 text-sm hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset"
                    style={{ color: "var(--navy)", borderBottom: "1px solid var(--linen)" }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </details>

            <details className="hidden xl:block relative">
              <summary
                className="cursor-pointer list-none whitespace-nowrap border px-2.5 py-2 text-[0.72rem] font-semibold rounded-md hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ color: "var(--navy)", borderColor: "var(--linen)" }}
              >
                {moreLabel}
              </summary>
              <div
                className="absolute right-0 top-full z-50 mt-2 min-w-52 overflow-hidden rounded-md border shadow-lg"
                style={{ backgroundColor: "var(--cream)", borderColor: "var(--linen)" }}
              >
                {extraLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block px-4 py-3 text-sm hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset"
                    style={{ color: "var(--navy)", borderBottom: "1px solid var(--linen)" }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </details>

            <a
              href={`tel:${BEDRIJF.telefoon.e164}`}
              className="sm:hidden knop knop-rood !py-2.5 !px-3.5 !text-[0.8rem]"
              aria-label={`${locale === "de" ? "Anrufen" : locale === "en" ? "Call" : "Bel"} ${BEDRIJF.telefoon.weergave}`}
            >
              {locale === "de" ? "Anrufen" : locale === "en" ? "Call" : "Bellen"}
            </a>

            <button
              type="button"
              ref={menuButton}
              className="xl:hidden p-2 -mr-2 rounded-md transition-colors hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: "var(--navy)" }}
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={locale === "de" ? "Menü" : "Menu"}
            >
              {open ? <KruisIcoon /> : <MenuIcoon />}
            </button>
          </div>
        </div>

        {/* ── Uitgeklapt menu ───────────────────────────────────────────── */}
        {open && (
          <div
            id="mobile-navigation"
            className="xl:hidden max-h-[calc(100dvh-6.4rem)] overflow-y-auto overscroll-contain"
            style={{ backgroundColor: "var(--cream)", borderTop: "1px solid var(--linen)" }}
          >
            <nav aria-label={locale === "de" ? "Hauptnavigation" : locale === "en" ? "Main navigation" : "Hoofdnavigatie"} className="max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 py-2">
              {primaryLinks.map(({ href, label }, index) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-lg"
                  style={{
                    borderBottom: "1px solid var(--linen)",
                    color: index === 0 ? "white" : "var(--navy)",
                    background: index === 0 ? "linear-gradient(90deg, #941b27, #b32632)" : undefined,
                    paddingInline: index === 0 ? "14px" : undefined,
                    marginBlock: index === 0 ? "8px 4px" : undefined,
                    borderRadius: index === 0 ? "6px" : undefined,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {label}
                </Link>
              ))}

              <p className="pt-5 pb-1 text-[0.68rem] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--gold)" }}>
                {accountLabel}
              </p>
              {accountLinks.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="block py-3 text-base" style={{ borderBottom: "1px solid var(--linen)", color: "var(--navy)" }}>
                  {label}
                </Link>
              ))}

              <p className="pt-5 pb-1 text-[0.68rem] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--gold)" }}>
                {moreLabel}
              </p>
              {extraLinks.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="block py-3 text-base" style={{ borderBottom: "1px solid var(--linen)", color: "var(--navy)" }}>
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


