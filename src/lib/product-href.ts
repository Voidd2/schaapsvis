export function productHref(locale: string, slug: string) {
  return slug === "varlaks-zalm" ? `/${locale}/varlaks#film` : `/${locale}/assortiment/${slug}`;
}
