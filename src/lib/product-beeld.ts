import type { Product } from "./assortiment-data";

export type ProductPhoto = {
  src: string;
  alt: string;
  editorial: boolean;
  whole: boolean;
  caption?: string;
  credit?: { author: string; source: string; license: string; licenseUrl: string };
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
  "schelvis": {
    "src": "/images/assortiment-internet/schelvis.png",
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
      "author": "Hans Hillewaert",
      "source": "https://commons.wikimedia.org/wiki/File:Limanda_limanda.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "zalmforel": {
    "src": "/images/assortiment-internet/zalmforel.png",
    "kind": "product"
  },
  "tonijnfilet": {
    "src": "/images/assortiment-internet/tonijnfilet.png",
    "kind": "product"
  },
  "zeeduivelfilet": {
    "src": "/images/assortiment-internet/zeeduivelfilet.png",
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
  "leng": {
    "src": "/images/assortiment-internet/leng.jpg",
    "kind": "species",
    "credit": {
      "author": "Vsevolod",
      "source": "https://commons.wikimedia.org/wiki/File:Molva_molva_155653858.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    }
  },
  "zalmmoot": {
    "src": "/images/assortiment-internet/zalmmoot.png",
    "kind": "product"
  },
  "hele-krab": {
    "src": "/images/assortiment-internet/hele-krab.jpg",
    "kind": "product",
    "credit": {
      "author": "Wolfmann",
      "source": "https://commons.wikimedia.org/wiki/File:TASKEKRABBE_r%C3%B8dkrabbe_(Cancer_pagurus)_Hele,_kokte_krabber_servert_som_mat_p%C3%A5_fat_(panne)_Vestfold_2021-09_Cooked_edible_brown_crab_Norway.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "vongole": {
    "src": "/images/assortiment-internet/vongole.png",
    "kind": "product"
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
  "visburger": {
    "src": "/images/assortiment-internet/visburger.jpg",
    "kind": "serving",
    "credit": {
      "author": "jeffreyw",
      "source": "https://commons.wikimedia.org/wiki/File:Fish_sandwich_with_dilled_tartar_sauce.jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
    }
  },
  "zeewolf": {
    "src": "/images/assortiment-internet/zeewolf.png",
    "kind": "product"
  },
  "zwaardvis": {
    "src": "/images/assortiment-internet/zwaardvis.png",
    "kind": "product"
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
  "grauwe-poon": {
    "src": "/images/assortiment-internet/grauwe-poon.jpg",
    "kind": "species",
    "credit": {
      "author": "Arnstein Rønning",
      "source": "https://commons.wikimedia.org/wiki/File:Eutrigla_gurnardus.JPG",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
    }
  },
  "wulken": {
    "src": "/images/assortiment-internet/wulken.jpg",
    "kind": "product",
    "credit": {
      "author": "Arnaud 25",
      "source": "https://commons.wikimedia.org/wiki/File:Bulots_01.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    }
  },
  "warm-gerookte-zalm": {
    "src": "/images/assortiment-internet/warm-gerookte-zalm.jpg",
    "kind": "serving",
    "credit": {
      "author": "FotoosVanRobin",
      "source": "https://commons.wikimedia.org/wiki/File:Hot_Smoked_Salmon_with_black_Tagliatelle.jpg",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
    }
  },
  "zeevruchtensalade": {
    "src": "/images/assortiment-internet/zeevruchtensalade.jpg",
    "kind": "serving",
    "credit": {
      "author": "E4024",
      "source": "https://commons.wikimedia.org/wiki/File:Seafood_salad.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "garnalencocktail": {
    "src": "/images/assortiment-internet/garnalencocktail.jpg",
    "kind": "serving",
    "credit": {
      "author": "Hortensja Bukietowa",
      "source": "https://commons.wikimedia.org/wiki/File:Garnalencocktail.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "visspies": {
    "src": "/images/assortiment-internet/visspies.jpg",
    "kind": "serving",
    "credit": {
      "author": "PAULIX04",
      "source": "https://commons.wikimedia.org/wiki/File:Fish_Fillet_Skewers_at_Davao_City.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "fish-and-chips": {
    "src": "/images/assortiment-internet/fish-and-chips.jpg",
    "kind": "serving",
    "credit": {
      "author": "Grendelkhan",
      "source": "https://commons.wikimedia.org/wiki/File:Fish_and_chips_plate_with_peas.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "snoekbaars": {
    "src": "/images/assortiment-internet/snoekbaars.jpg",
    "kind": "species",
    "credit": {
      "author": "eLNuko",
      "source": "https://commons.wikimedia.org/wiki/File:Sander_lucioperca_1.jpg",
      "license": "Public domain",
      "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/"
    }
  },
  "tongschar": {
    "src": "/images/assortiment-internet/tongschar.jpg",
    "kind": "species",
    "credit": {
      "author": "Hans Hillewaert",
      "source": "https://commons.wikimedia.org/wiki/File:Microstomus_kitt_1.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "bot": {
    "src": "/images/assortiment-internet/bot.jpg",
    "kind": "species",
    "credit": {
      "author": "Hans Hillewaert",
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
  "spiering": {
    "src": "/images/assortiment-internet/spiering.jpg",
    "kind": "species",
    "credit": {
      "author": "Виктор",
      "source": "https://commons.wikimedia.org/wiki/File:Osmerus_eperlanus_117759646.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    }
  },
  "skrei": {
    "src": "/images/assortiment-internet/skrei.jpg",
    "kind": "species",
    "credit": {
      "author": "Wilhelm Thomas Fiege",
      "source": "https://commons.wikimedia.org/wiki/File:Atlantic_Cod,_Atlantischer_Kabeljau_(Gadus_morhua).jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "tilapiafilet": {
    "src": "/images/assortiment-internet/tilapiafilet.png",
    "kind": "product"
  },
  "gerookte-zalmmoot": {
    "src": "/images/assortiment-internet/gerookte-zalmmoot.png",
    "kind": "product"
  },
  "gerookte-sprotfilet": {
    "src": "/images/assortiment-internet/gerookte-sprotfilet.png",
    "kind": "product"
  },
  "alikruiken": {
    "src": "/images/assortiment-internet/alikruiken.jpg",
    "kind": "product",
    "credit": {
      "author": "L'irlandés",
      "source": "https://commons.wikimedia.org/wiki/File:Caracolillos.JPG",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
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
  "krabpoten": {
    "src": "/images/assortiment-internet/krabpoten.png",
    "kind": "product"
  },
  "haringsalade": {
    "src": "/images/assortiment-internet/haringsalade.jpg",
    "kind": "serving",
    "credit": {
      "author": "Roede",
      "source": "https://commons.wikimedia.org/wiki/File:Sildesalat_2.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "mosselsalade": {
    "src": "/images/assortiment-internet/mosselsalade.jpg",
    "kind": "serving",
    "credit": {
      "author": "FotoosVanRobin",
      "source": "https://commons.wikimedia.org/wiki/File:Musselsalade_with_saffrondressing.jpg",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
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
  "visnuggets": {
    "src": "/images/assortiment-internet/visnuggets.jpg",
    "kind": "serving",
    "credit": {
      "author": "Jason Lam",
      "source": "https://commons.wikimedia.org/wiki/File:06_fried_fish_nugget_with_tartar_sauce_inside_(3042906372).jpg",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
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
  "tongfilet": {
    "src": "/images/assortiment-internet/tongfilet.jpg",
    "kind": "serving",
    "credit": {
      "author": "Ben Brown",
      "source": "https://commons.wikimedia.org/wiki/File:Dover_Sole_Fillets_(14943823963).jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
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
  "red-snapperfilet": {
    "src": "/images/assortiment-internet/red-snapperfilet.jpg",
    "kind": "serving",
    "credit": {
      "author": "Parkerman & Christie from San Diego, USA",
      "source": "https://commons.wikimedia.org/wiki/File:Pan-fried_Red_Snapper_Fillet.jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
    }
  },
  "gerookte-coquilles": {
    "src": "/images/assortiment-internet/gerookte-coquilles.jpg",
    "kind": "serving",
    "credit": {
      "author": "stu_spivack",
      "source": "https://commons.wikimedia.org/wiki/File:Smoked_scallops_(Sapore).jpg",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
    }
  },
  "gerookte-mosselen": {
    "src": "/images/assortiment-internet/gerookte-mosselen.jpg",
    "kind": "serving",
    "credit": {
      "author": "Daderot",
      "source": "https://commons.wikimedia.org/wiki/File:Smoked_mussels,_peas,_and_wild_rice_-_Massachusetts.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    }
  },
  "krabvlees": {
    "src": "/images/assortiment-internet/krabvlees.jpg",
    "kind": "product",
    "credit": {
      "author": "BrokenSphere",
      "source": "https://commons.wikimedia.org/wiki/File:Peeled_crab_meat.JPG",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "gerookte-garnalen": {
    "src": "/images/assortiment-internet/gerookte-garnalen.jpg",
    "kind": "product",
    "credit": {
      "author": "MOs810",
      "source": "https://commons.wikimedia.org/wiki/File:Smoked_polish_shrimps.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "zeekraalsalade": {
    "src": "/images/assortiment-internet/zeekraalsalade.jpg",
    "kind": "species",
    "credit": {
      "author": "Hortensja Bukietowa",
      "source": "https://commons.wikimedia.org/wiki/File:Verse_zeekraal01.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "schelvisfilet": {
    "src": "/images/assortiment-internet/schelvisfilet.jpg",
    "kind": "serving",
    "credit": {
      "author": "Daderot",
      "source": "https://commons.wikimedia.org/wiki/File:Pan_roasted_haddock_with_mushrooms,_green_beans,_rice,_and_broccolini_-_Summer_Shack_-_Cambridge,_MA.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    }
  },
  "kabeljauwwangen": {
    "src": "/images/assortiment-internet/kabeljauwwangen.jpg",
    "kind": "species",
    "credit": {
      "author": "Matthieu Godbout",
      "source": "https://commons.wikimedia.org/wiki/File:Gadus_morhua-idlm2006.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
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
  "zeeforel": {
    "src": "/images/assortiment-internet/zeeforel.jpg",
    "kind": "species",
    "credit": {
      "author": "Caught by Lars Olaf Simonsen, photographed by Anne Blindheim, retouched by Lars, consumed by both.",
      "source": "https://commons.wikimedia.org/wiki/File:Salmo_trutta_trutta_retouched.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
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
  "halve-kreeft": {
    "src": "/images/assortiment-internet/halve-kreeft.jpg",
    "kind": "serving",
    "credit": {
      "author": "Syced",
      "source": "https://commons.wikimedia.org/wiki/File:Le_homard_Breton,Chawanmushi,_huile_de_fenouil._L%27Anthocyane,_Lannion_(94306).jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    }
  },
  "zalm-dillesalade": {
    "src": "/images/assortiment-internet/zalm-dillesalade.png",
    "kind": "product"
  },
  "zeebrasemfilet": {
    "src": "/images/assortiment-internet/zeebrasemfilet.jpg",
    "kind": "species",
    "credit": {
      "author": "Llez",
      "source": "https://commons.wikimedia.org/wiki/File:Pagellus_bogaraveo_-_Mercado_Municipal_Funchal_.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "kokkelvlees": {
    "src": "/images/assortiment-internet/kokkelvlees.jpg",
    "kind": "product",
    "credit": {
      "author": "Juan Emilio Prades Bel",
      "source": "https://commons.wikimedia.org/wiki/File:Berberechos.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "noorse-kreeftstaart": {
    "src": "/images/assortiment-internet/noorse-kreeftstaart.jpg",
    "kind": "serving",
    "credit": {
      "author": "Navin75",
      "source": "https://commons.wikimedia.org/wiki/File:La_Langoustine_(14589980444).jpg",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
    }
  },
  "kreeftensalade": {
    "src": "/images/assortiment-internet/kreeftensalade.jpg",
    "kind": "serving",
    "credit": {
      "author": "إيان",
      "source": "https://commons.wikimedia.org/wiki/File:Lobster_salad_roll.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "vissticks": {
    "src": "/images/assortiment-internet/vissticks.jpg",
    "kind": "product",
    "credit": {
      "author": "Superbass",
      "source": "https://commons.wikimedia.org/wiki/File:Fishfinger_classic_fried_1.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "sushi-mix": {
    "src": "/images/assortiment-internet/sushi-mix.jpg",
    "kind": "serving",
    "credit": {
      "author": "www.bluewaikiki.com",
      "source": "https://commons.wikimedia.org/wiki/File:Salmon_and_Tuna_Nigiri_Sushi,_2008.jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
    }
  },
  "kabeljauwtongen": {
    "src": "/images/assortiment-internet/kabeljauwtongen.jpg",
    "kind": "serving",
    "credit": {
      "author": "Abuluntu",
      "source": "https://commons.wikimedia.org/wiki/File:Abuluntu_cod_tounge.jpg",
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
  "visbitterballen": {
    "src": "/images/assortiment-internet/visbitterballen.jpg",
    "kind": "serving",
    "credit": {
      "author": "ChristianCelestial",
      "source": "https://commons.wikimedia.org/wiki/File:Delicious_Crunchy_Fish_Croquettes.jpg",
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
 if(locale==="nl")return photo;
 const translated=ALTS[product.slug];
 return {...photo,alt:translated?translated[locale==="de"?1:0]:product.naam};
}
