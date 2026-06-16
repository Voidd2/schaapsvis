export type BlogCategorie = "Seizoen" | "Ons verhaal" | "Visweetjes" | "Duurzaam";

export type BlogSectie = {
  kop?: string;
  alineas: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  datum: string; // ISO, voor sortering + Article schema
  datumLabel: string;
  leestijd: string;
  categorie: BlogCategorie;
  fotoUrl: string;
  fotoAlt: string;
  secties: BlogSectie[];
  gerelateerdeRecepten?: string[]; // recept-slugs
  gerelateerdeLinks?: { label: string; href: string }[];
  seoKeywords: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "viskalender-welke-vis-in-welk-seizoen",
    title: "De viskalender: welke vis is wanneer het lekkerst?",
    excerpt:
      "Vis heeft seizoenen, net als groente en fruit. Wie in het juiste seizoen koopt, eet lekkerder én vaak goedkoper. De complete kalender, maand voor maand.",
    datum: "2026-06-01",
    datumLabel: "1 juni 2026",
    leestijd: "5 min",
    categorie: "Seizoen",
    fotoUrl: "/images/scene-vis.svg",
    fotoAlt: "Verse vis op ijs in de viswinkel",
    secties: [
      {
        alineas: [
          "Veel mensen denken dat vis het hele jaar hetzelfde smaakt. Niets is minder waar. Vis heeft seizoenen — momenten waarop hij op zijn vetst, vleziger en het meest op smaak is. Dat hangt samen met de paaitijd, de watertemperatuur en wat de vis zelf eet. Wie in het juiste seizoen koopt, eet niet alleen lekkerder, maar betaalt vaak ook minder: volop aanbod betekent een scherpere prijs.",
        ],
      },
      {
        kop: "Lente (maart – mei)",
        alineas: [
          "Het seizoen van de eerste platvis. Schol is in mei op zijn best — na de paai in de winter heeft hij zich tegoed gedaan en is het vlees stevig en blank. Ook zeebaars en dorade komen in de lente goed op smaak. En wie van rauwe oesters houdt: tot eind april zijn ze nog op hun mooist, daarna beginnen ze melkig te worden door de voortplantingstijd.",
        ],
      },
      {
        kop: "Zomer (juni – augustus)",
        alineas: [
          "Hét hoogtepunt: de Hollandse Nieuwe. De eerste vaatjes komen half juni binnen en dan is de nieuwe haring zes tot acht weken op zijn aller-romigst. Ook makreel is in de zomer op zijn vetst — perfect om te roken of te stomen. Sardines en ansjovis horen eveneens bij de zomer; op de grill zijn ze onverslaanbaar.",
        ],
      },
      {
        kop: "Herfst (september – november)",
        alineas: [
          "Vanaf september begint het mosselseizoen pas écht (onthoud: de maanden met een 'r'). De Zeeuwse mossel is in oktober en november op zijn vleesvolst. Garnalen zijn in de nazomer en herfst op hun best, en ook de eerste wintervis — kabeljauw en wijting — komt dan mooi op smaak.",
        ],
      },
      {
        kop: "Winter (december – februari)",
        alineas: [
          "Koud water maakt stevige, vette vis. Kabeljauw is in de winter op zijn allerbest: dikke, sneeuwwitte vlokken. Ook tarbot, griet en schelvis horen bij het winterseizoen. En de oester is terug — rond de feestdagen op zijn mooist. Gerookte paling en zalm zijn klassiekers op de kersttafel.",
          "Twijfelt u wat er déze week goed is? Kom langs of bel ons — wij weten elke dag wat er vers van de veiling komt.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Bekijk ons assortiment", href: "/assortiment" },
      { label: "Bestel vooruit", href: "/bestellen" },
    ],
    seoKeywords:
      "viskalender, vis seizoen, welke vis wanneer, verse vis seizoen, hollandse nieuwe wanneer, mosselseizoen",
  },
  {
    slug: "hollandse-nieuwe-waarom-juni-haring-anders-smaakt",
    title: "Hollandse Nieuwe: waarom juni-haring anders smaakt",
    excerpt:
      "Elk jaar in juni staat Nederland in de rij voor de eerste nieuwe haring. Maar wat maakt de Hollandse Nieuwe nou eigenlijk zo bijzonder? Het zit hem in het vet.",
    datum: "2026-06-08",
    datumLabel: "8 juni 2026",
    leestijd: "4 min",
    categorie: "Visweetjes",
    fotoUrl: "/images/scene-haring.svg",
    fotoAlt: "Hollandse Nieuwe haring",
    secties: [
      {
        alineas: [
          "Haring is er het hele jaar. Maar Hollandse Nieuwe — die is er maar een paar maanden. De eerste vaatjes komen traditioneel half juni binnen, en dan proeft u iets wat de rest van het jaar simpelweg niet bestaat.",
        ],
      },
      {
        kop: "Het geheim: vet op precies het juiste moment",
        alineas: [
          "In het voorjaar begint de haring zich vol te eten aan watervlooien en plankton in de Noordzee. Tegen juni zit er minstens 16 procent vet in de vis — maar de voortplanting is nog niet begonnen, dus alle energie zit nog ín het visvlees in plaats van in hom of kuit. Dat is het magische venster: maximaal vet, maximaal romig.",
          "Alleen haring die in die periode gevangen is én op de traditionele manier wordt gerijpt, mag Hollandse Nieuwe heten. De vis wordt gekaakt — een techniek die de Nederlanders al sinds de veertiende eeuw gebruiken — waarbij de alvleesklier blijft zitten. De enzymen daaruit laten de haring rijpen tot die zachte, bijna boterachtige structuur.",
        ],
      },
      {
        kop: "Zo eet u hem",
        alineas: [
          "De puristen zijn streng: een echte nieuwe haring eet u puur, hooguit met wat gesnipperde ui. Bij de staart pakken, achteroverbuigen, happen. Maar eerlijk is eerlijk: op een zacht broodje met augurk is hij ook niet te versmaden.",
          "Bij ons in de winkel en op de markt snijden we de haring vers op het moment dat u hem bestelt — zo hoort het. Een haring die al uren gesneden ligt, verliest zijn glans en smaak.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Broodje haring bestellen", href: "/bestellen" },
      { label: "Bekijk de viskalender", href: "/blog/viskalender-welke-vis-in-welk-seizoen" },
    ],
    seoKeywords:
      "hollandse nieuwe, nieuwe haring, haring leiden, hollandse nieuwe 2026, wanneer hollandse nieuwe, haring eten",
  },
  {
    slug: "sinds-1938-de-geschiedenis-van-schaaps-vis",
    title: "Sinds 1938: vier generaties vis op de Herenstraat",
    excerpt:
      "Van Gerrit Schaap die in 1938 zijn viswinkel opende tot vandaag: de geschiedenis van een Leids begrip, verteld in vijf hoofdstukken.",
    datum: "2026-05-15",
    datumLabel: "15 mei 2026",
    leestijd: "6 min",
    categorie: "Ons verhaal",
    fotoUrl: "/images/scene-winkel.svg",
    fotoAlt: "Verse vis op de toonbank van een viswinkel",
    secties: [
      {
        alineas: [
          "Wie op de Herenstraat in Leiden loopt, ruikt het al voor hij het ziet: verse vis, gebakken kibbeling, gerookte makreel. Op nummer 48 zit al sinds 1938 dezelfde viswinkel. Dit is het verhaal van een zaak die generaties Leidenaren heeft gevoed.",
        ],
      },
      {
        kop: "1938 — Gerrit Schaap begint",
        alineas: [
          "Gerrit Schaap opent zijn vishandel in een tijd waarin de vis nog letterlijk vers van de boot kwam en elke Leidenaar zijn eigen visboer had. Zijn naam zou aan de winkel blijven kleven — tot op de dag van vandaag.",
        ],
      },
      {
        kop: "1957 — De familie Haasnoot neemt over",
        alineas: [
          "De jonge Cor Haasnoot komt als dertienjarige bij meneer Schaap werken. Hij leert het vak van onderaf en neemt in 1957 de zaak over. De naam 'Schaap' blijft — uit eerbetoon aan de oprichter. Zo werd de familie Haasnoot 'de familie Schaap' voor heel vis-etend Leiden.",
        ],
      },
      {
        kop: "2009 — De derde generatie",
        alineas: [
          "In 2009 neemt de derde generatie het roer officieel over. De winkel gaat mee de eenentwintigste eeuw in — maar de sfeer blijft zoals Leidenaren hem koesteren: persoonlijk, gezellig, eerlijk. 'Mensen komen hier niet alleen voor de vis, maar ook voor een praatje', klinkt het achter de toonbank. 'Het is hier soms net een dorpskroeg.'",
        ],
      },
      {
        kop: "2018 — Tachtig jaar, een feest van de stad",
        alineas: [
          "Op 1 januari 2018 bestaat de zaak tachtig jaar. Klanten sturen foto's en herinneringen in voor een jubileumboek. Een van de mooiste komt van Ria Verburg, die maandelijks kibbeling ophaalde voor de kinderopvang: 'Bij het ophalen zei hij altijd: een doos kibbeling voor het weeshuis! Ik moest er elke keer om lachen.'",
        ],
      },
      {
        kop: "Vandaag — klaar voor de vierde generatie",
        alineas: [
          "Naast de winkel op de Herenstraat staat het team tegenwoordig ook op de Leidse markt (woensdag en zaterdag) en bij Hoogvliet in Voorschoten (vrijdag). Het assortiment is gegroeid, de website is er bijgekomen — maar het hart van de zaak is onveranderd: verse vis, eerlijk advies en een goed gesprek.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Lees ons volledige verhaal", href: "/ons-verhaal" },
      { label: "Kom langs in de winkel", href: "/bezoek-ons" },
    ],
    seoKeywords:
      "schaaps vis geschiedenis, viswinkel leiden geschiedenis, herenstraat leiden, vishandel leiden 1938, oudste viswinkel leiden",
  },
  {
    slug: "wilde-zalm-vs-kweekzalm-waarom-wij-varlaks-kiezen",
    title: "Wilde zalm vs. kweekzalm — en waarom wij Varlaks kiezen",
    excerpt:
      "Is wilde zalm beter dan kweekzalm? Het eerlijke antwoord is genuanceerder dan u denkt. Over kleurstoffen, antibiotica en waarom goede kweek bestaat.",
    datum: "2026-04-20",
    datumLabel: "20 april 2026",
    leestijd: "5 min",
    categorie: "Duurzaam",
    fotoUrl: "/images/scene-zalm.svg",
    fotoAlt: "Verse zalmfilet",
    secties: [
      {
        alineas: [
          "'Wilde zalm is altijd beter dan kweekzalm' — het is een van de hardnekkigste overtuigingen onder visliefhebbers. Maar klopt het ook? Het eerlijke antwoord: het hangt er helemaal van af hoe er gekweekt wordt.",
        ],
      },
      {
        kop: "Het probleem met gewone kweekzalm",
        alineas: [
          "Industriële zalmkwekerijen proppen soms tienduizenden vissen in een kooi. Weinig ruimte betekent stress, ziektes en zeeluis — en dus antibiotica en chemische behandelingen. De roze kleur? Die komt bij goedkope kweekzalm vaak van synthetisch astaxanthine, een kleurstof uit de fabriek. Wilde zalm krijgt zijn kleur van nature, door het eten van kreeftachtigen.",
        ],
      },
      {
        kop: "Maar wilde zalm is geen wondermiddel",
        alineas: [
          "Wilde zalmbestanden staan wereldwijd onder druk. De Atlantische wilde zalm is zelfs zo schaars dat er nauwelijks nog commercieel op gevist mag worden. Veel 'wilde' zalm in de supermarkt is Pacifische zalm die ingevroren een halve wereldreis heeft gemaakt. Vers is anders.",
          "Goede kweek kán juist een oplossing zijn: het ontlast de wilde bestanden én levert verse vis van constante kwaliteit.",
        ],
      },
      {
        kop: "Waarom Varlaks anders is",
        alineas: [
          "Onze Varlaks zalm groeit op in het Skjerstadfjord in Noord-Noorwegen, bij twee familiebedrijven: Wenberg Fiskeoppdrett en Edelfarm. Lage dichtheid, ijskoud helder water, geen antibiotica, geen GMO. De kleur komt van Panaferd-AX — natuurlijk astaxanthine, hetzelfde stofje dat wilde zalm uit zijn voedsel haalt, niet de synthetische variant.",
          "Zeeluis wordt er niet met chemicaliën bestreden maar met een laser: camera's spotten de luis en een laserpuls schakelt hem uit, zonder de vis te raken. Het klinkt als science fiction, het is gewoon Noorse nuchterheid.",
          "Het resultaat proeft u: steviger van structuur, puurder van smaak. Kom langs en vergelijk zelf.",
        ],
      },
    ],
    gerelateerdeRecepten: ["varlaks-uit-de-oven"],
    gerelateerdeLinks: [
      { label: "Het volledige Varlaks-verhaal", href: "/varlaks" },
      { label: "Lees meer over biologische vis", href: "/biologische-vis" },
    ],
    seoKeywords:
      "wilde zalm vs kweekzalm, kweekzalm gezond, varlaks zalm, biologische zalm leiden, beste zalm kopen, zalm zonder antibiotica",
  },
  {
    slug: "waarom-staat-makreel-op-rood",
    title: "Waarom staat makreel op rood? Een eerlijk verhaal",
    excerpt:
      "Makreel is gezond, betaalbaar en heerlijk — maar staat sinds 2025 op rood in de VISwijzer. Hoe kan dat? En waarom verkopen wij hem dan nog?",
    datum: "2026-03-10",
    datumLabel: "10 maart 2026",
    leestijd: "4 min",
    categorie: "Duurzaam",
    fotoUrl: "/images/scene-vis.svg",
    fotoAlt: "Verse makreel",
    secties: [
      {
        alineas: [
          "Wij zijn er eerlijk over: de gestoomde makreel in onze vitrine staat op rood in de VISwijzer. Niet omdat de vangstmethode slecht is, en niet omdat de vis ongezond zou zijn — maar door iets veel menselijkers: ruzie over quota.",
        ],
      },
      {
        kop: "Wat is er aan de hand?",
        alineas: [
          "Makreel zwemt in scholen door de hele Noordoost-Atlantische Oceaan en trekt zich niets aan van landsgrenzen. De EU, Noorwegen, IJsland, Groot-Brittannië en Rusland moeten samen afspreken hoeveel er gevangen mag worden. Dat lukt al jaren niet — elk land stelt zijn eigen quotum vast, en opgeteld wordt er structureel meer gevangen dan biologen adviseren.",
          "Daarom zette de VISwijzer makreel in april 2025 op rood: niet de vis is het probleem, maar de politiek eromheen.",
        ],
      },
      {
        kop: "Waarom verkopen wij hem dan nog?",
        alineas: [
          "Een terechte vraag. Het antwoord: er is op dit moment geen breed verkrijgbaar duurzaam alternatief op commerciële schaal. Handlijn-gevangen makreel bestaat en is wél groen — maar het aanbod is zo klein dat het de vraag bij lange na niet dekt.",
          "Wij kiezen ervoor om transparant te zijn in plaats van te doen alsof er niets aan de hand is. U beslist zelf. En onze gestoomde makreel blijft wat hij is: drie ingrediënten — makreel, zout, rook — en boordevol omega-3.",
        ],
      },
      {
        kop: "Wat kunt u doen?",
        alineas: [
          "Eet gevarieerd. Wie de ene week makreel eet en de andere week MSC-gecertificeerde haring of ASC-zalm, spreidt de druk. En check gerust zelf de VISwijzer op goodfish.nl — dezelfde bron die wij gebruiken.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Onze biologische vis-pagina", href: "/biologische-vis" },
      { label: "VISwijzer op goodfish.nl", href: "https://www.goodfish.nl" },
    ],
    seoKeywords:
      "makreel viswijzer rood, makreel duurzaam, makreel overbevist, gestoomde makreel, makreel gezond omega 3",
  },
  {
    slug: "kibbeling-vs-lekkerbek-het-verschil",
    title: "Kibbeling vs. lekkerbek: wat is eigenlijk het verschil?",
    excerpt:
      "Beide goudbruin gebakken, beide onweerstaanbaar. Maar kibbeling en lekkerbek zijn écht twee verschillende dingen. Een korte les visboerologie.",
    datum: "2026-02-14",
    datumLabel: "14 februari 2026",
    leestijd: "3 min",
    categorie: "Visweetjes",
    fotoUrl: "/images/scene-vis.svg",
    fotoAlt: "Goudbruine kibbeling op bakpapier",
    secties: [
      {
        alineas: [
          "Aan onze toonbank horen we de vraag wekelijks: 'Wat is nou eigenlijk het verschil tussen kibbeling en lekkerbek?' Tijd om het één keer goed uit te leggen.",
        ],
      },
      {
        kop: "Kibbeling: stukjes",
        alineas: [
          "Kibbeling zijn stukjes witvis in beslag, gefrituurd tot ze goudbruin zijn. Traditioneel van kabeljauw — het woord komt van 'kabeljauwwang', de kibbeling van vroeger was letterlijk het wangvlees. Tegenwoordig wordt vaak ook pollak (koolvis) gebruikt: milder van smaak en vriendelijker geprijsd. Bij ons kunt u kiezen: de authentieke kabeljauw of de populaire pollak.",
        ],
      },
      {
        kop: "Lekkerbek: een hele filet",
        alineas: [
          "Een lekkerbek is een héle visfilet in beslag — meestal wijting, soms ook kabeljauw of schelvis. Groter, platter, en u eet hem als een soort visschnitzel. Wijting is een fijne, magere witvis die qua smaak verrassend dicht bij kabeljauw komt.",
        ],
      },
      {
        kop: "Welke kiest u?",
        alineas: [
          "Kibbeling is ideaal om te delen (of niet te delen — wij oordelen niet) en perfect met een bakje knoflook- of ravigotesaus. De lekkerbek is een maaltijd op zich, lekker op een broodje of met friet. Voedingstechnisch ontlopen ze elkaar weinig: beide rond de 220–235 kcal per 100 gram, eiwitrijk, en de vis zelf is mager — het beslag maakt het smullen.",
          "Pro-tip: bestel uw kibbeling vooruit voor drukke zaterdagen. Dan ligt hij vers gebakken voor u klaar.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Kibbeling vooruit bestellen", href: "/bestellen" },
      { label: "Bekijk de voedingswaarden", href: "/assortiment" },
    ],
    seoKeywords:
      "verschil kibbeling lekkerbek, kibbeling leiden, lekkerbek leiden, kibbeling kabeljauw of koolvis, kibbeling bestellen",
  },
  {
    slug: "de-echte-hollandse-garnaal",
    title: "De échte Hollandse garnaal is klein, grijs en geweldig",
    excerpt:
      "Vergeet de grote roze garnalen uit de diepvries. De echte Hollandse garnaal is klein, grijsbruin en wordt al sinds 1620 voor onze kust gevangen.",
    datum: "2026-01-20",
    datumLabel: "20 januari 2026",
    leestijd: "4 min",
    categorie: "Visweetjes",
    fotoUrl: "/images/scene-schaaldier.svg",
    fotoAlt: "Hollandse garnalen, gekookt en gepeld",
    secties: [
      {
        alineas: [
          "Als klanten 'garnalen' zeggen, bedoelen ze vaak de grote roze exemplaren van de toko of supermarkt. Maar de échte Hollandse garnaal — Crangon crangon voor de wetenschappers — is iets compleet anders: klein, grijsbruin in het water, en pas lichtroze nadat hij gekookt is. En qua smaak wint hij het van elke tropische gamba: zilt, zoet en vol.",
        ],
      },
      {
        kop: "Van Waddenzee tot uw boterham",
        alineas: [
          "Onze Hollandse garnalen komen van SOLT, een coöperatie van vijf garnalenvissers uit Zoutkamp — een dorp waar al sinds 1620 op garnalen wordt gevist. De boten (herkenbaar aan de letters 'ZK' op de boeg) vissen op de Waddenzee en Noordzee met bokkennetten.",
          "Het mooiste detail: de garnalen worden direct aan boord in zeewater gekookt. Verser kan technisch niet. Daarna worden ze in Lauwersoog machinaal gepeld — alles binnen Nederland, van vangst tot klaar product.",
        ],
      },
      {
        kop: "MSC-gecertificeerd",
        alineas: [
          "De SOLT-vissers werken MSC-gecertificeerd en gebruiken roller-chain systemen in plaats van traditionele klossenpezen, waardoor de zeebodem minder wordt beroerd. De Hollandse garnaal staat daarmee als groene keuze te boek.",
          "Let op: verse Hollandse garnalen zijn bij ons op aanvraag verkrijgbaar — bel of mail even van tevoren, dan zorgen wij dat ze er zijn.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Lees meer op onze biologische vis-pagina", href: "/biologische-vis" },
      { label: "Garnalen op aanvraag bestellen", href: "/bestellen" },
    ],
    seoKeywords:
      "hollandse garnalen, noordzeegarnalen, crangon crangon, garnalen leiden, hollandse garnalen kopen, solt garnalen",
  },
  {
    slug: "marktdag-in-leiden-achter-de-kraam",
    title: "Marktdag in Leiden: een kijkje achter de kraam",
    excerpt:
      "Elke woensdag en zaterdag staan we op de Leidse markt. Wat komt daar eigenlijk bij kijken? Een dag mee achter de vistoonbank — van 5 uur 's ochtends tot de laatste haring.",
    datum: "2026-05-02",
    datumLabel: "2 mei 2026",
    leestijd: "4 min",
    categorie: "Ons verhaal",
    fotoUrl: "/images/scene-markt.svg",
    fotoAlt: "Verse vis uitgestald op de markt in Leiden",
    secties: [
      {
        alineas: [
          "De Leidse markt aan de Nieuwe Rijn is een van de oudste en gezelligste markten van Nederland — en al jaren ons tweede thuis. Elke woensdag en zaterdag bouwen we er onze kraam op. Maar wat ziet u níet als u om elf uur een broodje haring komt halen?",
        ],
      },
      {
        kop: "Vijf uur 's ochtends",
        alineas: [
          "Marktdag begint in het donker. De verse vis moet geladen, het ijs gestort, de bakolie op temperatuur. Tegen half acht staat de kraam — en dan komen de vaste klanten al aanlopen, sommigen al tientallen jaren, voor 'het gewone recept': twee haringen, een bakje kibbeling, een ons gerookte zalm.",
        ],
      },
      {
        kop: "Waarom de markt anders is dan de winkel",
        alineas: [
          "Op de markt gaat alles sneller, luider, directer. U ziet de vis liggen, u ruikt de bakwalm, u hoort het advies van drie klanten verderop. Voor veel Leidenaren is de zaterdagse vismarkt een ritueel — broodje haring in de hand, boodschappentas aan de arm, even bijpraten.",
          "Praktisch om te weten: grote bestellingen kunt u ook op de markt afhalen. Geef het bij het vooruitbestellen gewoon aan — dan ligt alles klaar en hoeft u niet in de rij.",
        ],
      },
      {
        kop: "Drie plekken, één kwaliteit",
        alineas: [
          "Winkel op de Herenstraat (maandag t/m zaterdag), markt Leiden (woensdag + zaterdag), en vrijdags bij Hoogvliet in Voorschoten. Zelfde vis, zelfde mensen, zelfde verhalen. Tot ziens bij de kraam!",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Alle locaties en tijden", href: "/bezoek-ons" },
      { label: "Bestel vooruit voor de markt", href: "/bestellen" },
    ],
    seoKeywords:
      "markt leiden vis, vismarkt leiden, leidse markt woensdag zaterdag, vis kraam leiden, broodje haring markt leiden",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export const blogPostsGesorteerd = [...blogPosts].sort((a, b) =>
  b.datum.localeCompare(a.datum)
);
