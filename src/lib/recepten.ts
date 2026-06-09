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

import { receptenVisrecepten } from "./recepten-visrecepten";

const receptenOrigineel: Recept[] = [
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

  // === Recepten met dank aan visrecepten.nl ===

  {
    slug: "zwaardvis-patat-dillesaus",
    title: "Zwaardvis-patat in romige dillesaus",
    subtitle: "Stevige vis als snack met een frisse dipsaus",
    tijd: "25 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Bijzonder"],
    fotoUrl:
      "https://images.unsplash.com/photo-1644784643137-b9073dd262f6?w=800&q=80",
    fotoLabel: "Gebakken visreepjes op bord met saus en groenten",
    vanSchaap: ["400 g zwaardvis"],
    vanSupermarkt: [
      "3 el visspecerijen",
      "Versgemalen peper + bloem",
      "Zonnebloemolie",
      "4 el halfvolle mayonaise",
      "3 el yoghurt",
      "1 bosje verse dille",
      "1 tl Dijonmosterd + 1 el honing",
    ],
    bereidingswijze: [
      "Snijd de zwaardvis in lange reepjes van ±1 cm breed en max. 5 cm lang. Breng op smaak met visspecerijen en peper. Wentel door de bloem.",
      "Bak de visreepjes in een pan met olie in 6 minuten gaar, af en toe omscheppend. Houd warm in een voorverwarmde oven op 100°C.",
      "Maak ondertussen de dillesaus: hak de dille fijn en meng 2 el door de mayonaise, yoghurt, mosterd en honing. Breng op smaak met peper.",
      "Serveer de gebakken zwaardvis met de saus ernaast.",
    ],
    verhaal:
      "Zwaardvis is niet iets dat u in een gewone supermarkt vindt, maar bij Schaap's Vis weten we wat er binnenkomt. Stevig vlees, milde smaak — als visfrites maar dan voor volwassenen. De dille maakt het compleet.",
    highlight: "Bijzondere vis",
    seoKeywords: "zwaardvis recept, zwaardvis patat, visreepjes met dillesaus",
  },
  {
    slug: "krieltjessalade-haring",
    title: "Krieltjessalade met haring",
    subtitle: "Klassiek Hollands — aardappel, haring, kappertjes",
    tijd: "30 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Zomers"],
    fotoUrl:
      "https://images.unsplash.com/photo-1552204081-7a832e4ee470?w=800&q=80",
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
    slug: "pasta-met-mosselen",
    title: "Pasta met mosselen",
    subtitle: "Romig, snel en boordevol smaak van de zee",
    tijd: "25 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Bijzonder"],
    fotoUrl:
      "https://images.unsplash.com/photo-1652480191212-13ecee3ec66b?w=800&q=80",
    fotoLabel: "Pasta in kom met mosselen en basilicum",
    vanSchaap: ["1 kg verse mosselen"],
    vanSupermarkt: [
      "1 citroen (rasp + sap)",
      "200 g pasta",
      "150 g Griekse yoghurt of 1 bakje zure room",
      "125 ml slagroom",
      "3 el verse basilicum (fijngesneden)",
      "Zout en peper",
    ],
    bereidingswijze: [
      "Rasp de citroen. Spoel de mosselen en verwijder kapotte en open exemplaren die niet sluiten na tikken.",
      "Doe de mosselen in een pan, pers er een halve citroen over. Stoom afgedekt in 6–8 minuten open. Kook ondertussen de pasta al dente. Zeef het kookvocht.",
      "Warm de yoghurt met slagroom op. Roer citroenrasp en 2–3 el mosselvocht erdoor tot een mooie saus.",
      "Meng de uitgelekte pasta door de saus. Roer de basilicum erdoor. Verdeel over 2 diepe kommen en leg de mosselen in schelp erop.",
    ],
    verhaal:
      "Mosselen met pasta klinkt als een restaurantgerecht, maar dit staat in 25 minuten op tafel. De truc zit in het mosselvocht — dat is pure zee-essentie. Gebruik het zuinig: 2 à 3 eetlepels is genoeg voor alle smaak.",
    seoKeywords: "pasta mosselen recept, mosselpasta, pasta met mosselen romig",
  },
  {
    slug: "kabeljauw-zeekraal-venkel",
    title: "Kabeljauw met zeekraal en venkel",
    subtitle: "Knapperig vel, frisse groenten — in 30 minuten",
    tijd: "30 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Gezond", "Bijzonder"],
    fotoUrl:
      "https://images.unsplash.com/photo-1587913956756-4fcf4833241d?w=800&q=80",
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
      "Zeekraal halen ze hier soms ook rechtstreeks uit de Zeeuwse delta. Zout van zichzelf, knapperig — het past perfect bij de milde, vlokkerige structuur van kabeljauwlende. Vraag Aldert om de lende: dat is het dikste, vetste stuk van de vis.",
    seoKeywords:
      "kabeljauw zeekraal recept, kabeljauw venkel, kabeljauwlende bereiden",
  },
  {
    slug: "hollandse-bowl",
    title: "Hollandse Bowl",
    subtitle: "Verse haring in een moderne poke bowl — met wortel en biet",
    tijd: "25 min",
    moeilijkheid: "Makkelijk",
    tags: ["Zomers", "Gezond", "Snel"],
    fotoUrl:
      "https://images.unsplash.com/photo-1597958792579-bd3517df6399?w=800&q=80",
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
    title: "Hollandse garnalensalade met gegrilde pompoen",
    subtitle: "Garnalen op hun best — met edamame en zwarte bonen",
    tijd: "40 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Zomers", "Gezond", "Bijzonder"],
    fotoUrl:
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800&q=80",
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
    slug: "venkelsoep-wilde-zalm",
    title: "Venkelsoep met wilde zalm",
    subtitle: "Romige, zachte soep — de zalm gaart erin terwijl u serveert",
    tijd: "50 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Bijzonder", "Gezond"],
    fotoUrl:
      "https://images.unsplash.com/photo-1616501268826-ee9731c915d4?w=800&q=80",
    fotoLabel: "Kom romige venkelsoep met dille en croutons",
    vanSchaap: [
      "500 g wilde sockeye zalm — vraag Aldert om dunne plakken te snijden",
    ],
    vanSupermarkt: [
      "1 kg venkelknol",
      "400 g uien",
      "1 tl venkelzaadjes",
      "1 l visbouillon (1 blokje)",
      "125 ml slagroom",
      "2 el olijfolie",
    ],
    bereidingswijze: [
      "Snijd de venkel in repen. Bewaar het loof. Snijd de uien in ringen.",
      "Verhit olijfolie in een pan en bak het venkelzaad aan. Voeg venkel en uien toe en bak zachtjes aan — niet bruin, anders wordt de soep donker.",
      "Voeg de bouillon toe en laat 30 minuten sudderen. Pureer de soep glad. Roer er vlak voor het opdienen 3–4 el slagroom door.",
      "Haal de zalm uit de koelkast. Verdeel de dunne plakken over 4 diepe borden. Schenk de hete soep erover — de zalm gaart mooi rosé door de warmte.",
      "Garneer met venkelgroen of dille.",
    ],
    verhaal:
      "Dit is een truc die chefs gebruiken: je gaart de zalm niet in de pan, maar in de borden. De hete soep trekt er overheen en de zalm wordt mooi rosé van binnen. Werkt perfect met wilde sockeye zalm — die heeft een intensere smaak dan kweekzalm.",
    seoKeywords:
      "venkelsoep zalm recept, zalm soep venkel, romige vissoep wilde zalm",
  },
  {
    slug: "krokante-zeeduivel-spinazie",
    title: "Krokante zeeduivel met spinazie",
    subtitle: "De kreeft van de vis — knapperig sesamkorst, roerbak-spinazie",
    tijd: "30 min",
    moeilijkheid: "Gemiddeld",
    tags: ["Bijzonder"],
    fotoUrl:
      "https://images.unsplash.com/photo-1580959375944-abd7e991f971?w=800&q=80",
    fotoLabel: "Pan-seared visfilet op romige spinazie",
    vanSchaap: ["600 g zeeduivelfilet, in 4 gelijke stukken"],
    vanSupermarkt: [
      "3 el bloem + 4 el sesamzaad",
      "1 ei",
      "250 g Japanse noedels",
      "5 el olie",
      "1 rode peper (in reepjes)",
      "1 teen knoflook + 3 cm gemberwortel (geraspt)",
      "600 g spinazie",
      "2–3 el sojasaus",
      "1 limoen in partjes",
    ],
    bereidingswijze: [
      "Dep de zeeduivel droog. Breng op smaak met zout en peper.",
      "Zet drie borden klaar: bloem, geklopt ei, sesamzaad. Haal de filets door bloem → ei → sesamzaad.",
      "Kook de noedels al dente. Verhit 2 el olie in een wok. Roerbak peper, knoflook en gember 1 minuut. Voeg spinazie toe en laat slinken.",
      "Verhit 3 el olie in een koekenpan op matig vuur. Bak zeeduivel 3–4 minuten per kant goudbruin — niet te heet, anders verbrandt het sesamzaad.",
      "Verdeel noedels en spinazie over 4 borden, besprenkel met sojasaus. Leg de zeeduivel ernaast. Serveer met limoen.",
    ],
    verhaal:
      "Zeeduivel wordt de kreeft van de vis genoemd — stevig, lekker vet en heel vergevingsgezind in de pan. Het sesamkorst geeft knapperigheid terwijl het vlees van binnen zacht blijft. Niet te heet bakken is de enige truc: medium vuur, geduld.",
    highlight: "De kreeft van de vis",
    seoKeywords:
      "zeeduivel recept, krokante zeeduivel sesam, zeeduivel spinazie",
  },
  {
    slug: "gebakken-schol-tomaat-olijven",
    title: "Gebakken schol met tomaat en olijven",
    subtitle: "Lichte scholfilet met een mediterrane saus",
    tijd: "25 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Makkelijk"],
    fotoUrl:
      "https://images.unsplash.com/photo-1633244092661-4519a1ffc67e?w=800&q=80",
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
    fotoUrl:
      "https://images.unsplash.com/photo-1650375592281-cd8250d81e27?w=800&q=80",
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
    title: "Krabsalade met avocado",
    subtitle: "Licht, fris zomervoorgerecht",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Zomers"],
    fotoUrl:
      "https://images.unsplash.com/photo-1625937712525-54a864ecf1c5?w=800&q=80",
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
    title: "Witlof-oesterzwamsalade met Hollandse garnalen",
    subtitle: "Knapperige oesterzwam, romige garnalen, frisse witlof",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    tags: ["Snel", "Gezond"],
    fotoUrl:
      "https://images.unsplash.com/photo-1624791836022-459a61fbb1a0?w=800&q=80",
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
  ...(receptenVisrecepten as Recept[]),
];
