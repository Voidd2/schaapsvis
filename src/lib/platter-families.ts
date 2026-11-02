import { DIRKS_VISSCHALEN } from "./dirks-selectie";
import { feestdagenProduct } from "./feestdagen-producten";

/** One family mapping for overview, detail navigation and URL validation. */
export const PLATTER_FAMILIES = ["klassiek", "luxe", "hapjes"] as const;
export type PlatterFamily = typeof PLATTER_FAMILIES[number];
export const platterFamilies = Object.fromEntries(PLATTER_FAMILIES.map(family => [
  family, DIRKS_VISSCHALEN.filter(item => item.groep === family && feestdagenProduct(item.slug)?.categorie === "visschalen"),
])) as Record<PlatterFamily, typeof DIRKS_VISSCHALEN>;

export function platterFamily(slug: string) {
  return PLATTER_FAMILIES.find(family => platterFamilies[family].some(item => item.slug === slug));
}

export function selectedPlatter(family: PlatterFamily, params: Pick<URLSearchParams, "get">) {
  return platterFamilies[family].find(item => item.slug === params.get(family)) ?? platterFamilies[family][0];
}

export function platterSelectionParams(search: string, family: PlatterFamily, slug: string) {
  const params = new URLSearchParams(search);
  params.set(family, slug);
  // Validate every supplied selection, including values for another family.
  for (const key of PLATTER_FAMILIES) if (params.has(key)) params.set(key, selectedPlatter(key, params).slug);
  return params;
}

export function platterDetailHref(locale: string, slug: string, search = "") {
  const family = platterFamily(slug);
  if (!family) return `/${locale}/feestdagen/${slug}`;
  return `/${locale}/feestdagen/${slug}?${platterSelectionParams(search, family, slug)}`;
}

export function platterOverviewHref(locale: string, slug: string, search = "") {
  const family = platterFamily(slug);
  if (!family) return `/${locale}/visschalen`;
  return `/${locale}/visschalen?${platterSelectionParams(search, family, slug)}#schalen-${family}`;
}

export function platterSizeLabel(slug: string, locale: string) {
  const family = platterFamily(slug);
  const item = family && platterFamilies[family].find(item => item.slug === slug);
  return item ? `${item.personenVan}–${item.personenTot} ${locale === "de" ? "Personen" : locale === "en" ? "people" : "personen"}` : "";
}

export const platterLabels = {
  nl: { back: "← Alle visschalen", size: "Kies het formaat", details: "Samenstelling en allergenen →" },
  en: { back: "← All seafood platters", size: "Choose a size", details: "Contents and allergens →" },
  de: { back: "← Alle Fischplatten", size: "Größe wählen", details: "Zusammenstellung und Allergene →" },
};
