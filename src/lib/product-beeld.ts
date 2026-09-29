import type { Product } from "./assortiment-data";

export type ProductPhoto = {
  src: string;
  alt: string;
  editorial: boolean;
  whole: boolean;
  credit?: { author: string; source: string; license: string; licenseUrl: string };
};

// Product-matched photos, with attribution wherever an external license requires it.
const PRODUCT_BEELDEN: Record<string, Pick<ProductPhoto, "src" | "alt" | "credit">> = {
  "gerookte-zalm-high-seas": { src: "/images/editorial/gerookte-zalm-serveervoorbeeld.png", alt: "Gerookte zalm op een schaal met dille — serveerinspiratie" },
  "creuse-oesters": { src: "/images/editorial/creuse-oesters-serveervoorbeeld.png", alt: "Creuse oesters op ijs met citroen — serveerinspiratie" },
  "bosje-sprot": { src: "/images/producten-hd/sprot-garitzko.jpg", alt: "Gerookte sprot, Sprattus sprattus", credit: { author: "Garitzko", source: "https://commons.wikimedia.org/wiki/File:Kieler_Sprotten_(Sprattus_sprattus).jpg", license: "Public domain", licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/" } },
  "krabsalade": { src: "/images/editorial/krabsalade.webp", alt: "Romige krabsalade met lenteui — serveerinspiratie" },
  "noorse-garnalen": { src: "/images/editorial/noorse-garnalen.webp", alt: "Gepelde Noorse garnalen met citroen — serveerinspiratie" },
  "schol": {
    src: "/images/producten-hd/schol-hans-hillewaert.jpg",
    alt: "Echte Noordzeeschol (Pleuronectes platessa), gefotografeerd door Hans Hillewaert",
    credit: {
      author: "Hans Hillewaert",
      source: "https://commons.wikimedia.org/wiki/File:Pleuronectes_platessa.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
  "zeebaars": { src: "/images/editorial/zeebaars.webp", alt: "Hele zeebaars op een witte schaal" },
  "zalmsalade": { src: "/images/editorial/zalmsalade.webp", alt: "Romige zalmsalade met dille — serveerinspiratie" },
  "tonijnsalade": { src: "/images/editorial/tonijnsalade.webp", alt: "Tonijnsalade met ui en augurk — serveerinspiratie" },
  "garnalensalade": { src: "/images/editorial/garnalensalade.webp", alt: "Hollandse garnalen in cocktailsaus — serveerinspiratie" },
  "zeeuwse-mosselen": { src: "/images/editorial/zeeuwse-mosselen.webp", alt: "Zeeuwse mosselen in gesloten schelpen" },
  "haring": { src: "/images/editorial/hollandse-nieuwe-uitjes.webp", alt: "Hollandse haring met uitjes en augurk — serveerinspiratie" },
  "gravad-lax": { src: "/images/recepten/gravlaks.webp", alt: "Gesneden gravlaks met dille — serveerinspiratie" },
  "lekkerbek": { src: "/images/recepten/lekkerbek-koolsalade.webp", alt: "Krokante lekkerbek met koolsalade — serveerinspiratie" },
  "broodje-haring": { src: "/images/recepten/broodje-haring-uitjes.webp", alt: "Broodje haring met uitjes — serveerinspiratie" },
  "vissoep": { src: "/images/recepten/romige-vissoep.webp", alt: "Romige vissoep — serveerinspiratie" },
  "poke-bowl-zalm": { src: "/images/recepten/poke-bowl-verse-zalm.webp", alt: "Pokébowl met zalm, rijst en groenten — serveerinspiratie" },
  "visschaal": { src: "/images/editorial/visschaal-inspiratie.webp", alt: "Voorbeeld van een visschaal; inhoud en formaat in overleg" },
  "feestschotel": { src: "/images/editorial/feestschaal-voorbeeld.webp", alt: "Voorbeeld van een feestschaal; inhoud en formaat in overleg" },
};

/** One source for catalogue cards, details and metadata. */
function sourcePhoto(product: Product): ProductPhoto | null {
  const beeld = PRODUCT_BEELDEN[product.slug];
  if (beeld) return { ...beeld, editorial: true, whole: ["schol", "zeebaars"].includes(product.slug) };
  if (["varlaks-zalm", "zalmfilet"].includes(product.slug)) {
    return { src: "/images/editorial/zalm.webp", editorial: true, whole: false, alt: "Zalm met citroen en dille — serveerinspiratie" };
  }
  if (product.slug === "kibbeling") {
    return { src: "/images/editorial/kibbeling.webp", editorial: true, whole: false, alt: "Krokante kibbeling met saus" };
  }
  return product.photo ? { src: product.photo, editorial: false, whole: true, alt: product.naam } : null;
}
const ALTS:Record<string,readonly[string,string]>={
"krabsalade":["Creamy crab salad with spring onion, serving suggestion","Cremiger Krabbensalat mit Frühlingszwiebeln, Serviervorschlag"],
"noorse-garnalen":["Peeled northern shrimp with lemon, serving suggestion","Geschälte nordische Garnelen mit Zitrone, Serviervorschlag"],
"schol":["North Sea plaice, Pleuronectes platessa, photographed by Hans Hillewaert","Nordseescholle, Pleuronectes platessa, fotografiert von Hans Hillewaert"],
"zeebaars":["Whole sea bass on a white platter","Ganzer Wolfsbarsch auf einer weißen Platte"],
"zalmsalade":["Creamy salmon salad with dill, serving suggestion","Cremiger Lachssalat mit Dill, Serviervorschlag"],
"tonijnsalade":["Tuna salad with onion and gherkin, serving suggestion","Thunfischsalat mit Zwiebeln und Gewürzgurken, Serviervorschlag"],
"garnalensalade":["Dutch shrimp in cocktail sauce, serving suggestion","Holländische Garnelen in Cocktailsauce, Serviervorschlag"],
"zeeuwse-mosselen":["Zeeland mussels in closed shells","Zeeländische Miesmuscheln in geschlossenen Schalen"],
"haring":["Dutch herring with onion and gherkin, serving suggestion","Holländischer Matjes mit Zwiebeln und Gewürzgurken, Serviervorschlag"],
"gravad-lax":["Sliced gravlax with dill, serving suggestion","Aufgeschnittener Graved Lachs mit Dill, Serviervorschlag"],
"lekkerbek":["Crispy battered fish with coleslaw, serving suggestion","Knuspriger Backfisch mit Krautsalat, Serviervorschlag"],
"broodje-haring":["Herring roll with onion, serving suggestion","Matjesbrötchen mit Zwiebeln, Serviervorschlag"],
"vissoep":["Creamy fish soup, serving suggestion","Cremige Fischsuppe, Serviervorschlag"],
"poke-bowl-zalm":["Salmon poke bowl with rice and vegetables, serving suggestion","Lachs-Poké-Bowl mit Reis und Gemüse, Serviervorschlag"],
"visschaal":["Example seafood platter; contents and size agreed individually","Beispiel einer Fischplatte; Inhalt und Größe nach Absprache"],
"feestschotel":["Example celebration platter; contents and size agreed individually","Beispiel einer Festplatte; Inhalt und Größe nach Absprache"],
"zalmfilet":["Salmon fillet with lemon and dill, serving suggestion","Lachsfilet mit Zitrone und Dill, Serviervorschlag"],
"varlaks-zalm":["Salmon fillet with lemon and dill, serving suggestion","Lachsfilet mit Zitrone und Dill, Serviervorschlag"],
"kibbeling":["Crispy kibbeling with ravigote sauce, serving suggestion","Knuspriger Kibbeling mit Ravigotesauce, Serviervorschlag"],
"gerookte-zalm-high-seas":["Thin slices of smoked salmon with dill on a platter, serving suggestion","Dünne Räucherlachsscheiben mit Dill auf einer Platte, Serviervorschlag"],
"creuse-oesters":["Cupped Pacific oysters served on ice with lemon, serving suggestion","Felsenaustern auf Eis mit Zitrone, Serviervorschlag"],
"bosje-sprot":["Smoked sprats, Sprattus sprattus","Geräucherte Sprotten, Sprattus sprattus"]
};
export function productPhoto(product:Product,locale="nl"):ProductPhoto|null{
 const photo=sourcePhoto(product);if(!photo)return null;
 if(locale==="nl")return photo;
 const translated=ALTS[product.slug];
 return {...photo,alt:translated?translated[locale==="de"?1:0]:product.naam};
}
