export interface CatalogProduct {
  id: string;
  naam: string;
  beschrijving: string;
  categorie: CatalogCategorie;
  eenheid: string;
  info?: string;
  tip?: string;
  zoekwoorden?: string[];
  beschikbaar: boolean;
}

export type CatalogCategorie =
  | "bereid"
  | "schaal"
  | "gerookt"
  | "zeewier"
  | "vers"
  | "salades"
  | "soepen"
  | "schotels";

export const CATEGORIE_LABELS: Record<CatalogCategorie, string> = {
  bereid: "Bereid & gebakken",
  schaal: "Schaal- & schelpdieren",
  gerookt: "Gerookt & gezouten",
  zeewier: "Zeewier & zeekraal",
  vers: "Verse vissen",
  salades: "Vissalades",
  soepen: "Soepen",
  schotels: "Visschotels (op bestelling)",
};

export const CATALOG: CatalogProduct[] = [
  // Bereid & gebakken
  {
    id: "kibbeling-kabeljauw",
    naam: "Kibbeling van kabeljauw",
    beschrijving: "De authentieke keuze — dikkere filet, rijkere smaak",
    categorie: "bereid",
    eenheid: "gram",
    info: "Kabeljauw is de originele kibbeling-vis. Steviger van structuur en dieper van smaak dan pollak. Iets duurder, maar de echte visliefhebber proeft het verschil.",
    tip: "Reken 200g per persoon",
    zoekwoorden: ["kibbeling", "kabeljauw", "gebakken"],
    beschikbaar: true,
  },
  {
    id: "kibbeling-pollak",
    naam: "Kibbeling van pollak (koolvis)",
    beschrijving: "De populaire standaard — mild van smaak",
    categorie: "bereid",
    eenheid: "gram",
    info: "Pollak is de meest gebruikte kibbeling-vis vandaag de dag. Mild, luchtig beslag, altijd lekker. Prima keuze voor wie niet van een uitgesproken vissmaak houdt.",
    tip: "Reken 200g per persoon",
    zoekwoorden: ["kibbeling", "pollak", "koolvis", "gebakken"],
    beschikbaar: true,
  },
  {
    id: "lekkerbek",
    naam: "Lekkerbek",
    beschrijving: "Heekfilet, gebakken in luchtig beslag",
    categorie: "bereid",
    eenheid: "stuks",
    zoekwoorden: ["lekkerbek", "gebakken", "heek", "witvis"],
    beschikbaar: true,
  },
  {
    id: "inktvisringen-gebakken",
    naam: "Inktvisringen gebakken",
    beschrijving: "Knapperig gebakken, direct eetklaar",
    categorie: "bereid",
    eenheid: "gram",
    zoekwoorden: ["inktvis", "inktvisringen", "calamari", "gebakken"],
    beschikbaar: true,
  },
  {
    id: "inktvisringen-rauw",
    naam: "Inktvisringen rauw",
    beschrijving: "Ongebakken, om zelf klaar te maken",
    categorie: "bereid",
    eenheid: "gram",
    zoekwoorden: ["inktvis", "inktvisringen", "calamari", "rauw"],
    beschikbaar: true,
  },

  // Schaal- & schelpdieren
  {
    id: "surimi-krab",
    naam: "Surimi krab",
    beschrijving: "Krabsticks op basis van surimi",
    categorie: "schaal",
    eenheid: "gram",
    zoekwoorden: ["surimi", "krab", "krabstick"],
    beschikbaar: true,
  },
  {
    id: "surimi-garnaal",
    naam: "Surimi garnaal",
    beschrijving: "Garnaalsmaak op basis van surimi",
    categorie: "schaal",
    eenheid: "gram",
    zoekwoorden: ["surimi", "garnaal"],
    beschikbaar: true,
  },
  {
    id: "garnalen-gepeld",
    naam: "Gepelde verse garnalen",
    beschrijving: "Al gepeld, direct te gebruiken",
    categorie: "schaal",
    eenheid: "gram",
    zoekwoorden: ["garnalen", "gepeld", "vers", "garnaal"],
    beschikbaar: true,
  },
  {
    id: "garnalen-blacktiger",
    naam: "Black Tiger garnalen",
    beschrijving: "Grote tropische garnalen",
    categorie: "schaal",
    eenheid: "gram",
    zoekwoorden: ["garnalen", "black tiger", "tiger prawn", "grote garnaal"],
    beschikbaar: true,
  },
  {
    id: "garnalen-hollands",
    naam: "Hollandse garnalen",
    beschrijving: "De kleine Noordzee-klassieker",
    categorie: "schaal",
    eenheid: "gram",
    zoekwoorden: ["hollandse garnalen", "garnalen", "Noordzee"],
    beschikbaar: true,
  },

  // Gerookt & gezouten
  {
    id: "haring",
    naam: "Verse haring",
    beschrijving: "Hollandse Nieuwe — rauw en vers",
    categorie: "gerookt",
    eenheid: "stuks",
    zoekwoorden: ["haring", "nieuwe haring", "hollandse nieuwe", "rauw"],
    beschikbaar: true,
  },
  {
    id: "zalm-gerookt",
    naam: "Gerookte Noorse Zalm — High Seas",
    beschrijving: "Koud gerookt, lang gesneden, ASC gecertificeerd (500g)",
    categorie: "gerookt",
    eenheid: "gram",
    info: "High Seas gerookte zalm van Den Heijer (Scheveningen) — ASC gecertificeerde Atlantische zalm uit Noorwegen, koud gerookt in dunne plakken.",
    zoekwoorden: ["zalm", "gerookt", "zalm gerookt", "noorse zalm", "high seas", "smoked salmon"],
    beschikbaar: true,
  },

  // Zeewier & zeekraal
  {
    id: "zeekraal",
    naam: "Zeekraal",
    beschrijving: "Verse zeekraal — licht gezouten zeesmaak",
    categorie: "zeewier",
    eenheid: "gram",
    zoekwoorden: ["zeekraal", "zeewier", "groenten", "zee"],
    beschikbaar: true,
  },
  {
    id: "wakame",
    naam: "Wakame",
    beschrijving: "Japans zeewier, ideaal in salades",
    categorie: "zeewier",
    eenheid: "gram",
    zoekwoorden: ["wakame", "zeewier", "japans", "salade"],
    beschikbaar: true,
  },

  // Verse vissen
  {
    id: "schol",
    naam: "Schol (heel)",
    beschrijving: "Verse platvis — Hollandse klassieker",
    categorie: "vers",
    eenheid: "stuks",
    zoekwoorden: ["schol", "platvis", "vers"],
    beschikbaar: true,
  },
  {
    id: "scholfilet",
    naam: "Scholfilet",
    beschrijving: "Vers gefileerd, zonder graten",
    categorie: "vers",
    eenheid: "gram",
    zoekwoorden: ["scholfilet", "schol", "filet", "platvis"],
    beschikbaar: true,
  },
  {
    id: "zeebaars",
    naam: "Zeebaars",
    beschrijving: "Vers, heel of gefileerd op aanvraag",
    categorie: "vers",
    eenheid: "stuks",
    zoekwoorden: ["zeebaars", "baars", "vers"],
    beschikbaar: true,
  },
  {
    id: "zalm-varlaks",
    naam: "Zalm — Varlaks biologisch",
    beschrijving: "Noors, biologisch, zonder antibiotica",
    categorie: "vers",
    eenheid: "gram",
    info: "Onze premium zalm van Varlaks — familieboeren boven de poolcirkel. Geen antibiotica, geen GMO. Volledig traceerbaar.",
    zoekwoorden: ["zalm", "varlaks", "biologisch", "noors", "salmon"],
    beschikbaar: true,
  },
  {
    id: "kabeljouw",
    naam: "Kabeljouw",
    beschrijving: "Verse kabeljauwfilet",
    categorie: "vers",
    eenheid: "gram",
    zoekwoorden: ["kabeljouw", "kabeljauw", "kabeljauwfilet", "cod"],
    beschikbaar: true,
  },
  {
    id: "dorade",
    naam: "Dorade",
    beschrijving: "Verse zeebaars-familie — ideaal op de grill",
    categorie: "vers",
    eenheid: "stuks",
    zoekwoorden: ["dorade", "goudvis", "grill", "vers"],
    beschikbaar: true,
  },

  // Salades
  {
    id: "zalmsalade",
    naam: "Zalmsalade",
    beschrijving: "Huisgemaakt",
    categorie: "salades",
    eenheid: "per 200g",
    zoekwoorden: ["zalmsalade", "salade", "zalm"],
    beschikbaar: true,
  },
  {
    id: "garnaalsalade",
    naam: "Garnaalsalade",
    beschrijving: "Huisgemaakt",
    categorie: "salades",
    eenheid: "per 200g",
    zoekwoorden: ["garnaalsalade", "salade", "garnalen"],
    beschikbaar: true,
  },

  // Soepen
  {
    id: "vissoep",
    naam: "Vissoep",
    beschrijving: "Huisgemaakte vissoep",
    categorie: "soepen",
    eenheid: "per portie",
    zoekwoorden: ["vissoep", "soep", "vis"],
    beschikbaar: true,
  },

  // Schotels
  {
    id: "visschotel-klein",
    naam: "Visschotel klein",
    beschrijving: "Voor 4–6 personen",
    categorie: "schotels",
    eenheid: "per schaal",
    tip: "Minimaal 2 dagen van tevoren bestellen",
    zoekwoorden: ["visschotel", "schotel", "feest", "borrel"],
    beschikbaar: true,
  },
  {
    id: "visschotel-groot",
    naam: "Visschotel groot",
    beschrijving: "Voor 8–12 personen",
    categorie: "schotels",
    eenheid: "per schaal",
    tip: "Minimaal 2 dagen van tevoren bestellen",
    zoekwoorden: ["visschotel", "schotel", "feest", "groot", "borrel"],
    beschikbaar: true,
  },
  {
    id: "haringschotel",
    naam: "Haringschotel",
    beschrijving: "Feestelijke presentatie met verse haring",
    categorie: "schotels",
    eenheid: "per schaal",
    tip: "Minimaal 1 dag van tevoren bestellen",
    zoekwoorden: ["haringschotel", "haring", "schotel", "feest"],
    beschikbaar: true,
  },
];

// Legacy export for admin panel compatibility
export const PRODUCTEN = CATALOG.map((p) => ({
  id: p.id,
  naam: p.naam,
  beschrijving: p.beschrijving,
  categorie: p.categorie as string,
  eenheid: p.eenheid,
  beschikbaar: p.beschikbaar,
  opmerking: p.tip,
}));

export type Product = (typeof PRODUCTEN)[number];
