/**
 * Alle foto's die de site wil hebben, op één plek.
 *
 * ┌─ EIGENAAR ────────────────────────────────────────────────────────────────┐
 * │ Hieronder staat elke plek waar een foto hoort, met erbij wat erop moet     │
 * │ staan. Zet je foto in `public/images/` en vul het pad in bij `bestand`.    │
 * │ Meer hoef je niet te doen: de foto verschijnt dan overal waar die plek     │
 * │ gebruikt wordt.                                                            │
 * │                                                                            │
 * │ Zolang `bestand` leeg is wordt het fotovak niet getoond. Echte winkel-    │
 * │ en historische foto's blijven gereserveerd voor eigenaarfoto's.          │
 * │                                                                            │
 * │ Formaat: zie `verhouding`. Met de telefoon is prima, maar zorg dat het     │
 * │ licht is: bij de toonbank staan, niet ertegenin fotograferen.              │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

export type Verhouding = "vierkant" | "liggend" | "portret" | "breed";

export interface Beeldplek {
  /** Waar de foto op de site terechtkomt. */
  waar: string;
  /** Wat erop moet staan. Dit is de opdracht aan de fotograaf. */
  wat: string;
  /** Pad in `public/`, bijvoorbeeld "/images/winkel-gevel.jpg". Leeg = nog geen foto. */
  bestand: string;
  /** Alt-tekst. Beschrijvend en lokaal — dat leest Google mee. */
  alt: string;
  verhouding: Verhouding;
  /** Intern label voor een nog ontbrekende eigenaarfoto. */
  terugval: string;
}

export const BEELD = {
  /* ── Het logo ──────────────────────────────────────────────────────────── */
  logoBadge: {
    waar: "Homepage, Ons verhaal en de voet",
    wat: "Het ronde Schaap's Vis-logo zoals het op de gevel en de kraam staat, vrijstaand op wit of transparant (PNG of SVG).",
    bestand: "",
    alt: "Logo van Schaap's Vishandel in Leiden, sinds 1938",
    verhouding: "vierkant",
    terugval: "Schaap's Vis",
  },
  logoLiggend: {
    waar: "De kop van elke pagina",
    wat: "Liggende versie van hetzelfde logo: de vis links, 'Schaap's Vis' ernaast. Als die niet bestaat, laat het dan leeg — dan blijft de naam in letters staan, en dat is beter dan een ronde badge die de kop uit elkaar duwt.",
    bestand: "",
    alt: "Schaap's Vishandel, Leiden",
    verhouding: "breed",
    terugval: "Schaap's Vishandel",
  },

  /* ── De zaak ───────────────────────────────────────────────────────────── */
  winkelGevel: {
    waar: "Homepage (de grote foto bovenaan) en Bezoek ons",
    wat: "De winkel van buiten, met de gevel en het uithangbord herkenbaar. Liefst met daglicht en een stukje Herenstraat erbij.",
    bestand: "",
    alt: "De winkel van Schaap's Vishandel aan de Herenstraat 48 in Leiden",
    verhouding: "liggend",
    terugval: "Herenstraat 48, Leiden",
  },
  toonbank: {
    waar: "Homepage en Contact",
    wat: "De toonbank met vis erop, van dichtbij. Dit is de belangrijkste foto van de hele site: hier ziet iemand wat hij koopt.",
    bestand: "/images/producten/kabeljauw.png",
    alt: "Verse kabeljauw uit het assortiment",
    verhouding: "liggend",
    terugval: "De toonbank",
  },
  achterDeToonbank: {
    waar: "Contact, naast het telefoonnummer",
    wat: "Iemand van de zaak achter de toonbank, gewoon aan het werk. Geen poseren. Dit maakt bellen persoonlijker.",
    bestand: "",
    alt: "Achter de toonbank bij Schaap's Vishandel in Leiden",
    verhouding: "vierkant",
    terugval: "Wij staan klaar",
  },
  gebakkenVis: {
    waar: "Homepage, het blok over gebakken vis",
    wat: "Verse kibbeling of lekkerbek, warm, net uit de pan. Bij voorkeur in het bakje zoals de klant het meekrijgt.",
    bestand: "/images/editorial/kibbeling.webp",
    alt: "Krokante kibbeling met saus",
    verhouding: "liggend",
    terugval: "Kibbeling en lekkerbek",
  },

  /* ── De kramen ─────────────────────────────────────────────────────────── */
  marktZaterdag: {
    waar: "Bezoek ons en Marktkramen",
    wat: "De kraam op de Aalmarkt, met de Waag herkenbaar op de achtergrond. Zo weet iemand waar hij moet zoeken.",
    bestand: "",
    alt: "De viskraam van Schaap's op de Aalmarkt bij de Waag in Leiden",
    verhouding: "liggend",
    terugval: "Aalmarkt, bij de Waag",
  },
  marktWoensdag: {
    waar: "Bezoek ons en Marktkramen",
    wat: "De kraam op woensdag, met genoeg van de omgeving erop om hem terug te vinden.",
    bestand: "",
    alt: "De viskraam van Schaap's op de woensdagmarkt in Leiden",
    verhouding: "liggend",
    terugval: "Woensdagmarkt Leiden",
  },
  marktVoorschoten: {
    waar: "Bezoek ons, Marktkramen en Viswinkel Voorschoten",
    wat: "De kraam op de parkeerplaats bij Hoogvliet in Voorschoten.",
    bestand: "",
    alt: "De viskraam van Schaap's bij Hoogvliet in Voorschoten",
    verhouding: "liggend",
    terugval: "Bij Hoogvliet, Voorschoten",
  },

  /* ── De geschiedenis ───────────────────────────────────────────────────── */
  /* Hier zit de meeste winst. Eén vergeelde foto uit 1960 doet meer voor de
     geloofwaardigheid dan twintig keer "sinds 1938" in de tekst. */
  historie1938: {
    waar: "Ons verhaal, bij 1938",
    wat: "De oudste foto die je hebt: de winkel, de viskar, Gerrit Schaap, een oud prijsbord. Scheef, korrelig of vergeeld mag — dat maakt het juist echt.",
    bestand: "",
    alt: "Schaap's Vishandel in Leiden rond de oprichting in 1938",
    verhouding: "liggend",
    terugval: "1938",
  },
  historie1960: {
    waar: "Ons verhaal, bij 1957–1960",
    wat: "Cor Haasnoot, de winkel of de markt in de jaren vijftig of zestig.",
    bestand: "",
    alt: "Schaap's Vishandel in Leiden in de jaren zestig",
    verhouding: "liggend",
    terugval: "1960",
  },
  historie1980: {
    waar: "Ons verhaal, bij 1980",
    wat: "De zaak, de kraam of het gezin in de jaren tachtig.",
    bestand: "",
    alt: "Schaap's Vishandel in Leiden in de jaren tachtig",
    verhouding: "liggend",
    terugval: "1980",
  },
  historie2000: {
    waar: "Ons verhaal, bij 2000–2009",
    wat: "Aldert Haasnoot in de winkel, rond de tijd dat hij de zaak overnam.",
    bestand: "",
    alt: "Aldert Haasnoot in de winkel van Schaap's Vishandel in Leiden",
    verhouding: "liggend",
    terugval: "2009",
  },
  historieNu: {
    waar: "Ons verhaal, bij Vandaag",
    wat: "De zaak zoals hij er nu bij staat, met het team erbij.",
    bestand: "",
    alt: "Het team van Schaap's Vishandel in Leiden vandaag",
    verhouding: "liggend",
    terugval: "Vandaag",
  },

  /* ── De drie visschalen ────────────────────────────────────────────────── */
  /* Geen algemene plaat van vis: een foto van precies díe schaal, zoals jullie
     hem opmaken. Iemand moet het gevoel hebben dat hij naar de toonbank kijkt. */
  schaalBorrel: {
    waar: "Visschalen en de homepage",
    wat: "De borrelschaal zoals jullie hem echt maken, van bovenaf, op een neutrale ondergrond.",
    bestand: "/images/editorial/visschaal-inspiratie.webp",
    alt: "Serveerinspiratie: visschaal met gerookte vis, garnalen en salades",
    verhouding: "vierkant",
    terugval: "Borrelschaal",
  },
  schaalFamilie: {
    waar: "Visschalen",
    wat: "De familieschaal, dezelfde opzet en dezelfde belichting als de andere twee.",
    bestand: "",
    alt: "Familieschaal van Schaap's Vishandel in Leiden",
    verhouding: "vierkant",
    terugval: "Familieschaal",
  },
  schaalFeest: {
    waar: "Visschalen",
    wat: "De feestschaal, dezelfde opzet en dezelfde belichting als de andere twee.",
    bestand: "",
    alt: "Feestschaal van Schaap's Vishandel in Leiden",
    verhouding: "vierkant",
    terugval: "Feestschaal",
  },

  /* ── Varlaks ───────────────────────────────────────────────────────────── */
  varlaksFilet: {
    waar: "De Varlaks-pagina",
    wat: "Een Varlaks-filet op jullie eigen toonbank. Niet de persfoto van de kweker: die van jullie is geloofwaardiger.",
    bestand: "",
    alt: "Varlaks biologische zalmfilet bij Schaap's Vishandel in Leiden",
    verhouding: "liggend",
    terugval: "Varlaks zalmfilet",
  },
} as const satisfies Record<string, Beeldplek>;

export type BeeldNaam = keyof typeof BEELD;

/** Hoeveel foto's er nog ontbreken — gebruikt in OVERDRACHT.md en de controle. */
export function ontbrekendeBeelden(): BeeldNaam[] {
  return (Object.keys(BEELD) as BeeldNaam[]).filter((naam) => BEELD[naam].bestand === "");
}
