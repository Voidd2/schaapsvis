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
  keuken?: string;
  veiligheid?: string;
  /** Eigen foto van het gerecht. Zet die zodra de eigenaar er een heeft. */
  fotoUrl?: string;
  fotoLabel: string;
  /**
   * De vis uit het assortiment die dit gerecht draagt (`slug` uit
   * `assortiment-data.ts`). Legt de link van recept naar product voor advies.
   * Een productfoto mag nooit een foto van het bereide gerecht vervangen.
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

import { RECEPT_FOTOS } from "./recept-fotos";
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
      "300 g gerookte zalm",
    ],
    vanSupermarkt: [
      "100 g rucola of veldsla",
      "½ komkommer",
      "1 avocado",
      "½ rode ui",
      "1 citroen",
      "2 el olijfolie",
      "1 el kappertjes (optioneel)",
      "1 el fijngehakte dille",
      "Peper",
    ],
    bereidingswijze: [
      "Was en droog de sla. Snijd komkommer en avocado, en snijd de ui in dunne ringen.",
      "Meng 2 el citroensap met de olijfolie en peper.",
      "Verdeel sla, komkommer en avocado over vier borden.",
      "Verdeel de gerookte zalm en rode ui erover. Voeg eventueel kappertjes toe.",
      "Besprenkel met dressing, strooi de dille erover en serveer direct.",
    ],
    verhaal: "Een frisse salade met gerookte zalm, komkommer en avocado. Serveer als voorgerecht of lichte lunch; voeg voor een grotere maaltijd brood toe.",
    highlight: "15 min · Zomer hit",
    seoKeywords: "zalmsalade recept, zomerse salade zalm, gerookte zalm salade",
    porties: 4,
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
    vanSchaap: [
      "4 Varlaks zalmfilets van 150–200 g",
    ],
    vanSupermarkt: [
      "1 citroen",
      "15 g verse dille",
      "2 el olijfolie",
      "Zout en peper",
      "600 g krieltjes of 300 g rijst (optioneel bijgerecht)",
    ],
    bereidingswijze: [
      "Verwarm de oven voor op 200°C (180°C hetelucht). Kook eventueel de krieltjes of rijst volgens de verpakking.",
      "Leg de zalm in een ovenschaal, bestrijk met olie en voeg zout en peper toe.",
      "Leg citroenschijfjes en de helft van de dille op de zalm.",
      "Bak circa 12–18 minuten, afhankelijk van de dikte. Controleer dat de vis ook in het dikste deel gaar is; hij valt dan gemakkelijk in vlokken uiteen.",
      "Strooi de resterende dille erover en serveer met het gekozen bijgerecht.",
    ],
    verhaal: "Citroen en dille passen bij de zachte smaak van zalm. De dikte van de filet bepaalt de oventijd: controleer de vis, niet alleen de klok.",
    highlight: "Varlaks special",
    seoKeywords: "zalm oven recept, zalm citroen dille, varlaks zalm recept",
    porties: 4,
  },
  {
    slug: "kibbeling-bakken",
    hoofdproduct: "kibbeling",
    title: "Kibbeling thuis bakken",
    subtitle: "Knapperig van buiten, mals van binnen — het frituren doet een volwassene",
    tijd: "40 min",
    moeilijkheid: "Gemiddeld",
    tags: [
      "Bijzonder",
    ],
    fotoLabel: "Goudbruin gebakken kibbeling met witte saus",
    vanSchaap: [
      "800 g rauwe pollakfilet, zonder graten — vraag vooraf naar de mogelijkheden",
    ],
    vanSupermarkt: [
      "150 g bloem + 2 el extra om de vis te bestuiven",
      "1 tl bakpoeder",
      "200 ml koud bruiswater",
      "1 tl paprikapoeder",
      "½ tl zout en peper naar smaak",
      "Frituurolie: hoeveelheid volgens de frituurpan, of voldoende voor een laag van 5 cm in een hoge pan",
      "Citroen en ravigottesaus (optioneel)",
    ],
    bereidingswijze: [
      "Snijd de vis in stukken van ongeveer 4 cm en dep goed droog. Houd de vis gekoeld tot gebruik.",
      "Meng 150 g bloem, bakpoeder, paprikapoeder, zout en peper. Klop het koude bruiswater erdoor tot een glad, dik vloeibaar beslag.",
      "Verhit de olie tot 175°C en controleer met een frituurthermometer. Vul een gewone hoge pan niet meer dan voor een derde met olie.",
      "Bestuif de vis licht met de extra bloem en haal de stukken door het beslag.",
      "Bak in kleine porties circa 4–5 minuten tot goudbruin en van binnen gaar. Laat de olie tussen porties weer op temperatuur komen.",
      "Laat uitlekken op keukenpapier en serveer direct, eventueel met citroen en saus.",
    ],
    verhaal: "Zelf kibbeling maken begint met rauwe visfilet en een koud beslag. Dep de vis goed droog en bak in kleine porties, zodat het korstje krokant blijft. Laat het frituren aan een volwassene over; kinderen kunnen op veilige afstand helpen met het beslag.",
    highlight: "200g p.p. aanbevolen",
    seoKeywords:
      "kibbeling recept thuis, kibbeling bakken, pollak kibbeling",
    porties: 4,
  },
  {
    slug: "gravlaks",
    hoofdproduct: "varlaks-zalm",
    title: "Gravlaks van Varlaks zalm",
    subtitle: "48 uur geduld — het meest indrukwekkende voorgerecht dat u ooit serveert",
    tijd: "48 uur (+ 25 min bereiding)",
    moeilijkheid: "Uitdagend",
    tags: ["Bijzonder"],
    fotoLabel: "Gepekelde zalm met verse dille en roze peperbessen",
    vanSchaap: [
      "600 g VÅRLAKS-zalmfilet met vel van Schaap’s Vishandel",
    ],
    vanSupermarkt: [
      "75 g grof zeezout",
      "75 g suiker",
      "20 g verse dille",
      "1 tl grofgemalen zwarte peper",
      "1 citroen",
      "2 el grove mosterd",
      "1 el honing",
      "1 el wittewijnazijn",
      "2 el neutrale olie",
      "Roggebrood om te serveren",
    ],
    bereidingswijze: [
      "Controleer de VÅRLAKS-zalmfilet op graten en dep de filet droog. Werk met schoon keukengerei en houd de zalm gekoeld.",
      "Meng zout, suiker, peper, citroenrasp en de helft van de fijngehakte dille.",
      "Leg de zalm met het vel naar beneden in een schaal op vershoudfolie. Verdeel het pekelmengsel over het visvlees en verpak goed.",
      "Zet afgedekt 48 uur in de koelkast bij 4°C met een licht gewicht erop. Keer het pakket elke 12 uur en houd het gekoeld.",
      "Verwijder de pekel zorgvuldig en dep de vis droog. Snijd vlak voor het serveren dunne plakjes van het vel af.",
      "Klop mosterd, honing, azijn en olie tot een saus en roer de resterende dille erdoor.",
      "Serveer kleine porties met de mosterd-dillesaus, roggebrood en citroen.",
    ],
    verhaal: "Met onze VÅRLAKS-zalm maakt u zachte gravlaks met dille en een frisse mosterd-dillesaus. Liever meteen genieten? We hebben gravlaks regelmatig kant-en-klaar in de winkel. Stuur ons gerust een WhatsApp-bericht voor de actuele beschikbaarheid.",
    highlight: "Weekend project",
    seoKeywords: "gravlaks recept, gepekelde zalm, zelf gravlax maken",
    porties: 6,
    keuken: "Scandinavisch",
    veiligheid: "Gravlaks is gepekelde, ongegaarde zalm. Werk met schoon keukengerei en houd de vis tijdens de bereiding bij 4°C gekoeld. Zwangeren, jonge kinderen, ouderen en mensen met verminderde weerstand kiezen beter een door en door verhit visgerecht.",
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
      "600 g gemengde visfilet, bijvoorbeeld kabeljauw, schol en zalm",
    ],
    vanSupermarkt: [
      "1 ui",
      "2 stengels bleekselderij",
      "2 wortelen",
      "400 g tomatenblokjes uit blik",
      "1 liter visbouillon",
      "200 ml slagroom",
      "100 ml droge witte wijn of extra bouillon",
      "1 el olijfolie",
      "1 laurierblad",
      "2 el fijngehakte peterselie",
      "Zout en peper",
    ],
    bereidingswijze: [
      "Snipper de ui en snijd selderij en wortel klein. Snijd de vis in stukken van circa 3 cm en houd gekoeld.",
      "Fruit de groenten 5 minuten in olijfolie.",
      "Voeg wijn of extra bouillon toe. Laat 2 minuten zacht koken.",
      "Voeg bouillon, tomaten en laurier toe en laat circa 15 minuten zachtjes koken tot de groenten gaar zijn.",
      "Leg de vis in de soep en laat 6–10 minuten zachtjes garen. Vermijd hard koken en veel roeren.",
      "Roer de room erdoor, verwarm goed en verwijder het laurierblad. Breng op smaak en strooi de peterselie erover.",
    ],
    verhaal:
      "Niets gaat boven zelfgemaakte vissoep op een koude dag. Vraag naar de vis van de dag — een combinatie van twee soorten geeft de meeste diepte.",
    seoKeywords: "vissoep recept, romige vissoep, zelfgemaakte vissoep",
    porties: 4,
  },
  {
    slug: "gegrilde-schol",
    hoofdproduct: "scholfilet",
    title: "Gebakken scholfilet met groene kruiden",
    subtitle: "Licht, gezond en in 20 minuten klaar",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Makkelijk", "Gezond", "Zomers"],
    fotoLabel: "Gebakken scholfilet met peterselie en citroen",
    vanSchaap: [
      "600 g scholfilet",
    ],
    vanSupermarkt: [
      "30 g roomboter",
      "1 el olijfolie",
      "1 citroen",
      "2 el fijngehakte peterselie",
      "1 el fijngeknipte bieslook",
      "Zout en peper",
    ],
    bereidingswijze: [
      "Controleer de scholfilets op graten en dep droog. Bestrooi met zout en peper.",
      "Verhit boter en olie in een koekenpan op middelhoog vuur. Bak zo nodig in twee porties.",
      "Bak de schol circa 2–3 minuten per kant; de exacte tijd hangt af van de dikte. Keer voorzichtig en controleer of de vis gaar is.",
      "Zet het vuur laag en voeg een beetje citroensap, peterselie en bieslook toe.",
      "Schep de kruidenboter over de vis en serveer direct.",
    ],
    verhaal:
      "Scholfilet is snel gaar en past goed bij een eenvoudige kruidenboter. Behandel de filets voorzichtig en controleer of het dikste deel gaar is: de baktijd hangt af van de dikte.",
    seoKeywords: "scholfilet bakken, gebakken schol recept, schol met groene kruiden",
    porties: 4,
  },

  // === Recepten met dank aan visrecepten.nl ===

  {
    slug: "kabeljauw-zeekraal-venkel",
    hoofdproduct: "kabeljauwfilet",
    title: "Kabeljauw met zeekraal en venkel",
    subtitle: "Knapperig vel, frisse groenten — in 30 minuten",
    tijd: "30 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Gezond", "Bijzonder"],
    fotoLabel: "Gebakken kabeljauw met zeekraal en venkel",
    vanSchaap: [
      "4 kabeljauwfilets met vel van 150 g — vraag naar beschikbaarheid",
    ],
    vanSupermarkt: [
      "250 g zeekraal",
      "1 grote venkelknol",
      "4 el olie",
      "Peper en zo nodig een beetje zout",
    ],
    bereidingswijze: [
      "Verwarm de oven voor op 125°C. Breng de kabeljauw op smaak met zout en peper.",
      "Verhit 2 el olie in een koekenpan. Leg de kabeljauw met de velkant naar beneden en bak 3–4 minuten tot het vel knapperig is. Keer om, bak 1 minuut.",
      "Leg de filets in de oven en laat nog ±10 minuten nagaren. Controleer of het dikste deel gaar is.",
      "Snijd de venkel in dunne reepjes. Verhit 2 el olie in een wok en roerbak venkel en zeekraal 3–4 minuten — gaar maar nog met bite.",
      "Verdeel de groenten over 4 warme borden. Leg de kabeljauw met de velkant omhoog erop.",
    ],
    verhaal: "Kabeljauw met vel krijgt in de pan een krokante buitenkant. Venkel en zeekraal vormen een fris bijgerecht. Proef voordat u zout toevoegt: zeekraal is van zichzelf al zout.",
    seoKeywords:
      "kabeljauw zeekraal recept, kabeljauw venkel, kabeljauwlende bereiden",
    porties: 4,
  },
  {
    slug: "garnalensalade-pompoen",
    hoofdproduct: "hollandse-garnalen",
    title: "Hollandse garnalensalade met geroosterde pompoen",
    subtitle: "Garnalen op hun best — met edamame en zwarte bonen",
    tijd: "40 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Zomers", "Gezond", "Bijzonder"],
    fotoLabel: "Salade met Hollandse garnalen, geroosterde pompoen en bonen",
    vanSchaap: ["400 g gepelde, gekookte Hollandse garnalen"],
    vanSupermarkt: [
      "1 kleine pompoen van circa 1 kg",
      "1 kleine krop eikenbladsla",
      "6 el Caesardressing + 2 el mayonaise",
      "½ el sojasaus",
      "200 g zwarte bonen uit blik, uitgelekt",
      "125 g voorgekookte edamame",
      "3 el kappertjes",
      "1 tl kerrypoeder",
      "2 el zonnebloemolie",
    ],
    bereidingswijze: [
      "Verwarm de oven voor op 200°C. Halveer en schil de pompoen, verwijder de zaden en snijd in repen van circa 1 cm dik.",
      "Meng de pompoen met 1 el olie en het kerrypoeder. Verdeel over een bakplaat en rooster 20–25 minuten tot zacht; keer halverwege.",
      "Was de sla. Meng de Caesardressing met de mayonaise en ½ el sojasaus.",
      "Spoel de zwarte bonen af en laat uitlekken. Bak de voorgekookte edamame 2–3 minuten in de resterende 1 el olie. Laat pompoen en edamame iets afkoelen.",
      "Verdeel sla, pompoen, edamame, bonen en kappertjes over 4 kommen. Leg de garnalen erop. Serveer de dressing apart.",
    ],
    verhaal: "Een maaltijdsalade waarin de garnalen worden gecombineerd met zoete pompoen en bonen. Snijd de pompoen in dunne repen en controleer of ze zacht zijn voordat u de salade opmaakt.",
    seoKeywords:
      "hollandse garnalensalade, garnalen salade pompoen, garnalen bowl recept",
    porties: 4,
  },
  {
    slug: "gebakken-schol-tomaat-olijven",
    hoofdproduct: "scholfilet",
    title: "Gebakken schol met tomaat en olijven",
    subtitle: "Lichte scholfilet met een mediterrane saus",
    tijd: "25 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Makkelijk"],
    fotoLabel: "Gebakken schol op tomatensaus met groene en zwarte olijven",
    vanSchaap: ["600 g scholfilet"],
    vanSupermarkt: [
      "4 el bloem + ½ tl paprikapoeder",
      "3 el olijfolie",
      "2 sjalotten + 2 tenen knoflook",
      "1 el balsamicoazijn",
      "200 ml gezeefde tomaten",
      "50 g groene olijven + 50 g zwarte olijven",
      "2 el pesto",
      "Zout en peper",
      "300 g pasta of 600 g krieltjes (optioneel bijgerecht)",
    ],
    bereidingswijze: [
      "Meng bloem met peper, zout en paprikapoeder. Wentel de scholfilets erdoor.",
      "Verhit 1 el olijfolie, bak de sjalotjes en knoflook aan. Blus af met azijn, voeg gezeefde tomaten, olijven en pesto toe. Warm kort op en zet apart.",
      "Verhit de rest van de olie en bak de scholfilets aan beide kanten goudbruin, ±5 minuten totaal.",
      "Schep saus op 4 borden en leg de scholfilets erop. Serveer met pasta of krieltjes, bereid volgens de verpakking.",
    ],
    verhaal:
      "Schol met een mediterrane twist — de tomaat-olijvensaus past verrassend goed bij de zachte smaak van schol. Snel klaar en ook nog eens mooi op tafel. Probeer eens met kerstomaten door de saus.",
    seoKeywords:
      "gebakken schol recept, schol tomaat olijven, scholfilet bereiden",
    porties: 4,
    keuken: "Mediterraan",
  },
  {
    slug: "roggebrood-paling-appelsalsa",
    title: "Roggebrood met paling en appelsalsa",
    subtitle: "Gerookte paling als amuse — klaar in 10 minuten",
    tijd: "10 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Bijzonder"],
    fotoLabel: "Roggebroodhapjes met gerookte paling en appelsalsa",
    vanSchaap: ["100 g gerookte paling"],
    vanSupermarkt: [
      "1 kleine appel",
      "1 el citroensap",
      "½ el gembersiroop",
      "1 el fijngeknipte bieslook",
      "4 plakken roggebrood",
      "1 el mayonaise",
    ],
    bereidingswijze: [
      "Snijd de appel in kleine blokjes en meng met citroensap, gembersiroop en bieslook.",
      "Snijd de palingfilet in smalle stukken. Controleer op achtergebleven graten.",
      "Snijd elke plak roggebrood in twee kleine hapjes en bestrijk dun met mayonaise.",
      "Verdeel de paling en appelsalsa over de acht hapjes en serveer direct.",
    ],
    verhaal:
      "Gerookte paling is het best bewaarde geheim van de Hollandse vishandel. Diegenen die het kennen, zweren erbij. De zoetzure appelsalsa snijdt door de rijkheid van de paling — een hapje dat indruk maakt zonder dat het u meer dan 10 minuten kost.",
    highlight: "Amuse in 10 min",
    seoKeywords:
      "roggebrood paling recept, gerookte paling amuse, paling appel hapje",
    porties: 4,
  },
  {
    slug: "krabsalade-avocado",
    title: "Surimisalade met avocado",
    subtitle: "Licht, fris zomervoorgerecht",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Zomers"],
    fotoLabel: "Salade met surimi, avocado en tomaat",
    vanSchaap: [
      "200 g surimi (krabsticks) — vraag naar beschikbaarheid",
    ],
    vanSupermarkt: [
      "1 lente-ui",
      "100 g kerstomaten",
      "2 rijpe avocado's",
      "3 el citroensap",
      "40 g veldsla",
      "1 tl mosterd",
      "½ tl suiker",
      "2 el fijngeknipte bieslook",
      "3 el olijfolie",
      "Zout en peper",
    ],
    bereidingswijze: [
      "Snijd lente-ui en tomaten. Halveer de avocado's, verwijder de pit en snijd het vruchtvlees in plakken. Besprenkel met 1 el citroensap.",
      "Snijd de surimi in stukken of trek voorzichtig uit elkaar.",
      "Meng de resterende 2 el citroensap met mosterd, suiker, olijfolie, bieslook en peper. Voeg zo nodig zout toe.",
      "Verdeel veldsla, surimi, tomaten en avocado over vier borden. Voeg lente-ui en dressing toe.",
    ],
    verhaal: "Surimi, ook bekend als krabsticks, is een product van vis en is geen echt krabvlees. Met avocado en een citroendressing maakt u er een eenvoudig voorgerecht van.",
    seoKeywords: "surimisalade avocado recept, krabsticks salade, surimi voorgerecht",
    porties: 4,
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
    vanSchaap: [
      "200 g gepelde, gekookte Hollandse garnalen",
    ],
    vanSupermarkt: [
      "2 stronkjes witlof",
      "1 little gem",
      "150 g oesterzwammen",
      "½ komkommer",
      "100 g kerstomaten",
      "2 bosuien",
      "1 el wittewijnazijn",
      "3 el olijfolie",
      "1 el fijngehakte dille",
      "Zout en peper",
    ],
    bereidingswijze: [
      "Was en droog de sla en witlof. Snijd komkommer, tomaten en bosui.",
      "Scheur de oesterzwammen in stukken. Bak in 2 el olie circa 5–7 minuten goudbruin en laat even afkoelen.",
      "Meng 1 el olie met azijn, dille, zout en peper tot een dressing.",
      "Verdeel sla, witlof en gesneden groenten over vier borden. Voeg de oesterzwammen en garnalen toe.",
      "Besprenkel met de dressing en serveer direct.",
    ],
    verhaal:
      "Hollandse garnalen hebben zo'n puur, zoet smaakje — ze hoeven weinig. De oesterzwammen worden knapperig gebakken en vormen een mooie tegenhanger. Dit is een lunch die er feestelijk uitziet maar in 20 minuten klaar staat.",
    seoKeywords:
      "witlof garnalen salade, oesterzwam salade garnalen, hollandse garnalen recept",
    porties: 4,
  },
];

export const recepten: Recept[] = [
  ...receptenOrigineel,
  ...receptenPraktisch,
].map((recept) => ({ ...recept, fotoUrl: RECEPT_FOTOS[recept.slug] ?? recept.fotoUrl }));

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
 * Alleen een gerechtfoto wordt als receptbeeld gebruikt. Zonder gerechtfoto
 * blijft het naamvlak staan; een rauwe productfoto is geen vervanging.
 */
export function receptBeeld(recept: Recept): ReceptBeeld {
  if (recept.fotoUrl) {
    return { src: recept.fotoUrl, alt: `${recept.title} — recept van Schaap's Vishandel in Leiden` };
  }

  const product = recept.hoofdproduct ? getProduct(recept.hoofdproduct) : undefined;
  return {
    alt: recept.fotoLabel,
    productSlug: product?.slug,
    productNaam: product?.naam,
  };
}
