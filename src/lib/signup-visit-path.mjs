export const visitConsentVersion = "signup-visit-v1";
export const maxVisitPages = 20;
export const visitMinutes = 30;

// Keep only shop content. Never record form values, queries, fragments or private routes.
export function signupVisitPath(value) {
  if (typeof value !== "string" || value.length > 150) return "";
  const path = value.replace(/\/$/, "");
  const section = /^\/(nl|en|de)(\/(aanbiedingen|assortiment|bezoek-ons|bezorgen|biologische-vis|blog|contact|frischer-fisch-leiden|marktkraam-leiden|ons-verhaal|recepten|too-good-to-go|varlaks|viskalender|viswinkel-leiden|viswinkel-voorschoten))?$/;
  const detail = /^\/(nl|en|de)\/(assortiment|recepten|blog|bezorgen)\/[a-z0-9][a-z0-9-]{0,99}$/;
  return section.test(path) || detail.test(path) ? path : "";
}
