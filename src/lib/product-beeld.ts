import type { Product } from "./assortiment-data";

/** One source for catalogue cards, details and metadata. */
export function productPhoto(product: Product) {
  if (["varlaks-zalm", "zalmfilet"].includes(product.slug)) {
    return { src: "/images/editorial/zalm.webp", editorial: true, alt: "Zalm met citroen en dille — serveerinspiratie" };
  }
  if (product.slug === "kibbeling") {
    return { src: "/images/editorial/kibbeling.webp", editorial: true, alt: "Krokante kibbeling met saus" };
  }
  return product.photo ? { src: product.photo, editorial: false, alt: product.naam } : null;
}
