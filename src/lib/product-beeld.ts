import type { Product } from "./assortiment-data";

export type ProductPhoto = {
  src: string;
  alt: string;
  editorial: boolean;
  whole: boolean;
  credit?: { author: string; source: string; license: string; licenseUrl: string };
};

// Product-matched photos, with attribution wherever an external license requires it.
const PRODUCT_BEELDEN: Record<string, Pick<ProductPhoto, "src" | "alt" | "credit">> = {
  "krabsalade": { src: "/images/editorial/krabsalade.webp", alt: "Romige krabsalade met lenteui — serveerinspiratie" },
  "noorse-garnalen": { src: "/images/editorial/noorse-garnalen.webp", alt: "Gepelde Noorse garnalen met citroen — serveerinspiratie" },
  "schol": {
    src: "/images/producten-hd/schol-hans-hillewaert.jpg",
    alt: "Echte Noordzeeschol (Pleuronectes platessa), gefotografeerd door Hans Hillewaert",
    credit: {
      author: "Hans Hillewaert",
      source: "https://commons.wikimedia.org/wiki/File:Pleuronectes_platessa.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
  "zeebaars": { src: "/images/editorial/zeebaars.webp", alt: "Hele zeebaars op een witte schaal" },
  "zalmsalade": { src: "/images/editorial/zalmsalade.webp", alt: "Romige zalmsalade met dille — serveerinspiratie" },
  "tonijnsalade": { src: "/images/editorial/tonijnsalade.webp", alt: "Tonijnsalade met ui en augurk — serveerinspiratie" },
  "garnalensalade": { src: "/images/editorial/garnalensalade.webp", alt: "Hollandse garnalen in cocktailsaus — serveerinspiratie" },
  "zeeuwse-mosselen": { src: "/images/editorial/zeeuwse-mosselen.webp", alt: "Zeeuwse mosselen in gesloten schelpen" },
  "haring": { src: "/images/editorial/hollandse-nieuwe-uitjes.webp", alt: "Hollandse haring met uitjes en augurk — serveerinspiratie" },
  "gravad-lax": { src: "/images/recepten/gravlaks.webp", alt: "Gesneden gravlaks met dille — serveerinspiratie" },
  "lekkerbek": { src: "/images/recepten/lekkerbek-koolsalade.webp", alt: "Krokante lekkerbek met koolsalade — serveerinspiratie" },
  "broodje-haring": { src: "/images/recepten/broodje-haring-uitjes.webp", alt: "Broodje haring met uitjes — serveerinspiratie" },
  "vissoep": { src: "/images/recepten/romige-vissoep.webp", alt: "Romige vissoep — serveerinspiratie" },
  "poke-bowl-zalm": { src: "/images/recepten/poke-bowl-verse-zalm.webp", alt: "Pokébowl met zalm, rijst en groenten — serveerinspiratie" },
  "visschaal": { src: "/images/editorial/visschaal-inspiratie.webp", alt: "Voorbeeld van een visschaal; inhoud en formaat in overleg" },
  "feestschotel": { src: "/images/editorial/feestschaal-voorbeeld.webp", alt: "Voorbeeld van een feestschaal; inhoud en formaat in overleg" },
};

/** One source for catalogue cards, details and metadata. */
export function productPhoto(product: Product): ProductPhoto | null {
  const beeld = PRODUCT_BEELDEN[product.slug];
  if (beeld) return { ...beeld, editorial: true, whole: ["schol", "zeebaars"].includes(product.slug) };
  if (["varlaks-zalm", "zalmfilet"].includes(product.slug)) {
    return { src: "/images/editorial/zalm.webp", editorial: true, whole: false, alt: "Zalm met citroen en dille — serveerinspiratie" };
  }
  if (product.slug === "kibbeling") {
    return { src: "/images/editorial/kibbeling.webp", editorial: true, whole: false, alt: "Krokante kibbeling met saus" };
  }
  return product.photo ? { src: product.photo, editorial: false, whole: true, alt: product.naam } : null;
}
