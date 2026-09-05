/**
 * Bezorging — gebied, kosten, dagen en voorwaarden.
 *
 * ┌─ EIGENAAR ────────────────────────────────────────────────────────────────┐
 * │ Alles wat je over bezorgen wilt wijzigen staat in dít bestand. Bedragen,  │
 * │ bezorgdagen, uiterste besteltijd en het bezorggebied. Pas je hier iets    │
 * │ aan, dan verandert het op de hele site: de bezorgpagina's, het            │
 * │ bestelformulier, de postcodecheck én de gegevens die Google uitleest.     │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Wat we bezorgen is bewust beperkt: verse vis en visschalen. Gebakken vis
 * (kibbeling, lekkerbek) gaat niet mee de weg op — dat is binnen twintig
 * minuten slap en dan verkoop je iets wat je zelf niet zou eten. Die haal je op
 * in de winkel.
 */

/* ═══════════════════════════════════════════════════════════════════════════
   Kosten en drempels
   ═══════════════════════════════════════════════════════════════════════════ */

export const BEZORGING = {
  /** Minimaal bestelbedrag voor bezorging (exclusief bezorgkosten). */
  minimumBedrag: 25,

  /**
   * Bezorgkosten. Eén tarief voor het hele gebied — de rit naar Wassenaar duurt
   * langer dan die naar de Merenwijk, maar drie verschillende tarieven op een
   * site kost meer uitleg dan het oplevert.
   */
  standaardKosten: 5.99,

  /** Vanaf dit bedrag vervallen de bezorgkosten. */
  gratisVanaf: 35,

  /** Bezorgdagen. 0 = zondag … 6 = zaterdag. */
  bezorgdagen: [3, 4, 5, 6] as const, // woensdag t/m zaterdag

  /** Uiterste besteltijd voor bezorging de volgende bezorgdag. */
  uitersteBesteltijd: "12:00",

  /** Tijdvakken waaruit de klant kiest. */
  tijdvakken: ["09:00 – 12:00", "12:00 – 15:00", "15:00 – 18:00"] as const,

  /** Afhalen is gratis en kan op elke openingsdag. */
  afhaalKosten: 0,
} as const;

export const BEZORGDAG_NAMEN = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];

/** "woensdag t/m zaterdag" of "woensdag, vrijdag en zaterdag" — leesbaar gezet. */
export function bezorgdagenTekst(): string {
  const dagen = [...BEZORGING.bezorgdagen].sort((a, b) => a - b);
  const aaneengesloten = dagen.every((d, i) => i === 0 || d === dagen[i - 1] + 1);
  if (aaneengesloten && dagen.length > 2) {
    return `${BEZORGDAG_NAMEN[dagen[0]]} t/m ${BEZORGDAG_NAMEN[dagen[dagen.length - 1]]}`;
  }
  const namen = dagen.map((d) => BEZORGDAG_NAMEN[d]);
  return `${namen.slice(0, -1).join(", ")} en ${namen[namen.length - 1]}`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Bezorggebied
   ───────────────────────────────────────────────────────────────────────────
   Vijf gemeenten. Elke gemeente krijgt een eigen pagina (/bezorgen/<slug>),
   omdat mensen niet zoeken op "vis bezorgen" maar op "vis bezorgen Wassenaar".
   De wijknamen staan er niet voor de sier: daarmee wordt zo'n pagina gevonden
   op zoekopdrachten die de concurrentie laat liggen.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Gemeente {
  slug: string;
  naam: string;
  /** Postcodecijfers die bij deze gemeente horen, als [van, tot] inclusief. */
  postcodes: [number, number][];
  /**
   * Alleen invullen als deze gemeente écht een ander tarief krijgt. Normaal
   * geldt `BEZORGING.standaardKosten` overal.
   */
  kosten?: number;
  /** Reistijd vanaf de Herenstraat — eerlijk, geen marketing. */
  rijtijd: string;
  /** Wijken en buurten waar we komen. */
  wijken: string[];
  /** Eén zin die deze gemeente onderscheidt — geen algemene vulling. */
  intro: string;
}

export const GEMEENTEN: Gemeente[] = [
  {
    slug: "leiden",
    naam: "Leiden",
    postcodes: [[2311, 2334]],
    rijtijd: "10 tot 20 minuten",
    wijken: [
      "Binnenstad",
      "Pieterswijk",
      "Maredorp",
      "Leiden-Noord",
      "Merenwijk",
      "Stevenshof",
      "Professorenwijk",
      "Vogelwijk",
      "Roodenburgerdistrict",
      "Cronestein",
      "Boshuizen",
      "Zuidwest",
    ],
    intro:
      "Onze eigen stad. De winkel staat op de Herenstraat, dus in Leiden is de vis vaak binnen een half uur na het inpakken bij u aan de deur.",
  },
  {
    slug: "leiderdorp",
    naam: "Leiderdorp",
    postcodes: [[2350, 2354]],
    rijtijd: "15 minuten",
    wijken: [
      "Oude Dorp",
      "Binnenhof",
      "Buitenhof",
      "Voorhof",
      "Leyhof",
      "Ouderzorg",
      "Driegatenbrug",
    ],
    intro:
      "Over de Zijl en u bent er. Veel Leiderdorpers staan al jaren op zaterdag bij onze kraam op de Nieuwe Rijn — nu hoeft dat niet meer.",
  },
  {
    slug: "voorschoten",
    naam: "Voorschoten",
    postcodes: [[2250, 2254]],
    rijtijd: "15 minuten",
    wijken: [
      "Centrum",
      "Noord-Hofland",
      "Vlietwijk",
      "Krimwijk",
      "Boschgeest",
      "Adegeest",
      "Starrenburg",
    ],
    intro:
      "In Voorschoten staan we elke vrijdag bij Hoogvliet. Wie er dan niet uitkomt, laat de vis voortaan gewoon thuisbezorgen.",
  },
  {
    slug: "wassenaar",
    naam: "Wassenaar",
    postcodes: [[2240, 2245]],
    rijtijd: "20 tot 25 minuten",
    wijken: [
      "Centrum",
      "Oostdorp",
      "Kerkehout",
      "Deijleroord",
      "Rijksdorp",
      "Zijdeweg",
      "De Kieviet",
    ],
    intro:
      "Wassenaar is onze verste bestemming en de rit gaat door de duinen. We rijden hier met een vaste route, tegen hetzelfde tarief als de rest.",
  },
  {
    slug: "leidschendam",
    naam: "Leidschendam",
    postcodes: [[2260, 2266]],
    rijtijd: "20 tot 25 minuten",
    wijken: [
      "Damcentrum",
      "Leidschendam-Noord",
      "Prinsenhof",
      "De Heuvel",
      "Amstelwijk",
      "Essesteijn",
      "Duivenvoorde",
    ],
    intro:
      "Langs de Vliet naar Leidschendam. We bezorgen in heel Leidschendam, van het Damcentrum tot Essesteijn.",
  },
];

export function gemeenteBySlug(slug: string): Gemeente | undefined {
  return GEMEENTEN.find((g) => g.slug === slug);
}

/** Bezorgkosten voor een gemeente — valt terug op het standaardtarief. */
export function kostenVoor(gemeente: Gemeente): number {
  return gemeente.kosten ?? BEZORGING.standaardKosten;
}

/**
 * Het laagste en hoogste tarief. Zolang elke gemeente hetzelfde kost zijn die
 * gelijk; de functie blijft bestaan zodat één afwijkend tarief later geen
 * zoekactie door de hele site wordt.
 */
export function kostenBereik(): { laag: number; hoog: number } {
  const alle = GEMEENTEN.map(kostenVoor);
  return { laag: Math.min(...alle), hoog: Math.max(...alle) };
}

/** Waar de klant nog vandaan moet komen voor gratis bezorging. 0 = gehaald. */
export function tekortVoorGratis(bedrag: number): number {
  return Math.max(0, Math.round((BEZORGING.gratisVanaf - bedrag) * 100) / 100);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Postcodecheck
   ═══════════════════════════════════════════════════════════════════════════ */

export type PostcodeResultaat =
  | { status: "ongeldig" }
  | { status: "buiten" }
  | { status: "binnen"; gemeente: Gemeente; kosten: number };

/**
 * Controleert of een postcode in het bezorggebied valt.
 * Accepteert "2313AL", "2313 al" en "2313" — alleen de vier cijfers tellen.
 */
export function checkPostcode(invoer: string): PostcodeResultaat {
  const cijfers = invoer.replace(/\s/g, "").slice(0, 4);
  if (!/^\d{4}$/.test(cijfers)) return { status: "ongeldig" };

  const nummer = Number(cijfers);
  const gemeente = GEMEENTEN.find((g) =>
    g.postcodes.some(([van, tot]) => nummer >= van && nummer <= tot)
  );

  if (!gemeente) return { status: "buiten" };
  return { status: "binnen", gemeente, kosten: kostenVoor(gemeente) };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Wat gaat er mee de weg op?
   ───────────────────────────────────────────────────────────────────────────
   Alleen verse vis en visschalen. Wil je later ook gerookte vis of salades
   laten bezorgen, zet de categorie dan hieronder erbij.
   ═══════════════════════════════════════════════════════════════════════════ */

export const BEZORGBARE_CATEGORIEEN = ["verse-vis"] as const;

export function isBezorgbaar(categorie: string): boolean {
  return (BEZORGBARE_CATEGORIEEN as readonly string[]).includes(categorie);
}

/** Eerstvolgende bezorgdag vanaf een datum, rekening houdend met de besteltijd. */
export function eersteBezorgdag(vanaf: Date = new Date()): Date {
  const uur = vanaf.getHours();
  const minuut = vanaf.getMinutes();
  const [grensUur, grensMinuut] = BEZORGING.uitersteBesteltijd.split(":").map(Number);
  const naDeadline = uur > grensUur || (uur === grensUur && minuut >= grensMinuut);

  const dag = new Date(vanaf);
  dag.setDate(dag.getDate() + (naDeadline ? 2 : 1));

  for (let i = 0; i < 7; i++) {
    if ((BEZORGING.bezorgdagen as readonly number[]).includes(dag.getDay())) return dag;
    dag.setDate(dag.getDate() + 1);
  }
  return dag;
}
