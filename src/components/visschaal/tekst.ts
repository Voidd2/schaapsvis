"use client";

import { useTranslations } from "next-intl";
import type { Groep } from "@/lib/visschaal";

/**
 * De namen van de onderdelen van een visschaal in de taal van de bezoeker.
 *
 * De Nederlandse teksten in `src/lib/visschaal.ts` blijven de bron — dat is waar
 * de eigenaar zijn schaal samenstelt. Hier worden ze omgezet aan de hand van de
 * id van elk onderdeel. Ontbreekt een vertaling, dan valt hij terug op het
 * Nederlands: liever één regel in de verkeerde taal dan een lege plek of een
 * sleutelnaam op het scherm.
 */
export function useSchaalTekst() {
  const t = useTranslations("visschaalItems");
  const of = (sleutel: string, terugval: string) => (t.has(sleutel) ? t(sleutel) : terugval);

  return {
    groep: (groep: Groep, terugval: string) => of(`groep_${groep}`, terugval),
    uitleg: (groep: Groep, terugval: string) => of(`uitleg_${groep}`, terugval),
    naam: (id: string, terugval: string) => of(id, terugval),
    toelichting: (id: string, terugval?: string) =>
      terugval === undefined ? undefined : of(`toelichting_${id}`, terugval),
    eenheid: (eenheid?: string) =>
      eenheid === undefined ? undefined : of(`eenheid_${eenheid}`, eenheid),
    seizoen: (seizoen?: string) =>
      seizoen === undefined ? undefined : of(`seizoen_${seizoen}`, seizoen),
  };
}
