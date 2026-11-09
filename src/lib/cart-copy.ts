export const cartCopy = {
  nl: {
    noteLabel: "Vul uw wensen voor deze samenstelling opnieuw in", lostNote: "Uw eerdere notitie is gewist bij het opnieuw laden. Voeg eventuele allergieën of wensen opnieuw toe voor u de bestelling aanvraagt.", saveNote: "Notitie bewaren", noNote: "Verder zonder notitie", invalidChoice: "Controleer uw keuzes en hoeveelheden.",
    title: "Uw winkelwagen", open: "Open winkelwagen", close: "Sluit winkelwagen", count: "producten", add: "Voeg toe aan winkelwagen", added: "In uw winkelwagen",
    wishes: "Specifieke wensen (optioneel)", placeholder: "Bijvoorbeeld geen paling; graag extra zalm indien mogelijk.", wishNote: "Aanpassingen en eventuele prijsverschillen bevestigen we persoonlijk.",
    subtotal: "Bekend subtotaal", unit: "Prijs per eenheid", line: "Regelbedrag", request: "Bestelling aanvragen via WhatsApp", preview: "Bekijk bericht", note: "Uw bestelling is pas definitief na persoonlijke bevestiging.",
    greeting: "Hallo Schaap’s Vishandel!\n\nIk wil graag deze bestelling aanvragen:", pickup: "Afhalen", undecided: "datum in overleg", wishHeading: "Wensen", unconfirmed: "De definitieve totaalprijs inclusief ongeprijsde producten of aanpassingen moet nog worden bevestigd.", ending: "Kunnen jullie bevestigen of dit mogelijk is en wanneer ik het kan afhalen?",
    helpBefore: "Hulp nodig bij het kiezen? Stuur ons gerust een ", helpLink: "WhatsApp-bericht", helpAfter: ". We helpen u graag.", helpMessage: "Hallo Schaap’s Vishandel, kunnen jullie mij helpen bij het kiezen van een visschaal of delicatessen?", others: "Bekijk andere visschalen", custom: "Een schaal op maat bespreken", customNote: "Vraag uw hele bestelling vanuit de winkelwagen aan. We bespreken de prijs voor maatwerk via WhatsApp.",
    dateError: "Kies vandaag of een latere datum, of laat de datum nog open.",
  },
  en: {
    noteLabel: "Re-enter your notes for this selection", lostNote: "Your earlier note was cleared on reload. Add any allergies or preferences again before requesting your order.", saveNote: "Save note", noNote: "Continue without a note", invalidChoice: "Check your choices and quantities.",
    title: "Your basket", open: "Open basket", close: "Close basket", count: "products", add: "Add to basket", added: "In your basket",
    wishes: "Special requests (optional)", placeholder: "For example no eel; extra salmon if possible.", wishNote: "We confirm changes and any price difference personally.",
    subtotal: "Known subtotal", unit: "Unit price", line: "Line total", request: "Request order via WhatsApp", preview: "View message", note: "Your order is only final after personal confirmation.",
    greeting: "Hello Schaap’s Vishandel!\n\nI would like to request this order:", pickup: "Collection", undecided: "date to be agreed", wishHeading: "Special requests", unconfirmed: "The final total including unpriced products or changes still needs to be confirmed.", ending: "Could you confirm whether this is possible and when I can collect it?",
    helpBefore: "Need help choosing? Send us a ", helpLink: "WhatsApp message", helpAfter: ". We are happy to help.", helpMessage: "Hello Schaap’s Vishandel, could you help me choose a seafood platter or delicacies?", others: "View other seafood platters", custom: "Discuss a bespoke platter", customNote: "Request the whole order from your basket. We agree any bespoke costs on WhatsApp.",
    dateError: "Choose today or a later date, or leave the date open.",
  },
  de: {
    noteLabel: "Wünsche für diese Zusammenstellung erneut eingeben", lostNote: "Ihre Notiz wurde beim Neuladen gelöscht. Ergänzen Sie Allergien oder Wünsche erneut, bevor Sie die Bestellung anfragen.", saveNote: "Notiz speichern", noNote: "Ohne Notiz fortfahren", invalidChoice: "Bitte Auswahl und Mengen prüfen.",
    title: "Ihr Warenkorb", open: "Warenkorb öffnen", close: "Warenkorb schließen", count: "Produkte", add: "In den Warenkorb", added: "In Ihrem Warenkorb",
    wishes: "Besondere Wünsche (optional)", placeholder: "Zum Beispiel ohne Aal; wenn möglich mehr Lachs.", wishNote: "Änderungen und eventuelle Preisunterschiede bestätigen wir persönlich.",
    subtotal: "Bekannte Zwischensumme", unit: "Einzelpreis", line: "Positionssumme", request: "Bestellung per WhatsApp anfragen", preview: "Nachricht ansehen", note: "Ihre Bestellung wird erst nach persönlicher Bestätigung verbindlich.",
    greeting: "Hallo Schaap’s Vishandel!\n\nIch möchte diese Bestellung anfragen:", pickup: "Abholung", undecided: "Termin nach Absprache", wishHeading: "Wünsche", unconfirmed: "Der Endpreis einschließlich unbepreister Produkte oder Änderungen muss noch bestätigt werden.", ending: "Können Sie bestätigen, ob dies möglich ist und wann ich die Bestellung abholen kann?",
    helpBefore: "Brauchen Sie Hilfe bei der Auswahl? Senden Sie uns eine ", helpLink: "WhatsApp-Nachricht", helpAfter: ". Wir helfen Ihnen gern.", helpMessage: "Hallo Schaap’s Vishandel, können Sie mir bei der Auswahl einer Fischplatte oder von Delikatessen helfen?", others: "Weitere Fischplatten ansehen", custom: "Eine individuelle Platte besprechen", customNote: "Fragen Sie Ihre gesamte Bestellung im Warenkorb an. Kosten für Sonderwünsche vereinbaren wir per WhatsApp.",
    dateError: "Wählen Sie heute oder ein späteres Datum, oder lassen Sie den Termin offen.",
  },
} as const;
export function cartText(locale: string) { return cartCopy[locale === "en" || locale === "de" ? locale : "nl"]; }
