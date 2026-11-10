import { varlaksCertification } from "@/lib/varlaks-certification";

export const questionsCopy = {
  nl: {
    questions: "Veelgestelde vragen over onze zalm",
    organicQuestion: "Is VÅRLAKS-zalm biologisch?",
    organicAnswer: varlaksCertification.nl,
    preparationQuestion: "Hoe kan ik de zalm bereiden?",
    preparationAnswer: "Zalm leent zich goed voor de pan en de oven. Citroen en dille zijn een mooie combinatie. Bekijk ons recept of vertel ons wat u wilt maken; dan adviseren we over een passende portie en bereiding.",
    orderQuestion: "Kan ik zalm voor een diner aanvragen?",
    orderAnswer: "Ja. Vertel ons welke vis u zoekt, voor hoeveel personen u kookt en wanneer u de vis wilt ophalen. We bespreken de hoeveelheid en de prijs met u voordat u bestelt.",
    sources: "Meer lezen over VÅRLAKS",
    source1: "VÅRLAKS: herkomst en werkwijze",
    source2: "Over VÅRLAKS en de samenwerking met PLUS",
    source3: "PLUS over zalmkwaliteit en certificering",
    source4: "VÅRLAKS-folder (PDF)",
    source5: "VÅRLAKS over herkomst en ASC-certificering",
  },
  en: {
    questions: "Questions about our salmon",
    organicQuestion: "Is VÅRLAKS salmon organic?",
    organicAnswer: varlaksCertification.en,
    preparationQuestion: "How can I cook the salmon?",
    preparationAnswer: "Salmon works well in a pan or in the oven. Lemon and dill make a lovely pairing. Explore our recipe or tell us what you are cooking; we can advise on portions and preparation.",
    orderQuestion: "Can I enquire about salmon for a dinner party?",
    orderAnswer: "Yes. Tell us which fish you’d like, how many people you’re cooking for and when you’d like to collect it. We’ll agree the quantity and price with you before you order.",
    sources: "Read more about VÅRLAKS",
    source1: "VÅRLAKS: origin and approach",
    source2: "VÅRLAKS and its partnership with PLUS",
    source3: "PLUS on salmon quality and certification",
    source4: "VÅRLAKS brochure (PDF)",
    source5: "VÅRLAKS on origin and ASC certification",
  },
  de: {
    questions: "Häufige Fragen zu unserem Lachs",
    organicQuestion: "Ist VÅRLAKS-Lachs biologisch?",
    organicAnswer: varlaksCertification.de,
    preparationQuestion: "Wie kann ich den Lachs zubereiten?",
    preparationAnswer: "Lachs eignet sich gut für Pfanne und Ofen. Zitrone und Dill passen wunderbar dazu. Entdecken Sie unser Rezept oder erzählen Sie uns, was Sie kochen möchten. Wir beraten Sie zu Portionen und Zubereitung.",
    orderQuestion: "Kann ich Lachs für ein Abendessen anfragen?",
    orderAnswer: "Ja. Sagen Sie uns, welchen Fisch Sie möchten, für wie viele Personen Sie kochen und wann Sie ihn abholen möchten. Menge und Preis klären wir mit Ihnen vor der Bestellung.",
    sources: "Mehr über VÅRLAKS lesen",
    source1: "VÅRLAKS: Herkunft und Arbeitsweise",
    source2: "VÅRLAKS und die Zusammenarbeit mit PLUS",
    source3: "PLUS zu Lachsqualität und Zertifizierung",
    source4: "VÅRLAKS-Broschüre (PDF)",
    source5: "VÅRLAKS zu Herkunft und ASC-Zertifizierung",
  },
} as const;


export const sources = [
  ["https://varlaks.no/#why-choose-varlaks", "source1"],
  ["https://urkseafood.nl/blog/nieuws/varlaks-en-plus-bundelen-krachten-voor-premium-zalm-van-topkwaliteit/", "source2"],
  ["https://www.plus.nl/goed-eten/kwaliteit/duurzame-zalm", "source3"],
  ["https://dijkshoornvisspecialiteiten.nl/wp-content/uploads/2021/12/varlaks-flyer-nederlands.pdf", "source4"],
  ["https://varlaks.no/retail/", "source5"],
] as const;
