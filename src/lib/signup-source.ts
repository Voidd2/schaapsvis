const copy = {
  nl: {
    unknown: "Bron niet vastgelegd", accountOnly: "Account zonder kortingsinschrijving",
    sources: {
      "sitewide-popup": "Nieuwsbriefpop-up op de website",
      "varlaks-popup": "Pop-up op de VÅRLAKS-pagina", "locations-popup": "Pop-up op de locatiepagina",
      "discount-form": "Kortingspagina · Aanmelden voor kortingen", "newsletter-form": "Nieuwsbriefformulier",
      "account-registration": "Bij het aanmaken van een account", account: "Formulier tijdens ingelogd bezoek",
      footer: "Nieuwsbrief onderaan de pagina",
    },
  },
  en: {
    unknown: "Source not recorded", accountOnly: "Account without a discount signup",
    sources: {
      "sitewide-popup": "Website newsletter pop-up",
      "varlaks-popup": "VÅRLAKS page pop-up", "locations-popup": "Locations page pop-up",
      "discount-form": "Discount signup page", "newsletter-form": "Newsletter form",
      "account-registration": "During account registration", account: "Form during a signed-in visit",
      footer: "Newsletter in the page footer",
    },
  },
  de: {
    unknown: "Quelle nicht erfasst", accountOnly: "Konto ohne Rabatt-Anmeldung",
    sources: {
      "sitewide-popup": "Newsletter-Popup auf der Website",
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

const trafficLabels = {
  nl: { newsletter: "E-mail / nieuwsbrief", other: "Andere website", direct_unknown: "Direct / onbekend", missing: "Niet vastgelegd" },
  en: { newsletter: "Email / newsletter", other: "Other website", direct_unknown: "Direct / unknown", missing: "Not recorded" },
  de: { newsletter: "E-Mail / Newsletter", other: "Andere Website", direct_unknown: "Direkt / unbekannt", missing: "Nicht erfasst" },
};
const platforms = { google: "Google", facebook: "Facebook", instagram: "Instagram", bing: "Bing" };

export function trafficSourceLabel(value: string | null | undefined, locale: string) {
  const labels = trafficLabels[locale === "de" || locale === "en" ? locale : "nl"];
  if (value && Object.hasOwn(platforms, value)) return platforms[value as keyof typeof platforms];
  if (value === "newsletter" || value === "other" || value === "direct_unknown") return labels[value];
  return labels.missing;
}

export function signupRegionLabel(value: string | null | undefined, locale: string) {
  if (!value) return null;
  if (value === "elders") return locale === "en" ? "Elsewhere" : locale === "de" ? "Andernorts" : "Elders";
  if (value === "regio-071") return locale === "en" ? "Elsewhere in area 071" : locale === "de" ? "Übriges Gebiet 071" : "Overig regio 071";
  return value[0].toUpperCase() + value.slice(1);
}
