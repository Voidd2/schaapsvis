import type { FeestdagenProduct } from "./feestdagen-producten";

// Text-only overlays: canonical slugs, prices, images and category stay intact.
type Translation = readonly [en: string, de: string];
const variants: Record<string, { name: Translation; intro: Translation }> = {
  "visschotel-klein-2-3-pers": {
    name: ["Small seafood platter for 2–3 people", "Kleine Fischplatte für 2–3 Personen"],
    intro: ["A classic seafood platter for two to three people, centred on salmon salad, prawns and smoked fish.", "Eine klassische Fischplatte für zwei bis drei Personen mit Lachssalat, Garnelen und Räucherfisch."],
  },
  "visschotel-klein-3-5-pers": {
    name: ["Small seafood platter for 3–5 people", "Kleine Fischplatte für 3–5 Personen"],
    intro: ["A classic seafood platter for three to five people with salmon salad, prawns and smoked fish.", "Eine klassische Fischplatte für drei bis fünf Personen mit Lachssalat, Garnelen und Räucherfisch."],
  },
  "visschotel-middel-5-8-pers": {
    name: ["Medium seafood platter for 5–8 people", "Mittlere Fischplatte für 5–8 Personen"],
    intro: ["A generously filled classic seafood platter for five to eight people.", "Eine reichhaltige klassische Fischplatte für fünf bis acht Personen."],
  },
  "visschotel-groot-8-10-pers": {
    name: ["Large seafood platter for 8–10 people", "Große Fischplatte für 8–10 Personen"],
    intro: ["A generous classic seafood platter for a larger group of eight to ten people.", "Eine großzügige klassische Fischplatte für eine größere Gruppe von acht bis zehn Personen."],
  },
  "visschotel-luxe-2-3-pers": {
    name: ["Deluxe seafood platter for 2–3 people", "Deluxe-Fischplatte für 2–3 Personen"],
    intro: ["A deluxe seafood platter for two to three people, including tuna, smoked fish and prawns.", "Eine Deluxe-Fischplatte für zwei bis drei Personen, unter anderem mit Thunfisch, Räucherfisch und Garnelen."],
  },
  "visschotel-luxe-3-5-pers": {
    name: ["Deluxe seafood platter for 3–5 people", "Deluxe-Fischplatte für 3–5 Personen"],
    intro: ["A deluxe seafood platter for three to five people with a wide selection of smoked and prepared fish.", "Eine Deluxe-Fischplatte für drei bis fünf Personen mit einer vielseitigen Auswahl an geräuchertem und zubereitetem Fisch."],
  },
  "visschotel-luxe-5-8-pers": {
    name: ["Deluxe seafood platter for 5–8 people", "Deluxe-Fischplatte für 5–8 Personen"],
    intro: ["A deluxe seafood platter for five to eight people with tuna, salmon, eel and prawns.", "Eine Deluxe-Fischplatte für fünf bis acht Personen mit Thunfisch, Lachs, Aal und Garnelen."],
  },
  "visschotel-luxe-8-10-pers": {
    name: ["Deluxe seafood platter for 8–10 people", "Deluxe-Fischplatte für 8–10 Personen"],
    intro: ["A generous deluxe seafood platter for eight to ten people, festively arranged for the whole table.", "Eine großzügige Deluxe-Fischplatte für acht bis zehn Personen, festlich für die ganze Tischrunde angerichtet."],
  },
  "visschotel-luxe-10-14-pers": {
    name: ["Deluxe seafood platter for 10–14 people", "Deluxe-Fischplatte für 10–14 Personen"],
    intro: ["The largest deluxe seafood platter in the selection, for ten to fourteen people.", "Die größte Deluxe-Fischplatte unserer Auswahl, für zehn bis vierzehn Personen."],
  },
  "visschotel-hapjes-2-3-pers": {
    name: ["Seafood bites platter for 2–3 people", "Platte mit Fischhäppchen für 2–3 Personen"],
    intro: ["A platter of seafood bites for two to three people, ideal with drinks.", "Eine Platte mit kleinen Fischhäppchen für zwei bis drei Personen, ideal zum geselligen Beisammensein."],
  },
  "visschotel-hapjes-3-5-pers": {
    name: ["Seafood bites platter for 3–5 people", "Platte mit Fischhäppchen für 3–5 Personen"],
    intro: ["A varied platter of fish and prawn bites for three to five people.", "Eine abwechslungsreiche Häppchenplatte mit Fisch und Garnelen für drei bis fünf Personen."],
  },
  "visschotel-hapjes-6-10-pers": {
    name: ["Seafood bites platter for 6–10 people", "Platte mit Fischhäppchen für 6–10 Personen"],
    intro: ["A large seafood bites platter for six to ten people, suitable for parties and drinks.", "Eine große Platte mit Fischhäppchen für sechs bis zehn Personen, passend für Feiern und gesellige Runden."],
  },
};

const phrases: Record<string, Translation> = {
  "Huisgemaakte zalmsalade": ["Homemade salmon salad", "Hausgemachter Lachssalat"],
  "Hollandse en roze garnalen": ["North Sea brown shrimp and pink prawns", "Nordseegarnelen und rosa Garnelen"],
  "Gerookte zalm en gerookte paling": ["Smoked salmon and smoked eel", "Räucherlachs und geräucherter Aal"],
  "Makreel, pepermakreel of brado": ["Mackerel, peppered mackerel or brado", "Makrele, Pfeffermakrele oder Brado"],
  "Seafoodsalade en garnituur": ["Seafood salad and garnish", "Meeresfrüchtesalat und Garnitur"],
  "Kort aangebakken tonijn": ["Lightly seared tuna", "Kurz angebratener Thunfisch"],
  "Gerookte en warmgerookte zalm": ["Smoked and hot-smoked salmon", "Räucherlachs und heißgeräucherter Lachs"],
  "Gerookte paling en makreel": ["Smoked eel and mackerel", "Geräucherter Aal und Makrele"],
  "Grote en roze garnalen": ["Large prawns and pink prawns", "Große Garnelen und rosa Garnelen"],
  "Zalmwraps en surimi": ["Salmon wraps and surimi", "Lachs-Wraps und Surimi"],
  "Makreel, pepermakreel en brado": ["Mackerel, peppered mackerel and brado", "Makrele, Pfeffermakrele und Brado"],
  "Rivierkreeftstaartjes en gerookte paling": ["Crayfish tails and smoked eel", "Flusskrebsschwänze und geräucherter Aal"],
  "Vis": ["Fish", "Fisch"],
  "Schaaldieren": ["Crustaceans", "Krebstiere"],
  "Gluten": ["Gluten", "Gluten"],
  "Ei": ["Egg", "Ei"],
  "Mosterd": ["Mustard", "Senf"],
  "Soja": ["Soy", "Soja"],
  "Selderij": ["Celery", "Sellerie"],
  "Melk": ["Milk", "Milch"],
  "Sesam": ["Sesame", "Sesam"],
  "Minimaal één dag vooraf bestellen.": ["Order at least one day in advance.", "Mindestens einen Tag im Voraus bestellen."],
  "Ovale schaal van circa 34 × 25 cm.": ["Oval platter, approximately 34 × 25 cm.", "Ovale Platte, ca. 34 × 25 cm."],
  "Ovale schaal van circa 44 × 30 cm.": ["Oval platter, approximately 44 × 30 cm.", "Ovale Platte, ca. 44 × 30 cm."],
  "Ovale schaal van circa 54 × 34 cm.": ["Oval platter, approximately 54 × 34 cm.", "Ovale Platte, ca. 54 × 34 cm."],
  "Ronde schaal van circa 47 cm doorsnee.": ["Round platter, approximately 47 cm in diameter.", "Runde Platte mit ca. 47 cm Durchmesser."],
  "per stuk": ["each", "pro Stück"],
};

export function localizedPlatterProduct(product: FeestdagenProduct, locale: string): FeestdagenProduct {
  if (locale !== "en" && locale !== "de") return product;
  const copy = variants[product.slug];
  if (!copy) return product; // Other seasonal products keep their existing content.
  const index = locale === "en" ? 0 : 1;
  const translate = (text: string) => {
    const value = phrases[text]?.[index];
    if (!value) throw new Error(`Missing platter translation: ${locale}: ${text}`);
    return value;
  };
  return {
    ...product,
    naam: copy.name[index], intro: copy.intro[index],
    samenstelling: product.samenstelling.map(translate),
    allergenen: product.allergenen.map(translate),
    eenheid: translate(product.eenheid),
    besteltermijn: product.besteltermijn && translate(product.besteltermijn),
    formaat: product.formaat && translate(product.formaat),
  };
}
