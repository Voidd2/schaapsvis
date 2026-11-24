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
  /** Visible caption describing the actual owner photo, when used in the hero. */
  bijschrift?: string;
  vertalingen?: Partial<Record<"en" | "de", { alt: string; bijschrift?: string }>>;
  verhouding: Verhouding;
  /** Intern label voor een nog ontbrekende eigenaarfoto. */
  terugval: string;
}

const standplaatsVoorschoten = {
  alt: "De viskraam van Schaap’s op de parkeerplaats bij Hoogvliet in Voorschoten",
  bijschrift: "Onze viskraam",
  vertalingen: {
    en: { alt: "Schaap’s fish stall in the Hoogvliet car park in Voorschoten", bijschrift: "Our fish stall" },
    de: { alt: "Der Fischstand von Schaap’s auf dem Parkplatz bei Hoogvliet in Voorschoten", bijschrift: "Unser Fischstand" },
  },
};

export const BEELD = {
  /* ── Het logo ──────────────────────────────────────────────────────────── */
  logoBadge: {
    waar: "Paginakop, voet en studentenpas",
    wat: "Het door de eigenaar goedgekeurde vernieuwde ronde Schaap's Vis-logo op wit.",
    bestand: "/images/brand/schaapsvis-logo-192.webp",
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
    bestand: "/images/schaaps/winkel-herenstraat.webp",
    alt: "De winkel van Schaap's Vishandel aan de Herenstraat 48 in Leiden",
    bijschrift: "Onze winkel · Herenstraat 48, Leiden",
    vertalingen: {
      en: { alt: "Schaap’s Vishandel shop at Herenstraat 48 in Leiden", bijschrift: "Our shop · Herenstraat 48, Leiden" },
      de: { alt: "Das Geschäft von Schaap’s Vishandel an der Herenstraat 48 in Leiden", bijschrift: "Unser Geschäft · Herenstraat 48, Leiden" },
    },
    verhouding: "liggend",
    terugval: "Herenstraat 48, Leiden",
  },
  hoogvlietVoorschoten: {
    waar: "Bezoek ons, bij de vrijdaglocatie in Voorschoten",
    wat: "Overzicht van de viskraam en de parkeerplaats bij Hoogvliet.",
    bestand: "/images/schaaps/parkeerplaats-viskraam-voorschoten.webp",
    ...standplaatsVoorschoten,
    verhouding: "liggend",
    terugval: "Hoogvliet in Voorschoten",
  },
  toonbank: {
    waar: "Homepage en Contact",
    wat: "De toonbank met vis erop, van dichtbij. Dit is de belangrijkste foto van de hele site: hier ziet iemand wat hij koopt.",
    bestand: "/images/producten-hd/kabeljauw.webp",
    alt: "Verse kabeljauw uit het assortiment",
    verhouding: "liggend",
    terugval: "De toonbank",
  },
  winkelToonbank: {
    waar: "Viswinkel Leiden",
    wat: "Verse vis in de vitrine van de winkel aan de Herenstraat.",
    bestand: "/images/schaaps/toonbank-herenstraat-leiden.webp",
    alt: "Hele vissen en visfilets in de toonbank aan de Herenstraat in Leiden",
    vertalingen: {
      en: { alt: "Whole fish and fish fillets in the display counter at Herenstraat in Leiden" },
      de: { alt: "Ganze Fische und Fischfilets in der Theke an der Herenstraat in Leiden" },
    },
    verhouding: "liggend",
    terugval: "Onze toonbank",
  },
  kraamToonbank: {
    waar: "Homepage en de fotogalerij van de viskraam in Voorschoten",
    wat: "De toonbank met haring, oesters en salades in de viskraam in Voorschoten.",
    bestand: "/images/schaaps/haring-oesters-viskraam-voorschoten.webp",
    alt: "Haring en oesters in de toonbank van de viskraam",
    vertalingen: {
      en: { alt: "Herring and oysters in the fish stall’s display counter" },
      de: { alt: "Hering und Austern in der Theke des Fischstands" },
    },
    verhouding: "liggend",
    terugval: "Onze toonbank",
  },
  oestersInDeWinkel: {
    waar: "Viswinkel Leiden, bij de vragen aan de toonbank",
    wat: "Een medewerker laat een oester zien in de winkel.",
    bestand: "/images/schaaps/oesters-in-de-winkel.webp",
    alt: "Een medewerker achter de vistoonbank laat een oester en een kistje oesters zien",
    verhouding: "liggend",
    terugval: "Aan de toonbank",
  },
  achterDeToonbank: {
    waar: "Contact, naast het telefoonnummer",
    wat: "Iemand van de zaak achter de toonbank, gewoon aan het werk. Geen poseren. Dit maakt bellen persoonlijker.",
    bestand: "/images/schaaps/toonbank-marktkraam.webp",
    alt: "Onze viskraam met de toonbank vol vis op ijs",
    verhouding: "vierkant",
    terugval: "Wij staan klaar",
  },
  gebakkenVis: {
    waar: "Homepage, het blok over gebakken vis",
    wat: "Verse kibbeling of lekkerbek, warm, net uit de pan. Bij voorkeur in het bakje zoals de klant het meekrijgt.",
    bestand: "/images/editorial/kibbeling-schaapstray.png",
    alt: "Krokante kibbeling met saus",
    verhouding: "liggend",
    terugval: "Kibbeling en lekkerbek",
  },

  /* ── De kramen ─────────────────────────────────────────────────────────── */
  haringkraam: {
    waar: "Marktkraam Leiden",
    wat: "Haringverkoop aan het water op de Leidse markt.",
    bestand: "/images/schaaps/haringkraam-aan-het-water.webp",
    alt: "De viskraam van Schaap’s aan het water op de Leidse markt, met de haringsnijder achter de toonbank",
    verhouding: "liggend",
    terugval: "Haring op de Leidse markt",
  },
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
    bestand: "/images/schaaps/viskraam-hoogvliet-voorschoten.webp",
    ...standplaatsVoorschoten,
    verhouding: "liggend",
    terugval: "Bij Hoogvliet, Voorschoten",
  },

  /* ── De geschiedenis ───────────────────────────────────────────────────── */
  /* Hier zit de meeste winst. Eén vergeelde foto uit 1960 doet meer voor de
     geloofwaardigheid dan twintig keer "sinds 1938" in de tekst. */
  historie1938: {
    waar: "Homepage familieblok en Ons verhaal, bij 1938",
    wat: "De oudste foto die je hebt: de winkel, de viskar, Gerrit Schaap, een oud prijsbord. Scheef, korrelig of vergeeld mag — dat maakt het juist echt.",
    bestand: "",
    alt: "Schaap's Vishandel in Leiden rond de oprichting in 1938",
    verhouding: "liggend",
    terugval: "1938",
  },
  nelInDeWinkel: {
    waar: "Ons verhaal, in de periode van Cor en Nel",
    wat: "Familiefoto van Aldert met zijn moeder Nel, uit de tijd dat zijn ouders Nel en Cor Haasnoot de zaak runden.",
    bestand: "/images/schaaps/nel-achter-de-toonbank.webp",
    alt: "Aldert Haasnoot links achter de toonbank, met rechts zijn moeder Nel in een blauw schort",
    verhouding: "liggend",
    terugval: "Aldert met zijn moeder Nel in de winkel",
  },
  historie2018: {
    waar: "Ons verhaal — tijdlijn 2018",
    wat: "Een echte foto uit 2018 bij het bijbehorende tijdlijnmoment; jaartal en personen eerst laten bevestigen.",
    bestand: "",
    alt: "Schaap’s Vishandel in 2018",
    verhouding: "liggend",
    terugval: "Foto uit 2018 aanleveren",
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
    bestand: "/images/schaaps/aldert-overname.webp",
    alt: "Aldert Haasnoot in zijn rode schort achter de toonbank bij de overname in 2009",
    verhouding: "liggend",
    terugval: "2009",
  },
  historieNu: {
    waar: "Ons verhaal, bij Vandaag — actuele teamfoto, nooit als historische foto",
    wat: "De zaak zoals hij er nu bij staat, met het team erbij.",
    bestand: "/images/schaaps/schaaps-viskraam.webp",
    alt: "Klanten voor de viskraam van Schaap’s op de Leidse markt",
    verhouding: "liggend",
    terugval: "Vandaag",
  },

  /* ── De drie visschalen ────────────────────────────────────────────────── */
  /* Tijdelijke voorbeeldfoto's. De werkelijke schalen en samenstelling wijken af. */
  schaalBorrel: {
    waar: "Visschalen en de homepage",
    wat: "Tijdelijk voorbeeld van een borrelschaal; vervangen door eigen foto.",
    bestand: "/images/dirks/visschotel-hapjes-3-5-pers.webp",
    alt: "Voorbeeldschaal met gerookte vis, garnalen en hapjes op een zwarte schaal",
    verhouding: "vierkant",
    terugval: "Borrelschaal",
  },
  schaalFamilie: {
    waar: "Visschalen",
    wat: "Tijdelijk voorbeeld van een grotere visschaal; vervangen door eigen foto.",
    bestand: "/images/dirks/visschotel-middel-5-8-pers.webp",
    alt: "Voorbeeld van een grotere visschaal met gerookte zalm, garnalen en salades",
    verhouding: "vierkant",
    terugval: "Familieschaal",
  },
  schaalFeest: {
    waar: "Visschalen",
    wat: "Tijdelijk voorbeeld van een ruime visschaal; vervangen door eigen foto.",
    bestand: "/images/dirks/visschotel-luxe-10-14-pers.webp",
    alt: "Voorbeeld van een ruime feestschaal met diverse gerookte vis, garnalen en salades",
    verhouding: "vierkant",
    terugval: "Feestschaal",
  },

  /* ── Varlaks ───────────────────────────────────────────────────────────── */
  varlaksFilet: {
    waar: "De Varlaks-pagina",
    wat: "Een Varlaks-filet op jullie eigen toonbank. Niet de persfoto van de kweker: die van jullie is geloofwaardiger.",
    bestand: "",
    alt: "VÅRLAKS-zalmfilet bij Schaap's Vishandel in Leiden",
    verhouding: "liggend",
    terugval: "Varlaks zalmfilet",
  },
} as const satisfies Record<string, Beeldplek>;

export type BeeldNaam = keyof typeof BEELD;

export const kraamGalerij = [
  { ...BEELD.kraamToonbank, breedte: 870, hoogte: 580 },
  { ...standplaatsVoorschoten, bestand: "/images/schaaps/vrijdag-bij-de-viskraam.webp", breedte: 822, hoogte: 548 },
] as const;

/** Pure data check, safe to call from server and client components. */
export function heeftBeeld(naam: BeeldNaam): boolean {
  return BEELD[naam].bestand !== "";
}

/** Hoeveel foto's er nog ontbreken — gebruikt in OVERDRACHT.md en de controle. */
export function ontbrekendeBeelden(): BeeldNaam[] {
  return (Object.keys(BEELD) as BeeldNaam[]).filter((naam) => BEELD[naam].bestand === "");
}


/** The storefront takes over only when a real owner image has been registered. */
export function homepageHeroBeeld(locale: string) {
  const gevel = BEELD.winkelGevel;
  if (gevel.bestand) {
    const copy = locale === "en" || locale === "de" ? gevel.vertalingen[locale] : gevel;
    return { src: gevel.bestand, alt: copy.alt, caption: copy.bijschrift };
  }
  const copy = locale === "de"
    ? ["Ofenlachs mit Zitrone und Dill", "Serviervorschlag · Lachs mit Zitrone und Dill"]
    : locale === "en"
      ? ["Oven-baked salmon with lemon and dill", "Serving idea · salmon with lemon and dill"]
      : ["Zalm uit de oven met citroen en dille", "Aan tafel · zalm met citroen en dille"];
  return { src: "/images/recepten/zalm-citroen-dille.webp", alt: copy[0], caption: copy[1] };
}
