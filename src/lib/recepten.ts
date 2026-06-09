export type ReceptTag =
  | "Snel"
  | "Met de kids"
  | "Zomers"
  | "Bijzonder"
  | "Makkelijk"
  | "Gezond";

export type Recept = {
  slug: string;
  title: string;
  subtitle: string;
  tijd: string;
  moeilijkheid: "Makkelijk" | "Gemiddeld" | "Uitdagend";
  tags: ReceptTag[];
  fotoUrl?: string;
  fotoLabel: string;
  vanSchaap: string[];
  vanSupermarkt: string[];
  bereidingswijze: string[];
  verhaal: string;
  highlight?: string;
  seoKeywords?: string;
};

export const ALLE_TAGS: ReceptTag[] = [
  "Snel",
  "Met de kids",
  "Zomers",
  "Bijzonder",
  "Makkelijk",
  "Gezond",
];

export const TAG_ICON: Record<ReceptTag, string> = {
  Snel: "⚡",
  "Met de kids": "👨‍👧",
  Zomers: "☀️",
  Bijzonder: "✦",
  Makkelijk: "✓",
  Gezond: "◎",
};

export const recepten: Recept[] = [
  {
    slug: "zomerse-zalmsalade",
    title: "Zomerse zalmsalade",
    subtitle: "Licht, fris en in 15 minuten op tafel",
    tijd: "15 min",
    moeilijkheid: "Makkelijk",
    tags: ["Zomers", "Snel", "Makkelijk", "Gezond"],
    fotoUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    fotoLabel: "Frisse saladekom met stukjes zalm en groenten",
    vanSchaap: [
      "Vers gerookte zalm (ca. 150g per persoon)",
      "Of: Varlaks zalmfilet — 12 min op 200°C in de oven",
    ],
    vanSupermarkt: [
      "Rucola of veldsla (100g)",
      "½ komkommer",
      "1 avocado",
      "½ rode ui, dun gesneden",
      "Sap van 1 citroen + olijfolie",
      "Optioneel: kappertjes, verse dille",
    ],
    bereidingswijze: [
      "Als u de zalm zelf bakt: oven op 200°C, zalm 12 min — klaar als hij makkelijk uiteen valt.",
      "Dressing: citroensap + olijfolie + zout + peper mengen.",
      "Sla op een schaal. Komkommer en avocado verdelen.",
      "Zalm bovenop leggen en in stukken trekken.",
      "Rode ui erover, besprenkel met dressing. Direct serveren.",
    ],
    verhaal:
      "De perfecte zomerse lunch of een licht diner. Vers gerookte zalm van Schaap's Vis maakt dit gerecht direct bijzonder — de rooksmaak past perfect bij de frisheid van citroen en avocado. Vraag Aldert welke zalm die dag het lekkerst ruikt.",
    highlight: "15 min · Zomer hit",
    seoKeywords: "zalmsalade recept, zomerse salade zalm, gerookte zalm salade",
  },
  {
    slug: "zalm-citroen-dille",
    title: "Zalm in de oven met citroen en dille",
    subtitle: "Simpel, snel en verrassend lekker",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Makkelijk", "Gezond"],
    fotoUrl:
      "https://images.unsplash.com/photo-1614627293113-e7e68163d958?w=800&q=80",
    fotoLabel: "Zalmfilets in ovenschaal met citroenschijfjes en kruiden",
    vanSchaap: ["Varlaks zalmfilet (150–200g per persoon)"],
    vanSupermarkt: [
      "1 citroen",
      "Verse dille",
      "Olijfolie, zout, peper",
      "Optioneel: knoflook, kappertjes",
    ],
    bereidingswijze: [
      "Oven voorverwarmen op 200°C.",
      "Zalm op bakpapier. Besprenkel met olijfolie, zout en peper.",
      "Citroenschijfjes en dille erop.",
      "Bak 12–15 min. Iets rosé van binnen is perfect — niet te gaar maken.",
      "Direct serveren met krieltjes of rijst.",
    ],
    verhaal:
      "De Varlaks zalm heeft zo'n rijke smaak dat er weinig bij nodig is. Aldert's advies: niet te lang in de oven. Rosé van binnen is geen fout — dat is precies goed.",
    highlight: "Varlaks special",
    seoKeywords: "zalm oven recept, zalm citroen dille, varlaks zalm recept",
  },
  {
    slug: "kibbeling-bakken",
    title: "Kibbeling thuis bakken",
    subtitle: "Knapperig van buiten, mals van binnen · leuk om met de kids te doen",
    tijd: "30–35 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Met de kids", "Bijzonder"],
    fotoUrl:
      "https://images.unsplash.com/photo-1611599538235-128e54f1250f?w=800&q=80",
    fotoLabel: "Goudbruin gebakken kibbeling met witte saus",
    vanSchaap: [
      "Kibbeling beslag (kabeljauw of pollak) — 200g per persoon is onze aanbeveling",
      "Keuze kabeljauw = steviger, diepe smaak (de authentieke keuze)",
      "Keuze pollak = milder, luchtig — de populairste tegenwoordig",
      "Optioneel: extra bloem (±€1–4 afhankelijk van hoeveelheid)",
    ],
    vanSupermarkt: [
      "1–1,5 liter frituurolie of zonnebloemolie",
      "Keukenpapier",
      "Dipsaus naar keuze: tartaarsaus, mayonaise of zure room",
      "Optioneel: friet of stokbrood erbij",
    ],
    bereidingswijze: [
      "Haal de kibbeling 15 min van tevoren uit de koelkast — koude vis verlaagt de olietemperatuur.",
      "GEEN frituurpan? Geen probleem — gebruik een diepe pan met 5 cm olie. Vul niet te vol: olie schuimt bij het bakken.",
      "Verhit olie tot 175–180°C. Test: houtje in de olie — als het snel borrelt, is het goed.",
      "Bak in kleine porties: maximaal 4–6 stukken tegelijk. Meer tegelijk = temperatuur zakt = vettige kibbeling.",
      "Bak 3–4 minuten goudbruin, één keer omdraaien.",
      "Uitlekken op keukenpapier, direct bestrooien met zout.",
      "Meteen serveren — kibbeling wacht niet.",
    ],
    verhaal:
      "Kibbeling bakken is makkelijker dan het lijkt, maar er zijn twee dingen die het verschil maken: olietemp en portiegrootte. Met de kids is dit een perfect kookproject — laat ze de kibbeling voorzichtig in de pan laten zakken (altijd met tang, op veilige afstand van het spatten). De keuze tussen kabeljauw en pollak: kabeljauw heeft een stevigere bite en een uitgesprokenere vissmaak. Pollak is milder. Beide zijn lekker — het is maar net wat u wilt.",
    highlight: "200g p.p. aanbevolen",
    seoKeywords:
      "kibbeling recept thuis, kibbeling bakken, kabeljauw kibbeling, pollak kibbeling",
  },
  {
    slug: "gravlaks",
    title: "Gravlaks van Varlaks zalm",
    subtitle: "48 uur geduld — het meest indrukwekkende voorgerecht dat u ooit serveert",
    tijd: "48 uur (+ 15 min bereiding)",
    moeilijkheid: "Uitdagend",
    tags: ["Bijzonder"],
    fotoUrl:
      "https://images.unsplash.com/photo-1498604819470-d34ff92b1341?w=800&q=80",
    fotoLabel: "Gepekelde zalm met verse dille en roze peperbessen",
    vanSchaap: [
      "Hele Varlaks zalmfilet (500–800g, met vel) — vraag Aldert de graten te verwijderen",
    ],
    vanSupermarkt: [
      "200g grof zeezout + 150g suiker",
      "1 grote bos verse dille",
      "1 el grofgemalen peper",
      "Optioneel: 2 el cognac",
      "Serveren: roggebrood, roomkaas, rode ui, kappertjes",
    ],
    bereidingswijze: [
      "Dille fijnhakken. Mengen met zout, suiker en peper.",
      "Zalm met velzijde naar onder op vershoudfolie. Volledig afdekken met het mengsel.",
      "Strak in folie wikkelen. In schaal met gewicht erop (snijplank + blikjes).",
      "48 uur in de koelkast. Na 24 uur omdraaien.",
      "Afspoelen, droogdeppen. In flinterdunne plakjes snijden met lang scherp mes.",
      "Serveren op roggebrood met roomkaas.",
    ],
    verhaal:
      "Gravlaks is een Scandinavisch recept waarbij de zalm 'gaart' door pekelen — geen oven nodig. Eerlijk: dit gerecht duurt lang en is voor gevorderden. Maar de reactie van uw gasten maakt het absoluut waard. Gebruik altijd verse Varlaks zalm — de kwaliteit is allesbepalend bij rauw eten.",
    highlight: "Weekend project",
    seoKeywords: "gravlaks recept, gepekelde zalm, zelf gravlax maken",
  },
  {
    slug: "haring-salade",
    title: "Haring met appel en rode ui",
    subtitle: "Fris, snel en klassiek Hollands",
    tijd: "15 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Makkelijk", "Zomers"],
    fotoUrl:
      "https://images.unsplash.com/photo-1665841265022-27fd74b83005?w=800&q=80",
    fotoLabel: "Haring op roggebrood met rode ui en citroen",
    vanSchaap: ["4 verse haringen, gefileerd — haal ze op de dag zelf"],
    vanSupermarkt: [
      "1 zoetzure appel (Elstar)",
      "1 kleine rode ui",
      "2 el crème fraîche + 1 tl grove mosterd",
      "Verse bieslook, citroensap",
    ],
    bereidingswijze: [
      "Haring in stukjes. Appel schillen en in blokjes. Ui fijn snipperen.",
      "Crème fraîche + mosterd + citroensap + zout mengen.",
      "Alles voorzichtig samenvoegen.",
      "10 min koelen. Serveren op roggebrood.",
    ],
    verhaal:
      "Verse haring is het paradepaardje van de Hollandse vishandel. Hoe verser, hoe beter — haal hem op de dag zelf bij Schaap's Vis.",
    seoKeywords: "haring recept, verse haring met appel, haring salade",
  },
  {
    slug: "romige-vissoep",
    title: "Romige vissoep",
    subtitle: "Verwarmend, vol van smaak en vol vis",
    tijd: "45 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Bijzonder", "Gezond"],
    fotoUrl:
      "https://images.unsplash.com/photo-1620894580123-466ad3a0ca06?w=800&q=80",
    fotoLabel: "Kom vissoep met stukken verse vis in een rijke bouillon",
    vanSchaap: [
      "300g gemengde visfilet (kabeljauw + schol of zalm)",
      "Tip: vraag Aldert welke vis die dag het lekkerst is",
    ],
    vanSupermarkt: [
      "1 ui, 2 stengels selderij, 2 wortelen",
      "200ml slagroom, 1L visbouillon",
      "1 dl droge witte wijn, tomaten, kruiden",
    ],
    bereidingswijze: [
      "Groenten fruiten — 5 min.",
      "Wijn toevoegen, 2 min inkoken.",
      "Bouillon + tomaten + kruiden erbij. 15 min sudderen.",
      "Vis in stukken toevoegen. 8–10 min op laag vuur — NIET koken, vis wordt dan taai.",
      "Room erdoor, op smaak brengen. Direct serveren met brood.",
    ],
    verhaal:
      "Niets gaat boven zelfgemaakte vissoep op een koude dag. Vraag Aldert welke vis die dag het lekkerst is — een combinatie van twee soorten geeft de meeste diepte.",
    seoKeywords: "vissoep recept, romige vissoep, zelfgemaakte vissoep",
  },
  {
    slug: "gegrilde-schol",
    title: "Gegrilde scholfilet met groene kruiden",
    subtitle: "Licht, gezond en in 20 minuten klaar",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Makkelijk", "Gezond", "Zomers"],
    fotoUrl:
      "https://images.unsplash.com/photo-1714559899701-fd966509f726?w=800&q=80",
    fotoLabel: "Gegrilde witte visfilet met groenten en limoen",
    vanSchaap: ["Verse scholfilet (150g per persoon)"],
    vanSupermarkt: [
      "30g roomboter",
      "Sap van 1 citroen",
      "Peterselie en bieslook",
    ],
    bereidingswijze: [
      "Schol droogdeppen met keukenpapier.",
      "Zout en peper aan beide kanten.",
      "Boter in pan op middelhoog vuur. Schol 2–3 min per kant — geduld.",
      "Citroensap erbij (let op: spettert!). Kruiden erover.",
      "Direct serveren.",
    ],
    verhaal:
      "Schol is een onderschatte vis die thuis zelden klaargemaakt wordt. Snel, licht en gezond. Overkoken is de enige fout die u kunt maken — ze heeft vrijwel geen bereidingstijd nodig.",
    seoKeywords: "schol recept, scholfilet bakken, platvis recept",
  },
];
