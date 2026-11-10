const copy = {
  nl: {
    offerIntro: "Meld u aan en ontvang ongeveer één keer per week onze kortingsbonnen en nieuws uit de winkel.",
    offerPrivacy: "Privacy", offerUnsubscribe: "Afmelden kan in elke mail.",
    offerSubmit: "Ja, stuur mij kortingsmails", closeOffer: "Sluiten",
    title: "Aanmelden Voor Kortingen!",
    intro: "Ontvang regelmatig kortingsbonnen per e-mail voor producten uit het assortiment van Schaap’s Vishandel.",
    email: "Uw e-mailadres", consent: "Ja, ik wil kortingsbonnen van Schaap’s Vishandel per e-mail ontvangen.",
    submit: "Meld mij aan", sending: "Aanmelden…", privacy: "Hoe we uw e-mailadres gebruiken",
    unsubscribe: "Afmelden kan via de link in elke kortingsmail.",
    success: "U bent aangemeld!", next: "De volgende kortingsbon van Schaap’s ontvangt u per e-mail.",
    range: "Bekijk het assortiment", retry: "Aanmelden is niet gelukt. Probeer het opnieuw.",
    limited: "U heeft het meerdere keren geprobeerd. Probeer het later opnieuw.",
    photo: "De toonbank van Schaap’s Vishandel op de markt",
    js: "Zet JavaScript aan om u aan te melden.",
  },
  en: {
    offerIntro: "Sign up for our vouchers and news from the shop, about once a week.",
    offerPrivacy: "Privacy", offerUnsubscribe: "Unsubscribe in any email.",
    offerSubmit: "Yes, email me discounts", closeOffer: "Close",
    title: "Sign Up for Discounts!", intro: "Get regular discount vouchers by email for products from Schaap’s Vishandel.",
    email: "Your email address", consent: "Yes, I would like to receive discount vouchers from Schaap’s Vishandel by email.",
    submit: "Sign me up", sending: "Signing up…", privacy: "How we use your email address",
    unsubscribe: "You can unsubscribe using the link in every offers email.",
    success: "You’re signed up!", next: "You’ll receive our next discount voucher by email.",
    range: "Explore our range", retry: "We couldn’t sign you up. Please try again.",
    limited: "You’ve tried several times. Please try again later.",
    photo: "The fish counter at Schaap’s market stall", js: "Enable JavaScript to sign up.",
  },
  de: {
    offerIntro: "Melden Sie sich an und erhalten Sie etwa einmal pro Woche Rabattgutscheine und Neuigkeiten aus unserem Laden.",
    offerPrivacy: "Datenschutz", offerUnsubscribe: "Abmeldung in jeder E-Mail möglich.",
    offerSubmit: "Ja, ich möchte Rabatt-E-Mails", closeOffer: "Schließen",
    title: "Für Rabatte anmelden!", intro: "Erhalten Sie regelmäßig Rabattgutscheine für Produkte aus dem Sortiment von Schaap’s Vishandel per E-Mail.",
    email: "Ihre E-Mail-Adresse", consent: "Ja, ich möchte Rabattgutscheine von Schaap’s Vishandel per E-Mail erhalten.",
    submit: "Jetzt anmelden", sending: "Anmeldung läuft…", privacy: "So verwenden wir Ihre E-Mail-Adresse",
    unsubscribe: "Über den Link in jeder Angebotsmail können Sie sich abmelden.",
    success: "Sie sind angemeldet!", next: "Den nächsten Rabattgutschein von Schaap’s erhalten Sie per E-Mail.",
    range: "Zum Sortiment", retry: "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
    limited: "Sie haben es mehrmals versucht. Bitte versuchen Sie es später erneut.",
    photo: "Die Fischtheke am Marktstand von Schaap’s", js: "Aktivieren Sie JavaScript, um sich anzumelden.",
  },
} as const;

export function discountSignupCopy(locale: string) {
  return copy[locale === "en" || locale === "de" ? locale : "nl"];
}
