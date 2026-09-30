/**
 * De visschaal-aanvraag: één schaal of borrelbox en optionele extra's.
 * Naast de drie oorspronkelijke Schaap-schalen staan hier schotels uit de
 * eigenaar-goedgekeurde uitbreiding. Bronprijzen en peildatum zijn opgeslagen
 * in scripts/dirks-price-research-2026-09-29.json. De site toont richtprijzen:
 * samenstelling, beschikbaarheid en definitieve prijs worden bevestigd.
 */

import { DIRKS_VISSCHALEN } from "./dirks-selectie";

export const PRIJZEN_DEFINITIEF = false;
/** Basistarief voor elke visschaal; maatwerk wordt apart besproken. */
export const PRIJS_PER_PERSOON = 17.5;

/** Vuistregels om te bepalen hoeveel iemand nodig heeft. */
export const PORTIES = {
  /** Gram per persoon als borrelschaal, naast ander eten. */
  borrel: 150,
  /** Gram per persoon als de schaal de maaltijd is. */
  maaltijd: 250,
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   Eigen schalen en uitgebreide selectie
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Schaal {
  id: string;
  naam: string;
  /** Startbedrag van deze schaal, zonder extra's. */
  prijs: number;
  /** Voor hoeveel personen als borrelschaal — voor de prijs per persoon. */
  personenVan: number;
  personenTot: number;
  /** Eén zin die deze schaal onderscheidt van de andere twee. */
  omschrijving: string;
  /** Wat er standaard op ligt. */
  bevat: string[];
  /**
   * Welke foto hierbij hoort. De foto zelf staat in `src/lib/beeld.ts`, samen
   * met alle andere foto's van de site — één plek waar de eigenaar paden invult.
   */
  beeld?: "schaalBorrel" | "schaalFamilie" | "schaalFeest";
  foto?: string;
}

/**
 * ┌─ EIGENAAR ────────────────────────────────────────────────────────────────┐
 * │ De schaalsoorten hebben voorbeelden van groepsgrootte; prijs is altijd    │
 * │ € 17,50 per persoon. Inhoud en eventuele duurdere vis op aanvraag.        │
 * └───────────────────────────────────────────────────────────────────────────┘
 */
const EIGEN_SCHALEN: Schaal[] = [
  {
    id: "borrelschaal",
    naam: "Borrelschaal",
    beeld: "schaalBorrel",
    prijs: PRIJS_PER_PERSOON * 4,
    personenVan: 4,
    personenTot: 6,
    omschrijving: "Een visschaal voor een borrel of gezellig samenzijn. De invulling bespreken we graag met u.",
    bevat: [],
  },
  {
    id: "familieschaal",
    naam: "Familieschaal",
    beeld: "schaalFamilie",
    prijs: PRIJS_PER_PERSOON * 8,
    personenVan: 8,
    personenTot: 10,
    omschrijving: "Een ruimere visschaal voor familie of vrienden. Bespreek uw gewenste vissoorten met ons.",
    bevat: [],
  },
  {
    id: "feestschaal",
    naam: "Feestschaal",
    beeld: "schaalFeest",
    prijs: PRIJS_PER_PERSOON * 12,
    personenVan: 12,
    personenTot: 16,
    omschrijving: "Een feestelijke visschaal voor een bijzondere gelegenheid. Luxe vissoorten stemmen we met u af.",
    bevat: [],
  },
];

/** Uitbreiding op verzoek van de eigenaar, gebaseerd op de prijspeiling van 29-09-2026.
 * Afbeeldingen zijn voorbeelden; de werkelijke inhoud stemmen wij met de klant af.
 * Dieetwensen en kreeft worden uitsluitend handmatig aangevraagd.
 */
export const SCHALEN: Schaal[] = [
  ...EIGEN_SCHALEN,
  ...DIRKS_VISSCHALEN.filter((item) => !item.alleenAanvraag).sort((a, b) => {
    const volgorde = ["borrelbox", "klassiek", "luxe", "hapjes"];
    return volgorde.indexOf(a.groep) - volgorde.indexOf(b.groep) || a.prijs - b.prijs;
  }).map((item) => ({
    id: item.slug,
    naam: item.naam,
    foto: item.foto,
    prijs: PRIJS_PER_PERSOON * (item.personenVan ?? 2),
    personenVan: item.personenVan ?? 2,
    personenTot: item.personenTot ?? 4,
    omschrijving: item.groep === "borrelbox"
      ? "Een box met vis voor een borrel. De precieze samenstelling en presentatie stemmen we met u af."
      : item.groep === "hapjes"
        ? "Kleine vishapjes om samen te delen. Vraag naar de invulling van de dag."
        : item.groep === "luxe"
          ? "Een ruimere, feestelijke visselectie. De inhoud hangt af van uw wensen en de verse aanvoer."
          : "Een schaal met een selectie van vis en zeevruchten. We bespreken wat u erop wilt hebben.",
    bevat: [],
  })),
];

export function schaalById(id: string): Schaal | undefined {
  return SCHALEN.find((s) => s.id === id);
}

/** Het bedrag waar de site "vanaf" mee adverteert. */
export const VANAF_BEDRAG = PRIJS_PER_PERSOON;

/* ═══════════════════════════════════════════════════════════════════════════
   De extra's — wat de klant er bovenop legt
   ═══════════════════════════════════════════════════════════════════════════ */

export type Groep = "gerookt" | "schaaldieren" | "hollands" | "salades" | "erbij";

export const GROEP_LABELS: Record<Groep, string> = {
  gerookt: "Gerookte vis",
  schaaldieren: "Schaal- en schelpdieren",
  hollands: "Hollandse klassiekers",
  salades: "Salades",
  erbij: "Erbij",
};

export const GROEP_UITLEG: Record<Groep, string> = {
  gerookt: "Op de dag zelf bij ons van het mes gesneden.",
  schaaldieren: "Wat de boten brengen bepaalt wat er kan. Bij twijfel bellen we u.",
  hollands: "Waar de winkel sinds 1938 om bekendstaat.",
  salades: "Huisgemaakt, elke ochtend vers aangemaakt.",
  erbij: "De kleinigheden die het af maken.",
};

export interface Onderdeel {
  id: string;
  naam: string;
  /** Prijs per 100 gram, tenzij `perStuk` is gezet. */
  prijs: number;
  groep: Groep;
  /**
   * Sommige dingen verkoop je niet op gewicht. Een oester is een oester.
   * Staat dit er, dan is `prijs` de prijs per stuk/dozijn en telt het niet mee
   * in het gewicht van de schaal.
   */
  perStuk?: string;
  toelichting?: string;
  seizoen?: string;
  /** Wat een vergelijkbaar product elders kost, per 100 g. Alleen ter controle. */
  marktprijs?: number;
}

/**
 * Prijzen per 100 gram. Elke regel zit onder wat we bij anderen zagen; bij de
 * regels waar we een vergelijking van hebben staat die erbij in `marktprijs`.
 */
export const ONDERDELEN: Onderdeel[] = [
  /* ── Gerookte vis ───────────────────────────────────────────────────────── */
  {
    id: "gerookte-zalm",
    naam: "Gerookte zalm",
    prijs: 3.25,
    marktprijs: 4.29,
    groep: "gerookt",
    toelichting: "Van het mes gesneden. Verreweg het meest gekozen.",
  },
  {
    id: "gravad-lax",
    naam: "Gravad lax",
    prijs: 3.5,
    groep: "gerookt",
    toelichting: "Gemarineerd met dille en zeezout in plaats van gerookt.",
  },
  {
    id: "gerookte-makreel",
    naam: "Gerookte makreelfilet",
    prijs: 2.5,
    marktprijs: 2.75,
    groep: "gerookt",
  },
  {
    id: "gerookte-paling",
    naam: "Gerookte paling",
    prijs: 4.95,
    marktprijs: 5.5,
    groep: "gerookt",
    toelichting: "Dagprijs kan meebewegen; we bevestigen hem bij uw bestelling.",
  },

  /* ── Schaal- en schelpdieren ────────────────────────────────────────────── */
  {
    id: "hollandse-garnalen",
    naam: "Hollandse garnalen",
    prijs: 4.25,
    marktprijs: 4.5,
    groep: "schaaldieren",
    toelichting: "Met de hand gepeld. Hier vraagt bijna iedereen om.",
  },
  {
    id: "noorse-garnalen",
    naam: "Noorse garnalen",
    prijs: 2.25,
    groep: "schaaldieren",
  },
  {
    id: "gamba-s",
    naam: "Gamba's",
    prijs: 3.75,
    groep: "schaaldieren",
  },
  {
    id: "surimi-krab",
    naam: "Surimi krab",
    // EIGENAAR: nog jouw prijs invullen. Bewust geen supermarktprijs als
    // ijkpunt genomen — dat is een ander product en een andere kwaliteit.
    prijs: 1.5,
    groep: "schaaldieren",
  },
  {
    id: "creuse-oesters",
    naam: "Creuse oesters",
    prijs: 15.95,
    perStuk: "dozijn",
    groep: "schaaldieren",
    toelichting: "Ongeopend mee, met mesje. Openen doen we ook — zeg het erbij.",
  },

  /* ── Hollandse klassiekers ──────────────────────────────────────────────── */
  {
    id: "haringhapjes",
    naam: "Haringhapjes met ui",
    prijs: 2.75,
    groep: "hollands",
  },
  {
    id: "zure-haring",
    naam: "Zure haring en rolmops",
    prijs: 2.5,
    groep: "hollands",
  },
  {
    id: "gerookte-bokking",
    naam: "Gerookte bokking",
    prijs: 2.25,
    groep: "hollands",
  },

  /* ── Salades ────────────────────────────────────────────────────────────── */
  { id: "zalmsalade", naam: "Zalmsalade", prijs: 2.25, groep: "salades" },
  { id: "krabsalade", naam: "Krabsalade", prijs: 2.5, groep: "salades" },
  { id: "tonijnsalade", naam: "Tonijnsalade", prijs: 2.25, groep: "salades" },

  /* ── Erbij ──────────────────────────────────────────────────────────────── */
  {
    id: "sauzen",
    naam: "Sauzen: ravigote en cocktail",
    prijs: 4.5,
    perStuk: "set van 3",
    groep: "erbij",
  },
];

export const GROEP_VOLGORDE: Groep[] = [
  "gerookt",
  "schaaldieren",
  "hollands",
  "salades",
  "erbij",
];

export function onderdeelById(id: string): Onderdeel | undefined {
  return ONDERDELEN.find((o) => o.id === id);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Rekenen
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * De extra's die de klant koos.
 * Bij producten op gewicht is de waarde het aantal grammen (stappen van 100).
 * Bij producten per stuk is het simpelweg het aantal.
 */
export type Keuze = Record<string, number>;

/** Wat de klant heeft samengesteld: één schaal, plus wat hij erbij koos. */
export interface Samenstelling {
  /** `null` zolang er nog geen schaal is gekozen. */
  schaal: string | null;
  /** Gewenst aantal personen; de server begrenst dit op de gekozen schaal. */
  personen?: number;
  extras: Keuze;
}

export const LEGE_SAMENSTELLING: Samenstelling = { schaal: null, extras: {} };

export interface Regel {
  id: string;
  naam: string;
  /** Grammen bij gewicht, aantal bij stuks, 1 bij de schaal zelf. */
  hoeveelheid: number;
  perStuk?: string;
  bedrag: number;
  /** De schaal zelf, in plaats van een extra. */
  isSchaal?: boolean;
  personen?: number;
}

/** De schaal en de extra's als één lijst regels, de schaal voorop. */
export function regels(samen: Samenstelling): Regel[] {
  const uit: Regel[] = [];

  const schaal = samen.schaal ? schaalById(samen.schaal) : undefined;
  if (schaal) {
    uit.push({
      id: schaal.id,
      naam: schaal.naam,
      hoeveelheid: Math.max(schaal.personenVan, Math.min(schaal.personenTot, Math.floor(samen.personen ?? schaal.personenVan))),
      personen: Math.max(schaal.personenVan, Math.min(schaal.personenTot, Math.floor(samen.personen ?? schaal.personenVan))),
      bedrag: PRIJS_PER_PERSOON * Math.max(schaal.personenVan, Math.min(schaal.personenTot, Math.floor(samen.personen ?? schaal.personenVan))),
      isSchaal: true,
    });
  }

  return uit;
}

export function totaal(samen: Samenstelling): number {
  // Optellen van kommagetallen levert anders 46.650000000000006 op.
  return Math.round(regels(samen).reduce((som, r) => som + r.bedrag, 0) * 100) / 100;
}

/** Wat er aan extra's bovenop de schaal komt. */
export function extrasTotaal(samen: Samenstelling): number {
  void samen;
  return 0;
}

/** Het gewicht van de extra's — stuks en de schaal zelf tellen niet mee. */
export function extrasGewicht(samen: Samenstelling): number {
  void samen;
  return 0;
}

/**
 * Voor hoeveel personen dit ongeveer volstaat.
 *
 * De schaal zegt zelf voor hoeveel mensen hij is; extra's tellen daarbovenop
 * mee met de vuistregel voor een borrelschaal. Bij twijfel de laagste kant van
 * de reeks: liever te veel vis dan een lege schaal.
 */
export function personen(samen: Samenstelling): number {
  const schaal = samen.schaal ? schaalById(samen.schaal) : undefined;
  if (!schaal) return 0;
  return Math.max(schaal.personenVan, Math.min(schaal.personenTot, Math.floor(samen.personen ?? schaal.personenVan)));
}

/** Prijs per persoon, om te vergelijken met de pakketprijzen van anderen. */
export function prijsPerPersoon(samen: Samenstelling): number | null {
  const aantal = personen(samen);
  if (aantal < 1) return null;
  return PRIJS_PER_PERSOON;
}

/** "300 g", "2 × dozijn" of "1 schaal" — leesbaar gezet. */
export function hoeveelheidTekst(regel: Regel): string {
  if (regel.isSchaal) return `${regel.personen ?? regel.hoeveelheid} personen`;
  if (regel.perStuk) return `${regel.hoeveelheid}× ${regel.perStuk}`;
  return regel.hoeveelheid >= 1000
    ? `${(regel.hoeveelheid / 1000).toFixed(1).replace(".", ",")} kg`
    : `${regel.hoeveelheid} g`;
}
