import { analyticsConsentKey } from "./journey-shared.mjs";

export type PopupVariant = "a" | "b";
export type PopupExperiment = "varlaks" | "locations";
export type PopupMeasurement = { consent: true; id: string; variant: PopupVariant };
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
  const headlines = experiment === "locations" ? locationsHeadlines : varlaksHeadlines;
  return headlines[locale === "en" || locale === "de" ? locale : "nl"][variant];
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
