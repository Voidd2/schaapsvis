import { FEESTDAGEN_PRODUCTEN, feestdagenProduct, type FeestdagenProduct } from "./feestdagen-producten";
import { localizedPlatterProduct } from "./platter-product-text";

// Merchandising only: canonical prices, portions, photos and routes stay in the catalogue.
export const MAIN_PLATTERS = ["visschotel-klein-2-3-pers", "visschotel-klein-3-5-pers", "visschotel-middel-5-8-pers", "visschotel-luxe-10-14-pers", "visschotel-hapjes-3-5-pers", "visschotel-hapjes-6-10-pers"] as const;
export const GOURMET = ["gourmet-trio-1-persoon", "gourmet-schotel-3-4-pers", "gourmetschotel-5-6-pers"] as const;
export const DELICACIES = ["luxe-trio-klein", "luxe-vistrio", "salade-trio"] as const;
export const FEATURED = "zalmslaatje-de-luxe";
export const SECONDARY = FEESTDAGEN_PRODUCTEN.filter(p => ![...MAIN_PLATTERS, ...GOURMET, ...DELICACIES, FEATURED].includes(p.slug)).map(p => p.slug);
type Trio = readonly [string, string, string];
const commercialNames: Record<string, Trio> = {
  "visschotel-klein-2-3-pers": ["Klassieke kleine visschaal · 2–3 personen", "Small classic platter · 2–3 people", "Kleine klassische Fischplatte · 2–3 Personen"],
  "visschotel-klein-3-5-pers": ["Klassieke middelgrote visschaal · 3–5 personen", "Medium classic platter · 3–5 people", "Mittlere klassische Fischplatte · 3–5 Personen"],
  "visschotel-middel-5-8-pers": ["Klassieke grote visschaal · 5–8 personen", "Large classic platter · 5–8 people", "Große klassische Fischplatte · 5–8 Personen"],
  "visschotel-luxe-10-14-pers": ["Ronde luxe visschaal · 10–14 personen", "Round deluxe platter · 10–14 people", "Runde Deluxe-Fischplatte · 10–14 Personen"],
  "visschotel-hapjes-3-5-pers": ["Hapjesschaal · 3–5 personen", "Seafood bites platter · 3–5 people", "Fischhäppchenplatte · 3–5 Personen"],
  "visschotel-hapjes-6-10-pers": ["Grote hapjesschaal · 6–10 personen", "Large seafood bites platter · 6–10 people", "Große Fischhäppchenplatte · 6–10 Personen"],
};
export const languageIndex = (locale: string) => locale === "en" ? 1 : locale === "de" ? 2 : 0;

// Text overlays for the existing additions; no copied prices or ingredients.
const extraCopy: Record<string, { name: readonly [string, string]; intro: readonly [string, string] }> = {
  "zalmslaatje-de-luxe": { name: ["Deluxe salmon salad", "Lachssalat de luxe"], intro: ["Four scoops of salmon salad with smoked fish and prawns. A lunch for one or a starter to share.", "Vier Kugeln Lachssalat mit Räucherfisch und Garnelen. Als Mittagessen für eine Person oder Vorspeise zum Teilen."] },
  "gourmet-trio-1-persoon": { name: ["Gourmet trio for 1 person", "Gourmet-Trio für 1 Person"], intro: ["A tabletop grilling trio for one with three types of marinated fish.", "Ein Tischgrill-Trio für eine Person mit drei marinierten Fischsorten."] },
  "gourmet-schotel-3-4-pers": { name: ["Gourmet platter for 3–4 people", "Gourmetplatte für 3–4 Personen"], intro: ["A 1 kg tabletop grilling platter with salmon, tuna, cod and prawns for three to four people.", "Eine 1-kg-Tischgrillplatte mit Lachs, Thunfisch, Kabeljau und Garnelen für drei bis vier Personen."] },
  "gourmetschotel-5-6-pers": { name: ["Gourmet platter for 5–6 people", "Gourmetplatte für 5–6 Personen"], intro: ["A 1.5 kg tabletop grilling platter with salmon, tuna, cod and prawns for five to six people.", "Eine 1,5-kg-Tischgrillplatte mit Lachs, Thunfisch, Kabeljau und Garnelen für fünf bis sechs Personen."] },
  "luxe-trio-klein": { name: ["Small luxury seafood trio", "Kleines Luxus-Fischtrio"], intro: ["A small trio of Dutch shrimp, smoked eel and smoked salmon.", "Ein kleines Trio aus Nordseegarnelen, Räucheraal und Räucherlachs."] },
  "luxe-vistrio": { name: ["Large luxury seafood trio", "Großes Luxus-Fischtrio"], intro: ["A generous trio of Dutch shrimp, smoked eel and smoked salmon.", "Ein großzügiges Trio aus Nordseegarnelen, Räucheraal und Räucherlachs."] },
  "salade-trio": { name: ["Salad trio", "Salat-Trio"], intro: ["Three salads in one pack for bread, toast or sharing over drinks.", "Drei Salate in einer Verpackung für Brot, Toast oder eine gesellige Runde."] },
  "zalmsashimi": { name: ["Salmon sashimi", "Lachs-Sashimi"], intro: ["Thinly sliced salmon sashimi with a seasoned edge, seaweed salad and soy sauce.", "Dünn geschnittenes Lachs-Sashimi mit Gewürzrand, Algensalat und Sojasauce."] },
  "gegrilde-tonijn": { name: ["Seared tuna", "Gegrillter Thunfisch"], intro: ["Lightly seared yellowfin tuna with a spiced crust and soy-sesame dressing.", "Kurz gegrillter Gelbflossenthunfisch mit Gewürzkruste und Soja-Sesam-Dressing."] },
  "zalm-sashimi-ongesneden": { name: ["Uncut salmon sashimi", "Lachs-Sashimi am Stück"], intro: ["An uncut piece of fresh salmon to slice yourself for sashimi or sushi.", "Ein Stück frischer Lachs zum Selbstschneiden für Sashimi oder Sushi."] },
  "tonijn-sashimi-ongesneden": { name: ["Uncut tuna sashimi", "Thunfisch-Sashimi am Stück"], intro: ["An uncut piece of yellowfin tuna to slice yourself for sashimi or sushi.", "Ein Stück Gelbflossenthunfisch zum Selbstschneiden für Sashimi oder Sushi."] },
};
const ingredientText: Record<string, readonly [string, string]> = {
  "300 gram zalm": ["300 g salmon", "300 g Lachs"], "200 gram tonijn": ["200 g tuna", "200 g Thunfisch"], "300 gram kabeljauw": ["300 g cod", "300 g Kabeljau"], "200 gram garnalen": ["200 g prawns", "200 g Garnelen"],
  "450 gram zalm": ["450 g salmon", "450 g Lachs"], "300 gram tonijn": ["300 g tuna", "300 g Thunfisch"], "450 gram kabeljauw": ["450 g cod", "450 g Kabeljau"], "300 gram garnalen": ["300 g prawns", "300 g Garnelen"],
  "Huisgemaakte zalmsalade": ["House-made salmon salad", "Hausgemachter Lachssalat"], "Hollandse garnalen": ["Dutch shrimp", "Nordseegarnelen"], "Gerookte zalm": ["Smoked salmon", "Räucherlachs"], "Gerookte paling": ["Smoked eel", "Räucheraal"], "Garnituur": ["Garnish", "Garnitur"],
  "100 gram kabeljauw met botermarinade": ["100 g cod in butter marinade", "100 g Kabeljau in Buttermarinade"], "100 gram zalm met pestomarinade": ["100 g salmon in pesto marinade", "100 g Lachs in Pestomarinade"], "100 gram tonijn met piri-pirimarinade": ["100 g tuna in piri-piri marinade", "100 g Thunfisch in Piri-Piri-Marinade"],
  "Tonijn": ["Tuna", "Thunfisch"], "Zalm": ["Salmon", "Lachs"], "Kabeljauw": ["Cod", "Kabeljau"], "Garnalen": ["Prawns", "Garnelen"], "Vis van het moment": ["Seasonal fish", "Fisch je nach Angebot"], "Verschillende marinades": ["Various marinades", "Verschiedene Marinaden"],
  "Circa 40 gram Hollandse garnalen": ["Approximately 40 g Dutch shrimp", "Ca. 40 g Nordseegarnelen"], "Circa 40 gram gerookte paling": ["Approximately 40 g smoked eel", "Ca. 40 g Räucheraal"], "Circa 40 gram gerookte zalm": ["Approximately 40 g smoked salmon", "Ca. 40 g Räucherlachs"],
  "Circa 80 gram Hollandse garnalen": ["Approximately 80 g Dutch shrimp", "Ca. 80 g Nordseegarnelen"], "Circa 80 gram gerookte paling": ["Approximately 80 g smoked eel", "Ca. 80 g Räucheraal"], "Circa 80 gram gerookte zalm": ["Approximately 80 g smoked salmon", "Ca. 80 g Räucherlachs"],
  "Cocktailsaus": ["Cocktail sauce", "Cocktailsauce"], "Mosterd-dillesaus": ["Mustard-dill sauce", "Senf-Dill-Sauce"], "Zalm-eiersalade": ["Salmon and egg salad", "Lachs-Eiersalat"], "Makreelsalade": ["Mackerel salad", "Makrelensalat"], "Seafoodsalade": ["Seafood salad", "Meeresfrüchtesalat"],
  "Circa 90 gram zalmsashimi": ["Approximately 90 g salmon sashimi", "Ca. 90 g Lachs-Sashimi"], "Wakame": ["Wakame", "Wakame"], "Sojasaus": ["Soy sauce", "Sojasauce"], "Kruidenrand": ["Seasoned edge", "Gewürzrand"], "Geelvintonijn": ["Yellowfin tuna", "Gelbflossenthunfisch"], "Kruidenkorst": ["Spiced crust", "Gewürzkruste"], "Soja-sesamdressing": ["Soy-sesame dressing", "Soja-Sesam-Dressing"], "Verse zalm": ["Fresh salmon", "Frischer Lachs"],
  "Vis": ["Fish", "Fisch"], "Schaaldieren": ["Crustaceans", "Krebstiere"], "Ei": ["Egg", "Ei"], "Mosterd": ["Mustard", "Senf"], "Gluten": ["Gluten", "Gluten"], "Soja": ["Soy", "Soja"], "Melk": ["Milk", "Milch"], "Selderij": ["Celery", "Sellerie"], "Sesam": ["Sesame", "Sesam"],
};
export function catalogProduct(slug: string, locale: string): FeestdagenProduct {
  const source = feestdagenProduct(slug);
  if (!source) throw new Error(`Unknown catalogue product: ${slug}`);
  const i = languageIndex(locale);
  let product = localizedPlatterProduct(source, locale);
  const copy = extraCopy[slug];
  if (i && copy) {
    const translate = (text: string) => { const value = ingredientText[text]?.[i - 1]; if (!value) throw new Error(`Missing catalogue translation: ${text}`); return value; };
    product = { ...source, naam: copy.name[i - 1], intro: copy.intro[i - 1], samenstelling: source.samenstelling.map(translate), allergenen: source.allergenen.map(translate), eenheid: source.eenheid === "per 100 gram" ? (i === 1 ? "per 100 g" : "pro 100 g") : source.eenheid === "per set" ? (i === 1 ? "per set" : "pro Set") : source.eenheid.includes("90 gram") ? (i === 1 ? "per tub (approx. 90 g)" : "pro Schale (ca. 90 g)") : (i === 1 ? "each" : "pro Stück"), besteltermijn: source.besteltermijn ? (i === 1 ? "Order at least one day in advance." : "Mindestens einen Tag im Voraus bestellen.") : undefined };
  }
  if (product.categorie === "gourmet") product = { ...product, eenheid: i === 1 ? "per platter" : i === 2 ? "pro Platte" : "per schaal" };
  return commercialNames[slug] ? { ...product, naam: commercialNames[slug][i] } : product;
}

// These are enquiry wishes, NOT priced SKUs. No inferred portion, recipe or allergens.
export const SALAD_REQUESTS = [
  { slug: "extra-krabsalade", names: ["Krabsalade", "Crab salad", "Krabbensalat"], image: "/images/dirks/krabsalade.webp", productSlug: "krabsalade" },
  { slug: "extra-krab-mangosalade", names: ["Krab-mangosalade", "Crab and mango salad", "Krabben-Mango-Salat"], image: "/images/editorial/krab-mango-illustratief.webp", productSlug: null },
  { slug: "extra-zalmsalade", names: ["Zalmsalade", "Salmon salad", "Lachssalat"], image: "/images/dirks/zalmsalade.webp", productSlug: "zalmsalade" },
  { slug: "extra-tonijnsalade", names: ["Tonijnsalade", "Tuna salad", "Thunfischsalat"], image: "/images/dirks/tonijnsalade.webp", productSlug: "tonijnsalade" },
] as const;
