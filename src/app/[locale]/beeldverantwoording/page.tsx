import type { Metadata } from "next";
import { products } from "@/lib/assortiment-data";
import { localizedProduct } from "@/lib/product-localization";
import { productPhoto } from "@/lib/product-beeld";
import { BEDRIJF } from "@/lib/bedrijf";
import { paginaMetadata } from "@/lib/seo";
import { FEESTDAGEN_PRODUCTEN } from "@/lib/feestdagen-producten";

type Props = { params: Promise<{ locale: string }> };

const COPY = {
  nl: {
    title: "Beeldverantwoording",
    intro: "Een deel van de productbeelden is afkomstig van externe fotografen en wordt lokaal op deze website getoond. Hieronder staan de bijbehorende bron- en licentiegegevens.",
    source: "Bron",
    license: "Licentie",
    credit: "Beeldverantwoording | Schaap’s Vishandel",
    description: "Bron- en licentiegegevens van externe productfoto’s op de website van Schaap’s Vishandel.",
  },
  en: {
    title: "Image credits",
    intro: "Some product images are by external photographers and are displayed locally on this website. Their source and license details are listed below.",
    source: "Source",
    license: "License",
    credit: "Image credits | Schaap’s Vishandel",
    description: "Source and license details for external product images on the Schaap’s Vishandel website.",
  },
  de: {
    title: "Bildnachweise",
    intro: "Einige Produktbilder stammen von externen Fotografen und werden lokal auf dieser Website angezeigt. Die zugehörigen Quellen und Lizenzangaben finden Sie unten.",
    source: "Quelle",
    license: "Lizenz",
    credit: "Bildnachweise | Schaap’s Vishandel",
    description: "Quellen- und Lizenzangaben für externe Produktbilder auf der Website von Schaap’s Vishandel.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "en" || locale === "de" ? locale : "nl";
  const copy = COPY[lang];
  return {
    ...paginaMetadata({ locale: lang, pad: "/beeldverantwoording", title: copy.credit, description: copy.description, geenIndex: true }),
    robots: { index: false, follow: true },
  };
}

export default async function BeeldverantwoordingPage({ params }: Props) {
  const { locale } = await params;
  const lang = locale === "en" || locale === "de" ? locale : "nl";
  const copy = COPY[lang];
  const productEntries = products.flatMap((product) => {
    const localized = localizedProduct(product.slug, lang);
    if (!localized) return [];
    const photo = productPhoto(localized, lang);
    return photo?.credit ? [{ name: localized.naam, credit: photo.credit }] : [];
  });
  const feestEntries = FEESTDAGEN_PRODUCTEN.map((product) => ({
    name: product.naam,
    credit: {
      author: "Dirks Vishandel",
      source: `https://www.dirksvishandel.nl/product/${product.slug}/`,
      license: lang === "de" ? "Nutzung mit Genehmigung (Angabe des Inhabers, 1. November 2026)" : lang === "en" ? "Used with permission (owner statement, 1 November 2026)" : "Gebruikt met toestemming (verklaring eigenaar, 1 november 2026)",
      licenseUrl: `https://www.dirksvishandel.nl/product/${product.slug}/`,
    },
  }));
  const entries = [...productEntries, ...feestEntries].filter((entry, index, all) =>
    all.findIndex((candidate) => candidate.name === entry.name && candidate.credit.source === entry.credit.source) === index,
  );

  return (
    <main className="section-wrap py-14 md:py-20">
      <p className="kapitaal mb-3">{BEDRIJF.naam}</p>
      <h1 className="text-4xl md:text-5xl mb-5">{copy.title}</h1>
      <p className="max-w-3xl mb-10 leading-relaxed">{copy.intro}</p>
      <ul className="max-w-4xl divide-y divide-sky-100 border-y border-sky-100">
        {entries.map(({ name, credit }) => (
          <li key={`${name}-${credit.source}`} className="py-4">
            <h2 className="font-semibold">{name}</h2>
            <p className="text-sm mt-1">
              {copy.source}: <a className="underline" href={credit.source} target="_blank" rel="noopener noreferrer">{credit.author}</a>
              {credit.license && credit.licenseUrl && <> · {copy.license}: <a className="underline" href={credit.licenseUrl} target="_blank" rel="license noopener noreferrer">{credit.license}</a></>}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
