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
  "gravad-lax": {
    nl: "Gravad lax wordt bereid van Atlantische zalm (Salmo salar). Bij Schaap’s gebruiken we hiervoor geschikte zalm en hebben gravad lax regelmatig in de winkel; vraag ons naar de beschikbaarheid.",
    en: "Gravlax is made with Atlantic salmon (Salmo salar). Schaap’s uses salmon suitable for this preparation and regularly has gravlax in the shop; ask us about availability.",
    de: "Graved Lachs wird aus Atlantischem Lachs (Salmo salar) zubereitet. Schaap’s verwendet dafür geeigneten Lachs und hat Graved Lachs regelmäßig im Geschäft; fragen Sie nach der Verfügbarkeit.",
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
  "rode-poon": {
    nl: "Rode poon (Trigla lucerna) komt voor in de oostelijke Atlantische Oceaan, waaronder de Noordzee en de wateren rond de Britse eilanden.",
    en: "Tub gurnard (Trigla lucerna) occurs in the eastern Atlantic, including the North Sea and waters around the British Isles.",
    de: "Der Rote Knurrhahn (Trigla lucerna) kommt im östlichen Atlantik vor, auch in der Nordsee und rund um die Britischen Inseln.",
  },
  schar: {
    nl: "Schar (Limanda limanda) is een platvis uit de noordoostelijke Atlantische Oceaan; de Noordzee is een belangrijk leef- en visserijgebied.",
    en: "Dab (Limanda limanda) is a flatfish of the Northeast Atlantic; the North Sea is an important habitat and fishery area.",
    de: "Die Kliesche (Limanda limanda) ist ein Plattfisch des Nordostatlantiks; die Nordsee ist ein wichtiges Lebens- und Fanggebiet.",
  },
  inktvis: {
    nl: "De gewone pijlinktvis (Loligo vulgaris) leeft in kustwateren van de oostelijke Atlantische Oceaan en de Middellandse Zee. Dit is soortinformatie, geen herkomstclaim over een bestelling.",
    en: "The European squid (Loligo vulgaris) lives in coastal waters of the eastern Atlantic and Mediterranean. This describes the species, not the origin of an order.",
    de: "Der Gemeine Kalmar (Loligo vulgaris) lebt in Küstengewässern des östlichen Atlantiks und des Mittelmeers. Dies beschreibt die Art, nicht die Herkunft einer Lieferung.",
  },
  calamares: {
    nl: "Calamares zijn ringen van inktvis. De gewone pijlinktvis (Loligo vulgaris) komt voor in kustwateren van de oostelijke Atlantische Oceaan en de Middellandse Zee; de exacte herkomst hangt af van de partij.",
    en: "Calamares are squid rings. European squid (Loligo vulgaris) occurs in coastal waters of the eastern Atlantic and Mediterranean; the exact origin depends on the batch.",
    de: "Calamares sind Tintenfischringe. Der Gemeine Kalmar (Loligo vulgaris) lebt in Küstengewässern des östlichen Atlantiks und des Mittelmeers; die genaue Herkunft hängt von der jeweiligen Partie ab.",
  },
  scheermessen: {
    nl: "Scheermessen zijn langwerpige tweekleppige schelpdieren. De Amerikaanse zwaardschede (Ensis leei, vaak ook Ensis directus genoemd) komt inmiddels voor langs delen van de Noordzeekust; controleer de herkomst van de specifieke partij bij aankoop.",
    en: "Razor clams are elongated bivalves. The American razor clam (Ensis leei, also often called Ensis directus) is now established along parts of the North Sea coast; check the origin of the specific batch when buying.",
    de: "Schwertmuscheln sind längliche Muscheln. Die Amerikanische Schwertmuschel (Ensis leei, häufig auch Ensis directus genannt) kommt inzwischen an Teilen der Nordseeküste vor; fragen Sie beim Kauf nach der Herkunft der jeweiligen Partie.",
  },
  "gebakken-ansjovis": {
    nl: "Ansjovis is een kleine, pelagische zoutwatervis. De Europese ansjovis (Engraulis encrasicolus) komt voor in de noordoostelijke Atlantische Oceaan en de Middellandse Zee; bij dit product gaat het om een gebakken bereiding.",
    en: "Anchovy is a small pelagic saltwater fish. European anchovy (Engraulis encrasicolus) occurs in the northeastern Atlantic and Mediterranean; this product is served fried.",
    de: "Sardellen sind kleine, pelagische Meeresfische. Die Europäische Sardelle (Engraulis encrasicolus) kommt im nordöstlichen Atlantik und im Mittelmeer vor; dieses Produkt wird gebraten angeboten.",
  },
  zeekraal: {
    nl: "Zeekraal is een zilte kustplant, geen vis. De eetbare scheuten groeien op kwelders en in andere zoute kustgebieden; de herkomst van onze verse zeekraal kan per partij verschillen.",
    en: "Samphire is a salt-tolerant coastal plant, not a fish. Its edible shoots grow on salt marshes and other saline coastal areas; the origin of our fresh samphire can vary by batch.",
    de: "Queller ist eine salztolerante Küstenpflanze, kein Fisch. Die essbaren Triebe wachsen auf Salzwiesen und in anderen salzigen Küstengebieten; die Herkunft unseres frischen Quellers kann je nach Partie variieren.",
  },
  bot: {
    nl: "Bot (Platichthys flesus) komt voor in kustwateren en riviermondingen van de noordoostelijke Atlantische Oceaan, waaronder de Noordzee.",
    en: "European flounder (Platichthys flesus) occurs in coastal waters and estuaries of the Northeast Atlantic, including the North Sea.",
    de: "Die Flunder (Platichthys flesus) kommt in Küstengewässern und Flussmündungen des Nordostatlantiks vor, auch in der Nordsee.",
  },
  tilapiafilet: {
    nl: "Nijltilapia (Oreochromis niloticus) komt van nature voor in delen van Afrika en de Levant en wordt wereldwijd gekweekt. De soortnaam zegt niet waar deze filet is gekweekt.",
    en: "Nile tilapia (Oreochromis niloticus) is native to parts of Africa and the Levant and is farmed worldwide. The species name does not identify where this fillet was farmed.",
    de: "Der Nil-Tilapia (Oreochromis niloticus) ist in Teilen Afrikas und der Levante heimisch und wird weltweit gezüchtet. Der Artname verrät nicht, wo dieses Filet gezüchtet wurde.",
  },
  victoriabaars: {
    nl: "Nijlbaars (Lates niloticus) leeft van nature in grote Afrikaanse rivieren en meren, waaronder het Nijl- en Tsjaadbekken. Deze soortinformatie bevestigt niet de herkomst van iedere filet.",
    en: "Nile perch (Lates niloticus) is native to major African rivers and lakes, including the Nile and Lake Chad basins. This species information does not confirm the origin of each fillet.",
    de: "Der Nilbarsch (Lates niloticus) lebt in großen afrikanischen Flüssen und Seen, darunter im Nil- und Tschadbecken. Diese Arteninfo bestätigt nicht die Herkunft jedes Filets.",
  },
  "bosje-sprot": {
    nl: "Sprot (Sprattus sprattus) komt voor in de oostelijke Atlantische Oceaan, de Noordzee en delen van de Middellandse Zee.",
    en: "Sprat (Sprattus sprattus) occurs in the eastern Atlantic, the North Sea and parts of the Mediterranean.",
    de: "Die Sprotte (Sprattus sprattus) kommt im östlichen Atlantik, in der Nordsee und in Teilen des Mittelmeers vor.",
  },
  "gerookte-sprotfilet": {
    nl: "Sprot (Sprattus sprattus) komt voor in de oostelijke Atlantische Oceaan, de Noordzee en delen van de Middellandse Zee.",
    en: "Sprat (Sprattus sprattus) occurs in the eastern Atlantic, the North Sea and parts of the Mediterranean.",
    de: "Die Sprotte (Sprattus sprattus) kommt im östlichen Atlantik, in der Nordsee und in Teilen des Mittelmeers vor.",
  },
  "gerookte-heilbot": {
    nl: "Atlantische heilbot leeft op de bodem van de Noord-Atlantische Oceaan, van de Noordzee en Noorwegen tot Groenland en Canada.",
    en: "Atlantic halibut lives on the seabed of the North Atlantic, from the North Sea and Norway to Greenland and Canada.",
    de: "Atlantischer Heilbutt lebt am Meeresboden des Nordatlantiks, von Nordsee und Norwegen bis Grönland und Kanada.",
  },
  "gerookte-forelfilet": {
    nl: "Regenboogforel (Oncorhynchus mykiss) komt oorspronkelijk uit het stroomgebied van de noordelijke Stille Oceaan en wordt wereldwijd gekweekt. Dit is geen herkomstclaim over de forelfilet in onze toonbank.",
    en: "Rainbow trout (Oncorhynchus mykiss) is native to the North Pacific drainage and is farmed worldwide. This is not an origin claim about the trout fillet in our counter.",
    de: "Die Regenbogenforelle (Oncorhynchus mykiss) stammt ursprünglich aus dem Einzugsgebiet des Nordpazifiks und wird weltweit gezüchtet. Dies ist keine Herkunftsangabe für das Forellenfilet in unserer Theke.",
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
  "gerookte-forel-heel": {
    nl: "Regenboogforel (Oncorhynchus mykiss) komt oorspronkelijk uit het stroomgebied van de noordelijke Stille Oceaan en wordt wereldwijd gekweekt. Deze soortinformatie noemt niet de kweeklocatie van onze forel.",
    en: "Rainbow trout (Oncorhynchus mykiss) is native to the North Pacific drainage and is farmed worldwide. This species information does not identify where our trout was farmed.",
    de: "Die Regenbogenforelle (Oncorhynchus mykiss) stammt ursprünglich aus dem Einzugsgebiet des Nordpazifiks und wird weltweit gezüchtet. Diese Arteninfo nennt nicht den Zuchtort unserer Forelle.",
  },
  "gerookte-zalmmoot": {
    nl: "Atlantische zalm (Salmo salar) leeft van nature in de Noord-Atlantische Oceaan. Dit algemene verspreidingsgebied is geen herkomstclaim voor de warmgerookte moot in onze toonbank.",
    en: "Atlantic salmon (Salmo salar) is native to the North Atlantic. This general species range is not an origin claim for the warm-smoked portion in our counter.",
    de: "Atlantischer Lachs (Salmo salar) lebt von Natur aus im Nordatlantik. Dieses allgemeine Verbreitungsgebiet ist keine Herkunftsangabe für das heißgeräucherte Stück in unserer Theke.",
  },
  "blacktiger-garnalen": {
    nl: "De black tiger-garnaal (Penaeus monodon) komt van nature voor in de Indo-West-Pacifische regio, van de oostkust van Afrika en de Rode Zee tot Japan en Noord-Australië. Dit is het verspreidingsgebied van de soort, niet de herkomst van een specifieke partij.",
    en: "The black tiger shrimp (Penaeus monodon) is native to the Indo-West Pacific, from the east coast of Africa and the Red Sea to Japan and northern Australia. This is the species' range, not the origin of a specific batch.",
    de: "Die Schwarze Tigergarnele (Penaeus monodon) ist im Indo-Westpazifik heimisch, von der ostafrikanischen Küste und dem Roten Meer bis Japan und Nordaustralien. Dies ist das Verbreitungsgebiet der Art, nicht die Herkunft einer bestimmten Partie.",
  },
  "gebakken-mosselen": {
    nl: "Mosselen leven in kustwateren en hechten zich aan harde ondergrond. De blauwe mossel (Mytilus edulis) komt wijdverspreid voor in Europese wateren; dit bevestigt niet de kweeklocatie van een specifieke partij.",
    en: "Mussels live in coastal waters and attach to firm surfaces. Blue mussels (Mytilus edulis) are widespread in European waters; this does not confirm the farming location of a particular batch.",
    de: "Miesmuscheln leben in Küstengewässern und heften sich an feste Oberflächen. Die Miesmuschel (Mytilus edulis) ist in europäischen Gewässern weit verbreitet; dies bestätigt nicht den Zuchtort einer bestimmten Partie.",
  },
  "hele-kreeft": {
    nl: "De Europese kreeft (Homarus gammarus) leeft langs de oostelijke Atlantische kust, van Noorwegen en de Noordzee tot de Middellandse Zee. De herkomst van een specifieke kreeft staat hiermee niet vast.",
    en: "The European lobster (Homarus gammarus) lives along the eastern Atlantic coast, from Norway and the North Sea to the Mediterranean. This does not identify the origin of a particular lobster.",
    de: "Der Europäische Hummer (Homarus gammarus) lebt an der östlichen Atlantikküste, von Norwegen und der Nordsee bis zum Mittelmeer. Die Herkunft eines bestimmten Hummers ist damit nicht bestätigt.",
  },
};

export function productLeefgebied(slug: string, locale: string): string | undefined {
  const copy = RANGE[slug];
  return copy?.[siteLanguage(locale)];
}



