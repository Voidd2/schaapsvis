export const cartCopy = {
  nl: {
    title: "Uw winkelmandje", open: "Open winkelmandje", close: "Sluit winkelmandje", count: "producten", add: "Toevoegen aan winkelmandje", added: "In uw winkelmandje",
    wishes: "Specifieke wensen (optioneel)", placeholder: "Bijvoorbeeld geen paling; graag extra zalm indien mogelijk.", wishNote: "Aanpassingen en eventuele prijsverschillen bevestigen we persoonlijk.",
    subtotal: "Bekend subtotaal", unit: "Prijs per eenheid", line: "Regelbedrag", request: "Bestelling aanvragen via WhatsApp", preview: "Bekijk bericht", note: "Uw bestelling is pas definitief na persoonlijke bevestiging.",
    greeting: "Hallo Schaap’s Vishandel!\n\nIk wil graag deze bestelling aanvragen:", pickup: "Afhalen", undecided: "datum in overleg", wishHeading: "Wensen", unconfirmed: "De definitieve totaalprijs inclusief ongeprijsde producten of aanpassingen moet nog worden bevestigd.", ending: "Kunnen jullie bevestigen of dit mogelijk is en wanneer ik het kan afhalen?",
    helpBefore: "Hulp nodig bij het kiezen? Bel ons op ", helpOr: " of stuur een ", helpLink: "WhatsApp-bericht", helpAfter: ". We helpen u graag.", helpMessage: "Hallo Schaap’s Vishandel, kunnen jullie mij helpen bij het kiezen van een visschaal of delicatessen?", others: "Bekijk andere visschalen", custom: "Een schaal op maat bespreken", customNote: "Maatwerk bespreken we apart; uw gekozen producten blijven in het winkelmandje.",
    dateError: "Kies vandaag of een latere datum, of laat de datum nog open.", sameDayNotice: "Een of meer gekozen producten vragen normaal minimaal één dag voorbereiding. Afhalen vandaag is niet gegarandeerd; overleg daarom eerst even met ons.",
  },
  en: {
    title: "Your basket", open: "Open basket", close: "Close basket", count: "products", add: "Add to basket", added: "In your basket",
    wishes: "Special requests (optional)", placeholder: "For example no eel; extra salmon if possible.", wishNote: "We confirm changes and any price difference personally.",
    subtotal: "Known subtotal", unit: "Unit price", line: "Line total", request: "Request order via WhatsApp", preview: "View message", note: "Your order is only final after personal confirmation.",
    greeting: "Hello Schaap’s Vishandel!\n\nI would like to request this order:", pickup: "Collection", undecided: "date to be agreed", wishHeading: "Special requests", unconfirmed: "The final total including unpriced products or changes still needs to be confirmed.", ending: "Could you confirm whether this is possible and when I can collect it?",
    helpBefore: "Need help choosing? Call us on ", helpOr: " or send a ", helpLink: "WhatsApp message", helpAfter: ". We are happy to help.", helpMessage: "Hello Schaap’s Vishandel, could you help me choose a seafood platter or delicacies?", others: "View other seafood platters", custom: "Discuss a bespoke platter", customNote: "We discuss bespoke requests separately; your selected products stay in your basket.",
    dateError: "Choose today or a later date, or leave the date open.", sameDayNotice: "One or more selected items normally require at least one day’s notice. Collection today cannot be guaranteed; please check with us first.",
  },
  de: {
    title: "Ihr Warenkorb", open: "Warenkorb öffnen", close: "Warenkorb schließen", count: "Produkte", add: "In den Warenkorb", added: "In Ihrem Warenkorb",
    wishes: "Besondere Wünsche (optional)", placeholder: "Zum Beispiel ohne Aal; wenn möglich mehr Lachs.", wishNote: "Änderungen und eventuelle Preisunterschiede bestätigen wir persönlich.",
    subtotal: "Bekannte Zwischensumme", unit: "Einzelpreis", line: "Positionssumme", request: "Bestellung per WhatsApp anfragen", preview: "Nachricht ansehen", note: "Ihre Bestellung wird erst nach persönlicher Bestätigung verbindlich.",
    greeting: "Hallo Schaap’s Vishandel!\n\nIch möchte diese Bestellung anfragen:", pickup: "Abholung", undecided: "Termin nach Absprache", wishHeading: "Wünsche", unconfirmed: "Der Endpreis einschließlich unbepreister Produkte oder Änderungen muss noch bestätigt werden.", ending: "Können Sie bestätigen, ob dies möglich ist und wann ich die Bestellung abholen kann?",
    helpBefore: "Brauchen Sie Hilfe bei der Auswahl? Rufen Sie uns unter ", helpOr: " an oder senden Sie eine ", helpLink: "WhatsApp-Nachricht", helpAfter: ". Wir helfen Ihnen gern.", helpMessage: "Hallo Schaap’s Vishandel, können Sie mir bei der Auswahl einer Fischplatte oder von Delikatessen helfen?", others: "Weitere Fischplatten ansehen", custom: "Eine individuelle Platte besprechen", customNote: "Individuelle Wünsche besprechen wir separat; Ihre gewählten Produkte bleiben im Warenkorb.",
    dateError: "Wählen Sie heute oder ein späteres Datum, oder lassen Sie den Termin offen.", sameDayNotice: "Ein oder mehrere ausgewählte Produkte benötigen normalerweise mindestens einen Tag Vorlauf. Eine Abholung heute können wir nicht garantieren; bitte stimmen Sie dies mit uns ab.",
  },
} as const;
export function cartText(locale: string) { return cartCopy[locale === "en" || locale === "de" ? locale : "nl"]; }
