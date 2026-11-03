/**
 * Het mandje: wat iemand bij elkaar heeft geklikt voordat hij afrekent.
 *
 * Twee soorten dingen kunnen erin, en die gedragen zich verschillend:
 *
 *  • **Verse vis** gaat op gewicht. Het totaal hangt af van het gekozen gewicht;
 *    we spreken de prijs vooraf met de klant af. We tonen geen dagprijs.
 *  • **Een visschaal** is wél op de cent uit te rekenen: startbedrag plus de
 *    extra's die de klant erbij kiest.
 *
 * Daarom kan de winkelwagen alleen een hard bedrag laten zien als er een
 * visschaal in zit — en alleen dan kan hij eerlijk zeggen hoeveel er nog bij
 * moet voor gratis bezorging.
 */

import { products, eenheidVoor, type Categorie } from "./assortiment-data";
import { isBezorgbaar } from "./bezorging";
import {
  LEGE_SAMENSTELLING,
  schaalById,
  type Samenstelling,
} from "./visschaal";

export const MANDJE_OPSLAG = "sv_bestelling_v2";
export const SCHAAL_OPSLAG = "sv_visschaal_v3";

/** Anonymous selections belong to this tab, never to an account or server session.
 * Move legacy device-local selections once, only after session storage succeeds.
 * Keeping the old value on failure avoids destroying an existing selection.
 */
function readSelection(key: string): string | null {
  try {
    const current = sessionStorage.getItem(key);
    if (current !== null) return current;
    const legacy = localStorage.getItem(key);
    if (legacy !== null) {
      sessionStorage.setItem(key, legacy);
      localStorage.removeItem(key);
    }
    return legacy;
  } catch { return null; }
}

export interface MandjeRegel {
  slug: string;
  naam: string;
  categorie: Categorie;
  eenheid: string;
  bezorgbaar: boolean;
  /** Wat de klant invulde, bijvoorbeeld "500 gram" of "2 stuks". */
  hoeveelheid: string;
  /** "Gefileerd", "In moten", … — alleen zinvol bij hele verse vis. */
  snijwijze: string;
}

/** Een lege regel voor een product uit het assortiment. */
export function maakRegel(slug: string): MandjeRegel | null {
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  return {
    slug: product.slug,
    naam: product.naam,
    categorie: product.categorie,
    eenheid: eenheidVoor(product.categorie),
    bezorgbaar: isBezorgbaar(product.categorie),
    hoeveelheid: "",
    snijwijze: "",
  };
}

/** Wat er in de opslag staat, ontdaan van producten die niet meer bestaan. */
export function leesMandje(): MandjeRegel[] {
  try {
    const rauw = readSelection(MANDJE_OPSLAG);
    if (!rauw) return [];
    const gelezen: unknown = JSON.parse(rauw);
    if (!Array.isArray(gelezen)) return [];
    const gezien = new Set<string>();
    return gelezen.flatMap((r): MandjeRegel[] => {
      if (!r || typeof r !== "object" || typeof r.slug !== "string" || gezien.has(r.slug)) return [];
      const basis = maakRegel(r.slug);
      if (!basis) return [];
      gezien.add(r.slug);
      return [{ ...basis, hoeveelheid: typeof r.hoeveelheid === "string" ? r.hoeveelheid.slice(0, 120) : "", snijwijze: typeof r.snijwijze === "string" ? r.snijwijze.slice(0, 120) : "" }];
    });
  } catch {
    return [];
  }
}

export function bewaarMandje(regels: MandjeRegel[]) {
  try {
    sessionStorage.setItem(
      MANDJE_OPSLAG,
      JSON.stringify(
        regels.map((r) => ({
          slug: r.slug,
          hoeveelheid: r.hoeveelheid,
          snijwijze: r.snijwijze,
        }))
      )
    );
  } catch {
    /* geen opslag beschikbaar — dan onthoudt de browser het gewoon niet */
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   De visschaal
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Wat er over de visschaal in de opslag staat.
 *
 * Alles wat niet meer bestaat wordt weggelaten: een schaal die uit `SCHALEN` is
 * gehaald of een extra die niet meer op de kaart staat, mag geen bedrag meer
 * opleveren. Wie hier een id verzint krijgt dus niets — en de server rekent het
 * bovendien nog een keer na.
 */
export function leesSamenstelling(): Samenstelling {
  try {
    const rauw = readSelection(SCHAAL_OPSLAG);
    if (!rauw) return LEGE_SAMENSTELLING;
    const gelezen = JSON.parse(rauw) as Partial<Samenstelling>;
    const schaal =
      typeof gelezen.schaal === "string" && schaalById(gelezen.schaal) ? gelezen.schaal : null;
    const gegevens = schaal ? schaalById(schaal)! : undefined;
    const personen = gegevens && Number.isFinite(Number(gelezen.personen))
      ? Math.max(gegevens.personenVan, Math.min(gegevens.personenTot, Math.floor(Number(gelezen.personen))))
      : gegevens?.personenVan;
    return { schaal, personen, extras: {} };
  } catch {
    return LEGE_SAMENSTELLING;
  }
}

export function bewaarSamenstelling(samen: Samenstelling) {
  try {
    sessionStorage.setItem(SCHAAL_OPSLAG, JSON.stringify(samen));
  } catch {
    /* geen opslag beschikbaar */
  }
}

