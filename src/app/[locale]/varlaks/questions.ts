import { varlaksCertification } from "@/lib/varlaks-certification";

export const questionsCopy = {
  nl: {
    questions: "Veelgestelde vragen over onze zalm",
    certification: varlaksCertification.nl,
    preparationQuestion: "Hoe kan ik de zalm bereiden?",
    salmonRecipes: "Bekijk alle zalmrecepten",
    sources: "Meer lezen over VÅRLAKS",
    source1: "VÅRLAKS: herkomst en werkwijze",
    source2: "Over VÅRLAKS en de samenwerking met PLUS",
    source3: "PLUS over zalmkwaliteit en certificering",
    source4: "VÅRLAKS-folder (PDF)",
    source5: "VÅRLAKS over herkomst en ASC-certificering",
  },
  en: {
    questions: "Questions about our salmon",
    certification: varlaksCertification.en,
    preparationQuestion: "How can I cook the salmon?",
    salmonRecipes: "View all salmon recipes",
    sources: "Read more about VÅRLAKS",
    source1: "VÅRLAKS: origin and approach",
    source2: "VÅRLAKS and its partnership with PLUS",
    source3: "PLUS on salmon quality and certification",
    source4: "VÅRLAKS brochure (PDF)",
    source5: "VÅRLAKS on origin and ASC certification",
  },
  de: {
    questions: "Häufige Fragen zu unserem Lachs",
    certification: varlaksCertification.de,
    preparationQuestion: "Wie kann ich den Lachs zubereiten?",
    salmonRecipes: "Alle Lachsrezepte ansehen",
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
