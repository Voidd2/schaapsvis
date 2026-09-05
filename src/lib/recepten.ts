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
  porties?: number;
  seizoen?: string;
  /** Eigen foto van het gerecht. Zet die zodra de eigenaar er een heeft. */
  fotoUrl?: string;
  fotoLabel: string;
  /**
   * De vis uit het assortiment die dit gerecht draagt (`slug` uit
   * `assortiment-data.ts`). Doet twee dingen: hij levert een beeld zolang er
   * geen foto van het gerecht is, en hij legt de link van recept naar product —
   * iemand die een recept leest wil daarna die vis kunnen bestellen.
   */
  hoofdproduct?: string;
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

// Bewust leeg gelaten: de labels ("Snel", "Zomers") zeggen het al, en een rij
// emoji is precies wat een handgemaakte site niet doet.
export const TAG_ICON: Record<ReceptTag, string> = {
  Snel: "",
  "Met de kids": "",
  Zomers: "",
  Bijzonder: "",
  Makkelijk: "",
  Gezond: "",
};

import { receptenPraktisch } from "./recepten-praktisch";

const receptenOrigineel: Recept[] = [
  {
    slug: "zomerse-zalmsalade",
    hoofdproduct: "gerookte-zalm-high-seas",
    title: "Zomerse zalmsalade",
    subtitle: "Licht, fris en in 15 minuten op tafel",
    tijd: "15 min",
    moeilijkheid: "Makkelijk",
    tags: ["Zomers", "Snel", "Makkelijk", "Gezond"],
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
      "De perfecte zomerse lunch of een licht diner. Vers gerookte zalm van Schaap's Vis maakt dit gerecht direct bijzonder — de rooksmaak past perfect bij de frisheid van citroen en avocado. Vraag ons welke zalm die dag het lekkerst ruikt.",
    highlight: "15 min · Zomer hit",
    seoKeywords: "zalmsalade recept, zomerse salade zalm, gerookte zalm salade",
  },
  {
    slug: "zalm-citroen-dille",
    hoofdproduct: "varlaks-zalm",
    title: "Zalm in de oven met citroen en dille",
    subtitle: "Simpel, snel en verrassend lekker",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Makkelijk", "Gezond"],
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
      "De Varlaks zalm heeft zo'n rijke smaak dat er weinig bij nodig is. Ons advies: niet te lang in de oven. Rosé van binnen is geen fout — dat is precies goed.",
    highlight: "Varlaks special",
    seoKeywords: "zalm oven recept, zalm citroen dille, varlaks zalm recept",
  },
  {
    slug: "kibbeling-bakken",
    hoofdproduct: "kibbeling",
    title: "Kibbeling thuis bakken",
    subtitle: "Knapperig van buiten, mals van binnen · leuk om met de kids te doen",
    tijd: "30–35 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Met de kids", "Bijzonder"],
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
    hoofdproduct: "gravad-lax",
    title: "Gravlaks van Varlaks zalm",
    subtitle: "48 uur geduld — het meest indrukwekkende voorgerecht dat u ooit serveert",
    tijd: "48 uur (+ 15 min bereiding)",
    moeilijkheid: "Uitdagend",
    tags: ["Bijzonder"],
    fotoLabel: "Gepekelde zalm met verse dille en roze peperbessen",
    vanSchaap: [
      "Hele Varlaks zalmfilet (500–800g, met vel) — vraag ons de graten te verwijderen",
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
    hoofdproduct: "haring",
    title: "Haring met appel en rode ui",
    subtitle: "Fris, snel en klassiek Hollands",
    tijd: "15 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Makkelijk", "Zomers"],
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
    hoofdproduct: "kabeljauwfilet",
    title: "Romige vissoep",
    subtitle: "Verwarmend, vol van smaak en vol vis",
    tijd: "45 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Bijzonder", "Gezond"],
    fotoLabel: "Kom vissoep met stukken verse vis in een rijke bouillon",
    vanSchaap: [
      "300g gemengde visfilet (kabeljauw + schol of zalm)",
      "Tip: vraag naar de vis van de dag",
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
      "Niets gaat boven zelfgemaakte vissoep op een koude dag. Vraag naar de vis van de dag — een combinatie van twee soorten geeft de meeste diepte.",
    seoKeywords: "vissoep recept, romige vissoep, zelfgemaakte vissoep",
  },
  {
    slug: "gegrilde-schol",
    hoofdproduct: "scholfilet",
    title: "Gegrilde scholfilet met groene kruiden",
    subtitle: "Licht, gezond en in 20 minuten klaar",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Makkelijk", "Gezond", "Zomers"],
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

  // === Recepten met dank aan visrecepten.nl ===

  {
    slug: "krieltjessalade-haring",
    hoofdproduct: "haring",
    title: "Krieltjessalade met haring",
    subtitle: "Klassiek Hollands — aardappel, haring, kappertjes",
    tijd: "30 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Zomers"],
    fotoLabel: "Krieltjessalade met kruiden en vis op een schaal",
    vanSchaap: ["4 verse haringen, gefileerd — haal ze zo vers mogelijk"],
    vanSupermarkt: [
      "1 kg krieltjes met schil",
      "2 el kappertjes + 2 el kapperpekel",
      "4 el mayonaise",
      "3 el bieslook + 3 el peterselie (fijngesneden)",
      "150 g gemengde sla",
      "Peper en zout",
    ],
    bereidingswijze: [
      "Kook de krieltjes in ruim gezouten water in ±20 minuten gaar. Giet af en laat iets uitstomen.",
      "Meng de kappertjes, kapperpekel, mayonaise, bieslook en peterselie door de nog warme krieltjes. Breng op smaak.",
      "Verdeel de sla over een platte schaal. Schep de krieltjes erop.",
      "Verdeel de haringsstukken erover. Bestrooi met extra bieslook. Direct serveren.",
    ],
    verhaal:
      "Dit is zo'n gerecht dat je in de zomer gewoon wil eten — buiten, in de zon, met een glas fris erbij. Verse haring van Schaap's Vis maakt hier echt het verschil. Vraag of we ze alvast fileren, dat scheelt u thuis werk.",
    seoKeywords:
      "krieltjessalade recept, aardappelsalade met haring, hollandse salade haring",
  },
  {
    slug: "kabeljauw-zeekraal-venkel",
    hoofdproduct: "kabeljauwhaas",
    title: "Kabeljauw met zeekraal en venkel",
    subtitle: "Knapperig vel, frisse groenten — in 30 minuten",
    tijd: "30 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Gezond", "Bijzonder"],
    fotoLabel: "Kabeljauwfilet met tomaat en citroen op bord",
    vanSchaap: [
      "4 stukken kabeljauwlende met vel (elk 150 g)",
      "250 g verse zeekraal",
    ],
    vanSupermarkt: [
      "1 grote venkelknol",
      "4 el rijst- of arachideolie",
      "Zout en peper",
    ],
    bereidingswijze: [
      "Verwarm de oven voor op 125°C. Breng de kabeljauw op smaak met zout en peper.",
      "Verhit 2 el olie in een koekenpan. Leg de kabeljauw met de velkant naar beneden en bak 3–4 minuten tot het vel knapperig is. Keer om, bak 1 minuut.",
      "Leg de filets in de oven en laat nog ±10 minuten nagaren.",
      "Snijd de venkel in dunne reepjes. Verhit 2 el olie in een wok en roerbak venkel en zeekraal 3–4 minuten — gaar maar nog met bite.",
      "Verdeel de groenten over 4 warme borden. Leg de kabeljauw met de velkant omhoog erop.",
    ],
    verhaal:
      "Zeekraal halen ze hier soms ook rechtstreeks uit de Zeeuwse delta. Zout van zichzelf, knapperig — het past perfect bij de milde, vlokkerige structuur van kabeljauwlende. Vraag om de lende: dat is het dikste, vetste stuk van de vis.",
    seoKeywords:
      "kabeljauw zeekraal recept, kabeljauw venkel, kabeljauwlende bereiden",
  },
  {
    slug: "hollandse-bowl",
    hoofdproduct: "haring",
    title: "Hollandse Bowl",
    subtitle: "Verse haring in een moderne poke bowl — met wortel en biet",
    tijd: "25 min",
    moeilijkheid: "Makkelijk",
    tags: ["Zomers", "Gezond", "Snel"],
    fotoLabel: "Kleurrijke poke bowl met vis, edamame en sesam",
    vanSchaap: ["4 verse haringen, in stukken"],
    vanSupermarkt: [
      "2 tl geroosterde sesamzaadjes",
      "1 rode biet",
      "1 bosuitje",
      "30 g ramen noedels",
      "2 el sojasaus",
      "8 radijsjes",
      "1 vel sushi nori (zeewier), in reepjes geknipt",
      "175 g edamame sojabonen",
      "1 wortel",
    ],
    bereidingswijze: [
      "Bereid de ramen noedels volgens de verpakking. Doe ze in een kom en besprenkel met sojasaus. Laat iets afkoelen.",
      "Snijd de wortel, radijsjes en bosuitje dun. Snijd de rode biet in dunne plakjes. Houd de haring apart in de koelkast tot serveren.",
      "Verdeel de noedels over 4 kommen. Schik alle ingrediënten erop. Bestrooi met sesam.",
      "Serveer met extra sojasaus en eventueel ingelegde gember en wasabi.",
    ],
    verhaal:
      "De Hawaiiaanse poke bowl — maar dan Hollands. Verse haring i.p.v. zalm, wortel en biet als onze eigen accenten. Haring is eigenlijk perfect voor een bowl: vet, krachtig van smaak en supersnel klaar.",
    highlight: "Hollandse draai",
    seoKeywords: "hollandse bowl recept, haring poke bowl, haring bowl",
  },
  {
    slug: "garnalensalade-pompoen",
    hoofdproduct: "hollandse-garnalen",
    title: "Hollandse garnalensalade met gegrilde pompoen",
    subtitle: "Garnalen op hun best — met edamame en zwarte bonen",
    tijd: "40 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Zomers", "Gezond", "Bijzonder"],
    fotoLabel: "Garnalensalade in een kom met kruiden en tomaten",
    vanSchaap: ["400 g Hollandse garnalen"],
    vanSupermarkt: [
      "1 kleine pompoen (±1 kg)",
      "1 kleine krop eikenbladsla",
      "6 el Caesardressing + 2 el mayonaise",
      "2 el sojasaus",
      "1 klein blik (200 g) zwarte bonen",
      "125 g voorgekookte edamame",
      "3 el kappertjes",
      "Kerrypoeder + zonnebloemolie",
    ],
    bereidingswijze: [
      "Halveer de pompoen, verwijder de zaden en snijd in smalle repen. Schil de repen.",
      "Verwarm de grill op de hoogste stand. Bestrijk de pompoenrepen met olie en bestrooi met kerrypoeder. Grill 5–8 minuten, regelmatig kerend.",
      "Was de sla. Meng de Caesardressing met de mayonaise en ½ el sojasaus.",
      "Warm de zwarte bonen op en laat uitlekken. Bak de edamame kort in olie.",
      "Verdeel sla, pompoen, edamame, bonen en kappertjes over 4 kommen. Leg de garnalen erop. Serveer de dressing apart.",
    ],
    verhaal:
      "Hollandse garnalen zijn zo vol van smaak — het zou zonde zijn ze te verstopt in een saus. Hier zijn ze de ster. De pompoen geeft zoetheid, de edamame bite. Lekker met warme rijst of als poké bowl.",
    seoKeywords:
      "hollandse garnalensalade, garnalen salade pompoen, garnalen bowl recept",
  },
  {
    slug: "gebakken-schol-tomaat-olijven",
    hoofdproduct: "scholfilet",
    title: "Gebakken schol met tomaat en olijven",
    subtitle: "Lichte scholfilet met een mediterrane saus",
    tijd: "25 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Makkelijk"],
    fotoLabel: "Goudbruin gebakken visfilet in een pan met citroen",
    vanSchaap: ["600 g scholfilet"],
    vanSupermarkt: [
      "4 el bloem + ½ tl paprikapoeder",
      "3 el olijfolie",
      "2 sjalotjes (gesnipperd) + 2 teentjes knoflook",
      "1 el balsamicoazijn",
      "200 ml gezeefde tomaten",
      "50 g groene olijven + 50 g zwarte olijven (gehalveerd)",
      "2 el groene of rode pesto",
    ],
    bereidingswijze: [
      "Meng bloem met peper, zout en paprikapoeder. Wentel de scholfilets erdoor.",
      "Verhit 1 el olijfolie, bak de sjalotjes en knoflook aan. Blus af met azijn, voeg gezeefde tomaten, olijven en pesto toe. Warm kort op en zet apart.",
      "Verhit de rest van de olie en bak de scholfilets aan beide kanten goudbruin, ±5 minuten totaal.",
      "Schep saus op 4 borden en leg de scholfilets erop. Lekker met pasta of krieltjes.",
    ],
    verhaal:
      "Schol met een mediterrane twist — de tomaat-olijvensaus past verrassend goed bij de zachte smaak van schol. Snel klaar en ook nog eens mooi op tafel. Probeer eens met kerstomaten door de saus.",
    seoKeywords:
      "gebakken schol recept, schol tomaat olijven, scholfilet bereiden",
  },
  {
    slug: "roggebrood-paling-appelsalsa",
    title: "Roggebrood met paling en appelsalsa",
    subtitle: "Gerookte paling als amuse — klaar in 10 minuten",
    tijd: "10 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Bijzonder"],
    fotoLabel: "Roggebrood met gerookte vis, roomkaas en bieslook",
    vanSchaap: ["100 g gerookte paling"],
    vanSupermarkt: [
      "1 appel (geschild)",
      "1 el citroensap + ½ el gembersiroop",
      "1 el kervel of bieslook (fijngesneden)",
      "3 roggebroodjes",
      "Mayonaise",
    ],
    bereidingswijze: [
      "Hak de appel fijn en meng met citroensap, gembersiroop en kervel of bieslook.",
      "Snijd de paling in stukken van 5 cm.",
      "Snijd de roggebroodjes elk in 3 plakken. Besmeer dun met mayonaise.",
      "Leg de palingsstukken op de mayonaise. Schep de appelsalsa erover. Direct serveren.",
    ],
    verhaal:
      "Gerookte paling is het best bewaarde geheim van de Hollandse vishandel. Diegenen die het kennen, zweren erbij. De zoetzure appelsalsa snijdt door de rijkheid van de paling — een hapje dat indruk maakt zonder dat het u meer dan 10 minuten kost.",
    highlight: "Amuse in 10 min",
    seoKeywords:
      "roggebrood paling recept, gerookte paling amuse, paling appel hapje",
  },
  {
    slug: "krabsalade-avocado",
    hoofdproduct: "surimisalade",
    title: "Krabsalade met avocado",
    subtitle: "Licht, fris zomervoorgerecht",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Zomers"],
    fotoLabel: "Frisse krabsalade als voorgerecht op een wit bord",
    vanSchaap: ["200 g krabsticks"],
    vanSupermarkt: [
      "1 lente-uitje",
      "3 kleine tomaatjes",
      "2 rijpe avocado's",
      "3 el citroensap",
      "40 g veldsla",
      "1 tl mosterd + ½ tl suiker",
      "2 el bieslook (fijngeknipt)",
      "6 el olijfolie",
      "Peper en zout",
    ],
    bereidingswijze: [
      "Snijd de lente-uitjes in ringetjes en de tomaatjes in partjes. Halveer de avocado's, verwijder de pit, schil en snijd in plakken. Besprenkel met 1 el citroensap.",
      "Trek de krabsticks met een vork uit elkaar tot lange slierten.",
      "Verdeel veldsla, tomaat en krab over 4 borden. Schik avocadoplakken waaiergewijs erop. Bestrooi met lente-ui.",
      "Meng mosterd, suiker, zout, peper en bieslook. Voeg olie toe en klop tot een gladde dressing. Schenk over de salade.",
    ],
    verhaal:
      "Krabsalade hoeft niet ingewikkeld te zijn — het gaat om de kwaliteit van de krabsticks en de rijpheid van de avocado. Een mooie zomerstart voor een diner, of als lunch met een stuk brood.",
    seoKeywords:
      "krabsalade avocado recept, krab salade voorgerecht, krabsticks salade",
  },
  {
    slug: "witlof-garnalen-oesterzwam",
    hoofdproduct: "hollandse-garnalen",
    title: "Witlof-oesterzwamsalade met Hollandse garnalen",
    subtitle: "Knapperige oesterzwam, romige garnalen, frisse witlof",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Gezond"],
    fotoLabel: "Salade met garnalen en paddenstoelen op een bord",
    vanSchaap: ["100 g Hollandse garnalen"],
    vanSupermarkt: [
      "2 stronkjes witlof",
      "1 stronk little gem sla",
      "150 g oesterzwammen",
      "½ komkommer",
      "100 g cherrytomaatjes",
      "4 stengels bosui",
      "Royale scheut azijn",
      "2 el olijfolie",
      "Verse dille, zout en peper",
    ],
    bereidingswijze: [
      "Scheur de witlofbladeren los en meng met een royale scheut azijn. Verwijder little gem-blaadjes en laat uitlekken.",
      "Verhit een pan op hoog vuur. Scheur grotere oesterzwammen in gelijke stukken en bak in olijfolie goudbruin en knapperig — regelmatig omscheppen.",
      "Snijd komkommer in reepjes, tomaatjes doormidden, hak bosui en dille fijn. Meng in een kom met olijfolie, zout en peper.",
      "Schik sla- en witlofbladeren op de borden. Verdeel de salade en gebakken oesterzwammen erover. Garneer met Hollandse garnalen.",
    ],
    verhaal:
      "Hollandse garnalen hebben zo'n puur, zoet smaakje — ze hoeven weinig. De oesterzwammen worden knapperig gebakken en vormen een mooie tegenhanger. Dit is een lunch die er feestelijk uitziet maar in 20 minuten klaar staat.",
    seoKeywords:
      "witlof garnalen salade, oesterzwam salade garnalen, hollandse garnalen recept",
  },
];

export const recepten: Recept[] = [
  ...receptenOrigineel,
  ...receptenPraktisch,
];

/* ═══════════════════════════════════════════════════════════════════════════
   Beeld bij een recept
   ═══════════════════════════════════════════════════════════════════════════ */

import { getProduct } from "./assortiment-data";

export interface ReceptBeeld {
  /** Ontbreekt als we niets hebben; toon dan het naamvlak. */
  src?: string;
  alt: string;
  /** Waarom deze foto er staat. Alleen bij een productfoto. */
  bijschrift?: string;
  /** Naar welk product dit recept verwijst, als dat er is. */
  productSlug?: string;
  productNaam?: string;
}

/**
 * Wat we bij een recept laten zien.
 *
 * Eerste keus is een foto van het gerecht zelf. Zolang die er niet is tonen we
 * de vis die je ervoor bij ons haalt, mét een bijschrift dat zegt wat het is.
 * Wat we níet doen is een foto van kabeljauw onder een receptnaam zetten en de
 * lezer laten denken dat het het gerecht is.
 */
export function receptBeeld(recept: Recept): ReceptBeeld {
  if (recept.fotoUrl) {
    return { src: recept.fotoUrl, alt: `${recept.title} — recept van Schaap's Vishandel in Leiden` };
  }

  const product = recept.hoofdproduct ? getProduct(recept.hoofdproduct) : undefined;
  if (product?.photo) {
    return {
      src: product.photo,
      alt: `${product.naam} bij Schaap's Vishandel in Leiden — de vis voor ${recept.title.toLowerCase()}`,
      bijschrift: `Wat u hiervoor bij ons haalt: ${product.naam}`,
      productSlug: product.slug,
      productNaam: product.naam,
    };
  }

  return {
    alt: recept.fotoLabel,
    productSlug: product?.slug,
    productNaam: product?.naam,
  };
}
