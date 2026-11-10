const copy = {
  nl: {
    unknown: "Bron niet vastgelegd", accountOnly: "Account zonder kortingsinschrijving",
    sources: {
      "varlaks-popup": "Pop-up op de VÅRLAKS-pagina", "locations-popup": "Pop-up op de locatiepagina",
      "discount-form": "Kortingspagina · Aanmelden voor kortingen", "newsletter-form": "Nieuwsbriefformulier",
      "account-registration": "Bij het aanmaken van een account", account: "Formulier tijdens ingelogd bezoek",
      footer: "Nieuwsbrief onderaan de pagina",
    },
  },
  en: {
    unknown: "Source not recorded", accountOnly: "Account without a discount signup",
    sources: {
      "varlaks-popup": "VÅRLAKS page pop-up", "locations-popup": "Locations page pop-up",
      "discount-form": "Discount signup page", "newsletter-form": "Newsletter form",
      "account-registration": "During account registration", account: "Form during a signed-in visit",
      footer: "Newsletter in the page footer",
    },
  },
  de: {
    unknown: "Quelle nicht erfasst", accountOnly: "Konto ohne Rabatt-Anmeldung",
    sources: {
      "varlaks-popup": "Pop-up auf der VÅRLAKS-Seite", "locations-popup": "Pop-up auf der Standortseite",
      "discount-form": "Anmeldeseite für Rabatte", "newsletter-form": "Newsletterformular",
      "account-registration": "Bei der Kontoerstellung", account: "Formular während eines angemeldeten Besuchs",
      footer: "Newsletter am Seitenende",
    },
  },
};

export function signupSourceLabel(source: string | null | undefined, locale: string, accountOnly = false) {
  const t = copy[locale === "de" || locale === "en" ? locale : "nl"];
  if (!source && accountOnly) return t.accountOnly;
  if (source?.startsWith("footer:/")) return `${t.sources.footer} · ${source.slice(7)}`;
  if (source && Object.hasOwn(t.sources, source)) return t.sources[source as keyof typeof t.sources];
  return t.unknown;
}
