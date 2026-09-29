import type { Product } from "./assortiment-data";
const dirksPhotoMap: Record<string,string> = {
  "kabeljauwfilet": "kabeljauwfilet-rugstuk",
  "schol": "schol",
  "scholfilet": "scholfilet",
  "zeebaars": "zeebaars-ca-500-gram",
  "zeebaarsfilet": "zeebaarsfilet-ca-2-x-110-gram",
  "dorade": "dorade-ca-450-gram",
  "dorade-filet": "dorade-filet-ca-2-x-125-gram",
  "tarbotfilet": "tarbotfilet",
  "rode-poon": "rode-poon",
  "roodbaars": "roodbaars",
  "haring": "haring",
  "tonijnfilet": "tonijnfilet",
  "gerookte-zalm-high-seas": "gerookte-zalmfilet",
  "gerookte-wilde-zalm": "gerookte-wilde-zalm",
  "gerookte-bokking": "bokking",
  "gerookte-forelfilet": "gerookte-forelfilet",
  "noorse-garnalen": "noorse-garnalen",
  "gekookte-gambas": "gambas-gekookt",
  "zeeuwse-mosselen": "zeeuwse-mosselen",
  "kokkels": "kokkels",
  "coquilles": "coquilles-vlees",
  "inktvis": "pijlinktvis",
  "scheermessen": "scheermessen",
  "zalmsalade": "zalmsalade",
  "krabsalade": "krabsalade",
  "tonijnsalade": "tonijnsalade",
  "zeewiersalade": "wakame",
  "kibbeling": "kibbeling",
  "lekkerbek": "lekkerbek",
  "broodje-haring": "broodje-haring",
  "vissoep": "vissoep",
  "vispotje": "vispotje-1-persoon",
  "gerookte-zalm-snippers": "gerookte-zalmsnippers",
  "fine-de-claire-oesters": "fines-de-claires",
  "garnalenkroketten": "garnalen-kroket",
  "calamares": "gebakken-inktvisringen",
  "hele-kreeft": "kreeft-levend",
  "sardines": "sardines",
  "wilde-zalmfilet": "wilde-zalmfilet",
  "heilbotfilet": "heilbotfilet",
  "gebakken-mosselen": "gebakken-mosselen",
  "zeekraal": "zeekraal"
};

export type ProductPhoto = {
  src: string;
  alt: string;
  editorial: boolean;
  whole: boolean;
  caption?: string;
  credit?: { author: string; source: string; license?: string; licenseUrl?: string };
};

type InternetPhoto = { src: string; kind: "product" | "serving" | "species"; credit?: ProductPhoto["credit"] };
const INTERNET_BEELDEN: Record<string, InternetPhoto> = {
  "scholfilet": {
    "src": "/images/assortiment-internet/scholfilet.jpg",
    "kind": "serving",
    "credit": {
      "author": "HerryLawford (Herry Lawford)",
      "source": "https://commons.wikimedia.org/wiki/File:Fillet_of_plaice,_2018-(01).jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
    }
  },
  "zeebaarsfilet": {
    "src": "/images/assortiment-internet/zeebaarsfilet.png",
    "kind": "product"
  },
  "tarbot": {
    "src": "/images/assortiment-internet/tarbot.png",
    "kind": "product"
  },
  "tarbotfilet": {
    "src": "/images/assortiment-internet/tarbotfilet.png",
    "kind": "product"
  },
  "wijting": {
    "src": "/images/assortiment-internet/wijting.png",
    "kind": "product"
  },
  "wijtingfilet": {
    "src": "/images/assortiment-internet/wijtingfilet.png",
    "kind": "product"
  },
  "schar": {
    "src": "/images/assortiment-internet/schar.jpg",
    "kind": "species",
    "credit": {
      "author": "\nHans Hillewaert",
      "source": "https://commons.wikimedia.org/wiki/File:Limanda_limanda.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "tonijnfilet": {
    "src": "/images/assortiment-internet/tonijnfilet.png",
    "kind": "product"
  },
  "gerookte-forelfilet": {
    "src": "/images/assortiment-internet/gerookte-forelfilet.jpg",
    "kind": "serving",
    "credit": {
      "author": "Benreis",
      "source": "https://commons.wikimedia.org/wiki/File:Ger%C3%A4uchertes_Forellenfilet_St._Bartholom%C3%A4.JPG",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
    }
  },
  "scheermessen": {
    "src": "/images/assortiment-internet/scheermessen.png",
    "kind": "product"
  },
  "zeewiersalade": {
    "src": "/images/assortiment-internet/zeewiersalade.jpg",
    "kind": "product",
    "credit": {
      "author": "Arnaud 25",
      "source": "https://commons.wikimedia.org/wiki/File:Goma_wakame.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    }
  },
  "vispotje": {
    "src": "/images/assortiment-internet/vispotje.jpg",
    "kind": "serving",
    "credit": {
      "author": "P1898",
      "source": "https://commons.wikimedia.org/wiki/File:Fish_casserole_with_garnish.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    }
  },
  "fine-de-claire-oesters": {
    "src": "/images/assortiment-internet/fine-de-claire-oesters.jpg",
    "kind": "serving",
    "credit": {
      "author": "Aitor22",
      "source": "https://commons.wikimedia.org/wiki/File:%22Fine_de_Claire%22_raw_oysters.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "surimisalade": {
    "src": "/images/assortiment-internet/surimisalade.jpg",
    "kind": "serving",
    "credit": {
      "author": "sunny mama",
      "source": "https://commons.wikimedia.org/wiki/File:Surimi_salad1_(16714326780).jpg",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
    }
  },
  "calamares": {
    "src": "/images/assortiment-internet/calamares.jpg",
    "kind": "serving",
    "credit": {
      "author": "Francesc Fort",
      "source": "https://commons.wikimedia.org/wiki/File:Raci%C3%B3_de_Calamars.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "verse-heilbot": {
    "src": "/images/assortiment-internet/verse-heilbot.jpg",
    "kind": "species",
    "credit": {
      "author": "Matthieu Godbout",
      "source": "https://commons.wikimedia.org/wiki/File:Hippoglossus-hippoglossus-idlm2005.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
    }
  },
  "bot": {
    "src": "/images/assortiment-internet/bot.jpg",
    "kind": "species",
    "credit": {
      "author": "\nHans Hillewaert",
      "source": "https://commons.wikimedia.org/wiki/File:Platichthys_flesus_1.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "ansjovis": {
    "src": "/images/assortiment-internet/ansjovis.jpg",
    "kind": "species",
    "credit": {
      "author": "Diego Delso",
      "source": "https://commons.wikimedia.org/wiki/File:Boquerones_(Engraulis_encrasicolus),_Set%C3%BAbal,_Portugal,_2020-08-01,_DD_16.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "tilapiafilet": {
    "src": "/images/assortiment-internet/tilapiafilet.png",
    "kind": "product"
  },
  "gerookte-sprotfilet": {
    "src": "/images/assortiment-internet/gerookte-sprotfilet.png",
    "kind": "product"
  },
  "gamba-spiesen": {
    "src": "/images/assortiment-internet/gamba-spiesen.jpg",
    "kind": "serving",
    "credit": {
      "author": "Eximiousincorp",
      "source": "https://commons.wikimedia.org/wiki/File:Grilled_Shrimp_Skewers.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "gamba-tempura": {
    "src": "/images/assortiment-internet/gamba-tempura.jpg",
    "kind": "serving",
    "credit": {
      "author": "些細な日常",
      "source": "https://commons.wikimedia.org/wiki/File:Prawn-tempura-box.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "gebakken-mosselen": {
    "src": "/images/assortiment-internet/gebakken-mosselen.jpg",
    "kind": "serving",
    "credit": {
      "author": "E4024",
      "source": "https://commons.wikimedia.org/wiki/File:Fried_mussels.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "wilde-zalmfilet": {
    "src": "/images/assortiment-internet/wilde-zalmfilet.png",
    "kind": "product",
    "credit": {
      "author": "USFWS",
      "source": "https://commons.wikimedia.org/wiki/File:Sockeye_salmon_fillets.png",
      "license": "Public domain",
      "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/"
    }
  },
  "hele-kreeft": {
    "src": "/images/assortiment-internet/hele-kreeft.jpg",
    "kind": "species",
    "credit": {
      "author": "Arnaud 25",
      "source": "https://commons.wikimedia.org/wiki/File:Homard_breton.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    }
  },
  "sardines": {
    "src": "/images/assortiment-internet/sardines.jpg",
    "kind": "product",
    "credit": {
      "author": "Marek Ślusarczyk (Tupungato) Photo portfolio",
      "source": "https://commons.wikimedia.org/wiki/File:27_Sardines_in_fish_market_in_Europe_-_vismarkt_Fischmarkt.jpg",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
    }
  },
  "victoriabaars": {
    "src": "/images/assortiment-internet/victoriabaars.jpg",
    "kind": "product",
    "credit": {
      "author": "Siam Canadian India",
      "source": "https://commons.wikimedia.org/wiki/File:Nile_Perch_Fillets.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "gamba-kroketten": {
    "src": "/images/assortiment-internet/gamba-kroketten.jpg",
    "kind": "serving",
    "credit": {
      "author": "AchilleT",
      "source": "https://commons.wikimedia.org/wiki/File:GarnaalKrokette1.JPG",
      "license": "Public domain",
      "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/"
    }
  },
  "blacktiger-garnalen": {
    "src": "/images/assortiment-internet/blacktiger-garnalen.jpg",
    "kind": "product",
    "credit": {
      "author": "Almandine; Epipelagic (ruler removal)",
      "source": "https://commons.wikimedia.org/wiki/File:Penaeus_monodon.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "gebakken-ansjovis": {
    "src": "/images/assortiment-internet/gebakken-ansjovis.jpg",
    "kind": "serving",
    "credit": {
      "author": "E4024",
      "source": "https://commons.wikimedia.org/wiki/File:Hamsi_tava_-_roka.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "gerookte-zalmmoot": {
    "src": "/images/assortiment-internet/warm-gerookte-zalmmoten.jpg",
    "kind": "product"
  },
  "hollandse-garnalen": {
    "src": "/images/assortiment-internet/hollandse-garnalen-solt.jpeg",
    "kind": "product",
    "credit": {
      "author": "Dulk Haasnoot Seafood",
      "source": "https://www.dulkhaasnoot.nl/onze-producten/hollandse-garnalen/"
    }
  },
  "zeekraal": {
    "src": "/images/assortiment-internet/zeekraalsalade.jpg",
    "kind": "product",
    "credit": {
      "author": "Hortensja Bukietowa",
      "source": "https://commons.wikimedia.org/wiki/File:Verse_zeekraal01.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  }
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
  "zeeuwse-mosselen": { src: "/images/editorial/zeeuwse-mosselen.webp", alt: "Zeeuwse mosselen in gesloten schelpen" },
  "haring": { src: "/images/editorial/hollandse-nieuwe-uitjes.webp", alt: "Hollandse haring met uitjes en augurk — serveerinspiratie" },
  "gravad-lax": { src: "/images/recepten/gravlaks.webp", alt: "Gesneden gravlaks met dille — serveerinspiratie" },
  "lekkerbek": { src: "/images/recepten/lekkerbek-koolsalade.webp", alt: "Gebakken heek als lekkerbek met koolsalade — serveerinspiratie" },
  "broodje-haring": { src: "/images/recepten/broodje-haring-uitjes.webp", alt: "Broodje haring met uitjes — serveerinspiratie" },
  "vissoep": { src: "/images/recepten/romige-vissoep.webp", alt: "Romige vissoep — serveerinspiratie" },
};

/** One source for catalogue cards, details and metadata. */
function sourcePhoto(product: Product): ProductPhoto | null {
  const beeld = PRODUCT_BEELDEN[product.slug];
  if (beeld) return { ...beeld, editorial: true, whole: ["schol", "zeebaars"].includes(product.slug) };
  if (product.slug === "varlaks-zalm") {
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
"zeeuwse-mosselen":["Zeeland mussels in closed shells","Zeeländische Miesmuscheln in geschlossenen Schalen"],
"haring":["Dutch herring with onion and gherkin, serving suggestion","Holländischer Matjes mit Zwiebeln und Gewürzgurken, Serviervorschlag"],
"gravad-lax":["Sliced gravlax with dill, serving suggestion","Aufgeschnittener Graved Lachs mit Dill, Serviervorschlag"],
"lekkerbek":["Fried battered hake with coleslaw, serving suggestion","Frittierter Seehecht im Backteig mit Krautsalat, Serviervorschlag"],
"broodje-haring":["Herring roll with onion, serving suggestion","Matjesbrötchen mit Zwiebeln, Serviervorschlag"],
"vissoep":["Creamy fish soup, serving suggestion","Cremige Fischsuppe, Serviervorschlag"],
"varlaks-zalm":["Salmon fillet with lemon and dill, serving suggestion","Lachsfilet mit Zitrone und Dill, Serviervorschlag"],
"kibbeling":["Crispy kibbeling with ravigote sauce, serving suggestion","Knuspriger Kibbeling mit Ravigotesauce, Serviervorschlag"],
"gerookte-zalm-high-seas":["Thin slices of smoked salmon with dill on a platter, serving suggestion","Dünne Räucherlachsscheiben mit Dill auf einer Platte, Serviervorschlag"],
"creuse-oesters":["Cupped Pacific oysters served on ice with lemon, serving suggestion","Felsenaustern auf Eis mit Zitrone, Serviervorschlag"],
"bosje-sprot":["Smoked sprats, Sprattus sprattus","Geräucherte Sprotten, Sprattus sprattus"]
};
export function productPhoto(product:Product,locale="nl"):ProductPhoto|null{
 const source=dirksPhotoMap[product.slug as keyof typeof dirksPhotoMap];
 if(source){
  const l=locale==="de"?"de":locale==="en"?"en":"nl";
  const alt={nl:`${product.naam} op een lichte ondergrond — voorbeeldfoto`,en:`${product.naam} on a light background — illustrative photo`,de:`${product.naam} auf hellem Hintergrund — Beispielfoto`}[l];
  const caption={nl:"Voorbeeldfoto; herkomst, presentatie en beschikbaarheid bij ons kunnen verschillen.",en:"Illustrative photo; origin, presentation and availability at our shop may differ.",de:"Beispielfoto; Herkunft, Präsentation und Verfügbarkeit bei uns können abweichen."}[l];
  return {src:`/images/dirks/${source}.webp`,alt,caption,editorial:true,whole:false};
 }
 const internet=INTERNET_BEELDEN[product.slug];
 if(internet){
  const l=locale==="de"?"de":locale==="en"?"en":"nl";
  const labels={nl:{product:"Productfoto ter illustratie",serving:"Serveervoorbeeld",species:"Hoofdingrediënt ter illustratie"},en:{product:"Illustrative product photograph",serving:"Serving suggestion",species:"Illustrative photograph of the main ingredient"},de:{product:"Produktfoto zur Illustration",serving:"Serviervorschlag",species:"Beispielfoto der Hauptzutat"}}[l];
  const captions={nl:{product:"Foto ter illustratie; uitvoering en presentatie kunnen verschillen.",serving:"Serveervoorbeeld; dit is geen foto van onze eigen bereiding.",species:"Foto van het hoofdingrediënt; de aangeboden snit of bereiding kan verschillen."},en:{product:"Illustrative photograph; presentation and preparation may differ.",serving:"Serving suggestion; this is not a photograph of our own preparation.",species:"Photograph of the main ingredient; the cut or preparation offered may differ."},de:{product:"Beispielfoto; Zubereitung und Präsentation können abweichen.",serving:"Serviervorschlag; kein Foto unserer eigenen Zubereitung.",species:"Foto der Hauptzutat; der angebotene Zuschnitt oder die Zubereitung kann abweichen."}}[l];
  const subjects:Record<string,Record<string,string>>={
   kabeljauwwangen:{nl:"Koppen van kabeljauw, waaruit de wangen worden gesneden",en:"Cod heads, from which the cheeks are cut",de:"Kabeljauköpfe, aus denen die Backen geschnitten werden"},
   zeebrasemfilet:{nl:"Hele zeebrasem (Pagellus bogaraveo), vóór het fileren",en:"Whole blackspot seabream (Pagellus bogaraveo), before filleting",de:"Ganze Graubarschbrasse (Pagellus bogaraveo), vor dem Filetieren"},
   "zeekraalsalade":{nl:"Verse zeekraal, het hoofdingrediënt van zeekraalsalade",en:"Fresh samphire, the main ingredient of samphire salad",de:"Frischer Queller, die Hauptzutat von Quellersalat"},
   "hele-kreeft":{nl:"Europese kreeften (Homarus gammarus), vóór het koken",en:"European lobsters (Homarus gammarus), before cooking",de:"Europäische Hummer (Homarus gammarus), vor dem Kochen"},
   skrei:{nl:"Atlantische kabeljauw (Gadus morhua), de vissoort waartoe skrei behoort",en:"Atlantic cod (Gadus morhua), the species to which skrei belongs",de:"Atlantischer Kabeljau (Gadus morhua), die Fischart, zu der Skrei gehört"},
  };
  return {src:internet.src,alt:subjects[product.slug]?.[l]||product.naam+" — "+labels[internet.kind],caption:captions[internet.kind],editorial:true,whole:internet.kind!=="serving",credit:internet.credit};
 }
 const photo=sourcePhoto(product);if(!photo)return null;
 if(["krabsalade","tonijnsalade","zalmsalade"].includes(product.slug))photo.caption=locale==="en"?"Serving illustration; the ingredients and presentation in our shop may differ.":locale==="de"?"Servierbeispiel; Zutaten und Präsentation in unserem Geschäft können abweichen.":"Serveervoorbeeld; samenstelling en presentatie in onze winkel kunnen afwijken.";
 if(locale==="nl")return photo;
 const translated=ALTS[product.slug];
 return {...photo,alt:translated?translated[locale==="de"?1:0]:product.naam};
}
