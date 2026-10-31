import type { Locale } from "@/lib/seo";

export type FeestItem = {
  titel: string;
  tekst: string;
  beeld: string;
  alt: string;
  href?: string;
};

const COPY = {
  nl: {
    home: "Home",
    label: "December bij Schaap’s",
    title: "Feestdagen 2026",
    intro: "Van een feestelijke visschaal tot gerookte zalm, oesters en een gourmetselectie: bekijk de mogelijkheden en stem uw bestelling op tijd met ons af.",
    ask: "Bespreek uw bestelling",
    gifts: "Relatiegeschenken",
    categories: "Voor op tafel",
    categoriesTitle: "Kies wat bij uw feest past",
    categoriesIntro: "De foto’s zijn voorbeelden. Samenstelling, hoeveelheid en prijs hangen af van uw wensen en de verse aanvoer.",
    items: [
      ["Feestelijke visschalen", "Een complete schaal voor borrel, brunch of diner. We stellen de inhoud samen op basis van gezelschap, smaak en budget.", "/images/editorial/feestschaal-voorbeeld.webp", "Voorbeeld van een feestelijke visschaal", "/visschalen"],
      ["Visschaal voor de hele tafel", "Een ruime selectie van vis, garnalen en bijpassende garnituren voor een groter gezelschap.", "/images/editorial/familieschaal-voorbeeld.webp", "Voorbeeld van een ruime visschaal voor een gezelschap", "/visschalen"],
      ["Gourmet met vis", "Vis voor aan tafel, afgestemd op het aantal personen. Bekijk de voorbeelden en vraag naar de mogelijkheden.", "/images/barbecue-gourmet-hero.webp", "Gourmetselectie met verschillende vissoorten", "/barbecue-gourmet"],
      ["Gerookte zalm", "Mooi als voorgerecht, op brood of als onderdeel van een feestelijke schaal. Vraag naar porties en beschikbaarheid.", "/images/editorial/gerookte-zalm-serveervoorbeeld.png", "Gerookte zalm als serveersuggestie", "/assortiment/gerookte-zalm-high-seas"],
      ["Oesters", "Voor een aperitief of bijzondere avond. Grotere aantallen en speciale wensen spreken we vooraf met u af.", "/images/editorial/creuse-oesters-serveervoorbeeld.png", "Oesters als feestelijke serveersuggestie", "/assortiment/creuse-oesters"],
      ["Hollandse garnalen", "Voor cocktail, salade of voorgerecht. Houd de bereiding eenvoudig en laat de smaak van de garnalen spreken.", "/images/producten-hd/hollandse-garnalen.webp", "Hollandse garnalen", "/assortiment/hollandse-garnalen"],
      ["Warm gerookte zalm", "Een feestelijke blikvanger die warm of op kamertemperatuur geserveerd kan worden.", "/images/editorial/warm-gerookte-zalmmoten-eigen-product-ai.webp", "Warm gerookte zalm als serveersuggestie", "/assortiment/warm-gerookte-zalm"],
      ["Vis voor uw eigen menu", "Kookt u zelf? Vertel ons uw menu en gezelschap; we denken mee over vissoort, hoeveelheid en bereiding.", "/images/editorial/varlaks-zalm-rauw-ai.webp", "Zalm voor een feestelijk menu", "/assortiment"],
    ] as const,
    orderLabel: "Bestellen voor december",
    orderTitle: "Zo voorkomt u haast aan het einde",
    steps: [
      ["1", "Kies uw richting", "Bekijk de voorbeelden en bepaal het aantal gasten, het moment en uw globale budget."],
      ["2", "Stem af via WhatsApp", "Wij controleren wat haalbaar is, adviseren over hoeveelheden en bevestigen de samenstelling en prijs."],
      ["3", "Haal gekoeld af", "U ontvangt de afgesproken afhaaltijd en bewaarinstructies. Bijzondere wensen graag zo vroeg mogelijk."],
    ] as const,
    giftLabel: "Voor personeel en relaties",
    giftTitle: "Een cadeau uit de viswinkel",
    giftText: "Denk aan gerookte zalm, een pakket op maat of een tegoed voor de winkel. We maken geen standaardbelofte zonder uw wensen te kennen: aantallen, verpakking, budget en afhaalmoment stemmen we persoonlijk af.",
    giftLink: "Bekijk relatiegeschenken",
    practicalLabel: "Goed om te weten",
    practicalTitle: "Vers, gekoeld en persoonlijk afgestemd",
    practical: [
      ["Zijn de voorbeelden altijd verkrijgbaar?", "Nee. Verse aanvoer en seizoen bepalen wat mogelijk is. We bevestigen uw bestelling pas nadat we de inhoud met u hebben afgestemd."],
      ["Kan ik direct online afrekenen?", "Nog niet. U vraagt uw bestelling via WhatsApp aan; daarna bevestigen wij beschikbaarheid, samenstelling en prijs."],
      ["Hoe vroeg moet ik bestellen?", "Voor grotere schalen, gourmet en relatiegeschenken geldt: liever vroeg dan laat. Neem contact op zodra het aantal gasten bekend is."],
    ] as const,
    slotTitle: "Al een idee voor de feestdagen?",
    slotText: "Stuur het aantal personen, de gewenste datum en uw voorkeuren. Dan kijken we samen wat mogelijk is.",
  },
  en: {
    home: "Home", label: "December at Schaap’s", title: "Festive season 2026", intro: "From a festive seafood platter to smoked salmon, oysters and fish for gourmet dining: explore the options and arrange your order with us in good time.", ask: "Discuss your order", gifts: "Business gifts", categories: "For your table", categoriesTitle: "Choose what suits your celebration", categoriesIntro: "The photos are examples. Contents, quantities and price depend on your wishes and the fresh supply.",
    items: [
      ["Festive seafood platters", "A complete platter for drinks, brunch or dinner, tailored to your guests, taste and budget.", "/images/editorial/feestschaal-voorbeeld.webp", "Example festive seafood platter", "/visschalen"],
      ["A platter for the whole table", "A generous selection of fish, prawns and accompaniments for a larger group.", "/images/editorial/familieschaal-voorbeeld.webp", "Example large seafood platter", "/visschalen"],
      ["Fish gourmet selection", "Fish for tabletop cooking, matched to your number of guests. Ask us what is possible.", "/images/barbecue-gourmet-hero.webp", "Fish gourmet selection", "/barbecue-gourmet"],
      ["Smoked salmon", "For a starter, on bread or as part of a festive platter. Ask about portions and availability.", "/images/editorial/gerookte-zalm-serveervoorbeeld.png", "Smoked salmon serving suggestion", "/assortiment/gerookte-zalm-high-seas"],
      ["Oysters", "For an aperitif or special evening. Please arrange larger quantities and special requests in advance.", "/images/editorial/creuse-oesters-serveervoorbeeld.png", "Oyster serving suggestion", "/assortiment/creuse-oesters"],
      ["Dutch shrimp", "For a cocktail, salad or starter. Keep it simple and let the shrimp speak for itself.", "/images/producten-hd/hollandse-garnalen.webp", "Dutch shrimp", "/assortiment/hollandse-garnalen"],
      ["Hot-smoked salmon", "A festive centrepiece to serve warm or at room temperature.", "/images/editorial/warm-gerookte-zalmmoten-eigen-product-ai.webp", "Hot-smoked salmon serving suggestion", "/assortiment/warm-gerookte-zalm"],
      ["Fish for your own menu", "Cooking yourself? Tell us your menu and party size; we will advise on fish, quantities and preparation.", "/images/editorial/varlaks-zalm-rauw-ai.webp", "Salmon for a festive menu", "/assortiment"],
    ] as const,
    orderLabel: "Ordering for December", orderTitle: "Avoid the last-minute rush", steps: [["1", "Choose a direction", "Review the examples and decide on guest numbers, timing and an approximate budget."], ["2", "Arrange it on WhatsApp", "We check what is feasible, advise on quantities and confirm contents and price."], ["3", "Collect chilled", "You receive an agreed collection time and storage advice. Please share special requests early."]] as const,
    giftLabel: "For teams and business relations", giftTitle: "A gift from the fish shop", giftText: "Consider smoked salmon, a custom package or shop credit. Quantities, packaging, budget and collection are arranged personally.", giftLink: "Explore business gifts", practicalLabel: "Good to know", practicalTitle: "Fresh, chilled and tailored to you", practical: [["Are all examples always available?", "No. Fresh supply and season determine what is possible. We only confirm after agreeing the contents."], ["Can I pay online?", "Not yet. Send a request on WhatsApp; we then confirm availability, contents and price."], ["How early should I order?", "For larger platters, gourmet and gifts: the earlier the better. Contact us as soon as guest numbers are known."]] as const, slotTitle: "Already planning your celebration?", slotText: "Send the number of guests, preferred date and your wishes. We will see what is possible.",
  },
  de: {
    home: "Startseite", label: "Dezember bei Schaap’s", title: "Festtage 2026", intro: "Von festlichen Fischplatten bis Räucherlachs, Austern und einer Gourmet-Auswahl: Entdecken Sie die Möglichkeiten und stimmen Sie Ihre Bestellung rechtzeitig mit uns ab.", ask: "Bestellung besprechen", gifts: "Firmengeschenke", categories: "Für Ihre Tafel", categoriesTitle: "Passend zu Ihrem Fest", categoriesIntro: "Die Fotos sind Beispiele. Inhalt, Menge und Preis hängen von Ihren Wünschen und der frischen Anlieferung ab.",
    items: [
      ["Festliche Fischplatten", "Eine komplette Platte für Empfang, Brunch oder Abendessen, abgestimmt auf Gäste, Geschmack und Budget.", "/images/editorial/feestschaal-voorbeeld.webp", "Beispiel einer festlichen Fischplatte", "/visschalen"],
      ["Fischplatte für die ganze Tafel", "Eine großzügige Auswahl an Fisch, Garnelen und Beilagen für eine größere Runde.", "/images/editorial/familieschaal-voorbeeld.webp", "Beispiel einer großen Fischplatte", "/visschalen"],
      ["Fisch für Gourmet", "Fisch für den Tischgrill, abgestimmt auf die Personenzahl. Fragen Sie nach den Möglichkeiten.", "/images/barbecue-gourmet-hero.webp", "Gourmet-Auswahl mit Fisch", "/barbecue-gourmet"],
      ["Räucherlachs", "Als Vorspeise, auf Brot oder auf einer festlichen Platte. Fragen Sie nach Portionen und Verfügbarkeit.", "/images/editorial/gerookte-zalm-serveervoorbeeld.png", "Serviervorschlag mit Räucherlachs", "/assortiment/gerookte-zalm-high-seas"],
      ["Austern", "Für Aperitif oder besonderen Abend. Größere Mengen und Wünsche stimmen wir vorab ab.", "/images/editorial/creuse-oesters-serveervoorbeeld.png", "Festlicher Serviervorschlag mit Austern", "/assortiment/creuse-oesters"],
      ["Holländische Garnelen", "Für Cocktail, Salat oder Vorspeise. Einfach zubereitet kommt ihr Geschmack am besten zur Geltung.", "/images/producten-hd/hollandse-garnalen.webp", "Holländische Garnelen", "/assortiment/hollandse-garnalen"],
      ["Warm geräucherter Lachs", "Ein festlicher Blickfang, warm oder bei Raumtemperatur serviert.", "/images/editorial/warm-gerookte-zalmmoten-eigen-product-ai.webp", "Serviervorschlag mit warm geräuchertem Lachs", "/assortiment/warm-gerookte-zalm"],
      ["Fisch für Ihr eigenes Menü", "Sie kochen selbst? Nennen Sie Menü und Gästezahl; wir beraten zu Fisch, Menge und Zubereitung.", "/images/editorial/varlaks-zalm-rauw-ai.webp", "Lachs für ein festliches Menü", "/assortiment"],
    ] as const,
    orderLabel: "Für Dezember bestellen", orderTitle: "So vermeiden Sie Hektik", steps: [["1", "Richtung wählen", "Sehen Sie die Beispiele an und bestimmen Sie Gästezahl, Termin und ungefähres Budget."], ["2", "Per WhatsApp abstimmen", "Wir prüfen die Möglichkeiten, beraten zur Menge und bestätigen Inhalt und Preis."], ["3", "Gekühlt abholen", "Sie erhalten Abholzeit und Lagerhinweise. Besondere Wünsche bitte früh mitteilen."]] as const,
    giftLabel: "Für Teams und Geschäftsbeziehungen", giftTitle: "Ein Geschenk aus dem Fischgeschäft", giftText: "Zum Beispiel Räucherlachs, ein individuelles Paket oder ein Guthaben. Menge, Verpackung, Budget und Abholung stimmen wir persönlich ab.", giftLink: "Firmengeschenke ansehen", practicalLabel: "Gut zu wissen", practicalTitle: "Frisch, gekühlt und persönlich abgestimmt", practical: [["Sind alle Beispiele immer erhältlich?", "Nein. Frische Anlieferung und Saison bestimmen das Angebot. Wir bestätigen erst nach Abstimmung."], ["Kann ich online bezahlen?", "Noch nicht. Fragen Sie per WhatsApp an; danach bestätigen wir Verfügbarkeit, Inhalt und Preis."], ["Wie früh sollte ich bestellen?", "Bei größeren Platten, Gourmet und Geschenken gilt: je früher, desto besser. Melden Sie sich, sobald die Gästezahl feststeht."]] as const, slotTitle: "Planen Sie schon die Festtage?", slotText: "Senden Sie Gästezahl, Wunschtermin und Vorlieben. Dann prüfen wir gemeinsam die Möglichkeiten.",
  },
} as const;

export function feestdagenCopy(locale: string) {
  return COPY[(locale in COPY ? locale : "nl") as Locale];
}
