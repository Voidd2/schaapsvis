/**
 * De visschaal: drie schalen om uit te kiezen, en daarbovenop wat de klant zelf
 * toevoegt.
 *
 * Zo werkt het in de winkel ook: je wijst een schaal aan, en dan zegt iemand
 * "doe er nog wat extra garnalen bij". De schaal heeft een startbedrag, de
 * extra's gaan per 100 gram (een paar dingen per stuk).
 *
 * ┌─ EIGENAAR ────────────────────────────────────────────────────────────────┐
 * │ 1. `SCHALEN` hieronder: drie schalen met een naam, een startbedrag, voor  │
 * │    hoeveel personen, en wat erop ligt. Alles wat daar staat is voorlopig  │
 * │    behalve het bedrag van de kleinste — vervang het door jouw eigen       │
 * │    schalen zodra je ze hebt bepaald.                                      │
 * │ 2. De foto per schaal staat in `src/lib/beeld.ts`, samen met alle andere  │
 * │    foto's van de site. Zonder foto toont de site een naamvlak.            │
 * │ 3. `ONDERDELEN`: de extra's, in euro per 100 gram.                        │
 * │ 4. Zet `PRIJZEN_DEFINITIEF` op `true` zodra alles klopt. Tot die tijd zet │
 * │    de site erbij dat het richtprijzen zijn.                               │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ── Waar de prijzen op gebaseerd zijn ──────────────────────────────────────
 *
 * Uitgangspunt: per persoon onder de markt zitten, en dat kunnen navertellen.
 * Vergeleken wordt alleen met ándere vishandels. Supermarkten tellen niet mee:
 * dat is een ander product en een andere kwaliteit, en dus geen eerlijke maat.
 *
 * Complete schotels bij andere vishandels, per persoon (september 2026):
 *
 *   Puurvis, Leidschendam        € 14,50   ← ligt in ons bezorggebied
 *   Puurvis hors d'oeuvre        € 16,95
 *   Fieret                       € 19,95 / € 29,95 / € 33,95
 *   Koelewijn                    € 28,50 / € 30,00
 *   Dirks, luxe 10–14 personen   € 160 per schaal (≈ € 11–16 p.p.)
 *
 * Prijzen per 100 gram bij andere vishandels, voor de extra's:
 *
 *   Gerookte zalm        € 3,50 (Visspecialist Andre) · € 4,29 (Vismarine)
 *   Hollandse garnalen   € 4,50 (Andre) · € 6,49 (Vismarine)
 *   Gerookte paling      € 5,50 (Andre) · € 7,00 (Stevens) · € 10,50 (Krol)
 *   Gerookte makreel     € 2,75 (Andre) · € 5,50 (Peter Tol)
 */

export const PRIJZEN_DEFINITIEF = false;

/** Wat we bij de concurrentie zagen, zodat de site het kan laten zien. */
export const MARKT = {
  /** Goedkoopste complete schotel per persoon die we in de regio vonden. */
  goedkoopstePerPersoon: 14.5,
  concurrent: "Puurvis, Leidschendam",
  peildatum: "september 2026",
} as const;

/** Vuistregels om te bepalen hoeveel iemand nodig heeft. */
export const PORTIES = {
  /** Gram per persoon als borrelschaal, naast ander eten. */
  borrel: 150,
  /** Gram per persoon als de schaal de maaltijd is. */
  maaltijd: 250,
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   De drie schalen
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
  beeld: "schaalBorrel" | "schaalFamilie" | "schaalFeest";
}

/**
 * ┌─ EIGENAAR ────────────────────────────────────────────────────────────────┐
 * │ Dit zijn drie voorbeelden om de site mee te kunnen bouwen. Alleen het     │
 * │ startbedrag van de kleinste (€ 55,90) is wat je hebt doorgegeven; de      │
 * │ andere twee bedragen, de namen en alles wat er op ligt zijn ingevuld om   │
 * │ te laten zien hoe het eruitziet. Vervang ze door je eigen schalen.        │
 * └───────────────────────────────────────────────────────────────────────────┘
 */
export const SCHALEN: Schaal[] = [
  {
    id: "borrelschaal",
    naam: "Borrelschaal",
    beeld: "schaalBorrel",
    prijs: 55.9,
    personenVan: 4,
    personenTot: 6,
    omschrijving:
      "De schaal waar de meeste mensen om vragen. Genoeg voor een borrel met vier tot zes man, naast ander eten.",
    bevat: [
      "Gerookte zalm van het mes",
      "Hollandse garnalen, met de hand gepeld",
      "Haringhapjes met ui",
      "Gerookte makreelfilet",
      "Huisgemaakte zalm- en krabsalade",
      "Sauzen: ravigote en cocktail",
    ],
  },
  {
    id: "familieschaal",
    naam: "Familieschaal",
    beeld: "schaalFamilie",
    // EIGENAAR: jouw bedrag hier.
    prijs: 89.9,
    personenVan: 8,
    personenTot: 10,
    omschrijving:
      "Dezelfde opzet, ruimer gevuld, met gerookte paling erbij. Voor een verjaardag of een zondag met de familie.",
    bevat: [
      "Alles van de borrelschaal, ruimer gesneden",
      "Gerookte paling",
      "Gravad lax",
      "Noorse garnalen",
      "Zure haring en rolmops",
      "Sauzen: ravigote en cocktail",
    ],
  },
  {
    id: "feestschaal",
    naam: "Feestschaal",
    beeld: "schaalFeest",
    // EIGENAAR: jouw bedrag hier.
    prijs: 139.9,
    personenVan: 12,
    personenTot: 16,
    omschrijving:
      "De grote schaal, met oesters en gamba's. Voor de kerstdagen, een receptie of een groot gezelschap.",
    bevat: [
      "Alles van de familieschaal",
      "Creuse oesters, ongeopend met mesje",
      "Gamba's",
      "Surimi krab",
      "Gerookte bokking",
      "Sauzen: ravigote en cocktail",
    ],
  },
];

export function schaalById(id: string): Schaal | undefined {
  return SCHALEN.find((s) => s.id === id);
}

/** Het bedrag waar de site "vanaf" mee adverteert. */
export const VANAF_BEDRAG = Math.min(...SCHALEN.map((s) => s.prijs));

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
}

/** De schaal en de extra's als één lijst regels, de schaal voorop. */
export function regels(samen: Samenstelling): Regel[] {
  const uit: Regel[] = [];

  const schaal = samen.schaal ? schaalById(samen.schaal) : undefined;
  if (schaal) {
    uit.push({
      id: schaal.id,
      naam: schaal.naam,
      hoeveelheid: 1,
      bedrag: schaal.prijs,
      isSchaal: true,
    });
  }

  for (const [id, hoeveelheid] of Object.entries(samen.extras)) {
    const onderdeel = onderdeelById(id);
    if (!onderdeel || hoeveelheid <= 0) continue;
    uit.push({
      id,
      naam: onderdeel.naam,
      hoeveelheid,
      perStuk: onderdeel.perStuk,
      bedrag: onderdeel.perStuk
        ? onderdeel.prijs * hoeveelheid
        : (onderdeel.prijs * hoeveelheid) / 100,
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
  return Math.round(
    regels(samen)
      .filter((r) => !r.isSchaal)
      .reduce((som, r) => som + r.bedrag, 0) * 100
  ) / 100;
}

/** Het gewicht van de extra's — stuks en de schaal zelf tellen niet mee. */
export function extrasGewicht(samen: Samenstelling): number {
  return regels(samen)
    .filter((r) => !r.isSchaal && !r.perStuk)
    .reduce((som, r) => som + r.hoeveelheid, 0);
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
  return schaal.personenVan + Math.floor(extrasGewicht(samen) / PORTIES.borrel);
}

/** Prijs per persoon, om te vergelijken met de pakketprijzen van anderen. */
export function prijsPerPersoon(samen: Samenstelling): number | null {
  const aantal = personen(samen);
  if (aantal < 1) return null;
  return totaal(samen) / aantal;
}

/** "300 g", "2 × dozijn" of "1 schaal" — leesbaar gezet. */
export function hoeveelheidTekst(regel: Regel): string {
  if (regel.isSchaal) return "1×";
  if (regel.perStuk) return `${regel.hoeveelheid}× ${regel.perStuk}`;
  return regel.hoeveelheid >= 1000
    ? `${(regel.hoeveelheid / 1000).toFixed(1).replace(".", ",")} kg`
    : `${regel.hoeveelheid} g`;
}
