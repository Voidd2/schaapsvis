import { STANDARD_FISH_TRIO, FISH_TRIO_PORTION, trioPriceCents, TRIO_GRAMS } from "./gift-pricing";
import { gourmetPriceCents } from "./gourmet-pricing";

export type FeestdagenCategorie = "visschalen" | "gourmet" | "delicatessen";

export type FeestdagenProduct = {
  slug: string;
  naam: string;
  prijsCents: number;
  eenheid: string;
  afbeelding: string;
  categorie: FeestdagenCategorie;
  intro: string;
  samenstelling: readonly string[];
  allergenen: readonly string[];
  besteltermijn?: string;
  formaat?: string;
};

const klassiek = [
  "Huisgemaakte zalmsalade",
  "Hollandse en roze garnalen",
  "Gerookte zalm en gerookte paling",
  "Makreel, pepermakreel of brado",
  "Seafoodsalade en garnituur",
] as const;

const luxe = [
  "Huisgemaakte zalmsalade",
  "Kort aangebakken tonijn",
  "Gerookte en warmgerookte zalm",
  "Hollandse en roze garnalen",
  "Gerookte paling en makreel",
  "Seafoodsalade en garnituur",
] as const;

const hapjes = [
  "Grote en roze garnalen",
  "Zalmwraps en surimi",
  "Gerookte en warmgerookte zalm",
  "Makreel, pepermakreel en brado",
  "Rivierkreeftstaartjes en gerookte paling",
] as const;

const schotelAllergenen = ["Vis", "Schaaldieren", "Gluten", "Ei", "Mosterd", "Soja", "Selderij", "Melk"] as const;

export const FEESTDAGEN_PRODUCTEN: readonly FeestdagenProduct[] = [
  {
    slug: "zalmslaatje-de-luxe",
    naam: "Zalmslaatje de luxe",
    prijsCents: 1599,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/zalmslaatje-de-luxe.webp",
    categorie: "delicatessen",
    intro: "Vier bolletjes zalmsalade met gerookte vis en garnalen. Geschikt als lunch voor één of als voorgerecht om te delen.",
    samenstelling: ["Huisgemaakte zalmsalade", "Hollandse garnalen", "Gerookte zalm", "Gerookte paling", "Garnituur"],
    allergenen: ["Vis", "Schaaldieren", "Ei", "Mosterd", "Gluten", "Soja", "Melk", "Selderij"],
  },
  {
    slug: "visschotel-klein-2-3-pers",
    naam: "Visschotel klein 2-3 pers.",
    prijsCents: 5950,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-klein-2-3-pers.webp",
    categorie: "visschalen",
    intro: "Een klassieke visschotel voor twee tot drie personen, opgebouwd rond zalmsalade, garnalen en gerookte vis.",
    samenstelling: klassiek,
    allergenen: schotelAllergenen,
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ovale schaal van circa 34 × 25 cm.",
  },
  {
    slug: "visschotel-klein-3-5-pers",
    naam: "Visschotel klein 3-5 pers.",
    prijsCents: 7350,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-klein-3-5-pers.webp",
    categorie: "visschalen",
    intro: "Een klassieke visschotel voor drie tot vijf personen met zalmsalade, garnalen en gerookte vis.",
    samenstelling: klassiek,
    allergenen: schotelAllergenen,
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ovale schaal van circa 44 × 30 cm.",
  },
  {
    slug: "visschotel-middel-5-8-pers",
    naam: "Visschotel middel 5-8 pers.",
    prijsCents: 9850,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-middel-5-8-pers.webp",
    categorie: "visschalen",
    intro: "Een rijk gevulde klassieke visschotel voor vijf tot acht personen.",
    samenstelling: klassiek,
    allergenen: schotelAllergenen,
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ovale schaal van circa 44 × 30 cm.",
  },
  {
    slug: "visschotel-groot-8-10-pers",
    naam: "Visschotel groot 8-10 pers.",
    prijsCents: 11550,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-groot-8-10-pers.webp",
    categorie: "visschalen",
    intro: "Een royale klassieke visschotel voor een groter gezelschap van acht tot tien personen.",
    samenstelling: klassiek,
    allergenen: schotelAllergenen,
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ovale schaal van circa 54 × 34 cm.",
  },
  {
    slug: "visschotel-luxe-2-3-pers",
    naam: "Visschotel luxe 2-3 pers.",
    prijsCents: 6950,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-luxe-2-3-pers.webp",
    categorie: "visschalen",
    intro: "Een luxe visschotel voor twee tot drie personen, met onder meer tonijn, gerookte vis en garnalen.",
    samenstelling: luxe,
    allergenen: [...schotelAllergenen, "Sesam"],
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ovale schaal van circa 34 × 25 cm.",
  },
  {
    slug: "visschotel-luxe-3-5-pers",
    naam: "Visschotel luxe 3-5 pers.",
    prijsCents: 8450,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-luxe-3-5-pers.webp",
    categorie: "visschalen",
    intro: "Een luxe visschotel voor drie tot vijf personen met een brede selectie gerookte en bereide vis.",
    samenstelling: luxe,
    allergenen: [...schotelAllergenen, "Sesam"],
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ovale schaal van circa 44 × 30 cm.",
  },
  {
    slug: "visschotel-luxe-5-8-pers",
    naam: "Visschotel luxe 5-8 pers.",
    prijsCents: 10950,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-luxe-5-8-pers.webp",
    categorie: "visschalen",
    intro: "Een luxe visschotel voor vijf tot acht personen met tonijn, zalm, paling en garnalen.",
    samenstelling: luxe,
    allergenen: [...schotelAllergenen, "Sesam"],
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ovale schaal van circa 44 × 30 cm.",
  },
  {
    slug: "visschotel-luxe-8-10-pers",
    naam: "Visschotel luxe 8-10 pers.",
    prijsCents: 12550,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-luxe-8-10-pers.webp",
    categorie: "visschalen",
    intro: "Een royale luxe visschotel voor acht tot tien personen, feestelijk opgemaakt voor de hele tafel.",
    samenstelling: luxe,
    allergenen: [...schotelAllergenen, "Sesam"],
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ovale schaal van circa 54 × 34 cm.",
  },
  {
    slug: "visschotel-luxe-10-14-pers",
    naam: "Visschotel luxe 10-14 pers.",
    prijsCents: 16000,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-luxe-10-14-pers.webp",
    categorie: "visschalen",
    intro: "De grootste luxe visschotel uit de selectie, bedoeld voor tien tot veertien personen.",
    samenstelling: luxe,
    allergenen: [...schotelAllergenen, "Sesam"],
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ronde schaal van circa 47 cm doorsnee.",
  },
  {
    slug: "visschotel-hapjes-2-3-pers",
    naam: "Visschotel hapjes 2-3 pers.",
    prijsCents: 5350,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-hapjes-2-3-pers.webp",
    categorie: "visschalen",
    intro: "Een visschotel met kleine hapjes voor twee tot drie personen, ideaal voor een borrel.",
    samenstelling: hapjes,
    allergenen: ["Vis", "Schaaldieren", "Gluten", "Melk"],
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ovale schaal van circa 44 × 30 cm.",
  },
  {
    slug: "visschotel-hapjes-3-5-pers",
    naam: "Visschotel hapjes 3-5 pers.",
    prijsCents: 6750,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-hapjes-3-5-pers.webp",
    categorie: "visschalen",
    intro: "Een gevarieerde hapjesschotel met vis en garnalen voor drie tot vijf personen.",
    samenstelling: hapjes,
    allergenen: ["Vis", "Schaaldieren", "Gluten", "Melk"],
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ovale schaal van circa 44 × 30 cm.",
  },
  {
    slug: "visschotel-hapjes-6-10-pers",
    naam: "Visschotel hapjes 6-10 pers.",
    prijsCents: 8550,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/visschotel-hapjes-6-10-pers.webp",
    categorie: "visschalen",
    intro: "Een grote hapjesschotel voor zes tot tien personen, geschikt voor feest en borrel.",
    samenstelling: hapjes,
    allergenen: ["Vis", "Schaaldieren", "Gluten", "Melk"],
    besteltermijn: "Minimaal één dag vooraf bestellen.",
    formaat: "Ovale schaal van circa 54 × 34 cm.",
  },
  {
    slug: "gourmet-trio-1-persoon",
    naam: "Gourmet trio 1 persoon",
    prijsCents: gourmetPriceCents("gourmet-trio-1-persoon"),
    eenheid: "per schaal",
    afbeelding: "/images/dirks/gourmet-trio-1-persoon.webp",
    categorie: "gourmet",
    intro: "Een gourmettrio voor één persoon met zalm, tonijn en kabeljauw.",
    samenstelling: ["100 gram kabeljauw", "100 gram zalm", "100 gram tonijn"],
    allergenen: ["Vis", "Melk", "Mosterd"],
  },
  {
    slug: "gourmet-schotel-3-4-pers",
    naam: "Gourmet schotel 3-4 pers.",
    prijsCents: gourmetPriceCents("gourmet-schotel-3-4-pers"),
    eenheid: "per schaal",
    afbeelding: "/images/dirks/gourmet-schotel-3-4-pers.webp",
    categorie: "gourmet",
    intro: "Een visgourmetschotel van 1 kg met zalm, tonijn, kabeljauw en garnalen voor drie tot vier personen.",
    samenstelling: ["300 gram zalm", "200 gram tonijn", "300 gram kabeljauw", "200 gram gepelde Black Tiger-garnalen"],
    allergenen: ["Vis", "Schaaldieren", "Melk", "Mosterd"],
    besteltermijn: "Minimaal één dag vooraf bestellen.",
  },
  {
    slug: "gourmetschotel-5-6-pers",
    naam: "Gourmetschotel 5-6 pers.",
    prijsCents: gourmetPriceCents("gourmetschotel-5-6-pers"),
    eenheid: "per schaal",
    afbeelding: "/images/dirks/gourmetschotel-5-6-pers.webp",
    categorie: "gourmet",
    intro: "Een visgourmetschotel van 1,5 kg met zalm, tonijn, kabeljauw en garnalen voor vijf tot zes personen.",
    samenstelling: ["450 gram zalm", "300 gram tonijn", "450 gram kabeljauw", "300 gram gepelde Black Tiger-garnalen"],
    allergenen: ["Vis", "Schaaldieren", "Melk", "Mosterd"],
    besteltermijn: "Minimaal één dag vooraf bestellen.",
  },
  {
    slug: "zalmsashimi",
    naam: "Zalmsashimi",
    prijsCents: 999,
    eenheid: "per set",
    afbeelding: "/images/dirks/zalmsashimi.webp",
    categorie: "delicatessen",
    intro: "Dun gesneden zalmsashimi met een gekruide rand, zeewiersalade en sojasaus.",
    samenstelling: ["Circa 90 gram zalmsashimi", "Wakame", "Sojasaus", "Kruidenrand"],
    allergenen: ["Vis", "Sesam", "Melk", "Ei", "Soja", "Gluten"],
  },
  {
    slug: "gegrilde-tonijn",
    naam: "Gegrilde tonijn",
    prijsCents: 999,
    eenheid: "per bakje (circa 90 gram)",
    afbeelding: "/images/dirks/gegrilde-tonijn.webp",
    categorie: "delicatessen",
    intro: "Kort gegrilde geelvintonijn met een gekruide korst en soja-sesamdressing.",
    samenstelling: ["Geelvintonijn", "Kruidenkorst", "Soja-sesamdressing"],
    allergenen: ["Vis", "Sesam", "Soja", "Gluten"],
  },
  {
    slug: "zalm-sashimi-ongesneden",
    naam: "Zalm sashimi ongesneden",
    prijsCents: 375,
    eenheid: "per 100 gram",
    afbeelding: "/images/dirks/zalm-sashimi-ongesneden.webp",
    categorie: "delicatessen",
    intro: "Voor sashimi selecteren we een mooi, gelijkmatig stuk zalmfilet. We verwijderen de huid en snijden de vetranden weg. U betaalt alleen voor het schoongemaakte stuk en snijdt het thuis zelf in plakjes.",
    samenstelling: ["Verse zalm"],
    allergenen: ["Vis"],
  },
  {
    slug: "tonijn-sashimi-ongesneden",
    naam: "Tonijn sashimi ongesneden",
    prijsCents: 949,
    eenheid: "per 100 gram",
    afbeelding: "/images/dirks/tonijn-sashimi-ongesneden.webp",
    categorie: "delicatessen",
    intro: "Een ongesneden blok geelvintonijn om zelf als sashimi of voor sushi te snijden.",
    samenstelling: ["Geelvintonijn"],
    allergenen: ["Vis"],
  },
  ...TRIO_GRAMS.map((grams, size): FeestdagenProduct => ({
    slug: ["luxe-trio-klein", "luxe-trio-middel", "luxe-vistrio"][size],
    naam: size === 0 ? "Luxe vistrio" : "Luxe vistrio " + ["klein", "middel", "groot"][size],
    prijsCents: size === 0 ? STANDARD_FISH_TRIO : trioPriceCents(size)!,
    eenheid: "per stuk",
    afbeelding: size === 0 ? "/images/dirks/luxe-trio-klein.webp" : "/images/dirks/luxe-vistrio.webp",
    categorie: "delicatessen",
    intro: size === 0 ? "Kies drie soorten van elk circa 80 g. Het drievaksbakje en de opmaak zijn inbegrepen. Voor een cadeau kunt u een cadeaubon toevoegen." : `Drie vakjes met elk circa ${grams} g: Hollandse garnalen, gerookte paling en gerookte zalm. Inclusief opmaak en verpakking.`,
    samenstelling: ["Hollandse garnalen", "gerookte paling", "gerookte zalm"].map(fish => `Circa ${size === 0 ? FISH_TRIO_PORTION : grams} gram ${fish}`).concat(["Cocktailsaus", "Mosterd-dillesaus"]),
    allergenen: ["Schaaldieren", "Vis", "Ei", "Mosterd", "Melk"],
  })),
  {
    slug: "salade-trio",
    naam: "Salade trio",
    prijsCents: 1199,
    eenheid: "per stuk",
    afbeelding: "/images/dirks/salade-trio.webp",
    categorie: "delicatessen",
    intro: "Kies zelf de salade voor elk van de drie vakjes, circa 120 g per vakje.",
    samenstelling: ["Drie salades naar keuze, circa 120 g per vakje"],
    allergenen: ["Vis", "Ei", "Mosterd", "Soja", "Selderij", "Schaaldieren", "Gluten"],
  },
] as const;

export const FEESTDAGEN_CATEGORIEEN: readonly { id: FeestdagenCategorie; naam: string; intro: string }[] = [
  { id: "visschalen", naam: "Visschalen", intro: "Klassiek, luxe of als hapjesschotel: kies de schaal die past bij uw gezelschap." },
  { id: "gourmet", naam: "Visgourmet", intro: "Voor een gezellige avond aan tafel, per persoon of als complete schaal." },
  { id: "delicatessen", naam: "Luxe vis & delicatessen", intro: "Voor voorgerecht, lunch, borrel of als aanvulling op de feesttafel." },
] as const;

export function feestdagenProduct(slug: string): FeestdagenProduct | undefined {
  return FEESTDAGEN_PRODUCTEN.find((product) => product.slug === slug);
}

export function feestdagenBedrag(prijsCents: number, locale = "nl"): string {
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : locale === "en" ? "en-NL" : "nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(prijsCents / 100);
}

export function feestdagenPrijs(product: FeestdagenProduct, locale = "nl"): string {
  return `${feestdagenBedrag(product.prijsCents, locale)} · ${product.eenheid}`;
}

export function gerelateerdeFeestdagenProducten(product: FeestdagenProduct): FeestdagenProduct[] {
  const zelfdeCategorie = FEESTDAGEN_PRODUCTEN.filter((item) => item.slug !== product.slug && item.categorie === product.categorie);
  const overig = FEESTDAGEN_PRODUCTEN.filter((item) => item.slug !== product.slug && item.categorie !== product.categorie);
  return [...zelfdeCategorie, ...overig].slice(0, 3);
}
