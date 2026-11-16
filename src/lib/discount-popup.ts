import { analyticsConsentKey } from "./journey-shared.mjs";

export type PopupVariant = "a" | "b" | "c";
export type PopupExperiment = "varlaks" | "locations" | "sitewide";
export type PopupMeasurement = { consent: true; id: string; variant: PopupVariant };
const sitewideHeadlines = {
  nl: {
    a: "Nieuws en aanbiedingen van Schaap’s Vis in uw inbox.",
    b: "Blijf op de hoogte van Schaap’s Vis met nieuws en kortingsmails.",
    c: "Schrijf u in voor nieuws, acties en aanbiedingen van Schaap’s Vis.",
  },
  en: {
    a: "News and offers from Schaap’s Vis in your inbox.",
    b: "Stay up to date with Schaap’s Vis through news and offer emails.",
    c: "Sign up for news, promotions and offers from Schaap’s Vis.",
  },
  de: {
    a: "Neuigkeiten und Angebote von Schaap’s Vis in Ihrem Postfach.",
    b: "Bleiben Sie mit Neuigkeiten und Angebots-E-Mails von Schaap’s Vis auf dem Laufenden.",
    c: "Melden Sie sich für Neuigkeiten, Aktionen und Angebote von Schaap’s Vis an.",
  },
};
const varlaksHeadlines = {
  nl: { a: "Leuke kortingen van Schaapsvis in uw mailbox?", b: "Op de hoogte blijven van kortingen en nieuws van Schaapsvis?" },
  en: { a: "Fancy Schaapsvis discounts in your inbox?", b: "Want to hear about Schaapsvis discounts and shop news?" },
  de: { a: "Lust auf Rabatte von Schaapsvis per E-Mail?", b: "Über Rabatte und Neuigkeiten von Schaapsvis informiert bleiben?" },
};

const locationsHeadlines = {
  nl: { a: "Onze visaanbiedingen in uw mailbox?", b: "Nieuws en kortingsmails van Schaap’s Vis ontvangen?" },
  en: { a: "Our fish offers in your inbox?", b: "News and discount emails from Schaap’s Vis?" },
  de: { a: "Unsere Fischangebote per E-Mail?", b: "Neuigkeiten und Rabatt-E-Mails von Schaap’s Vis erhalten?" },
};

export function popupHeadline(experiment: PopupExperiment, locale: string, variant: PopupVariant) {
  if (experiment === "sitewide") return sitewideHeadlines[locale === "en" || locale === "de" ? locale : "nl"][variant];
  const headlines = experiment === "locations" ? locationsHeadlines : varlaksHeadlines;
  return headlines[locale === "en" || locale === "de" ? locale : "nl"][variant as "a" | "b"];
}

export function allowsPopupAnalytics() {
  try { return localStorage.getItem(analyticsConsentKey) === "accepted"; }
  catch { return false; }
}

export function recordPopupStage(experiment: PopupExperiment, measurement: PopupMeasurement, stage: "shown" | "filled") {
  if (!allowsPopupAnalytics()) return;
  void fetch(`/api/members/analytics/${experiment}-popup`, {
    method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
    body: JSON.stringify({ measurement, stage }),
  }).catch(() => undefined);
}
