"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { WinkelwagenKnop } from "@/components/winkel/WinkelwagenKnop";
import { BEZORGING } from "@/lib/bezorging";
import { euro } from "@/lib/bedrijf";

/**
 * De kop van de webshop.
 *
 * Vanaf het moment dat iemand op Bestellen klikt hoort de site zich anders te
 * gedragen: geen menu met "Ons verhaal" en "Blog" meer, maar één weg vooruit —
 * bestellen — en één weg terug naar de winkelsite. De winkelwagen staat
 * rechtsboven waar iedereen hem zoekt.
 */
export function ShopHeader() {
  const t = useTranslations("winkelwagen");
  const nav = useTranslations("nav");
  const locale = useLocale();

  return (
    <div className="sticky top-0 z-50">
      {/* Wat de bezorging kost — de eerste vraag die iedereen heeft. */}
      <div
        className="text-[0.72rem] tracking-wide"
        style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}
      >
        <div className="max-w-6xl mx-auto px-4 h-8 flex items-center justify-center text-center font-semibold">
          {t("balk", {
            kosten: euro(BEZORGING.standaardKosten),
            gratis: euro(BEZORGING.gratisVanaf),
          })}
        </div>
      </div>

      <header style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto px-4 h-[4.4rem] flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-4 min-w-0">
            <Link href={`/${locale}/bestellen`} className="min-w-0 leading-none">
              <span
                className="block text-[1.15rem] sm:text-[1.35rem] leading-none whitespace-nowrap"
                style={{ fontFamily: "var(--font-display)", color: "var(--cream)", fontWeight: 700 }}
              >
                Schaap&rsquo;s Vishandel
              </span>
              <span className="kapitaal kapitaal-licht">{t("webshop")}</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="hidden sm:inline text-sm underline underline-offset-4"
              style={{ color: "rgba(250,246,239,0.75)" }}
            >
              &larr; {t("terugNaarSite")}
            </Link>
            <Link
              href={`/${locale}/visschalen`}
              className="hidden md:inline text-sm underline underline-offset-4"
              style={{ color: "rgba(250,246,239,0.75)" }}
            >
              {nav("visschalen")}
            </Link>
            <WinkelwagenKnop />
          </div>
        </div>
      </header>
    </div>
  );
}
