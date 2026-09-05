"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { BEDRIJF, ADRES_REGEL, euro } from "@/lib/bedrijf";
import { BEZORGING, bezorgdagenTekst } from "@/lib/bezorging";

/**
 * De voet van de webshop.
 *
 * Eén regel met wat iemand halverwege een bestelling nog wil weten: waar we
 * zitten, wanneer we rijden, wat het kost en hoe je ons belt. Geen tweede
 * navigatie — die leidt op dit punt alleen maar weg van het formulier.
 */
export function ShopFooter() {
  const t = useTranslations("winkelwagen");
  const g = useTranslations("gedeeld");
  const locale = useLocale();

  return (
    <footer
      style={{ backgroundColor: "var(--navy-dark)", color: "rgba(250,246,239,0.72)" }}
      className="mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <span>{ADRES_REGEL}</span>
        <a href={`tel:${BEDRIJF.telefoon.e164}`} className="hover:text-white transition-colors">
          {BEDRIJF.telefoon.weergave}
        </a>
        <span>
          {t("balk", {
            kosten: euro(BEZORGING.standaardKosten),
            gratis: euro(BEZORGING.gratisVanaf),
          })}
        </span>
        <span>{g("bezorgen")}: {bezorgdagenTekst()}</span>
        <Link
          href={`/${locale}`}
          className="ml-auto underline underline-offset-4 hover:text-white transition-colors"
        >
          &larr; {t("terugNaarSite")}
        </Link>
      </div>
    </footer>
  );
}
