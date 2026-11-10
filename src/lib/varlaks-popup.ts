export type PopupVariant = "a" | "b";
export type PopupMeasurement = { consent: true; id: string; variant: PopupVariant };
const headlines = {
  nl: { a: "Leuke kortingen van Schaapsvis in uw mailbox?", b: "Op de hoogte blijven van kortingen en nieuws van Schaapsvis?" },
  en: { a: "Fancy Schaapsvis discounts in your inbox?", b: "Want to hear about Schaapsvis discounts and shop news?" },
  de: { a: "Lust auf Rabatte von Schaapsvis per E-Mail?", b: "Über Rabatte und Neuigkeiten von Schaapsvis informiert bleiben?" },
};

export function popupHeadline(locale: string, variant: PopupVariant) {
  return headlines[locale === "en" || locale === "de" ? locale : "nl"][variant];
}

export function allowsPopupAnalytics() {
  try { return localStorage.getItem("sv-analytics-consent-v1") === "accepted"; }
  catch { return false; }
}

export function recordPopupStage(measurement: PopupMeasurement, stage: "shown" | "filled") {
  if (!allowsPopupAnalytics()) return;
  void fetch("/api/members/analytics/varlaks-popup", {
    method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
    body: JSON.stringify({ measurement, stage }),
  }).catch(() => undefined);
}
