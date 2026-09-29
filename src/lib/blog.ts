import { NIEUWE_ARTIKELEN, BIJGEWERKTE_ARTIKELEN } from "./blog-editorial";
import { VOORSCHOTEN_ARTIKELEN } from "./blog-voorschoten";
import { BLOG_CORRECTIONS } from "./blog-corrections";
import { bestelContact } from "./bestel-contact";
import type { VerkooppuntId } from "./bedrijf";

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
  bijgewerkt?: string;
  leestijd: string;
  categorie: BlogCategorie;
  fotoUrl: string;
  fotoAlt: string;
  secties: BlogSectie[];
  gerelateerdeRecepten?: string[]; // recept-slugs
  gerelateerdeLinks?: { label: string; href: string }[];
  seoKeywords: string;
  regio?: "Voorschoten";
  verkooppunten?: VerkooppuntId[];
  vragen?: { v: string; a: string }[];
};

const bestaandePosts: BlogPost[] = [
  {
    slug: "viskalender-welke-vis-in-welk-seizoen",
    title: "De viskalender: welke vis is wanneer het lekkerst?",
    excerpt:
      "Vis heeft seizoenen, net als groente en fruit. Ontdek ideeën per seizoen en vraag naar de actuele aanvoer en prijzen van deze week.",
    datum: "2026-06-01",
    datumLabel: "1 juni 2026",
    leestijd: "5 min",
    categorie: "Seizoen",
    fotoUrl: "/images/scene-vis.svg",
    fotoAlt: "Verse vis op ijs in de viswinkel",
    secties: [
      {
        alineas: [
          "De kwaliteit en beschikbaarheid van vis veranderen door paaitijd, watertemperatuur, voeding en aanvoer. Een seizoenskalender geeft inspiratie, geen voorraadlijst of prijsgarantie. Vraag welke vis deze week goed is en waar die vandaan komt.",
        ],
      },
      {
        kop: "Lente (maart – mei)",
        alineas: [
          "Schol wordt vaak met de late lente en zomer geassocieerd, nadat hij is hersteld van de winterse paai. Zeebaars en dorade passen bij lichte lentegerechten, maar herkomst en kweek beïnvloeden de beschikbaarheid. Oesters verschillen per soort en producent: vraag naar de actuele levering in plaats van alleen op een maand af te gaan.",
        ],
      },
      {
        kop: "Zomer (juni – augustus)",
        alineas: [
          "Het nieuwe haringseizoen begint meestal in juni; de exacte start wordt elk jaar bekendgemaakt. Makreel, sardines en ansjovis passen bij zomergerechten, maar bespreek naast smaak ook herkomst en vangstmethode. Zeeuwse bodemcultuurmosselen zijn meestal al in de zomer verkrijgbaar, niet alleen in maanden met een 'r'. De exacte start hangt af van de oogstkwaliteit en kan eerder vallen.",
        ],
      },
      {
        kop: "Herfst (september – november)",
        alineas: [
          "Mosselen blijven een populaire herfstkeuze. Het gebruikelijke seizoen van Zeeuwse bodemcultuurmosselen loopt ongeveer van juli tot april; de oude regel met de 'r' in de maand is geen betrouwbare beschikbaarheidskalender. Garnalen, kabeljauw en wijting geven ook ideeën voor herfstmaaltijden, afhankelijk van de aanvoer.",
        ],
      },
      {
        kop: "Winter (december – februari)",
        alineas: [
          "Kabeljauw, wijting en andere witvis passen bij warme wintergerechten. Tarbot, griet en schelvis geven meer mogelijkheden, afhankelijk van herkomst en aanvoer. Oesters, gerookte paling en gerookte zalm zijn populair rond de feestdagen, maar populariteit is geen voorraadgarantie.",
          "Twijfelt u wat u deze week wilt kiezen? Kom langs of bel ons. We bespreken graag de actuele levering, bereiding en passende alternatieven.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Bekijk ons assortiment", href: "/assortiment" },
      { ...bestelContact("nl") },
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
      { ...bestelContact("nl") },
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
          "Onze kibbeling maken we van pollak: stukjes vis in beslag, goudbruin gebakken. Lekker met ravigottesaus. Voor lekkerbek gebruiken we heek, geen pollak.",
        ],
      },
      {
        kop: "Lekkerbek: een hele filet van heek",
        alineas: [
          "Onze lekkerbek is een heekfilet in beslag, goudbruin gebakken. U krijgt een hele filet in plaats van de kleine stukjes van kibbeling.",
        ],
      },
      {
        kop: "Welke kiest u?",
        alineas: [
          "Kibbeling is ideaal om te delen (of niet te delen — wij oordelen niet) en perfect met een bakje ravigotesaus. De lekkerbek is een maaltijd op zich, lekker op een broodje of met friet. Voedingstechnisch ontlopen ze elkaar weinig: beide rond de 220–235 kcal per 100 gram, eiwitrijk, en de vis zelf is mager — het beslag maakt het smullen.",
          "Pro-tip: bestel uw kibbeling vooruit voor drukke zaterdagen. Dan ligt hij vers gebakken voor u klaar.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { ...bestelContact("nl") },
      { label: "Bekijk de voedingswaarden", href: "/assortiment" },
    ],
    seoKeywords:
      "verschil kibbeling lekkerbek, kibbeling leiden, lekkerbek leiden, kibbeling pollak, kibbeling ravigottesaus",
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
      { ...bestelContact("nl") },
    ],
    seoKeywords:
      "hollandse garnalen, noordzeegarnalen, crangon crangon, garnalen leiden, hollandse garnalen kopen, solt garnalen",
  },
  {
    slug: "marktdag-in-leiden-achter-de-kraam",
    verkooppunten: ["markt-woensdag", "markt"],
    bijgewerkt: "2026-09-28",
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
      { ...bestelContact("nl") },
    ],
    seoKeywords:
      "markt leiden vis, vismarkt leiden, leidse markt woensdag zaterdag, vis kraam leiden, broodje haring markt leiden",
  },
  {
    slug: "waar-koop-je-biologische-vis-in-leiden",
    title: "Waar koop je biologische vis in Leiden?",
    excerpt:
      "Biologische vis is in Leiden verrassend lastig te vinden. Wij leggen uit wat biologische vis precies is, waar je op moet letten, en waar je in Leiden écht biologische zalm en vis koopt.",
    datum: "2026-06-15",
    datumLabel: "15 juni 2026",
    leestijd: "5 min",
    categorie: "Duurzaam",
    fotoUrl: "/images/scene-zalm.svg",
    fotoAlt: "Biologische Varlaks zalm bij Schaap's Vishandel in Leiden",
    secties: [
      {
        alineas: [
          "Steeds meer Leidenaren willen bewuster eten: biologische groente, scharreleieren, en — terecht — ook biologische vis. Maar waar koop je die eigenlijk in Leiden? In de supermarkt is het aanbod beperkt en vaak onduidelijk, en lang niet elke visboer kan écht biologische vis leveren. Tijd om het uit te leggen.",
        ],
      },
      {
        kop: "Wat is biologische vis precies?",
        alineas: [
          "Belangrijk om te weten: biologische vis komt altijd uit gecertificeerde kweek. Wilde vis kan per definitie niet biologisch zijn — je kunt nu eenmaal niet controleren wat een wilde vis eet of hoe hij leeft. Voor het EU-biologisch keurmerk gelden strenge eisen, in Nederland gecontroleerd door Skal: biologisch voer, lage bezettingsdichtheid, geen preventieve antibiotica, geen synthetische kleurstoffen en aantoonbaar dierenwelzijn.",
          "Wilde vis kán wel duurzaam zijn — let dan op het MSC-keurmerk en de VISwijzer. Kortom: biologisch staat voor verantwoorde kweek, MSC voor duurzame wildvangst. Allebei goede keuzes, maar het is niet hetzelfde.",
        ],
      },
      {
        kop: "Biologische zalm in Leiden: Varlaks",
        alineas: [
          "Onze biologische Varlaks zalm komt uit de Skjerstadfjorden in Noord-Noorwegen, boven de poolcirkel bij Bodø. Hij wordt gekweekt door twee familieboerderijen op lage bezettingsdichtheid, is ASC én EU-biologisch gecertificeerd, en groeit op zonder antibiotica, hormonen of GMO. De roze kleur komt niet van synthetische kleurstof maar van natuurlijke astaxanthine (Panaferd-AX).",
          "Daarmee is Schaap's Vishandel een van de weinige plekken in Leiden waar je echte biologische zalm koopt — vers uit de toonbank, niet uit een vacuümverpakking in het schap.",
        ],
      },
      {
        kop: "En de rest van het assortiment?",
        alineas: [
          "Naast de biologische Varlaks zalm werken we met MSC-gecertificeerde wildvangst (zoals Hollandse garnalen en schol) en ASC-gecertificeerde kweekvis. Op onze biologische-vis-pagina laten we per product eerlijk de herkomst en de VISwijzer-status zien — ook als die oranje of rood is. Want eerlijk zijn over wat je verkoopt, hoort er wat ons betreft gewoon bij.",
        ],
      },
      {
        kop: "Waar te koop in Leiden",
        alineas: [
          "U vindt ons in de winkel aan de Herenstraat 48 (maandag t/m zaterdag), op de markt in Leiden — woensdag bij de Vismarkt aan de Nieuwe Rijn en zaterdag op de Aalmarkt voor de Waag — en op vrijdag bij Hoogvliet in Voorschoten. Vraag gerust naar de biologische zalm; we vertellen u er graag alles over. Bestel vooruit via WhatsApp of bel 071 514 9802, dan zetten we het voor u klaar.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Alles over onze biologische vis", href: "/biologische-vis" },
      { label: "Biologische Varlaks zalm", href: "/varlaks" },
      { label: "Bekijk het assortiment", href: "/assortiment" },
    ],
    seoKeywords:
      "biologische vis leiden, biologische zalm leiden, bio vis leiden, duurzame vis leiden, varlaks zalm leiden, waar biologische vis kopen leiden",
  },
  {
    slug: "wat-betekenen-msc-asc-en-het-eu-bio-logo",
    title: "MSC, ASC en het EU-biologisch logo: wat betekenen die keurmerken?",
    excerpt:
      "Aan de toonbank wijzen klanten vaak naar een sticker op de verpakking: wat betekent dat logo nou eigenlijk? MSC, ASC en het groene EU-bio blaadje beloven alle drie iets anders. We leggen het rustig uit.",
    datum: "2026-06-10",
    datumLabel: "10 juni 2026",
    leestijd: "5 min",
    categorie: "Duurzaam",
    fotoUrl: "/images/scene-vis.svg",
    fotoAlt: "Verse vis op ijs in de toonbank van Schaap's Vishandel Leiden",
    secties: [
      {
        alineas: [
          "Aan onze toonbank wijzen klanten regelmatig naar een sticker op de verpakking: 'Wat betekent dat blauwe logo eigenlijk?' Of ze vragen of onze zalm 'echt biologisch' is. Goede vragen, want de wereld van viskeurmerken zit vol afkortingen. MSC, ASC, EU-biologisch: drie logo's die u steeds vaker tegenkomt, en die alle drie iets anders beloven. Tijd om ze eens rustig uit elkaar te trekken.",
        ],
      },
      {
        kop: "MSC — duurzame wildvangst",
        alineas: [
          "MSC staat voor Marine Stewardship Council, en dit blauwe logo gaat over wilde vis die met een net of een lijn uit zee wordt gehaald. Een visserij mag het MSC-keurmerk alleen dragen als het visbestand gezond is, de vangstmethode de zeebodem en andere dieren zo min mogelijk schaadt, en de visserij goed wordt beheerd. Denk bij ons bijvoorbeeld aan de Hollandse garnalen.",
          "Het draait bij MSC dus om de vraag: kunnen we deze vissoort blijven vangen zonder de zee uit te putten? Een onafhankelijke controleur beoordeelt dat, en de certificering wordt periodiek opnieuw tegen het licht gehouden. Een blauw MSC-logo betekent kortom: verantwoord gevangen wilde vis.",
        ],
      },
      {
        kop: "ASC — verantwoorde kweek",
        alineas: [
          "ASC is het zusje van MSC, maar dan voor gekweekte vis: de Aquaculture Stewardship Council. Zalm, garnalen, pangasius en tilapia komen vaak uit kwekerijen, en ASC stelt eisen aan hoe die kwekerij werkt. Denk aan schoon water, controle op ziektes en medicijngebruik, verantwoord visvoer en goede arbeidsomstandigheden voor de mensen die er werken.",
          "ASC zegt dus iets over de manier van kweken, maar het is niet hetzelfde als 'biologisch'. Een ASC-kwekerij is netter en beter gecontroleerd dan een doorsnee kwekerij, maar de eisen gaan minder ver dan die van het biologische keurmerk. Onze Varlaks zalm is bijvoorbeeld ASC-gecertificeerd én biologisch, dat kan prima samen.",
        ],
      },
      {
        kop: "EU-biologisch — gecontroleerd door Skal",
        alineas: [
          "Het groene blaadje van het EU-biologisch logo is de strengste van de drie. Biologische vis komt altijd uit kweek, en in Nederland controleert de organisatie Skal of een kwekerij zich aan de biologische regels houdt. Die regels zijn fors: biologisch visvoer, een lage bezettingsdichtheid (dus meer ruimte en minder stress per vis), geen preventieve antibiotica, en geen synthetische kleurstoffen of andere kunstmatige toevoegingen.",
          "Dat laatste hoort u ons vaker zeggen bij de zalm: goedkope kweekzalm dankt zijn roze kleur soms aan een kleurstof uit de fabriek, terwijl die kleur bij biologische zalm uit een natuurlijke bron moet komen. Biologisch gaat dus een stap verder dan ASC: het is verantwoorde kweek plús strikte eisen aan voer, dierenwelzijn en toevoegingen.",
        ],
      },
      {
        kop: "Waarom wilde vis nooit 'biologisch' is",
        alineas: [
          "Een misverstand dat we vaak tegenkomen: 'die wilde kabeljauw is toch het meest natuurlijk, dus biologisch?' Logisch geredeneerd, maar zo werkt het keurmerk niet. Biologisch draait om controleerbare kweek: wat de vis eet, hoeveel ruimte hij heeft, welke middelen wel of niet gebruikt worden. Bij een wilde vis in de open zee kunt u dat allemaal niet controleren, dus kan hij per definitie geen biologisch logo dragen.",
          "Wilde vis kán wel heel duurzaam zijn, en daarvoor kijkt u juist naar MSC. Kortom: biologisch is er voor kweek, MSC voor wildvangst. Twee verschillende vragen, twee verschillende logo's.",
        ],
      },
      {
        kop: "Zelf checken: de VISwijzer",
        alineas: [
          "Wilt u het per vissoort en vangstmethode precies weten, dan is de Nederlandse VISwijzer (goodfish.nl) een fijn hulpmiddel. Met een simpel groen-oranje-rood systeem laat die zien hoe een bepaalde vis ervoor staat. Wij gebruiken diezelfde bron en zijn er eerlijk over, ook als een vis op oranje of rood staat.",
          "Loopt u er niet uit? Vraag het gewoon aan de toonbank. We leggen graag uit waar een vis vandaan komt en welk keurmerk erop zit. En wilt u zeker weten dat u biologisch koopt: onze Varlaks zalm is ASC én EU-biologisch gecertificeerd.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Alles over onze biologische vis", href: "/biologische-vis" },
      { label: "Biologische Varlaks zalm", href: "/varlaks" },
      { label: "Bekijk het assortiment", href: "/assortiment" },
    ],
    seoKeywords:
      "msc keurmerk, asc keurmerk, eu biologisch logo, skal biologische vis, wat betekent msc asc, duurzame vis keurmerken, biologische vis leiden",
  },
  {
    slug: "is-biologische-zalm-gezonder-omega-3",
    title: "Is biologische zalm gezonder? Wat u moet weten over omega-3",
    excerpt:
      "Is de biologische zalm van Schaap's nou ook gezonder? Het eerlijke antwoord is genuanceerder dan een simpel ja of nee. Over omega-3, en over wat er vooral níet in zit.",
    datum: "2026-06-12",
    datumLabel: "12 juni 2026",
    leestijd: "5 min",
    categorie: "Visweetjes",
    fotoUrl: "/images/scene-zalm.svg",
    fotoAlt: "Biologische Varlaks zalmfilet bij Schaap's Vishandel Leiden",
    secties: [
      {
        alineas: [
          "'Is die biologische zalm van jullie nou ook gezonder?' Het is een vraag die we graag krijgen, maar het eerlijke antwoord is genuanceerder dan een simpel ja of nee. Zalm is sowieso een gezonde vis, en het grootste verschil tussen gewone en biologische zalm zit niet zozeer in wat erin zit, maar juist in wat er níet in zit. Laten we het uit elkaar halen.",
        ],
      },
      {
        kop: "Vette vis en omega-3",
        alineas: [
          "Zalm hoort bij de vette vissoorten, net als makreel, haring en sardines. Die vette vissen zijn een goede bron van omega-3-vetzuren, en dat is een belangrijke reden waarom vis zo'n gezonde reputatie heeft. Omega-3 speelt onder meer een rol bij hart en bloedvaten, en ons lichaam maakt het zelf niet of nauwelijks aan, dus we moeten het uit ons eten halen.",
          "Hoeveel omega-3 er precies in een stuk zalm zit, verschilt per vis, per seizoen en per manier van kweken of vangen. Cijfers die u online tegenkomt lopen daarom flink uiteen. Wat wél vaststaat: vette vis in het algemeen is een van de rijkste natuurlijke bronnen van omega-3 die er zijn.",
        ],
      },
      {
        kop: "Wat adviseren de deskundigen?",
        alineas: [
          "In algemene zin adviseert de Gezondheidsraad om wekelijks vis te eten, waarbij vette vis extra wordt gewaardeerd om de omega-3. Meer dan dat willen wij er niet over beweren: wat voor u persoonlijk gezond is, hangt af van uw eigen situatie, en daarvoor is uw huisarts of diëtist een betere gesprekspartner dan uw visboer.",
          "Wij verkopen graag vis en vertellen u graag waar hij vandaan komt, maar we doen geen gezondheidsbeloftes die we niet kunnen waarmaken. Eerlijk blijven hoort er wat ons betreft gewoon bij.",
        ],
      },
      {
        kop: "Het verschil zit in wat er níet in zit",
        alineas: [
          "Waar biologische zalm zich onderscheidt, is niet per se een hoger omega-3-gehalte, maar de manier van kweken. Bij onze biologische Varlaks zalm betekent dat: geen preventieve antibiotica, geen genetisch gemodificeerd (GMO) voer, en geen synthetische astaxanthine.",
          "Dat laatste verdient uitleg. Astaxanthine is het stofje dat zalm zijn roze kleur geeft. In de natuur haalt zalm het uit zijn voedsel; bij goedkope kweek wordt vaak een synthetische, in de fabriek gemaakte variant aan het voer toegevoegd. Varlaks gebruikt in plaats daarvan natuurlijke astaxanthine, bekend onder de naam Panaferd-AX. De kleur komt dus uit een natuurlijke bron, niet uit een kleurpotje.",
        ],
      },
      {
        kop: "Dus: is het gezonder?",
        alineas: [
          "Het eerlijke antwoord: biologische zalm is niet automatisch een 'gezondere' zalm met méér omega-3. Dat kunnen en willen we niet beloven. Wat u wél krijgt, is zalm die is opgegroeid met meer ruimte, biologisch voer en zonder de synthetische toevoegingen die bij industriële kweek soms om de hoek komen kijken. Voor veel van onze klanten is dat precies de reden om ervoor te kiezen.",
          "Zie het zo: de omega-3 krijgt u bij elke vette vis. De biologische keuze gaat vooral over hóe de vis geleefd heeft en wat er níet aan is toegevoegd.",
        ],
      },
      {
        kop: "Wekelijks vis, gewoon lekker",
        alineas: [
          "Wilt u vaker vette vis eten, wissel dan gerust af: de ene week zalm, de andere week makreel of haring. Zo houdt u het gevarieerd én lekker. Onze biologische Varlaks zalm ligt vers in de toonbank aan de Herenstraat, en we snijden hem op maat, voor de oven, de pan of rauw voor een tartaar.",
          "Meer weten over waar onze zalm precies vandaan komt? Lees het volledige verhaal op de Varlaks-pagina, of vraag het gewoon even aan de toonbank.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Het volledige Varlaks-verhaal", href: "/varlaks" },
      { label: "Lees meer over biologische vis", href: "/biologische-vis" },
    ],
    seoKeywords:
      "biologische zalm gezonder, zalm omega 3, omega 3 vette vis, varlaks zalm gezond, natuurlijke astaxanthine, zalm zonder antibiotica, gezondheidsraad wekelijks vis",
  },
  {
    slug: "verse-vis-bewaren-en-bereiden-tips",
    title: "Verse vis bewaren en bereiden: de tips van de visboer",
    excerpt:
      "Verse vis is heerlijk, maar ook kwetsbaar. Met een paar simpele regels haalt u thuis het beste uit uw aankoop. Onze belangrijkste tips over bewaren, invriezen en bereiden.",
    datum: "2026-06-14",
    datumLabel: "14 juni 2026",
    leestijd: "5 min",
    categorie: "Visweetjes",
    fotoUrl: "/images/scene-vis.svg",
    fotoAlt: "Verse vis op ijs, klaar om te bewaren en te bereiden, bij Schaap's Vishandel Leiden",
    secties: [
      {
        alineas: [
          "Verse vis is heerlijk, maar ook een beetje kwetsbaar. Hij vraagt net iets meer aandacht dan een pak pasta in de kast. Toch is het helemaal niet ingewikkeld om vis thuis goed te bewaren en te bereiden: met een paar simpele regels haalt u het beste uit uw aankoop. Hieronder onze belangrijkste tips, precies zoals we ze ook aan de toonbank geven.",
        ],
      },
      {
        kop: "Zo herkent u echt verse vis",
        alineas: [
          "Verse vis ruikt niet 'vissig', maar fris, naar zee en naar zilt water. Een scherpe, ammoniakachtige of muffe geur is een teken dat de vis over zijn hoogtepunt heen is. Bij een hele vis kijkt u naar de ogen: die horen helder en bol te zijn, niet dof en ingevallen. De kieuwen moeten helderrood tot roze zijn, niet bruinig of grijs. En het vlees hoort terug te veren als u er zachtjes op drukt.",
          "In een goede viswinkel is dit makkelijk te controleren: u ziet het, u ruikt het en u vraagt het gewoon. Bij ons ligt de vis op ijs en snijden we hem pas vers als u erom vraagt. Dat is niet voor niets.",
        ],
      },
      {
        kop: "Bewaren in de koelkast",
        alineas: [
          "Verse vis is echt een dagverse aankoop. Bewaar hem op de koudste plek van uw koelkast, meestal de onderste plank net boven de groentelade. Houd hem afgedekt, bij voorkeur op een bordje met wat ijs eronder als u het extra goed wilt doen. Eet verse vis het liefst op de dag zelf, en uiterlijk binnen één tot twee dagen.",
          "Houd rauwe en gerookte vis gescheiden, en laat vis nooit urenlang op het aanrecht liggen. Koud is koning: hoe kouder u de vis houdt, hoe langer hij op smaak en veilig blijft. Twijfelt u? Ruik. Uw neus is een verrassend betrouwbare rechter.",
        ],
      },
      {
        kop: "Invriezen: kan dat?",
        alineas: [
          "Ja, verse vis invriezen kan prima, mits u het snel doet. Vries de vis in op de dag van aankoop, zo vers mogelijk, in een goed afgesloten zak of bakje zodat hij geen vriesbrand of vrieslucht oppikt. Vette vis zoals zalm en makreel bewaart u wat korter dan magere witvis, omdat het vet in de vriezer langzaam van smaak verandert.",
          "Ontdooien doet u het beste langzaam in de koelkast, niet op het aanrecht. En let op: eenmaal ontdooide vis vriest u niet nog een keer in. Wilt u vis rauw eten, koop dan vis die al eerder ingevroren is geweest, of vraag ons even om advies.",
        ],
      },
      {
        kop: "Bereiden: de grootste fout is te lang",
        alineas: [
          "De meest gemaakte fout met vis? Te lang bakken. Vis is zó gaar, veel sneller dan vlees. Zodra het vlees van doorschijnend naar mat-wit omslaat en de vlokken makkelijk loslaten, is hij klaar. Een paar minuten per kant in een hete pan is voor de meeste filets al genoeg.",
          "Dep de vis droog voordat u hem bakt, dan krijgt u een mooi korstje. Bak met de velkant eerst voor een knapperige huid. En haal de vis net iets vóór hij helemaal gaar lijkt uit de pan: hij gaart nog even na. Zo blijft hij mooi sappig in plaats van droog en rubberig.",
        ],
      },
      {
        kop: "Kort samengevat",
        alineas: [
          "Koop vers, houd koud, eet snel en bak kort, dan komt het eigenlijk altijd goed. Wilt u weten welke vis nú op zijn best is, kijk dan even op onze viskalender; vis heeft seizoenen, net als groente en fruit.",
          "Loopt u vast bij een bereiding? Vraag het gerust. Aan de toonbank geven we graag advies over de juiste vis voor uw gerecht en hoe u hem klaarmaakt. Ons hele aanbod vindt u op de assortimentspagina. Tot bij Schaap's!",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Bekijk ons assortiment", href: "/assortiment" },
      { label: "Bekijk de viskalender", href: "/viskalender" },
    ],
    seoKeywords:
      "verse vis bewaren, vis invriezen, verse vis herkennen, vis bereiden tips, hoe lang vis bewaren koelkast, vis niet te gaar bakken, verse vis leiden",
  },
  {
    slug: "echt-gerookte-vis-vs-kunstmatige-rooksmaak",
    title: "Echt gerookte vis vs. kunstmatige rooksmaak: wat is het verschil?",
    excerpt:
      "Niet alle 'gerookte' vis is écht gerookt. Sommige producten danken hun smaak aan toegevoegd rookaroma. We leggen het verschil uit — en waarom u het proeft.",
    datum: "2026-06-16",
    datumLabel: "16 juni 2026",
    leestijd: "5 min",
    categorie: "Visweetjes",
    fotoUrl: "/images/scene-gerookt.svg",
    fotoAlt: "Ambachtelijk gerookte vis bij Schaap's Vishandel Leiden",
    secties: [
      {
        alineas: [
          "Gerookte zalm, gerookte makreel, bokking: rokerige vis is heerlijk. Maar wist u dat niet alle 'gerookte' vis in de winkel écht boven rokend hout heeft gehangen? Een deel van de goedkopere producten dankt die rooksmaak aan toegevoegd rookaroma. Het verschil proeft u — en het is de moeite waard om te weten waar u op moet letten.",
        ],
      },
      {
        kop: "Echt roken: koud en warm",
        alineas: [
          "Echt roken is een ambacht. Bij koud roken (rond 20–30 °C) hangt de vis urenlang in de rook van smeulend hout, zoals eiken- of beukensnippers. De vis blijft daarbij zijdezacht — denk aan klassieke gerookte zalm in dunne plakken. Bij warm roken (rond 70–90 °C) wordt de vis tegelijk gerookt én gegaard, wat een steviger, volle rokerige vis oplevert, zoals gerookte makreel of bokking.",
          "In beide gevallen komt de smaak volledig uit het hout en de tijd. Dat geeft die diepe, natuurlijke rooksmaak en een mooie goudbruine kleur — iets wat je niet kunt namaken met een flesje aroma.",
        ],
      },
      {
        kop: "Kunstmatige rooksmaak: de snelle route",
        alineas: [
          "Om tijd en geld te besparen gebruiken sommige producenten 'rookaroma' (soms 'liquid smoke' genoemd): een geconcentreerde rooksmaakstof die door of over de vis wordt gebracht, zonder dat die ooit echt in de rook heeft gehangen. Op de verpakking staat dat soms verstopt in de ingrediëntenlijst als 'rookaroma' of 'aroma'.",
          "Het resultaat is vaak een eendimensionale, wat scherpe rooksmaak die aan de buitenkant blijft plakken, in plaats van de smaak die bij echt roken door de hele vis trekt. Niets mis mee qua veiligheid, maar het is simpelweg niet hetzelfde product.",
        ],
      },
      {
        kop: "Zo herkent u echt gerookte vis",
        alineas: [
          "Kijk naar de ingrediëntenlijst: bij echt gerookte vis staat er idealiter alleen vis, zout en rook. Ziet u 'rookaroma' of 'aroma' staan, dan is de kans groot dat er kunstmatige rooksmaak is gebruikt. Echt gerookte vis heeft bovendien een natuurlijke, ongelijkmatige goudbruine kleur en een smaak die vol en rond is, niet scherp aan de oppervlakte.",
          "En het simpelste van alles: vraag het gewoon aan uw visboer. Een goede visspecialist vertelt u precies hoe en waar de vis gerookt is.",
        ],
      },
      {
        kop: "Bij Schaap's: echt gerookt",
        alineas: [
          "Onze gerookte producten zijn écht gerookt, niet met aroma opgeleukt. Onze gerookte zalm (High Seas) komt via W.G. Den Heijer & Zn uit Scheveningen en wordt in Urk boven hout gerookt — ASC-gecertificeerd. Onze bokking en andere gerookte klassiekers volgen dezelfde eerlijke route: vis, zout en rook, meer niet.",
          "Kom gerust langs op de Herenstraat of op de markt en proef het verschil. Wilt u meer weten over hoe wij duurzaamheid en eerlijkheid combineren? Lees dan onze pagina over biologische en duurzame vis.",
        ],
      },
    ],
    gerelateerdeLinks: [
      { label: "Bekijk onze gerookte vis", href: "/assortiment" },
      { label: "Meer over biologische & duurzame vis", href: "/biologische-vis" },
    ],
    seoKeywords:
      "echt gerookte vis, gerookte vis vs kunstmatige rooksmaak, ambachtelijk gerookte vis leiden, gerookte zalm leiden, echt gerookte vis kopen, rookaroma",
  },
];

const blogBeelden: Record<string, { src: string; alt: string }> = {
  "viskalender-welke-vis-in-welk-seizoen": { src: "/images/recepten/gebakken-schol-tomaat-olijven.webp", alt: "Gebakken schol met tomaat en olijven" },
  "hollandse-nieuwe-waarom-juni-haring-anders-smaakt": { src: "/images/editorial/hollandse-nieuwe-uitjes.webp", alt: "Hollandse Nieuwe met fijngesneden uitjes en augurk op een wit bord" },
  "kibbeling-vs-lekkerbek-het-verschil": { src: "/images/editorial/kibbeling.webp", alt: "Krokante kibbeling met saus" },
  "de-echte-hollandse-garnaal": { src: "/images/producten-hd/hollandse-garnalen.webp", alt: "Hollandse garnalen" },
  "sinds-1938-de-geschiedenis-van-schaaps-vis": { src: "/images/producten-hd/kabeljauw.webp", alt: "Verse kabeljauw, een klassieker bij de vishandel" },
  "wilde-zalm-vs-kweekzalm-waarom-wij-varlaks-kiezen": { src: "/images/editorial/zalm.webp", alt: "Verse zalmfilet met citroen en dille" },
  "waarom-staat-makreel-op-rood": { src: "/images/recepten/makreelsalade-brood.webp", alt: "Makreelsalade op brood" },
  "marktdag-in-leiden-achter-de-kraam": { src: "/images/recepten/broodje-haring-uitjes.webp", alt: "Broodje haring met uitjes, een vertrouwde marktklassieker" },
  "waar-koop-je-biologische-vis-in-leiden": { src: "/images/recepten/zomerse-zalmsalade.webp", alt: "Serveersuggestie: zalm in een frisse salade" },
  "wat-betekenen-msc-asc-en-het-eu-bio-logo": { src: "/images/editorial/viskeurmerken-bio-asc-msc.webp", alt: "BIO, ASC en MSC uitgelegd: biologische kweek, verantwoorde kweek en duurzame wildvangst" },
  "is-biologische-zalm-gezonder-omega-3": { src: "/images/recepten/zalm-traybake-groenten-v2.webp", alt: "Zalm met groenten uit de oven" },
  "verse-vis-bewaren-en-bereiden-tips": { src: "/images/producten-hd/kabeljauwfilet.webp", alt: "Verse kabeljauwfilet om gekoeld te bewaren en te bereiden" },
  "echt-gerookte-vis-vs-kunstmatige-rooksmaak": { src: "/images/recepten/gerookte-zalm-rolletjes-roomkaas.webp", alt: "Gerookte zalmrolletjes met roomkaas" },
};
export const blogPosts: BlogPost[] = [...VOORSCHOTEN_ARTIKELEN, ...NIEUWE_ARTIKELEN, ...bestaandePosts.map(post => {
  const wijziging = BIJGEWERKTE_ARTIKELEN[post.slug];
  const beeld = blogBeelden[post.slug] ?? { src: post.fotoUrl, alt: post.fotoAlt };
  return { ...post, ...wijziging, fotoUrl: beeld.src, fotoAlt: beeld.alt, secties: (wijziging?.secties ?? post.secties).map(s => ({ ...s, alineas: s.alineas.map(a => a.replaceAll("maandag t/m zaterdag", "dinsdag t/m zaterdag")) })), ...(wijziging ? { bijgewerkt: "2026-09-28", datumLabel: "Bijgewerkt 28 september 2026" } : {}) };
})].map(post => BLOG_CORRECTIONS[post.slug] ? { ...post, ...BLOG_CORRECTIONS[post.slug], bijgewerkt: "2026-09-29", datumLabel: "Bijgewerkt 29 september 2026" } : post);

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export const blogPostsGesorteerd = [...blogPosts].sort((a, b) =>
  (b.bijgewerkt ?? b.datum).localeCompare(a.bijgewerkt ?? a.datum)
);
