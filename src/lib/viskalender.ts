export type ViskeurmerkBadge = "MSC" | "ASC" | "BIO";

export interface MaandVis {
  naam: string;
  keurmerk?: ViskeurmerkBadge;
}

export interface MaandData {
  naam: string;
  afkorting: string;
  seizoen: "Winter" | "Lente" | "Zomer" | "Herfst";
  vis: MaandVis[];
  tekst: string;
  hoogtepunt: string;
  links: { label: string; href: string }[];
}

export const viskalenderData: MaandData[] = [
  {
    naam: "Januari",
    afkorting: "Jan",
    seizoen: "Winter",
    vis: [
      { naam: "Zeeuwse Mosselen", keurmerk: "MSC" },
      { naam: "Oesters" },
      { naam: "Noordzee Schol" },
      { naam: "Tong" },
    ],
    tekst:
      "De wintermaanden zijn hét seizoen voor mosselen en oesters — maanden met een 'r', zo luidt het spreekwoord. Verse schol en tong zijn volop beschikbaar uit de Noordzee en bijzonder smaakvol in de kou.",
    hoogtepunt: "Zeeuwse mosselen en verse oesters op hun allerbest",
    links: [
      { label: "Assortiment bekijken", href: "/nl/assortiment" },
      { label: "Recepten voor vissoep", href: "/nl/recepten" },
    ],
  },
  {
    naam: "Februari",
    afkorting: "Feb",
    seizoen: "Winter",
    vis: [
      { naam: "Mosselen", keurmerk: "MSC" },
      { naam: "Oesters" },
      { naam: "Gerookte Noorse Zalm", keurmerk: "ASC" },
      { naam: "Kabeljauw" },
    ],
    tekst:
      "Februari is de laatste maand van het mosselseizoen voordat het mosselbed rust krijgt. Grijp uw kans — daarna tot september wachten. Gerookte Noorse zalm (ASC) en kabeljauw zijn jaarrond en bijzonder geschikt voor winterse ovengerechten.",
    hoogtepunt: "Laatste kans voor verse mosselen van dit seizoen",
    links: [
      { label: "Gerookte Noorse Zalm", href: "/nl/assortiment" },
      { label: "Recepten", href: "/nl/recepten" },
    ],
  },
  {
    naam: "Maart",
    afkorting: "Mar",
    seizoen: "Lente",
    vis: [
      { naam: "Schol" },
      { naam: "Tong" },
      { naam: "Eerste Hollandse Garnalen", keurmerk: "MSC" },
    ],
    tekst:
      "Het voorjaar brengt de eerste signalen van de garnalenvloot. Eind maart verschijnen de eerste verse Hollandse garnalen (Crangon crangon) weer op de toonbank — fris, zoet en MSC-gecertificeerd van de Waddenkust. Schol en tong zijn dit seizoen op hun best.",
    hoogtepunt: "Eerste Hollandse garnalen van het seizoen",
    links: [{ label: "Hollandse Garnalen reserveren", href: "/nl/bestellen" }],
  },
  {
    naam: "April",
    afkorting: "Apr",
    seizoen: "Lente",
    vis: [
      { naam: "Hollandse Garnalen", keurmerk: "MSC" },
      { naam: "Schol" },
      { naam: "Tong" },
    ],
    tekst:
      "De garnalenvloot vaart op volle kracht. MSC-gecertificeerde Hollandse garnalen (Crangon crangon) zijn nu dagelijks vers beschikbaar — gepeld aan de Waddenkust door Heiploeg en SOLT. Tong en schol uit eigen Noordzeewaters zijn bijzonder smaakvol in het vroege voorjaar.",
    hoogtepunt: "Dagverse MSC garnalen van Heiploeg en SOLT",
    links: [{ label: "Hollandse Garnalen (Heiploeg & SOLT)", href: "/nl/assortiment" }],
  },
  {
    naam: "Mei",
    afkorting: "Mei",
    seizoen: "Lente",
    vis: [
      { naam: "Hollandse Garnalen", keurmerk: "MSC" },
      { naam: "Schol" },
      { naam: "Biologische Zalm", keurmerk: "BIO" },
    ],
    tekst:
      "Mei is garnalentijd, maar ook de maand van de anticipatie: de haringvloot maakt zich klaar en de eerste berichten over de aankomende Hollandse Nieuwe bereiken de kust. Verse schol uit de Noordzee is nu op zijn best — ideaal om in boter te bakken.",
    hoogtepunt: "Seizoensschol + aankondiging van de Hollandse Nieuwe",
    links: [
      { label: "Assortiment", href: "/nl/assortiment" },
      { label: "Varlaks biologische zalm", href: "/nl/varlaks" },
    ],
  },
  {
    naam: "Juni",
    afkorting: "Jun",
    seizoen: "Zomer",
    vis: [
      { naam: "Hollandse Nieuwe Haring" },
      { naam: "Hollandse Garnalen", keurmerk: "MSC" },
      { naam: "Varlaks Biologische Zalm", keurmerk: "BIO" },
    ],
    tekst:
      "Juni is het hoogtepunt van het visseizoen: traditioneel arriveert de Hollandse Nieuwe vanaf half juni — de rauwe, licht gezouten haring die ieder jaar opnieuw het feestelijkste moment achter onze toonbank is. Naast de Nieuwe zijn garnalen volop verkrijgbaar en is onze biologische Varlaks-zalm een verfijnd alternatief.",
    hoogtepunt: "HOLLANDSE NIEUWE — het moment van het jaar",
    links: [
      { label: "Broodje Haring bestellen", href: "/nl/bestellen?product=haring" },
      { label: "Varlaks biologische zalm", href: "/nl/varlaks" },
    ],
  },
  {
    naam: "Juli",
    afkorting: "Jul",
    seizoen: "Zomer",
    vis: [
      { naam: "Hollandse Nieuwe Haring" },
      { naam: "Hollandse Garnalen", keurmerk: "MSC" },
      { naam: "Gerookte Noorse Zalm", keurmerk: "ASC" },
    ],
    tekst:
      "Het haringseizoen is in volle gang. Zomerse warmte maakt een broodje haring of een bakje verse garnalen extra aantrekkelijk. Juli is ook een topmaand voor een feestelijk visplankje met gerookte Noorse zalm van High Seas (ASC), perfect voor een zomers borrel.",
    hoogtepunt: "Hoogseizoen haring en garnalen — ideaal voor een visplankje",
    links: [
      { label: "Feestschotel bestellen", href: "/nl/bestellen?product=feestschotel" },
      { label: "Gerookte Noorse Zalm", href: "/nl/assortiment" },
    ],
  },
  {
    naam: "Augustus",
    afkorting: "Aug",
    seizoen: "Zomer",
    vis: [
      { naam: "Haring" },
      { naam: "Hollandse Garnalen", keurmerk: "MSC" },
      { naam: "Kibbeling (Alaska koolvis)", keurmerk: "MSC" },
    ],
    tekst:
      "Augustus is vakantiemaand én haringseizoen. Kibbeling is in de zomerdrukte altijd een favoriet: knapperig en snel. Onze kibbeling wordt gemaakt van kabeljauw of MSC-gecertificeerde Alaska koolvis (Theragra chalcogramma) — vraag het personeel naar het aanbod van de dag.",
    hoogtepunt: "Kibbeling en haring: de zomerse klassieker",
    links: [{ label: "Kibbeling bestellen", href: "/nl/bestellen?product=kibbeling-pollak" }],
  },
  {
    naam: "September",
    afkorting: "Sep",
    seizoen: "Herfst",
    vis: [
      { naam: "Zeeuwse Mosselen", keurmerk: "MSC" },
      { naam: "Oesters" },
      { naam: "Schol" },
    ],
    tekst:
      "September luidt het mosselseizoen in. De Zeeuwse mosselen zijn dit jaar in topconditie — stevig, vol en zoet. Tegelijk verschijnen de eerste oesters van het nieuwe seizoen. Een mooi moment voor een dampende pan mosselen op een koelere avond.",
    hoogtepunt: "Mosselseizoen start — oesters zijn terug",
    links: [
      { label: "Assortiment bekijken", href: "/nl/assortiment" },
      { label: "Recepten", href: "/nl/recepten" },
    ],
  },
  {
    naam: "Oktober",
    afkorting: "Okt",
    seizoen: "Herfst",
    vis: [
      { naam: "Mosselen", keurmerk: "MSC" },
      { naam: "Oesters" },
      { naam: "Kabeljauw" },
      { naam: "Alaska Koolvis", keurmerk: "MSC" },
    ],
    tekst:
      "Oktober is ideaal voor stevigere visgerechten nu de temperaturen dalen. Mosselen en oesters zijn in hun beste periode, en kabeljauw of MSC-gecertificeerde Alaska koolvis leent zich uitstekend voor een warme visstoof, stamppot of ovenschotel.",
    hoogtepunt: "Visstoof met kabeljauw of koolvis — herfstcomfort",
    links: [
      { label: "Recepten", href: "/nl/recepten" },
      { label: "Assortiment", href: "/nl/assortiment" },
    ],
  },
  {
    naam: "November",
    afkorting: "Nov",
    seizoen: "Herfst",
    vis: [
      { naam: "Mosselen", keurmerk: "MSC" },
      { naam: "Oesters" },
      { naam: "Gerookte Noorse Zalm", keurmerk: "ASC" },
    ],
    tekst:
      "Mosselen en oesters zijn volop in het seizoen. November is de aanloop naar de feestdagen — hét moment voor een eerste proeverij van oesters en voor het reserveren van een feestelijke visschotel. Onze gerookte Noorse zalm (High Seas, ASC) is een klassieke keuze voor een festief plateau.",
    hoogtepunt: "Aanloop feestdagen — oesters, mosselen, gerookte zalm",
    links: [{ label: "Feestschotel bestellen", href: "/nl/bestellen?product=feestschotel" }],
  },
  {
    naam: "December",
    afkorting: "Dec",
    seizoen: "Winter",
    vis: [
      { naam: "Oesters" },
      { naam: "Mosselen", keurmerk: "MSC" },
      { naam: "Gerookte Noorse Zalm", keurmerk: "ASC" },
      { naam: "Biologische Zalm", keurmerk: "BIO" },
    ],
    tekst:
      "December is hét feestseizoen voor vis. Oesters en mosselen zijn op hun allerbest, gerookte zalm staat op elk feestelijk plateau, en onze feestelijke visschotels zijn op bestelling verkrijgbaar voor uw kerst- of oudjaarsavond. Bestel op tijd — we zijn erg populair in december.",
    hoogtepunt: "Kerstvis, oesters en feestschotels — bestel op tijd!",
    links: [
      { label: "Feestschotel bestellen", href: "/nl/bestellen?product=feestschotel" },
      { label: "Assortiment bekijken", href: "/nl/assortiment" },
    ],
  },
];
