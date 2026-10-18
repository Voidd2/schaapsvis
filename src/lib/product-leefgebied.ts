import { siteLanguage } from "./language";

type RangeCopy = { nl: string; en: string; de: string };

// General species/fishery context, not a claim about the catch area of each
// individual delivery. Where a product's own origin is known, that is stated.
const RANGE: Record<string, RangeCopy> = {
  kabeljauwfilet: {
    nl: "Atlantische kabeljauw leeft aan beide kanten van de Noord-Atlantische Oceaan; in Europa loopt zijn verspreidingsgebied van de Golf van Biskaje tot de Barentszzee.",
    en: "Atlantic cod lives on both sides of the North Atlantic; in Europe its range extends from the Bay of Biscay to the Barents Sea.",
    de: "Atlantischer Kabeljau lebt auf beiden Seiten des Nordatlantiks; in Europa reicht sein Verbreitungsgebiet von der Biskaya bis zur Barentssee.",
  },
  schol: {
    nl: "Schol is een platvis van de noordoostelijke Atlantische Oceaan. De Noordzee is een belangrijk leef- en visserijgebied voor deze soort.",
    en: "Plaice is a flatfish of the Northeast Atlantic. The North Sea is an important habitat and fishery area for this species.",
    de: "Die Scholle ist ein Plattfisch des Nordostatlantiks. Die Nordsee ist ein wichtiges Lebens- und Fanggebiet dieser Art.",
  },
  scholfilet: {
    nl: "Schol is een platvis van de noordoostelijke Atlantische Oceaan. De Noordzee is een belangrijk leef- en visserijgebied voor deze soort.",
    en: "Plaice is a flatfish of the Northeast Atlantic. The North Sea is an important habitat and fishery area for this species.",
    de: "Die Scholle ist ein Plattfisch des Nordostatlantiks. Die Nordsee ist ein wichtiges Lebens- und Fanggebiet dieser Art.",
  },
  zeebaars: {
    nl: "De Europese zeebaars komt voor langs de oostelijke Atlantische kust en in de Middellandse Zee. De soort kan zowel wild worden gevangen als worden gekweekt.",
    en: "European sea bass occurs along the eastern Atlantic coast and in the Mediterranean. The species is both wild-caught and farmed.",
    de: "Europäischer Wolfsbarsch kommt an der östlichen Atlantikküste und im Mittelmeer vor. Die Art wird wild gefangen und gezüchtet.",
  },
  zeebaarsfilet: {
    nl: "De Europese zeebaars komt voor langs de oostelijke Atlantische kust en in de Middellandse Zee. De soort kan zowel wild worden gevangen als worden gekweekt.",
    en: "European sea bass occurs along the eastern Atlantic coast and in the Mediterranean. The species is both wild-caught and farmed.",
    de: "Europäischer Wolfsbarsch kommt an der östlichen Atlantikküste und im Mittelmeer vor. Die Art wird wild gefangen und gezüchtet.",
  },
  dorade: {
    nl: "De goudbrasem komt van nature voor in de oostelijke Atlantische Oceaan en de Middellandse Zee. Dorade wordt ook veel gekweekt; deze soortinformatie is geen herkomstclaim over een specifieke vis.",
    en: "Gilthead sea bream is native to the eastern Atlantic and Mediterranean. It is also widely farmed; this species information is not an origin claim for a particular fish.",
    de: "Die Goldbrasse ist im östlichen Atlantik und im Mittelmeer heimisch. Sie wird auch häufig gezüchtet; diese Arteninfo ist keine Herkunftsangabe für einen einzelnen Fisch.",
  },
  "dorade-filet": {
    nl: "De goudbrasem komt van nature voor in de oostelijke Atlantische Oceaan en de Middellandse Zee. Dorade wordt ook veel gekweekt; deze soortinformatie is geen herkomstclaim over een specifieke vis.",
    en: "Gilthead sea bream is native to the eastern Atlantic and Mediterranean. It is also widely farmed; this species information is not an origin claim for a particular fish.",
    de: "Die Goldbrasse ist im östlichen Atlantik und im Mittelmeer heimisch. Sie wird auch häufig gezüchtet; diese Arteninfo ist keine Herkunftsangabe für einen einzelnen Fisch.",
  },
  tarbot: {
    nl: "Tarbot leeft in de noordoostelijke Atlantische Oceaan, waaronder de Noordzee, en komt ook verder zuidelijk voor tot in de Middellandse Zee.",
    en: "Turbot lives in the Northeast Atlantic, including the North Sea, and also occurs farther south into the Mediterranean.",
    de: "Steinbutt lebt im Nordostatlantik, einschließlich der Nordsee, und kommt weiter südlich bis ins Mittelmeer vor.",
  },
  tarbotfilet: {
    nl: "Tarbot leeft in de noordoostelijke Atlantische Oceaan, waaronder de Noordzee, en komt ook verder zuidelijk voor tot in de Middellandse Zee.",
    en: "Turbot lives in the Northeast Atlantic, including the North Sea, and also occurs farther south into the Mediterranean.",
    de: "Steinbutt lebt im Nordostatlantik, einschließlich der Nordsee, und kommt weiter südlich bis ins Mittelmeer vor.",
  },
  wijting: {
    nl: "Wijting komt voor in de noordoostelijke Atlantische Oceaan. De soort is onder meer bekend uit de Noordzee en de wateren rond de Britse eilanden.",
    en: "Whiting occurs in the Northeast Atlantic. The species is found in the North Sea and waters around the British Isles, among other areas.",
    de: "Wittling kommt im Nordostatlantik vor. Die Art lebt unter anderem in der Nordsee und in den Gewässern rund um die Britischen Inseln.",
  },
  wijtingfilet: {
    nl: "Wijting komt voor in de noordoostelijke Atlantische Oceaan. De soort is onder meer bekend uit de Noordzee en de wateren rond de Britse eilanden.",
    en: "Whiting occurs in the Northeast Atlantic. The species is found in the North Sea and waters around the British Isles, among other areas.",
    de: "Wittling kommt im Nordostatlantik vor. Die Art lebt unter anderem in der Nordsee und in den Gewässern rund um die Britischen Inseln.",
  },
  haring: {
    nl: "Atlantische haring leeft in de Noord-Atlantische Oceaan. Voor Nederlandse haringvisserij zijn onder meer de Noordzee en aangrenzende wateren belangrijk.",
    en: "Atlantic herring lives in the North Atlantic. The North Sea and neighbouring waters are important to Dutch herring fisheries.",
    de: "Atlantischer Hering lebt im Nordatlantik. Nordsee und angrenzende Gewässer sind für die niederländische Heringsfischerei wichtig.",
  },
  "broodje-haring": {
    nl: "Atlantische haring leeft in de Noord-Atlantische Oceaan. Voor Nederlandse haringvisserij zijn onder meer de Noordzee en aangrenzende wateren belangrijk.",
    en: "Atlantic herring lives in the North Atlantic. The North Sea and neighbouring waters are important to Dutch herring fisheries.",
    de: "Atlantischer Hering lebt im Nordatlantik. Nordsee und angrenzende Gewässer sind für die niederländische Heringsfischerei wichtig.",
  },
  "gerookte-bokking": {
    nl: "Bokking wordt gemaakt van haring. Atlantische haring leeft in de Noord-Atlantische Oceaan; de Noordzee is een belangrijk visserijgebied.",
    en: "Bückling is made from herring. Atlantic herring lives in the North Atlantic; the North Sea is an important fishery area.",
    de: "Bückling wird aus Hering hergestellt. Atlantischer Hering lebt im Nordatlantik; die Nordsee ist ein wichtiges Fanggebiet.",
  },
  "gerookte-kipper": {
    nl: "Kipper is gerookte haring. Atlantische haring leeft in de Noord-Atlantische Oceaan; de Noordzee is een belangrijk visserijgebied.",
    en: "Kipper is smoked herring. Atlantic herring lives in the North Atlantic; the North Sea is an important fishery area.",
    de: "Kipper ist geräucherter Hering. Atlantischer Hering lebt im Nordatlantik; die Nordsee ist ein wichtiges Fanggebiet.",
  },
  "varlaks-zalm": {
    nl: "Deze ASC-gecertificeerde Atlantische zalm van VÅRLAKS wordt gekweekt in Noord-Noorwegen, boven de poolcirkel.",
    en: "This ASC-certified Atlantic salmon from VÅRLAKS is farmed in Northern Norway, above the Arctic Circle.",
    de: "Dieser ASC-zertifizierte Atlantische Lachs von VÅRLAKS wird in Nordnorwegen oberhalb des Polarkreises gezüchtet.",
  },
  "gerookte-zalm-high-seas": {
    nl: "De Atlantische zalm voor High Seas is afkomstig uit Noorwegen en koud gerookt door W.G. den Heijer & Zn. in Scheveningen.",
    en: "The Atlantic salmon used for High Seas comes from Norway and is cold-smoked by W.G. den Heijer & Zn. in Scheveningen.",
    de: "Der Atlantische Lachs für High Seas stammt aus Norwegen und wird von W.G. den Heijer & Zn. in Scheveningen kalt geräuchert.",
  },
  "gerookte-zalm-snippers": {
    nl: "De Atlantische zalm voor High Seas is afkomstig uit Noorwegen en koud gerookt door W.G. den Heijer & Zn. in Scheveningen.",
    en: "The Atlantic salmon used for High Seas comes from Norway and is cold-smoked by W.G. den Heijer & Zn. in Scheveningen.",
    de: "Der Atlantische Lachs für High Seas stammt aus Norwegen und wird von W.G. den Heijer & Zn. in Scheveningen kalt geräuchert.",
  },
  "hollandse-garnalen": {
    nl: "De Hollandse garnaal (Crangon crangon) leeft langs de Europese kust, waaronder de Noordzee. De MSC-certificering hoort bij de gecertificeerde Noordzeegarnalenvisserij.",
    en: "The common brown shrimp (Crangon crangon) lives along the European coast, including the North Sea. The MSC certification applies to the certified North Sea brown shrimp fishery.",
    de: "Die Nordseegarnele (Crangon crangon) lebt entlang der europäischen Küste, auch in der Nordsee. Die MSC-Zertifizierung gilt für die zertifizierte Nordseegarnelenfischerei.",
  },
  "noorse-garnalen": {
    nl: "De noordse garnaal (Pandalus borealis) leeft in koude noordelijke wateren van de Atlantische Oceaan en de Stille Oceaan.",
    en: "The northern shrimp (Pandalus borealis) lives in cold northern waters of the Atlantic and Pacific Oceans.",
    de: "Die Eismeergarnele (Pandalus borealis) lebt in kalten nördlichen Gewässern des Atlantiks und Pazifiks.",
  },
  "zeeuwse-mosselen": {
    nl: "Deze mosselen worden gekweekt in de Zeeuwse wateren, een bekende Nederlandse mosselregio.",
    en: "These mussels are farmed in Zeeland waters, a well-known Dutch mussel-growing region.",
    de: "Diese Miesmuscheln werden in den Gewässern Zeelands gezüchtet, einer bekannten niederländischen Muschelregion.",
  },
  "creuse-oesters": {
    nl: "Creuse-oesters zijn Japanse oesters die in Europese kustwateren worden gekweekt; de naam zegt op zichzelf niet waar een specifieke partij is gekweekt.",
    en: "Cupped oysters are Pacific oysters farmed in European coastal waters; the name alone does not identify where a particular batch was grown.",
    de: "Felsenaustern sind Pazifische Austern, die in europäischen Küstengewässern gezüchtet werden; der Name allein verrät nicht den Ort einer bestimmten Partie.",
  },
  "fine-de-claire-oesters": {
    nl: "Fine de Claire-oesters rijpen in de claires van Marennes-Oléron aan de Franse Atlantische kust.",
    en: "Fine de Claire oysters are matured in the claires of Marennes-Oléron on the French Atlantic coast.",
    de: "Fine-de-Claire-Austern reifen in den Claires von Marennes-Oléron an der französischen Atlantikküste.",
  },
  kokkels: {
    nl: "De gewone kokkel leeft in ondiepe zand- en slikgebieden langs de Europese Atlantische kust en in de Noordzee.",
    en: "The common cockle lives in shallow sandy and muddy areas along the European Atlantic coast and in the North Sea.",
    de: "Die Herzmuschel lebt in flachen Sand- und Schlickgebieten an der europäischen Atlantikküste und in der Nordsee.",
  },
  coquilles: {
    nl: "De grote mantel (Pecten maximus) komt voor in de noordoostelijke Atlantische Oceaan, waaronder rond de Britse eilanden.",
    en: "The great scallop (Pecten maximus) occurs in the Northeast Atlantic, including waters around the British Isles.",
    de: "Die Große Pilgermuschel (Pecten maximus) kommt im Nordostatlantik vor, auch in Gewässern rund um die Britischen Inseln.",
  },
  tonijnfilet: {
    nl: "Geelvintonijn leeft in tropische en subtropische wateren wereldwijd, zowel in de Atlantische als de Indische en Stille Oceaan.",
    en: "Yellowfin tuna lives in tropical and subtropical waters worldwide, across the Atlantic, Indian and Pacific Oceans.",
    de: "Gelbflossenthun lebt weltweit in tropischen und subtropischen Gewässern des Atlantiks, Indischen und Pazifischen Ozeans.",
  },
  "gerookte-wilde-zalm": {
    nl: "Wilde Pacifische zalmsoorten leven in de noordelijke Stille Oceaan. De productbeschrijving noemt Alaska als regio.",
    en: "Wild Pacific salmon species live in the North Pacific. The product description identifies Alaska as the region.",
    de: "Pazifische Wildlachsarten leben im nördlichen Pazifik. Die Produktbeschreibung nennt Alaska als Region.",
  },
  "wilde-zalmfilet": {
    nl: "Wilde Pacifische zalmsoorten leven in de noordelijke Stille Oceaan. Vraag ons naar de herkomst van de zalm die we aanbieden.",
    en: "Wild Pacific salmon species live in the North Pacific. Ask us about the origin of the salmon we offer.",
    de: "Pazifische Wildlachsarten leben im nördlichen Pazifik. Fragen Sie uns nach der Herkunft des angebotenen Lachses.",
  },
  roodbaars: {
    nl: "De roodbaars leeft in koude delen van de Noord-Atlantische Oceaan, waaronder rond IJsland, Groenland en Noorwegen.",
    en: "Redfish lives in cold parts of the North Atlantic, including waters around Iceland, Greenland and Norway.",
    de: "Rotbarsch lebt in kalten Teilen des Nordatlantiks, unter anderem rund um Island, Grönland und Norwegen.",
  },
  heilbotfilet: {
    nl: "Atlantische heilbot leeft op de bodem van de Noord-Atlantische Oceaan, van de Noordzee en Noorwegen tot Groenland en Canada.",
    en: "Atlantic halibut lives on the seabed of the North Atlantic, from the North Sea and Norway to Greenland and Canada.",
    de: "Atlantischer Heilbutt lebt am Meeresboden des Nordatlantiks, von Nordsee und Norwegen bis Grönland und Kanada.",
  },
  "verse-heilbot": {
    nl: "Atlantische heilbot leeft op de bodem van de Noord-Atlantische Oceaan, van de Noordzee en Noorwegen tot Groenland en Canada.",
    en: "Atlantic halibut lives on the seabed of the North Atlantic, from the North Sea and Norway to Greenland and Canada.",
    de: "Atlantischer Heilbutt lebt am Meeresboden des Nordatlantiks, von Nordsee und Norwegen bis Grönland und Kanada.",
  },
  sardines: {
    nl: "De Europese sardine komt voor in de noordoostelijke Atlantische Oceaan en de Middellandse Zee.",
    en: "The European sardine occurs in the Northeast Atlantic and the Mediterranean Sea.",
    de: "Die Europäische Sardine kommt im Nordostatlantik und im Mittelmeer vor.",
  },
  ansjovis: {
    nl: "Europese ansjovis komt voor in de oostelijke Atlantische Oceaan en de Middellandse Zee.",
    en: "European anchovy occurs in the eastern Atlantic and the Mediterranean Sea.",
    de: "Europäische Sardelle kommt im östlichen Atlantik und im Mittelmeer vor.",
  },
};

export function productLeefgebied(slug: string, locale: string): string | undefined {
  const copy = RANGE[slug];
  return copy?.[siteLanguage(locale)];
}

export const leefgebiedNote = {
  nl: "Dit is het algemene leef- of visserijgebied van de soort, niet een bewering over de vangstlocatie van iedere afzonderlijke levering.",
  en: "This describes the species' general habitat or fishery area, not the catch location of every individual delivery.",
  de: "Dies beschreibt das allgemeine Lebens- oder Fanggebiet der Art, nicht den Fangort jeder einzelnen Lieferung.",
} as const;

export function productLeefgebiedNote(locale: string): string {
  return leefgebiedNote[siteLanguage(locale)];
}

