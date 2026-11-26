import Link from "next/link";

const copy = {
  nl: { label: "Onze locaties", leiden: "Viswinkel Leiden · Herenstraat 48", voorschoten: "Viskraam bij Hoogvliet in Voorschoten · vrijdag" },
  en: { label: "Our locations", leiden: "Fish shop in Leiden · Herenstraat 48", voorschoten: "Fish stall at Hoogvliet in Voorschoten · Fridays" },
  de: { label: "Unsere Standorte", leiden: "Fischgeschäft Leiden · Herenstraat 48", voorschoten: "Fischstand bei Hoogvliet in Voorschoten · freitags" },
};

/** Direct location links without implying that every product is always in stock. */
export function LocationLinks({ locale }: { locale: string }) {
  const lang = locale === "en" || locale === "de" ? locale : "nl";
  const c = copy[lang];
  return <nav aria-label={c.label} className="mt-6 flex min-w-0 flex-col items-start gap-3 text-base">
    <Link href={`/${lang}/viswinkel-leiden`} className="max-w-full font-semibold underline underline-offset-4">{c.leiden} →</Link>
    <Link href={`/${lang}/viswinkel-voorschoten`} className="max-w-full font-semibold underline underline-offset-4">{c.voorschoten} →</Link>
  </nav>;
}
