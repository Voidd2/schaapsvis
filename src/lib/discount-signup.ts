export const discountConsentVersion = "discount-news-and-offers-v2";
export const newsletterLandingConsentVersion = "newsletter-landing-news-and-offers-v1";
export const popupConsentVersions = { locations: "locations-news-and-offers-v2", varlaks: "varlaks-news-and-offers-v4", sitewide: "sitewide-news-and-offers-v1" } as const;

const copy = {
  nl: {
    offerIntro: "Meld u aan voor nieuws, aanbiedingen en kortingsmails van Schaap’s Vis en blijf op de hoogte.",
    popupImageAlt: "Kind proeft een vis",
    offerPrivacy: "Privacy", offerUnsubscribe: "Afmelden kan in elke mail.",
    landingSubmit: "Stuur mij de aanbiedingen", offerSubmit: "Houd mij op de hoogte", closeOffer: "Sluiten",
    title: "Nieuws en aanbiedingen van Schaap’s Vis",
    intro: "Meld u aan voor nieuws, aanbiedingen en kortingsmails van Schaap’s Vis en blijf op de hoogte.",
    email: "Uw e-mailadres", consent: "Ja, ik wil nieuws, reclame en kortingsmails van Schaap’s Vis ontvangen.",
    submit: "Meld mij aan", sending: "Aanmelden…", privacy: "Hoe we uw e-mailadres gebruiken",
    unsubscribe: "Afmelden kan via de link in elke kortingsmail.",
    success: "U bent aangemeld!", next: "U staat op onze mailinglijst. Zodra we nieuws of een actie hebben, hoort u van ons per e-mail.",
    range: "Bekijk het assortiment", retry: "Aanmelden is niet gelukt. Probeer het opnieuw.",
    limited: "U heeft het meerdere keren geprobeerd. Probeer het later opnieuw.",
    photo: "De toonbank van Schaap’s Vishandel op de markt",
    js: "Zet JavaScript aan om u aan te melden.",
  },
  en: {
    offerIntro: "Sign up for news, offers and discount emails from Schaap’s Vis and stay up to date.",
    popupImageAlt: "A child tasting fish",
    offerPrivacy: "Privacy", offerUnsubscribe: "Unsubscribe in any email.",
    landingSubmit: "Email me the offers", offerSubmit: "Keep me informed", closeOffer: "Close",
    title: "News and offers from Schaap’s Vis", intro: "Sign up for news, offers and discount emails from Schaap’s Vis and stay up to date.",
    email: "Your email address", consent: "Yes, I would like to receive news, promotional and discount emails from Schaap’s Vis.",
    submit: "Sign me up", sending: "Signing up…", privacy: "How we use your email address",
    unsubscribe: "You can unsubscribe using the link in every offers email.",
    success: "You’re signed up!", next: "You’re on our mailing list. We’ll email you when we have news or an offer to share.",
    range: "Explore our range", retry: "We couldn’t sign you up. Please try again.",
    limited: "You’ve tried several times. Please try again later.",
    photo: "The fish counter at Schaap’s market stall", js: "Enable JavaScript to sign up.",
  },
  de: {
    offerIntro: "Melden Sie sich für Neuigkeiten, Angebote und Rabatt-E-Mails von Schaap’s Vis an und bleiben Sie informiert.",
    popupImageAlt: "Ein Kind probiert Fisch",
    offerPrivacy: "Datenschutz", offerUnsubscribe: "Abmeldung in jeder E-Mail möglich.",
    landingSubmit: "Angebote per E-Mail erhalten", offerSubmit: "Auf dem Laufenden bleiben", closeOffer: "Schließen",
    title: "Neuigkeiten und Angebote von Schaap’s Vis", intro: "Melden Sie sich für Neuigkeiten, Angebote und Rabatt-E-Mails von Schaap’s Vis an und bleiben Sie informiert.",
    email: "Ihre E-Mail-Adresse", consent: "Ja, ich möchte Neuigkeiten, Werbung und Rabatt-E-Mails von Schaap’s Vis erhalten.",
    submit: "Jetzt anmelden", sending: "Anmeldung läuft…", privacy: "So verwenden wir Ihre E-Mail-Adresse",
    unsubscribe: "Über den Link in jeder Angebotsmail können Sie sich abmelden.",
    success: "Sie sind angemeldet!", next: "Sie stehen auf unserer Mailingliste. Sobald wir Neuigkeiten oder ein Angebot haben, informieren wir Sie per E-Mail.",
    range: "Zum Sortiment", retry: "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
    limited: "Sie haben es mehrmals versucht. Bitte versuchen Sie es später erneut.",
    photo: "Die Fischtheke am Marktstand von Schaap’s", js: "Aktivieren Sie JavaScript, um sich anzumelden.",
  },
} as const;

export function discountSignupCopy(locale: string) {
  return copy[locale === "en" || locale === "de" ? locale : "nl"];
}
