"use client";

import { useLocale, useTranslations } from "next-intl";
import { platterName } from "@/lib/platter-localization";
import type { Groep } from "@/lib/visschaal";

/**
 * De namen van de onderdelen van een visschaal in de taal van de bezoeker.
 *
 * De Nederlandse teksten in `src/lib/visschaal.ts` blijven de bron — dat is waar
 * de eigenaar zijn schaal samenstelt. Hier worden ze omgezet aan de hand van de
 * id van elk onderdeel. Ontbrekende Engelse of Duitse vertalingen zijn fouten,
 * zodat de controles geen stilzwijgende Nederlandse terugval kunnen missen.
 */
export function useSchaalTekst() {
  const locale = useLocale();
  const t = useTranslations("visschaalItems");
  const of = (sleutel: string, terugval: string) => (t.has(sleutel) ? t(sleutel) : locale === "nl" ? terugval : (() => { throw new Error("Missing platter translation: " + sleutel); })());

  return {
    groep: (groep: Groep, terugval: string) => of(`groep_${groep}`, terugval),
    uitleg: (groep: Groep, terugval: string) => of(`uitleg_${groep}`, terugval),
    naam: (id: string, terugval: string) =>(platterName(id,locale) ?? of(id, terugval)),
    toelichting: (id: string, terugval?: string) =>
      terugval === undefined ? undefined : of(`toelichting_${id}`, terugval),
    eenheid: (eenheid?: string) =>
      eenheid === undefined ? undefined : of(`eenheid_${eenheid}`, eenheid),
    seizoen: (seizoen?: string) =>
      seizoen === undefined ? undefined : of(`seizoen_${seizoen}`, seizoen),
  };
}
