export type ViskeurmerkBadge = "MSC" | "ASC" | "BIO";

export interface MaandVis { naam: string; keurmerk?: ViskeurmerkBadge; }
export interface MaandData {
  naam: string;
  afkorting: string;
  seizoen: "Winter" | "Lente" | "Zomer" | "Herfst";
  vis: MaandVis[];
  tekst: string;
  hoogtepunt: string;
  foto: { src: string; alt: string };
  links: { label: string; href: string }[];
}

// Seizoensindicaties, geen live voorraad. Zie mosselen.nl/nl/mosselinfo/seizoen/.
// Een soortnaam is geen bewijs van certificering; alleen bevestigde MSC-garnalen
// krijgen hier een badge. Controleer steeds de actuele productlevering.
export const viskalenderData: MaandData[] = [
  {
    "naam": "Januari",
    "afkorting": "Jan",
    "seizoen": "Winter",
    "vis": [
      {
        "naam": "Kabeljauw"
      },
      {
        "naam": "Skrei (bij seizoensaanvoer)"
      },
      {
        "naam": "Oesters"
      },
      {
        "naam": "Mosselen"
      }
    ],
    "tekst": "Skrei komt doorgaans van januari tot april uit Noorwegen. Kabeljauw past bij warme ovengerechten; mosselen en oesters zijn ook in de winter een mooie keuze. Vraag ons wat er vandaag beschikbaar is.",
    "hoogtepunt": "Winterse kabeljauw, skrei en schelpdieren",
    "foto": {
      "src": "/images/recepten/gebakken-kabeljauw-botersaus-v2.webp",
      "alt": "Kabeljauw met citroen-botersaus"
    },
    "links": [
      {
        "label": "Meer over deze vis",
        "href": "/nl/assortiment/kabeljauwfilet"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  },
  {
    "naam": "Februari",
    "afkorting": "Feb",
    "seizoen": "Winter",
    "vis": [
      {
        "naam": "Kabeljauw"
      },
      {
        "naam": "Skrei"
      },
      {
        "naam": "Coquilles"
      },
      {
        "naam": "Mosselen"
      }
    ],
    "tekst": "Kies voor een winterse vismaaltijd of coquilles als voorgerecht. Het mosselseizoen is in februari nog niet voorbij: Zeeuwse bodemcultuurmosselen zijn doorgaans van juli tot april verkrijgbaar.",
    "hoogtepunt": "Een goed moment voor kabeljauw en coquilles",
    "foto": {
      "src": "/images/producten-hd/coquilles.webp",
      "alt": "Coquilles uit het assortiment"
    },
    "links": [
      {
        "label": "Meer over deze vis",
        "href": "/nl/assortiment/coquilles"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  },
  {
    "naam": "Maart",
    "afkorting": "Mar",
    "seizoen": "Lente",
    "vis": [
      {
        "naam": "Kabeljauw"
      },
      {
        "naam": "Oesters"
      },
      {
        "naam": "Mosselen"
      },
      {
        "naam": "Hollandse garnalen",
        "keurmerk": "MSC"
      }
    ],
    "tekst": "In maart kunt u vaak nog mosselen vinden. Hollandse garnalen zijn niet alleen een lenteproduct: aanvoer is ook in andere maanden mogelijk. Een frisse garnalensalade of oesters passen bij het voorjaar.",
    "hoogtepunt": "Van winterse vis naar frisse lentegerechten",
    "foto": {
      "src": "/images/recepten/oesters-sjalottenazijn.webp",
      "alt": "Oesters met sjalottenazijn"
    },
    "links": [
      {
        "label": "Meer over deze vis",
        "href": "/nl/assortiment/creuse-oesters"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  },
  {
    "naam": "April",
    "afkorting": "Apr",
    "seizoen": "Lente",
    "vis": [
      {
        "naam": "Schol"
      },
      {
        "naam": "Kabeljauw"
      },
      {
        "naam": "Hollandse garnalen",
        "keurmerk": "MSC"
      }
    ],
    "tekst": "In april loopt het gebruikelijke seizoen van Zeeuwse bodemcultuurmosselen af. Het exacte einde verschilt per oogst. Kies voor verse filet met voorjaarsgroenten of Hollandse garnalen en vraag naar de mooiste aanvoer.",
    "hoogtepunt": "Lichter koken met verse vis",
    "foto": {
      "src": "/images/recepten/kabeljauw-zeekraal-venkel.webp",
      "alt": "Kabeljauw met zeekraal en venkel"
    },
    "links": [
      {
        "label": "Meer over deze vis",
        "href": "/nl/assortiment/kabeljauwfilet"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  },
  {
    "naam": "Mei",
    "afkorting": "Mei",
    "seizoen": "Lente",
    "vis": [
      {
        "naam": "Schol"
      },
      {
        "naam": "Tong"
      },
      {
        "naam": "Hollandse garnalen",
        "keurmerk": "MSC"
      },
      {
        "naam": "Zalm"
      }
    ],
    "tekst": "In mei passen lichte visgerechten goed bij het seizoen. De nieuwe haringvangst komt later: de start van Hollandse Nieuwe wordt ieder jaar vastgesteld. Zalm blijft een veelzijdige keuze, ook buiten één specifiek seizoen.",
    "hoogtepunt": "Verse filet bij voorjaarsgroenten",
    "foto": {
      "src": "/images/recepten/gegrilde-schol.webp",
      "alt": "Gebakken scholfilet met kruiden en citroen"
    },
    "links": [
      {
        "label": "Meer over deze vis",
        "href": "/nl/assortiment/schol"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  },
  {
    "naam": "Juni",
    "afkorting": "Jun",
    "seizoen": "Zomer",
    "vis": [
      {
        "naam": "Hollandse Nieuwe (vanaf de seizoensstart)"
      },
      {
        "naam": "Hollandse garnalen",
        "keurmerk": "MSC"
      },
      {
        "naam": "Zalm"
      }
    ],
    "tekst": "De verkoop van Hollandse Nieuwe begint doorgaans in juni. De exacte startdatum en aanvoer verschillen per jaar. Vraag ons wanneer de nieuwe haring er is; lekker met uitjes of op een broodje.",
    "hoogtepunt": "Uitkijken naar de Hollandse Nieuwe",
    "foto": {
      "src": "/images/editorial/hollandse-nieuwe-uitjes.webp",
      "alt": "Haring met garnituur"
    },
    "links": [
      {
        "label": "Meer over deze vis",
        "href": "/nl/assortiment/haring"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  },
  {
    "naam": "Juli",
    "afkorting": "Jul",
    "seizoen": "Zomer",
    "vis": [
      {
        "naam": "Haring"
      },
      {
        "naam": "Mosselen (nieuwe oogst)"
      },
      {
        "naam": "Hollandse garnalen",
        "keurmerk": "MSC"
      },
      {
        "naam": "Schol"
      }
    ],
    "tekst": "Het seizoen van Zeeuwse bodemcultuurmosselen begint doorgaans in juli, soms eerder. Dat hangt af van weer, kwaliteit en aanvoer. Ook haring en schol zijn mooie keuzes voor een zomerse maaltijd.",
    "hoogtepunt": "Zomerse haring en de nieuwe mosseloogst",
    "foto": {
      "src": "/images/recepten/broodje-haring-uitjes.webp",
      "alt": "Broodje haring met uitjes"
    },
    "links": [
      {
        "label": "Meer over deze vis",
        "href": "/nl/assortiment/haring"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  },
  {
    "naam": "Augustus",
    "afkorting": "Aug",
    "seizoen": "Zomer",
    "vis": [
      {
        "naam": "Hollandse garnalen",
        "keurmerk": "MSC"
      },
      {
        "naam": "Haring"
      },
      {
        "naam": "Mosselen"
      },
      {
        "naam": "Kibbeling"
      }
    ],
    "tekst": "Een garnalencocktail, haringhapjes of mosselen op tafel: augustus biedt veel inspiratie. Kibbeling is het hele jaar een favoriet, niet alleen seizoensvis. Onze kibbeling maken we van pollak.",
    "hoogtepunt": "Garnalen, haring en een pan mosselen",
    "foto": {
      "src": "/images/recepten/hollandse-garnalencocktail.webp",
      "alt": "Hollandse garnalencocktail"
    },
    "links": [
      {
        "label": "Meer over deze vis",
        "href": "/nl/assortiment/hollandse-garnalen"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  },
  {
    "naam": "September",
    "afkorting": "Sep",
    "seizoen": "Herfst",
    "vis": [
      {
        "naam": "Mosselen"
      },
      {
        "naam": "Oesters"
      },
      {
        "naam": "Schol"
      },
      {
        "naam": "Hollandse garnalen",
        "keurmerk": "MSC"
      }
    ],
    "tekst": "In september is het mosselseizoen meestal al bezig, niet pas net gestart. Schol en Hollandse garnalen passen ook bij de overgang naar de herfst. De kwaliteit en beschikbaarheid blijven afhankelijk van de actuele aanvoer.",
    "hoogtepunt": "De zomer loopt door in de mosselpan",
    "foto": {
      "src": "/images/recepten/gebakken-schol-tomaat-olijven.webp",
      "alt": "Gebakken schol met tomaat en olijven"
    },
    "links": [
      {
        "label": "Meer over deze vis",
        "href": "/nl/assortiment/schol"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  },
  {
    "naam": "Oktober",
    "afkorting": "Okt",
    "seizoen": "Herfst",
    "vis": [
      {
        "naam": "Kabeljauw"
      },
      {
        "naam": "Mosselen"
      },
      {
        "naam": "Oesters"
      },
      {
        "naam": "Wijting"
      }
    ],
    "tekst": "Kabeljauw en wijting lenen zich voor een ovenschotel of stoof. Ook een pan mosselen past bij een herfstavond. De kalender geeft inspiratie, geen voorraadgarantie: vraag ons welke filet vandaag het mooist is.",
    "hoogtepunt": "Warme ovengerechten en visstoof",
    "foto": {
      "src": "/images/recepten/kabeljauw-oven-tomaat-olijven-v2.webp",
      "alt": "Kabeljauw uit de oven met tomaat en olijven"
    },
    "links": [
      {
        "label": "Meer over deze vis",
        "href": "/nl/assortiment/kabeljauwfilet"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  },
  {
    "naam": "November",
    "afkorting": "Nov",
    "seizoen": "Herfst",
    "vis": [
      {
        "naam": "Mosselen"
      },
      {
        "naam": "Oesters"
      },
      {
        "naam": "Kabeljauw"
      },
      {
        "naam": "Gerookte zalm"
      }
    ],
    "tekst": "Een dampende vissoep past bij november. Mosselen en oesters zijn vaak goed beschikbaar; gerookte zalm is een jaarrond product. Denk alvast na over uw feestmenu en bespreek bijzondere wensen met ons.",
    "hoogtepunt": "Vissoep en ideeën voor de feestdagen",
    "foto": {
      "src": "/images/recepten/romige-vissoep.webp",
      "alt": "Romige vissoep met groenten"
    },
    "links": [
      {
        "label": "Meer over deze vis",
        "href": "/nl/assortiment/kabeljauwfilet"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  },
  {
    "naam": "December",
    "afkorting": "Dec",
    "seizoen": "Winter",
    "vis": [
      {
        "naam": "Oesters"
      },
      {
        "naam": "Mosselen"
      },
      {
        "naam": "Gerookte zalm"
      },
      {
        "naam": "Hollandse garnalen",
        "keurmerk": "MSC"
      }
    ],
    "tekst": "Gerookte zalm, garnalen en schelpdieren geven uw feestmenu kleur. Zalm en garnalen zijn niet beperkt tot december. Wilt u een visschaal voor een groter gezelschap? Bespreek de inhoud en uw budget op tijd.",
    "hoogtepunt": "Een feestelijke tafel met vis",
    "foto": {
      "src": "/images/recepten/gerookte-zalm-rolletjes-roomkaas.webp",
      "alt": "Gerookte zalmrolletjes met roomkaas"
    },
    "links": [
      {
        "label": "Visschalen bekijken",
        "href": "/nl/visschalen"
      },
      {
        "label": "Recepten om mee te koken",
        "href": "/nl/recepten"
      }
    ]
  }
];
