import { getProduct, type Product, type Categorie } from "./assortiment-data";
import { PRODUCT_TRANSLATIONS } from "./product-translations";

export { siteLanguage, type SiteLanguage } from "./language";
import { siteLanguage, type SiteLanguage } from "./language";

const ALLERGENS: Record<string, readonly [string, string]> = {
  VIS: ["FISH", "FISCH"], SCHAALDIEREN: ["CRUSTACEANS", "KREBSTIERE"], WEEKDIEREN: ["MOLLUSCS", "WEICHTIERE"],
  EIEREN: ["EGGS", "EIER"], MOSTERD: ["MUSTARD", "SENF"], MELK: ["MILK", "MILCH"], SOJA: ["SOYA", "SOJA"],
  GLUTEN: ["GLUTEN", "GLUTEN"], SULFIET: ["SULPHITES", "SULFITE"], SELDERIJ: ["CELERY", "SELLERIE"], SESAMZAAD: ["SESAME", "SESAM"],
  "GLUTEN (tarwe)": ["GLUTEN (wheat)", "GLUTEN (Weizen)"],
  "kan MELK bevatten": ["may contain MILK", "kann MILCH enthalten"],
  "kan EIEREN, GLUTEN, MELK bevatten": ["may contain EGGS, GLUTEN, MILK", "kann EIER, GLUTEN, MILCH enthalten"],
};
export function allergenLabel(label: string, locale: string): string {
  const lang = siteLanguage(locale);
  if (lang === "nl") return label;
  const value = ALLERGENS[label];
  if (!value) throw new Error(`Missing allergen translation: ${label}`);
  return value[lang === "en" ? 0 : 1];
}

// Scientific identities are preserved, not translated or guessed from marketing names.
const SPECIES: Record<string, readonly [string, string]> = {
  "Gadus morhua": ["Cod", "Kabeljau"], "Pleuronectes platessa": ["Plaice", "Scholle"], "Solea solea": ["Dover sole", "Seezunge"],
  "Dicentrarchus labrax": ["Sea bass", "Wolfsbarsch"], "Sparus aurata": ["Gilthead sea bream", "Dorade"], "Scophthalmus rhombus": ["Brill", "Glattbutt"],
  "Psetta maxima": ["Turbot", "Steinbutt"], "Merluccius merluccius": ["Hake", "Seehecht"], "Melanogrammus aeglefinus": ["Haddock", "Schellfisch"],
  "Merlangius merlangus": ["Whiting", "Wittling"], "Trigla lucerna": ["Tub gurnard", "Roter Knurrhahn"], "Limanda limanda": ["Dab", "Kliesche"],
  "Sebastes marinus": ["Redfish", "Rotbarsch"], "Clupea harengus": ["Herring", "Hering"], "Salmo salar": ["Atlantic salmon", "Atlantischer Lachs"],
  "Oncorhynchus mykiss": ["Rainbow trout", "Regenbogenforelle"], "Thunnus albacares": ["Yellowfin tuna", "Gelbflossenthun"], "Lophius piscatorius": ["Monkfish", "Seeteufel"],
  "Oncorhynchus spp.": ["Wild Pacific salmon", "Pazifischer Wildlachs"], "Hippoglossus hippoglossus": ["Halibut", "Heilbutt"], "Sprattus sprattus": ["Sprat", "Sprotte"],
  "Crangon crangon": ["Brown shrimp", "Nordseegarnelen"], "Pandalus borealis": ["Northern prawns", "Nordische Garnelen"],
  "Litopenaeus vannamei": ["Prawns", "Garnelen"], "Penaeus vannamei": ["Prawns", "Garnelen"], "Penaeus spp.": ["Prawns", "Garnelen"],
  "Mytilus edulis": ["Mussels", "Miesmuscheln"], "Crassostrea gigas": ["Oysters", "Austern"], "Cerastoderma edule": ["Cockles", "Herzmuscheln"],
  "Pecten maximus": ["Scallops", "Jakobsmuscheln"], "Cancer pagurus": ["Brown crab", "Taschenkrebs"], "Loligo vulgaris": ["Squid", "Kalmar"],
  "Ensis directus": ["Razor clams", "Schwertmuscheln"], "Molva molva": ["Ling", "Leng"], "Leucoraja naevus": ["Skate", "Rochen"],
  "Nephrops norvegicus": ["Langoustines", "Kaisergranat"], "Ruditapes decussatus": ["Carpet-shell clams", "Venusmuscheln"],
  "Anarhichas lupus": ["Atlantic wolffish", "Seewolf"], "Xiphias gladius": ["Swordfish", "Schwertfisch"], "Eutrigla gurnardus": ["Grey gurnard", "Grauer Knurrhahn"],
  "Homarus gammarus": ["Lobster", "Hummer"], "Penaeus monodon": ["Tiger prawns", "Tigergarnelen"], "Buccinum undatum": ["Whelks", "Wellhornschnecken"],
  "Sander lucioperca": ["Pike-perch", "Zander"], "Microstomus kitt": ["Lemon sole", "Rotzunge"], "Platichthys flesus": ["Flounder", "Flunder"],
  "Sardina pilchardus": ["Sardines", "Sardinen"], "Engraulis encrasicolus": ["Anchovies", "Sardellen"], "Osmerus eperlanus": ["Smelt", "Stint"],
  "Salmo trutta": ["Sea trout", "Meerforelle"], "Oreochromis niloticus": ["Tilapia", "Tilapia"], "Lates niloticus": ["Nile perch", "Viktoriabarsch"],
  "Astacus spp.": ["Crayfish", "Flusskrebs"], "Littorina littorea": ["Periwinkles", "Strandschnecken"], "Pagellus bogaraveo": ["Blackspot sea bream", "Rotbrasse"],
  "Lutjanus spp.": ["Red snapper", "Red Snapper"], "Salicornia": ["Samphire", "Queller"],
};
const TAILS: Record<string, readonly [string, string]> = {
  ". Geen toegevoegde stoffen.": [". No added ingredients.", ". Keine zugesetzten Zutaten."],
  ".": [".", "."], ", zout, rook.": [", salt, smoke.", ", Salz, Rauch."],
  ", zout, water.": [", salt, water.", ", Salz, Wasser."], ", water, zout.": [", water, salt.", ", Wasser, Salz."],
  ", zout.": [", salt.", ", Salz."], ", zout, azijn.": [", salt, vinegar.", ", Salz, Essig."],
  ", kruiden, olie.": [", herbs, oil.", ", Kräuter, Öl."],
  ", water, zout, zuurteregelaar.": [", water, salt, acidity regulator.", ", Wasser, Salz, Säureregulator."],
  ", zonnebloemolie, zout, rook.": [", sunflower oil, salt, smoke.", ", Sonnenblumenöl, Salz, Rauch."],
  ". Geen toegevoegde stoffen. Rauwe haring, conform EU parasietenverordening voorbehandeld.": [". No added ingredients. Raw herring, pre-treated in accordance with EU parasite-control requirements.", ". Keine zugesetzten Zutaten. Roher Hering, nach den EU-Vorgaben zur Parasitenkontrolle vorbehandelt."],
  ", zout. Kan conserveermiddel E223 bevatten [SULFIET].": [", salt. May contain preservative E223 [SULPHITES].", ", Salz. Kann das Konservierungsmittel E223 [SULFITE] enthalten."],
  ", zout. Kan conserveermiddel (E221) bevatten.": [", salt. May contain preservative E221 (sulphites).", ", Salz. Kann das Konservierungsmittel E221 (Sulfite) enthalten."],
  ", zout, suiker, dille.": [", salt, sugar, dill.", ", Salz, Zucker, Dill."],
  ". Bij gebakken bereiding: TARWEBLOEM [GLUTEN].": [". When fried: WHEAT FLOUR [GLUTEN].", ". Bei gebratener Zubereitung: WEIZENMEHL [GLUTEN]."],
  ". Gebakken in boter [MELK] en TARWEBLOEM [GLUTEN].": [". Fried in butter [MILK] and WHEAT FLOUR [GLUTEN].", ". In Butter [MILCH] und WEIZENMEHL [GLUTEN] gebraten."],
  ", olijfolie, azijn, zout.": [", olive oil, vinegar, salt.", ", Olivenöl, Essig, Salz."],
};
const PREPARED: Record<string, readonly [string, string]> = {
  "hele-kreeft": ["Live lobster [CRUSTACEANS]. Ask about the species and current product information.", "Lebender Hummer [KREBSTIERE]. Fragen Sie nach der Art und aktuellen Produktangaben."],
  zalmsalade: ["Salmon [FISH], mayonnaise (sunflower oil, EGGS, vinegar, MUSTARD), onion, dill, salt, pepper.", "Lachs [FISCH], Mayonnaise (Sonnenblumenöl, EIER, Essig, SENF), Zwiebel, Dill, Salz, Pfeffer."],
  krabsalade: ["Crab / surimi [FISH, CRUSTACEANS], mayonnaise (EGGS, MUSTARD), spring onion, salt, paprika.", "Krabben / Surimi [FISCH, KREBSTIERE], Mayonnaise (EIER, SENF), Frühlingszwiebel, Salz, Paprika."],
  tonijnsalade: ["Tuna (Thunnus albacares) [FISH], mayonnaise (EGGS, MUSTARD), onion, gherkin, salt, pepper.", "Thunfisch (Thunnus albacares) [FISCH], Mayonnaise (EIER, SENF), Zwiebel, Gewürzgurke, Salz, Pfeffer."],
  zeewiersalade: ["Wakame seaweed (Undaria pinnatifida), sesame oil, SOY sauce (water, soya beans [SOYA], wheat [GLUTEN], salt), vinegar, sugar, sesame seeds [SESAME].", "Wakame-Algen (Undaria pinnatifida), Sesamöl, SOJAsauce (Wasser, Sojabohnen [SOJA], Weizen [GLUTEN], Salz), Essig, Zucker, Sesamsamen [SESAM]."],
  kibbeling: ["Pollak [FISH], WHEAT FLOUR, water, salt, raising agents (E450, E500), vegetable oil. Deep-fried. Ravigote sauce available separately; ask about its ingredients and allergens.", "Pollak [FISCH], WEIZENMEHL, Wasser, Salz, Backtriebmittel (E450, E500), Pflanzenöl. Frittiert. Ravigotesauce separat erhältlich; fragen Sie nach Zutaten und Allergenen."],
  lekkerbek: ["Hake [FISH], WHEAT FLOUR, water, salt, raising agent, vegetable oil. Deep-fried.", "Seehecht [FISCH], WEIZENMEHL, Wasser, Salz, Backtriebmittel, Pflanzenöl. Frittiert."],
  "broodje-haring": ["HERRING (Clupea harengus) [FISH], bread roll (WHEAT FLOUR, yeast, water, salt) [GLUTEN], onion, gherkin (cucumber, vinegar, sugar, MUSTARD), salt.", "HERING (Clupea harengus) [FISCH], Brötchen (WEIZENMEHL, Hefe, Wasser, Salz) [GLUTEN], Zwiebel, Gewürzgurke (Gurke, Essig, Zucker, SENF), Salz."],
  vissoep: ["Fresh fish (varies) [FISH], water, onion, carrot, CELERY, leek, potato, herbs, salt. May contain cream [MILK].", "Frischer Fisch (wechselnd) [FISCH], Wasser, Zwiebel, Karotte, SELLERIE, Lauch, Kartoffel, Kräuter, Salz. Kann Sahne [MILCH] enthalten."],
  vispotje: ["Fresh fish (varies) [FISH], cooking cream [MILK], onion, carrot, CELERY, herbs, salt, pepper.", "Frischer Fisch (wechselnd) [FISCH], Kochsahne [MILCH], Zwiebel, Karotte, SELLERIE, Kräuter, Salz, Pfeffer."],
  surimisalade: ["Surimi (white fish [FISH], starch, sugar), mayonnaise (sunflower oil, EGGS, vinegar, MUSTARD), onion, herbs, salt. May contain CRUSTACEANS and SOYA.", "Surimi (Weißfisch [FISCH], Stärke, Zucker), Mayonnaise (Sonnenblumenöl, EIER, Essig, SENF), Zwiebel, Kräuter, Salz. Kann KREBSTIERE und SOJA enthalten."],
  garnalenkroketten: ["Brown shrimp (Crangon crangon) [CRUSTACEANS], béchamel (WHEAT FLOUR [GLUTEN], butter [MILK], MILK), breadcrumbs [GLUTEN], EGGS, herbs, salt. Deep-fried.", "Nordseegarnelen (Crangon crangon) [KREBSTIERE], Béchamel (WEIZENMEHL [GLUTEN], Butter [MILCH], MILCH), Paniermehl [GLUTEN], EIER, Kräuter, Salz. Frittiert."],
  calamares: ["Squid (Loligo vulgaris) [MOLLUSCS], WHEAT FLOUR [GLUTEN], water, salt, vegetable oil. Deep-fried.", "Kalmar (Loligo vulgaris) [WEICHTIERE], WEIZENMEHL [GLUTEN], Wasser, Salz, Pflanzenöl. Frittiert."],
  "gamba-tempura": ["Prawns (Penaeus vannamei) [CRUSTACEANS], tempura batter (WHEAT FLOUR [GLUTEN], water, raising agent), vegetable oil. Deep-fried.", "Garnelen (Penaeus vannamei) [KREBSTIERE], Tempurateig (WEIZENMEHL [GLUTEN], Wasser, Backtriebmittel), Pflanzenöl. Frittiert."],
  "gebakken-mosselen": ["Mussels (Mytilus edulis) [MOLLUSCS], breadcrumbs/WHEAT FLOUR [GLUTEN], EGGS, vegetable oil. Garlic sauce: mayonnaise (EGGS, MUSTARD). Deep-fried.", "Miesmuscheln (Mytilus edulis) [WEICHTIERE], Paniermehl/WEIZENMEHL [GLUTEN], EIER, Pflanzenöl. Knoblauchsauce: Mayonnaise (EIER, SENF). Frittiert."],
  "gamba-kroketten": ["Prawns (Penaeus vannamei) [CRUSTACEANS], béchamel (WHEAT FLOUR [GLUTEN], butter [MILK], MILK), breadcrumbs [GLUTEN], EGGS, herbs. Deep-fried.", "Garnelen (Penaeus vannamei) [KREBSTIERE], Béchamel (WEIZENMEHL [GLUTEN], Butter [MILCH], MILCH), Paniermehl [GLUTEN], EIER, Kräuter. Frittiert."],
  "blacktiger-garnalen": ["Black Tiger prawns [CRUSTACEANS]. Ask about the current ingredients and allergens on the pack.","Black-Tiger-Garnelen [KREBSTIERE]. Fragen Sie nach Zutaten und Allergenen auf der aktuellen Verpackung."],
  "gebakken-ansjovis": ["Anchovies [FISH]. Ask about the ingredients and allergens of the preparation.","Sardellen [FISCH]. Fragen Sie nach Zutaten und Allergenen der Zubereitung."],
  "zeekraal": ["Samphire. Ask about current product information.","Queller. Fragen Sie nach aktuellen Produktangaben."],
};

export function translatedIngredients(product: Product, lang: SiteLanguage): string {
  if (lang === "nl") return product.ingredienten;
  const index = lang === "en" ? 0 : 1;
  if (PREPARED[product.slug]) return PREPARED[product.slug][index];
  const match = product.ingredienten.match(/^(.*?)\s*\[(VIS|SCHAALDIEREN|WEEKDIEREN)\]([\s\S]+)$/);
  const scientific = match?.[1].match(/\(([^)]+)\)/)?.[1] ?? match?.[1].trim();
  if (!match || !scientific || !SPECIES[scientific] || !TAILS[match[3]]) throw new Error(`Missing ingredients translation: ${product.slug}`);
  return `${SPECIES[scientific][index]} (${scientific}) [${allergenLabel(match[2], lang)}]${TAILS[match[3]][index]}`;
}
export function localizeProduct(product: Product, locale: string): Product {
  const lang = siteLanguage(locale);
  if (lang === "nl") return product;
  const t = PRODUCT_TRANSLATIONS[product.slug];
  if (!t) throw new Error(`Missing product translation: ${product.slug}`);
  const index = lang === "en" ? 0 : 2;
  return {...product, naam: t[index], desc: t[index + 1], ingredienten: translatedIngredients(product, lang), bevat: product.bevat.map(a => allergenLabel(a, lang)), badge: product.badge === "Biologisch" ? (lang === "en" ? "Organic" : "Bio") : product.badge};
}
export function localizedProduct(slug: string, locale: string) {
  const product = getProduct(slug);
  return product ? localizeProduct(product, locale) : undefined;
}
export const CATEGORY_NAMES: Record<SiteLanguage, Record<Categorie, string>> = {
  nl: {"verse-vis":"Verse vis", "gerookte-vis":"Gerookte vis", "schaal-schelp":"Schaal- & schelpdieren", vissalades:"Vissalades", bereid:"Bereid & snacks", zeegroenten:"Zeegroenten"},
  en: {"verse-vis":"Fresh fish", "gerookte-vis":"Smoked fish", "schaal-schelp":"Shellfish", vissalades:"Fish salads", bereid:"Prepared food & snacks", zeegroenten:"Sea vegetables"},
  de: {"verse-vis":"Frischer Fisch", "gerookte-vis":"Räucherfisch", "schaal-schelp":"Schalen- und Weichtiere", vissalades:"Fischsalate", bereid:"Zubereitete Speisen & Snacks", zeegroenten:"Meeresgemüse"},
};
