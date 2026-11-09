export const platterModes = ["standard-platter", "deluxe-platter"] as const;
export type PlatterMode = typeof platterModes[number];
export function isPlatterMode(mode: string): mode is PlatterMode {
  return mode === "standard-platter" || mode === "deluxe-platter";
}

export const platterMenu = {
  "standard-platter": {
    names: ["Standaard visschaal", "Standard seafood platter", "Standard-Fischplatte"],
    rate: 1650, fish: ["flakes", "herring-fish", "mackerel", "northern", "house-salmon"],
    anchor: "schalen-klassiek", photo: "/images/dirks/visschotel-klein-2-3-pers.webp",
  },
  "deluxe-platter": {
    names: ["Luxe visschaal", "Deluxe seafood platter", "Deluxe-Fischplatte"],
    rate: 1850, fish: ["eel", "shrimp", "salmon", "mackerel", "herring-fish"],
    anchor: "schalen-luxe", photo: "/images/dirks/visschotel-luxe-10-14-pers.webp",
  },
} as const;
export const platterIngredients: Record<string, readonly string[]> = {
  flakes: ["Zalmsnippers", "Salmon trimmings", "Lachsstückchen"],
  "herring-fish": ["Haring", "Herring", "Hering"],
  mackerel: ["Makreelfilet", "Mackerel fillet", "Makrelenfilet"],
  northern: ["Noorse garnalen", "Norwegian prawns", "Norwegische Garnelen"],
  "house-salmon": ["Zalmsalade", "Salmon salad", "Lachssalat"],
  eel: ["Gerookte paling", "Smoked eel", "Räucheraal"],
  shrimp: ["Hollandse garnalen", "Dutch brown shrimp", "Nordseegarnelen"],
  salmon: ["Luxe gerookte zalmfilet", "Premium smoked salmon fillet", "Feines Räucherlachsfilet"],
};
export const servingCopy = {
  per: ["per persoon", "per person", "pro Person"],
  people: ["Aantal personen", "Number of people", "Personenzahl"],
  edit: ["Stel deze visschaal samen", "Build this platter", "Diese Platte zusammenstellen"],
  swap: ["Vis omruilen", "Swap ingredients", "Zutaten tauschen"],
  swapNote: ["Wilt u iets weglaten? Kies een vervanger. We passen de hoeveelheid aan zodat u dezelfde winkelwaarde krijgt.", "Choose a replacement for anything you would like to leave out. We adjust the quantity to match its shop value.", "Wählen Sie für jede unerwünschte Zutat einen Ersatz. Wir passen die Menge an den gleichen Ladenwert an."],
  shopChoice: ["Laat de viswinkel een vervanger kiezen", "Let the shop choose a replacement", "Das Geschäft wählt den Ersatz"],
  extras: ["Extra toevoegen tegen winkelprijs", "Add extras at shop prices", "Extras zum Ladenpreis"],
  sizeNote: ["Wij kiezen klein, medium of groot op basis van uw gezelschap. Voor twee personen gebruiken we bijvoorbeeld een kleine schaal, voor tien een grote. Voor grotere gezelschappen verdelen we de vis zo nodig over meerdere schalen.", "We choose small, medium or large platters to suit your party, for example a small platter for two or a large one for ten. For larger groups we divide the fish between several platters as needed.", "Wir wählen kleine, mittlere oder große Platten passend zur Gästezahl, etwa eine kleine für zwei oder eine große für zehn Personen. Für größere Gruppen verteilen wir den Fisch bei Bedarf auf mehrere Platten."],
};
