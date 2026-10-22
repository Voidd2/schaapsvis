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
    "src": "/images/assortiment-internet/tarbot-ecomare.jpg",
    "kind": "product",
    "credit": {
      "author": "Ecomare / Oscar Bos",
      "source": "https://commons.wikimedia.org/wiki/File:Ecomare_-_tarbot_(tarbot-4072-ogb).jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  "tarbotfilet": {
    "src": "/images/assortiment-internet/tarbotfilet.png",
    "kind": "product"
  },
  "wijting": {
    "src": "/images/assortiment-internet/wijting-commons.jpg",
    "kind": "product",
    "credit": {
      "author": "Peter van der Sluijs",
      "source": "https://commons.wikimedia.org/wiki/File:De_wijting_is_een_goede_sportvis_maar_ook_heel_lekker.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
    }
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
    "src": "/images/editorial/gerookte-forelfilet-serveervoorbeeld.webp",
    "kind": "serving",
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
    "src": "/images/assortiment-internet/verse-heilbot-body-commons.webp",
    "kind": "product",
    "credit": {
      "author": "François Nguyen",
      "source": "https://commons.wikimedia.org/wiki/File:Halibut_fish_body.jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
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
    "src": "/images/assortiment-internet/ansjovis-commons.webp",
    "kind": "species",
    "credit": {
      "author": "Paul Asman and Jill Lenoble",
      "source": "https://commons.wikimedia.org/wiki/File:Anchovies_(4122029675).jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  "tilapiafilet": {
    "src": "/images/assortiment-internet/tilapiafilet-serving-commons.jpg",
    "kind": "serving",
    "credit": {
      "author": "jeffreyw",
      "source": "https://commons.wikimedia.org/wiki/File:Tilapia_filet_(13017999463).jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
    }
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
  "gamba-kroketten": {
    "src": "/images/editorial/gambakroketten-eigen-product.png",
    "kind": "serving",
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
const PRODUCT_BEELDEN: Record<string, Pick<ProductPhoto, "src" | "alt" | "credit" | "caption">> = {
  "gerookte-zalm-high-seas": { src: "/images/editorial/gerookte-zalm-serveervoorbeeld.png", alt: "Gerookte zalm op een schaal met dille — serveerinspiratie" },
  "gerookte-kipper": { src: "/images/editorial/gerookte-kipper-serveervoorbeeld.webp", alt: "Gerookte kippers met brood en citroen — serveervoorbeeld" },
  "gebakken-mosselen": { src: "/images/editorial/gebakken-mosselen-serveervoorbeeld.webp", alt: "Gebakken mosselen met citroen en peterselie — serveervoorbeeld" },
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
  "schar": { src: "/images/editorial/schar-serveervoorbeeld.webp", alt: "Schar (Limanda limanda) op ijs — voorbeeldfoto", caption: "Schar (Limanda limanda)" },
  "surimisalade": { src: "/images/editorial/surimisalade-serveervoorbeeld.webp", alt: "Romige surimisalade met surimi en bieslook — serveervoorbeeld", caption: "Surimisalade met bieslook" },
  "bot": { src: "/images/editorial/bot-serveervoorbeeld.webp", alt: "Bot (Platichthys flesus) op ijs — voorbeeldfoto", caption: "Bot (Platichthys flesus)" },
  "wijtingfilet": { src: "/images/editorial/wijtingfilet-serveervoorbeeld.webp", alt: "Verse wijtingfilets op ijs — voorbeeldfoto", caption: "Voorbeeldfoto; wijtingfilet is op aanvraag beschikbaar." },
  "victoriabaars": { src: "/images/editorial/victoriabaars-serveervoorbeeld.webp", alt: "Verse filets van Victoriabaars op ijs — voorbeeldfoto", caption: "Victoriabaarsfilet" },
  "gerookte-zalmmoot": { src: "/images/editorial/gerookte-zalmmoot-eigen-product.png", alt: "Warmgerookte zalmmoot van Schaap’s Vishandel", caption: "Moot warmgerookte zalmfilet." },
  "gerookte-sprotfilet": { src: "/images/editorial/gerookte-sprotfilet-serveervoorbeeld.webp", alt: "Kleine gerookte sprotfilets op een schaal — serveervoorbeeld", caption: "Gerookte sprotfilet" },
  "gerookte-heilbot": { src: "/images/editorial/gerookte-heilbot-serveervoorbeeld.webp", alt: "Plakjes gerookte heilbot met dille en citroen — serveersuggestie", caption: "Gerookte heilbot met dille en citroen" },
  "gerookte-forel-heel": { src: "/images/editorial/gerookte-forel-heel-serveervoorbeeld.webp", alt: "Hele warmgerookte forel met citroen en dille — serveersuggestie", caption: "Warmgerookte forel met citroen en dille" },
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
  if (beeld) return { ...beeld, editorial: true, whole: ["schol", "zeebaars", "gerookte-forel-heel"].includes(product.slug) };
  if (product.slug === "varlaks-zalm") {
    return { src: "/images/editorial/varlaks-zalm-rauw-ai.webp", editorial: true, whole: false, alt: "Rauwe verse zalmfilet op ijs met citroen en dille" };
  }
  if (product.slug === "kibbeling") {
    return { src: "/images/editorial/kibbeling-schaapstray.png", editorial: true, whole: false, alt: "Bakje krokante kibbeling met ravigotesaus" };
  }
  return product.photo ? { src: product.photo, editorial: false, whole: true, alt: product.naam } : null;
}
const ALTS:Record<string,readonly[string,string,string]>={
 "gerookte-forelfilet":["Gerookte forelfilet met dille en citroen — serveersuggestie","Smoked trout fillet with dill and lemon — serving suggestion","Geräuchertes Forellenfilet mit Dill und Zitrone — Serviervorschlag"],
"krabsalade":["Romige krabsalade met lente-ui — serveersuggestie","Creamy crab salad with spring onion, serving suggestion","Cremiger Krabbensalat mit Frühlingszwiebeln, Serviervorschlag"],
"noorse-garnalen":["Gepelde Noorse garnalen met citroen — serveersuggestie","Peeled northern shrimp with lemon, serving suggestion","Geschälte nordische Garnelen mit Zitrone, Serviervorschlag"],
"schol":["Noordzeeschol (Pleuronectes platessa), gefotografeerd door Hans Hillewaert","North Sea plaice, Pleuronectes platessa, photographed by Hans Hillewaert","Nordseescholle, Pleuronectes platessa, fotografiert von Hans Hillewaert"],
"schar":["Schar (Limanda limanda) op ijs — voorbeeldfoto","European dab (Limanda limanda) on ice — illustrative photo","Kliesche (Limanda limanda) auf Eis — Beispielfoto"],
"surimisalade":["Romige surimisalade met bieslook — serveersuggestie","Creamy surimi salad with chives, serving suggestion","Cremiger Surimisalat mit Schnittlauch, Serviervorschlag"],
"bot":["Bot (Platichthys flesus) op ijs — voorbeeldfoto","European flounder (Platichthys flesus) on ice — illustrative photo","Flunder (Platichthys flesus) auf Eis — Beispielfoto"],
"wijtingfilet":["Verse wijtingfilets op ijs — voorbeeldfoto","Fresh whiting fillets on ice — illustrative photo","Frische Wittlingsfilets auf Eis — Beispielfoto"],
"victoriabaars":["Verse Victoriabaarsfilets op ijs — voorbeeldfoto","Fresh Nile perch fillets on ice — illustrative photo","Frische Nilbarschfilets auf Eis — Beispielfoto"],
"gerookte-zalmmoot":["Warmgerookte zalmmoot op een schaal — voorbeeldfoto","Warm-smoked salmon steak on a platter — illustrative photo","Heißgeräuchertes Lachssteak auf einer Platte — Beispielfoto"],
"gerookte-sprotfilet":["Kleine gerookte sprotfilets op een schaal — serveersuggestie","Small smoked sprat fillets on a dish — serving suggestion","Kleine geräucherte Sprottenfilets auf einer Schale — Serviervorschlag"],
"gerookte-kipper":["Gerookte kippers op een bord met brood — serveervoorbeeld","Smoked kippers served with bread — serving suggestion","Geräucherte Kipper mit Brot — Serviervorschlag"],
"gebakken-mosselen":["Gebakken mosselen met citroen en peterselie — serveervoorbeeld","Fried mussels with lemon and parsley — serving suggestion","Gebratene Miesmuscheln mit Zitrone und Petersilie — Serviervorschlag"],
"gerookte-heilbot":["Plakjes gerookte heilbot met dille en citroen — serveersuggestie","Slices of smoked halibut with dill and lemon — serving suggestion","Scheiben Räucherheilbutt mit Dill und Zitrone — Serviervorschlag"],
"gerookte-forel-heel":["Hele warmgerookte forel met citroen en dille — serveersuggestie","Whole hot-smoked trout with lemon and dill — serving suggestion","Ganze heißgeräucherte Forelle mit Zitrone und Dill — Serviervorschlag"],
"zeebaars":["Hele zeebaars op een witte schaal","Whole sea bass on a white platter","Ganzer Wolfsbarsch auf einer weißen Platte"],
"zalmsalade":["Romige zalmsalade met dille — serveersuggestie","Creamy salmon salad with dill, serving suggestion","Cremiger Lachssalat mit Dill, Serviervorschlag"],
"tonijnsalade":["Tonijnsalade met ui en augurk — serveersuggestie","Tuna salad with onion and gherkin, serving suggestion","Thunfischsalat mit Zwiebeln und Gewürzgurken, Serviervorschlag"],
"zeeuwse-mosselen":["Zeeuwse mosselen in gesloten schelpen","Zeeland mussels in closed shells","Zeeländische Miesmuscheln in geschlossenen Schalen"],
"haring":["Hollandse haring met uitjes en augurk — serveersuggestie","Dutch herring with onion and gherkin, serving suggestion","Holländischer Matjes mit Zwiebeln und Gewürzgurken, Serviervorschlag"],
"gravad-lax":["Gesneden gravad lax met dille — serveersuggestie","Sliced gravlax with dill, serving suggestion","Aufgeschnittener Graved Lachs mit Dill, Serviervorschlag"],
"lekkerbek":["Gebakken heek als lekkerbek met koolsalade — serveerinspiratie","Fried battered hake with coleslaw, serving suggestion","Frittierter Seehecht im Backteig mit Krautsalat, Serviervorschlag"],
"broodje-haring":["Broodje haring met uitjes — serveersuggestie","Herring roll with onion, serving suggestion","Matjesbrötchen mit Zwiebeln, Serviervorschlag"],
"vissoep":["Romige vissoep — serveersuggestie","Creamy fish soup, serving suggestion","Cremige Fischsuppe, Serviervorschlag"],
"varlaks-zalm":["Rauwe verse zalmfilet op ijs met citroen en dille","Raw fresh salmon fillet on ice with lemon and dill","Rohes frisches Lachsfilet auf Eis mit Zitrone und Dill"],
"kibbeling":["Krokante kibbeling met ravigotesaus — serveersuggestie","Crispy kibbeling with ravigote sauce, serving suggestion","Knuspriger Kibbeling mit Ravigotesauce, Serviervorschlag"],
"gerookte-zalm-high-seas":["Dunne plakken gerookte zalm met dille op een schaal — serveersuggestie","Thin slices of smoked salmon with dill on a platter, serving suggestion","Dünne Räucherlachsscheiben mit Dill auf einer Platte, Serviervorschlag"],
"creuse-oesters":["Creuse oesters op ijs met citroen — serveersuggestie","Cupped Pacific oysters served on ice with lemon, serving suggestion","Felsenaustern auf Eis mit Zitrone, Serviervorschlag"],
"bosje-sprot":["Gerookte sprot (Sprattus sprattus)","Smoked sprats, Sprattus sprattus","Geräucherte Sprotten, Sprattus sprattus"]
};
export function productPhoto(product:Product,locale="nl"):ProductPhoto|null{
 const source=dirksPhotoMap[product.slug as keyof typeof dirksPhotoMap];
 if(source && product.slug !== "kibbeling"){
  const l=locale==="de"?"de":locale==="en"?"en":"nl";
  const localeIndex=l==="nl"?0:l==="en"?1:2;
  const translatedAlt=ALTS[product.slug];
  const alt=translatedAlt?translatedAlt[localeIndex]:{nl:`${product.naam} op een lichte ondergrond — voorbeeldfoto`,en:`${product.naam} on a light background — illustrative photo`,de:`${product.naam} auf hellem Hintergrund — Beispielfoto`}[l];
  const caption=["gerookte-zalm-high-seas","hollandse-garnalen","gerookte-zalm-snippers"].includes(product.slug) ? undefined : {nl:"Productfoto; herkomst en beschikbaarheid staan bij de productinformatie.",en:"Product photo; origin and availability are listed in the product information.",de:"Produktfotos; Herkunft und Verfügbarkeit stehen in den Produktinformationen."}[l];
  return {src:`/images/dirks/${source}.webp`,alt,caption,editorial:true,whole:false};
 }
 const inHouseImage=PRODUCT_BEELDEN[product.slug];
 if(inHouseImage&&["bot","schar","surimisalade","wijtingfilet","victoriabaars","gerookte-zalmmoot","gerookte-sprotfilet"].includes(product.slug)){
  const l=locale==="de"?"de":locale==="en"?"en":"nl";
  const localeIndex=l==="nl"?0:l==="en"?1:2;
  const translatedAlt=ALTS[product.slug];
  const captions:Record<string,Record<string,string>>={
   schar:{nl:"Schar (Limanda limanda).",en:"European dab (Limanda limanda).",de:"Kliesche (Limanda limanda)."},
   surimisalade:{nl:"Surimisalade met bieslook.",en:"Surimi salad with chives.",de:"Surimisalat mit Schnittlauch."},
   bot:{nl:"Bot (Platichthys flesus).",en:"European flounder (Platichthys flesus).",de:"Flunder (Platichthys flesus)."},
   wijtingfilet:{nl:"Voorbeeldfoto; wijtingfilet is op aanvraag beschikbaar.",en:"Illustrative photo; whiting fillets are available on request.",de:"Beispielfoto; Wittlingsfilet ist auf Anfrage erhältlich."},
   victoriabaars:{nl:"Victoriabaarsfilet.",en:"Nile perch fillet.",de:"Nilbarschfilet."},
   "gerookte-zalmmoot":{nl:"Moot warmgerookte zalmfilet.",en:"A portion of warm-smoked salmon fillet.",de:"Ein Stück heißgeräuchertes Lachsfilet."},
   "gerookte-sprotfilet":{nl:"Gerookte sprotfilet.",en:"Smoked sprat fillets.",de:"Geräucherte Sprottenfilets."},
  };
  return {...inHouseImage,alt:translatedAlt?.[localeIndex]||inHouseImage.alt,caption:captions[product.slug][l],editorial:true,whole:false};
 }
 const internet=INTERNET_BEELDEN[product.slug];
 if(internet){
  const l=locale==="de"?"de":locale==="en"?"en":"nl";
  const labels={nl:{product:"Productfoto ter illustratie",serving:"Serveervoorbeeld",species:"Hoofdingrediënt ter illustratie"},en:{product:"Illustrative product photograph",serving:"Serving suggestion",species:"Illustrative photograph of the main ingredient"},de:{product:"Produktfoto zur Illustration",serving:"Serviervorschlag",species:"Beispielfoto der Hauptzutat"}}[l];
  const captions={nl:{product:"Productfoto.",serving:"Serveersuggestie.",species:"De vissoort in beeld."},en:{product:"Product photo.",serving:"Serving suggestion.",species:"The fish shown."},de:{product:"Produktfoto.",serving:"Serviervorschlag.",species:"Die abgebildete Fischart."}}[l];
  const subjects:Record<string,Record<string,string>>={
   kabeljauwwangen:{nl:"Koppen van kabeljauw, waaruit de wangen worden gesneden",en:"Cod heads, from which the cheeks are cut",de:"Kabeljauköpfe, aus denen die Backen geschnitten werden"},
   zeebrasemfilet:{nl:"Hele zeebrasem (Pagellus bogaraveo), vóór het fileren",en:"Whole blackspot seabream (Pagellus bogaraveo), before filleting",de:"Ganze Graubarschbrasse (Pagellus bogaraveo), vor dem Filetieren"},
   "zeekraalsalade":{nl:"Verse zeekraal, het hoofdingrediënt van zeekraalsalade",en:"Fresh samphire, the main ingredient of samphire salad",de:"Frischer Queller, die Hauptzutat von Quellersalat"},
   "hele-kreeft":{nl:"Europese kreeften (Homarus gammarus), vóór het koken",en:"European lobsters (Homarus gammarus), before cooking",de:"Europäische Hummer (Homarus gammarus), vor dem Kochen"},
   skrei:{nl:"Atlantische kabeljauw (Gadus morhua), de vissoort waartoe skrei behoort",en:"Atlantic cod (Gadus morhua), the species to which skrei belongs",de:"Atlantischer Kabeljau (Gadus morhua), die Fischart, zu der Skrei gehört"},
   "verse-heilbot":{nl:"Heilbot op ijs — voorbeeldfoto",en:"Halibut on ice — illustrative photo",de:"Heilbutt auf Eis — Beispielfoto"},
  };
  const caption=product.slug==="verse-heilbot"
   ? {nl:"Heilbot op ijs.",en:"Halibut on ice.",de:"Heilbutt auf Eis."}[l]
   : captions[internet.kind];
  return {src:internet.src,alt:subjects[product.slug]?.[l]||product.naam+" — "+labels[internet.kind],caption,editorial:true,whole:internet.kind!=="serving",credit:internet.credit};
 }
 const photo=sourcePhoto(product);if(!photo)return null;
 if(["krabsalade","tonijnsalade","zalmsalade"].includes(product.slug))photo.caption=locale==="en"?"Salad serving suggestion.":locale==="de"?"Serviervorschlag für Fischsalat.":"Serveersuggestie voor vissalade.";
 const captionBySlug:Record<string,Record<string,string>>={
  "gerookte-kipper":{nl:"Gerookte kipper met brood.",en:"Smoked kipper with bread.",de:"Räucherkipper mit Brot."},
  "gebakken-mosselen":{nl:"Gebakken mosselen met citroen en peterselie.",en:"Fried mussels with lemon and parsley.",de:"Gebratene Miesmuscheln mit Zitrone und Petersilie."},
  "gerookte-heilbot":{nl:"Gerookte heilbot met dille en citroen.",en:"Smoked halibut with dill and lemon.",de:"Räucherheilbutt mit Dill und Zitrone."},
  "gerookte-forel-heel":{nl:"Warmgerookte forel met citroen en dille.",en:"Hot-smoked trout with lemon and dill.",de:"Heißgeräucherte Forelle mit Zitrone und Dill."},
 };
 if(captionBySlug[product.slug])photo.caption=captionBySlug[product.slug][locale==="de"?"de":locale==="en"?"en":"nl"];
 if(locale==="nl")return photo;
 const translated=ALTS[product.slug];
 return {...photo,alt:translated?translated[locale==="de"?2:1]:product.naam};
}

