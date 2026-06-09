export interface Product {
  id: string;
  naam: string;
  beschrijving: string;
  categorie: "gebakken" | "rauw" | "premium" | "soepen" | "salades" | "schotels";
  eenheid: string;
  beschikbaar: boolean;
  opmerking?: string;
}

// !! Pas dit menu aan naar het echte aanbod van Schaap's Vis !!
// Producten die niet bestaan: verwijder of zet beschikbaar: false
export const PRODUCTEN: Product[] = [
  // Gebakken
  { id: "kibbeling",      naam: "Kibbeling",            beschrijving: "Knapperig gebakken witvis",    categorie: "gebakken", eenheid: "per 250g",   beschikbaar: true },
  { id: "lekkerbek",      naam: "Lekkerbek",            beschrijving: "Verse wijting in beslag",      categorie: "gebakken", eenheid: "per stuk",   beschikbaar: true },
  { id: "lekkerbekje",    naam: "Lekkerbekje (klein)",  beschrijving: "Klein formaat",                categorie: "gebakken", eenheid: "per stuk",   beschikbaar: true },
  { id: "gebakken_schol", naam: "Gebakken Schol",       beschrijving: "Verse schol gebakken",         categorie: "gebakken", eenheid: "per stuk",   beschikbaar: true },
  { id: "gebakken_tong",  naam: "Gebakken Tong",        beschrijving: "Verse tong gebakken",          categorie: "gebakken", eenheid: "per stuk",   beschikbaar: true },

  // Verse & gerookte vis
  { id: "haring",         naam: "Verse Haring",         beschrijving: "Hollandse Nieuwe",             categorie: "rauw",     eenheid: "per stuk",   beschikbaar: true },
  { id: "broodje_haring", naam: "Broodje Haring",       beschrijving: "Met ui en augurk",             categorie: "rauw",     eenheid: "per stuk",   beschikbaar: true },
  { id: "kabeljauw",      naam: "Kabeljauwfilet",       beschrijving: "Vers",                         categorie: "rauw",     eenheid: "per 250g",   beschikbaar: true },
  { id: "scholfilet",     naam: "Scholfilet",           beschrijving: "Vers",                         categorie: "rauw",     eenheid: "per stuk",   beschikbaar: true },
  { id: "makreel",        naam: "Makreel",              beschrijving: "Vers of gerookt",              categorie: "rauw",     eenheid: "per stuk",   beschikbaar: true },
  { id: "paling",         naam: "Paling",               beschrijving: "Gerookt",                      categorie: "rauw",     eenheid: "per 250g",   beschikbaar: true },
  { id: "garnalen",       naam: "Garnalen",             beschrijving: "Hollandse garnalen",           categorie: "rauw",     eenheid: "per 100g",   beschikbaar: true },

  // Varlaks biologische zalm
  { id: "zalmfilet",      naam: "Varlaks Zalmfilet",    beschrijving: "Biologisch, Noorwegen",        categorie: "premium",  eenheid: "per 250g",   beschikbaar: true },
  { id: "zalmmoot",       naam: "Varlaks Zalmmoot",     beschrijving: "Biologisch, Noorwegen",        categorie: "premium",  eenheid: "per stuk",   beschikbaar: true },

  // Soepen & potjes
  { id: "vissoep",        naam: "Vissoep",              beschrijving: "Huisgemaakt",                  categorie: "soepen",   eenheid: "per portie", beschikbaar: true },
  { id: "vispotje",       naam: "Vispotje",             beschrijving: "Vis in romige saus",           categorie: "soepen",   eenheid: "per potje",  beschikbaar: true },

  // Vissalades
  { id: "zalmsalade",     naam: "Zalmsalade",           beschrijving: "Huisgemaakt",                  categorie: "salades",  eenheid: "per 200g",   beschikbaar: true },
  { id: "tona_salade",    naam: "Tonijnsalade",         beschrijving: "Huisgemaakt",                  categorie: "salades",  eenheid: "per 200g",   beschikbaar: true },
  { id: "garnalen_salade",naam: "Garnaalsalade",        beschrijving: "Huisgemaakt",                  categorie: "salades",  eenheid: "per 200g",   beschikbaar: true },

  // Visschotels (op bestelling)
  { id: "visschotel_kl",  naam: "Visschotel Klein",     beschrijving: "Voor 4-6 personen",            categorie: "schotels", eenheid: "per schaal", beschikbaar: true, opmerking: "Minimaal 2 dagen van tevoren bestellen" },
  { id: "visschotel_gr",  naam: "Visschotel Groot",     beschrijving: "Voor 8-12 personen",           categorie: "schotels", eenheid: "per schaal", beschikbaar: true, opmerking: "Minimaal 2 dagen van tevoren bestellen" },
  { id: "haringschotel",  naam: "Haringschotel",        beschrijving: "Feestelijke presentatie",      categorie: "schotels", eenheid: "per schaal", beschikbaar: true, opmerking: "Minimaal 1 dag van tevoren bestellen" },
];
