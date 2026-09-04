/**
 * De visschaal: één basisschaal met een startbedrag, en alles wat de klant er
 * extra op wil is een losse toevoeging met een eigen prijs.
 *
 * ┌─ EIGENAAR ────────────────────────────────────────────────────────────────┐
 * │ `STARTBEDRAG` en de prijzen bij de toevoegingen hieronder zijn nog        │
 * │ VOORLOPIG. Zet `PRIJZEN_DEFINITIEF` op `true` zodra de bedragen kloppen;  │
 * │ tot die tijd zet de site er netjes bij dat de prijs een richtbedrag is en │
 * │ dat je hem bevestigt. Zo staat er nooit een bedrag op de site waar je     │
 * │ later aan vastzit.                                                        │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

export const PRIJZEN_DEFINITIEF = false;

/** Waar elke visschaal begint. Alles daarboven kiest de klant er zelf bij. */
export const STARTBEDRAG = 42.5;

/** Onder dit aantal personen maken we geen schaal — dan is het een portie. */
export const MINIMUM_PERSONEN = 4;

export const BASISSCHAAL = {
  naam: "De visschaal",
  /** Waar het startbedrag ongeveer voor volstaat. */
  personen: "vier tot zes personen",
  /**
   * Wat er standaard op ligt. Bewust concreet: "een selectie zeebanket" zegt
   * niemand iets, "gerookte zalm, makreelfilet, Hollandse garnalen" wel.
   */
  bevat: [
    "Gerookte zalm van het mes gesneden",
    "Gerookte makreelfilet",
    "Hollandse garnalen",
    "Twee soorten vissalade",
    "Gerookte forel",
    "Haringhapjes met ui",
    "Citroen, dille en toast",
  ],
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   Toevoegingen
   ═══════════════════════════════════════════════════════════════════════════ */

export type ExtraGroep =
  | "groter"
  | "gerookt"
  | "schaaldieren"
  | "hollands"
  | "erbij";

export const GROEP_LABELS: Record<ExtraGroep, string> = {
  groter: "De schaal groter maken",
  gerookt: "Gerookte vis",
  schaaldieren: "Schaal- en schelpdieren",
  hollands: "Hollandse klassiekers",
  erbij: "Erbij",
};

export const GROEP_UITLEG: Record<ExtraGroep, string> = {
  groter: "Zit u met meer mensen aan tafel? Dan schalen we de hele schaal mee op.",
  gerookt: "Alles wordt bij ons in huis gesneden, op de dag zelf.",
  schaaldieren: "Verse aanvoer bepaalt wat er kan — bij twijfel bellen we u.",
  hollands: "Waar de winkel al sinds 1938 om bekendstaat.",
  erbij: "Kleinigheden die het af maken.",
};

export interface Extra {
  id: string;
  naam: string;
  /** Prijs in euro's die bovenop het startbedrag komt. */
  prijs: number;
  groep: ExtraGroep;
  /** Korte uitleg — alleen als die iets toevoegt. */
  toelichting?: string;
  /** Kan meerdere keren gekozen worden (bijv. per persoon of per 100 gram). */
  meervoudig?: boolean;
  /** Eenheid bij een meervoudige keuze. */
  eenheid?: string;
  /** Niet het hele jaar leverbaar. */
  seizoen?: string;
}

export const EXTRAS: Extra[] = [
  /* ── Groter ─────────────────────────────────────────────────────────────── */
  {
    id: "extra-persoon",
    naam: "Extra persoon",
    prijs: 9.5,
    groep: "groter",
    meervoudig: true,
    eenheid: "persoon",
    toelichting: "De hele schaal groeit mee, in dezelfde verhouding.",
  },

  /* ── Gerookte vis ───────────────────────────────────────────────────────── */
  {
    id: "extra-zalm",
    naam: "Extra gerookte zalm",
    prijs: 8.5,
    groep: "gerookt",
    meervoudig: true,
    eenheid: "portie van 100 g",
    toelichting: "Verreweg het meest gevraagd.",
  },
  {
    id: "varlaks",
    naam: "Varlaks in plaats van gewone gerookte zalm",
    prijs: 12.5,
    groep: "gerookt",
    toelichting:
      "Biologische zalm van familiebedrijven boven de poolcirkel. Steviger van structuur, zuiverder van smaak.",
  },
  {
    id: "gerookte-heilbot",
    naam: "Gerookte heilbot",
    prijs: 11.5,
    groep: "gerookt",
    toelichting: "Vet, mild en wit — de luxe van de rokerij.",
  },
  {
    id: "gerookte-paling",
    naam: "Gerookte paling",
    prijs: 16.5,
    groep: "gerookt",
    toelichting: "Dagprijs kan afwijken; we bevestigen hem bij uw bestelling.",
  },

  /* ── Schaal- en schelpdieren ────────────────────────────────────────────── */
  {
    id: "hollandse-garnalen",
    naam: "Extra Hollandse garnalen",
    prijs: 12.5,
    groep: "schaaldieren",
    meervoudig: true,
    eenheid: "portie van 100 g",
    toelichting: "Met de hand gepeld. Hier vraagt bijna iedereen om.",
  },
  {
    id: "creuse-oesters",
    naam: "Creuse oesters",
    prijs: 16.95,
    groep: "schaaldieren",
    meervoudig: true,
    eenheid: "dozijn",
    toelichting: "Ongeopend meegeleverd, met mesje. Openen doen we ook, zeg het erbij.",
  },
  {
    id: "gamba-spies",
    naam: "Gamba's",
    prijs: 9.75,
    groep: "schaaldieren",
    meervoudig: true,
    eenheid: "portie",
  },
  {
    id: "coquilles",
    naam: "Coquilles",
    prijs: 13.5,
    groep: "schaaldieren",
    meervoudig: true,
    eenheid: "portie",
  },
  {
    id: "krabklauwen",
    naam: "Krabklauwen",
    prijs: 11.5,
    groep: "schaaldieren",
  },
  {
    id: "halve-kreeft",
    naam: "Halve kreeft",
    prijs: 24.5,
    groep: "schaaldieren",
    meervoudig: true,
    eenheid: "halve kreeft",
    toelichting: "Minstens drie dagen vooruit bestellen.",
  },

  /* ── Hollandse klassiekers ──────────────────────────────────────────────── */
  {
    id: "hollandse-nieuwe",
    naam: "Hollandse Nieuwe",
    prijs: 7.5,
    groep: "hollands",
    meervoudig: true,
    eenheid: "portie",
    seizoen: "vanaf juni",
    toelichting: "In het seizoen; daarbuiten maatjesharing.",
  },
  {
    id: "zure-haring",
    naam: "Zure haring en rolmops",
    prijs: 6.5,
    groep: "hollands",
  },
  {
    id: "gerookte-bokking",
    naam: "Gerookte bokking",
    prijs: 5.75,
    groep: "hollands",
  },
  {
    id: "extra-salade",
    naam: "Extra vissalade naar keuze",
    prijs: 6.5,
    groep: "hollands",
    meervoudig: true,
    eenheid: "bakje",
    toelichting: "Zalm-, krab-, garnalen- of huzarensalade met vis.",
  },

  /* ── Erbij ──────────────────────────────────────────────────────────────── */
  {
    id: "brood",
    naam: "Vers brood en roomboter",
    prijs: 4.95,
    groep: "erbij",
  },
  {
    id: "sauzen",
    naam: "Sauzen: ravigote, cocktail en dille-mosterd",
    prijs: 4.5,
    groep: "erbij",
  },
  {
    id: "opmaak",
    naam: "Feestelijke opmaak",
    prijs: 7.5,
    groep: "erbij",
    toelichting: "Op een echte schaal met garnering, in plaats van in de doos.",
  },
  {
    id: "bestek",
    naam: "Wegwerpbordjes, bestek en servetten",
    prijs: 3.95,
    groep: "erbij",
    meervoudig: true,
    eenheid: "set van 6",
  },
];

export const GROEP_VOLGORDE: ExtraGroep[] = [
  "groter",
  "gerookt",
  "schaaldieren",
  "hollands",
  "erbij",
];

export function extrasPerGroep(groep: ExtraGroep): Extra[] {
  return EXTRAS.filter((e) => e.groep === groep);
}

export function extraById(id: string): Extra | undefined {
  return EXTRAS.find((e) => e.id === id);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Rekenen
   ═══════════════════════════════════════════════════════════════════════════ */

/** Gekozen toevoegingen als { id: aantal }. */
export type Keuze = Record<string, number>;

export function berekenTotaal(keuze: Keuze): number {
  return Object.entries(keuze).reduce((som, [id, aantal]) => {
    const extra = extraById(id);
    if (!extra || aantal <= 0) return som;
    return som + extra.prijs * aantal;
  }, STARTBEDRAG);
}

/** Regels voor de samenvatting en voor het bericht dat naar de winkel gaat. */
export function keuzeRegels(keuze: Keuze): { naam: string; aantal: number; bedrag: number }[] {
  return Object.entries(keuze)
    .map(([id, aantal]) => {
      const extra = extraById(id);
      if (!extra || aantal <= 0) return null;
      return { naam: extra.naam, aantal, bedrag: extra.prijs * aantal };
    })
    .filter((r): r is { naam: string; aantal: number; bedrag: number } => r !== null);
}
