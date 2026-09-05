/**
 * De visschaal: de klant kiest zelf wat erop komt en hoeveel, per 100 gram.
 *
 * Er is geen startbedrag en geen vaste samenstelling meer. Dat is bewust: bij
 * vrijwel elke concurrent koop je een pakket per persoon en betaal je dus ook
 * voor de paling waar je niet van houdt. Hier reken je alleen af wat je kiest.
 *
 * ┌─ EIGENAAR ────────────────────────────────────────────────────────────────┐
 * │ Alle prijzen staan hieronder in `ONDERDELEN`, in euro per 100 gram. Pas   │
 * │ ze aan wanneer je inkoop verandert; de configurator, het bestelformulier  │
 * │ en de prijsberekening lopen automatisch mee.                              │
 * │                                                                           │
 * │ Zet `PRIJZEN_DEFINITIEF` op `true` zodra je de bedragen hebt bevestigd.   │
 * │ Tot die tijd zet de site erbij dat het richtprijzen zijn.                 │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ── Waar de prijzen op gebaseerd zijn ──────────────────────────────────────
 *
 * Uitgangspunt: overal iets ónder de markt zitten, en dat kunnen navertellen.
 * Prijzen per 100 gram bij andere vishandels (opgehaald september 2026):
 *
 *   Gerookte zalm        € 3,50 (Visspecialist Andre) · € 4,29 (Vismarine)
 *                        · € 6,75 (Viswinkel Peter Tol, Amsterdam)
 *   Hollandse garnalen   € 4,50 (Andre) · € 6,49 (Vismarine)
 *   Gerookte paling      € 5,50 (Andre) · € 7,00 (Stevens) · € 10,50 (Krol)
 *   Gerookte makreel     € 2,75 (Andre) · € 5,50 (Peter Tol)
 *
 * En complete schotels, per persoon:
 *
 *   Puurvis, Leidschendam        € 14,50   ← ligt in ons bezorggebied
 *   Puurvis hors d'oeuvre        € 16,95
 *   Fieret                       € 19,95 / € 29,95 / € 33,95
 *   Koelewijn                    € 28,50 / € 30,00
 *   Dirks, luxe 10–14 personen   € 160 per schaal (≈ € 11–16 p.p.)
 *
 * Daarom rekent de configurator ook een prijs per persoon uit: zo ziet een
 * klant zwart-op-wit dat hij hier onder die € 14,50 uitkomt.
 */

export const PRIJZEN_DEFINITIEF = false;

/** Wat we bij de concurrentie zagen, zodat de site het kan laten zien. */
export const MARKT = {
  /** Goedkoopste complete schotel per persoon die we in de regio vonden. */
  goedkoopstePerPersoon: 14.5,
  concurrent: "Puurvis, Leidschendam",
  peildatum: "september 2026",
} as const;

/** Onder dit bedrag is het geen schaal maar een portie vis uit de winkel. */
export const MINIMUM_BEDRAG = 25;

/** Vuistregels om te bepalen hoeveel iemand nodig heeft. */
export const PORTIES = {
  /** Gram per persoon als borrelschaal, naast ander eten. */
  borrel: 150,
  /** Gram per persoon als de schaal de maaltijd is. */
  maaltijd: 250,
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   Wat er op kan
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
    id: "varlaks",
    naam: "Varlaks — biologische gerookte zalm",
    prijs: 4.95,
    groep: "gerookt",
    toelichting:
      "Van familiebedrijven boven de poolcirkel, zonder antibiotica. Steviger van structuur, zuiverder van smaak.",
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
  {
    id: "gerookte-heilbot",
    naam: "Gerookte heilbot",
    prijs: 4.75,
    groep: "gerookt",
    toelichting: "Vet, mild en wit — het mooiste uit de rokerij.",
  },
  {
    id: "gerookte-forel",
    naam: "Gerookte forelfilet",
    prijs: 2.75,
    groep: "gerookt",
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
    id: "coquilles",
    naam: "Coquilles",
    prijs: 5.5,
    groep: "schaaldieren",
  },
  {
    id: "rivierkreeft",
    naam: "Rivierkreeftstaartjes",
    prijs: 3.25,
    groep: "schaaldieren",
  },
  {
    id: "krabklauwen",
    naam: "Krabklauwen",
    prijs: 3.95,
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
  {
    id: "halve-kreeft",
    naam: "Halve kreeft",
    prijs: 23.5,
    perStuk: "halve kreeft",
    groep: "schaaldieren",
    toelichting: "Minstens drie dagen vooruit bestellen.",
  },

  /* ── Hollandse klassiekers ──────────────────────────────────────────────── */
  {
    id: "haringhapjes",
    naam: "Haringhapjes met ui",
    prijs: 2.75,
    groep: "hollands",
    seizoen: "Hollandse Nieuwe vanaf juni",
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
  { id: "garnalensalade", naam: "Garnalensalade", prijs: 2.75, groep: "salades" },
  { id: "tonijnsalade", naam: "Tonijnsalade", prijs: 2.25, groep: "salades" },

  /* ── Erbij ──────────────────────────────────────────────────────────────── */
  {
    id: "garnering",
    naam: "Opgemaakt op een schaal",
    prijs: 7.5,
    perStuk: "schaal",
    groep: "erbij",
    toelichting: "Met citroen, dille en garnering, in plaats van in de doos.",
  },
  {
    id: "brood",
    naam: "Vers brood en roomboter",
    prijs: 4.95,
    perStuk: "voor 6 personen",
    groep: "erbij",
  },
  {
    id: "sauzen",
    naam: "Sauzen: ravigote, cocktail en dille-mosterd",
    prijs: 4.5,
    perStuk: "set van 3",
    groep: "erbij",
  },
  {
    id: "bestek",
    naam: "Bordjes, bestek en servetten",
    prijs: 3.95,
    perStuk: "set van 6",
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
 * De keuze van de klant.
 * Bij producten op gewicht is de waarde het aantal grammen (stappen van 100).
 * Bij producten per stuk is het simpelweg het aantal.
 */
export type Keuze = Record<string, number>;

export interface Regel {
  id: string;
  naam: string;
  /** Grammen bij gewicht, aantal bij stuks. */
  hoeveelheid: number;
  perStuk?: string;
  bedrag: number;
}

export function regels(keuze: Keuze): Regel[] {
  return Object.entries(keuze)
    .map((invoer): Regel | null => {
      const [id, hoeveelheid] = invoer;
      const onderdeel = onderdeelById(id);
      if (!onderdeel || hoeveelheid <= 0) return null;
      const bedrag = onderdeel.perStuk
        ? onderdeel.prijs * hoeveelheid
        : (onderdeel.prijs * hoeveelheid) / 100;
      return {
        id,
        naam: onderdeel.naam,
        hoeveelheid,
        perStuk: onderdeel.perStuk,
        bedrag,
      };
    })
    .filter((r): r is Regel => r !== null);
}

export function totaal(keuze: Keuze): number {
  return regels(keuze).reduce((som, r) => som + r.bedrag, 0);
}

/** Het gewicht van de schaal — stuks tellen niet mee. */
export function totaalGewicht(keuze: Keuze): number {
  return regels(keuze)
    .filter((r) => !r.perStuk)
    .reduce((som, r) => som + r.hoeveelheid, 0);
}

/** Voor hoeveel personen dit ongeveer volstaat, als borrelschaal. */
export function personenBorrel(keuze: Keuze): number {
  return Math.floor(totaalGewicht(keuze) / PORTIES.borrel);
}

/** Prijs per persoon, om te vergelijken met de pakketprijzen van anderen. */
export function prijsPerPersoon(keuze: Keuze): number | null {
  const personen = personenBorrel(keuze);
  if (personen < 1) return null;
  return totaal(keuze) / personen;
}

/** "300 g" of "2 × dozijn" — leesbaar gezet. */
export function hoeveelheidTekst(regel: Regel): string {
  if (regel.perStuk) {
    return `${regel.hoeveelheid}× ${regel.perStuk}`;
  }
  return regel.hoeveelheid >= 1000
    ? `${(regel.hoeveelheid / 1000).toFixed(1).replace(".", ",")} kg`
    : `${regel.hoeveelheid} g`;
}
