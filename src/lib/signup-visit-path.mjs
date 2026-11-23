export const legacyVisitConsentVersion = "signup-visit-v1";
export const visitConsentVersion = "signup-visit-v2";
export const maxVisitPages = 20;
export const visitMinutes = 30;

// Keep only shop content. Never record form values, queries, fragments or private routes.
export function signupVisitPath(value) {
  if (typeof value !== "string" || value.length > 150) return "";
  const path = value.replace(/\/$/, "");
  const section = /^\/(nl|en|de)(\/(aanbiedingen|assortiment|barbecue-gourmet|bezoek-ons|bezorgen|biologische-vis|blog|contact|feestdagen|frischer-fisch-leiden|gourmetschotel|marktkraam-leiden|ons-verhaal|recepten|relatiegeschenken|too-good-to-go|varlaks|viskalender|visschalen|viswinkel-leiden|viswinkel-voorschoten))?$/;
  const detail = /^\/(nl|en|de)\/(assortiment|recepten|blog|bezorgen|feestdagen)\/[a-z0-9][a-z0-9-]{0,99}$/;
  return section.test(path) || detail.test(path) ? path : "";
}
