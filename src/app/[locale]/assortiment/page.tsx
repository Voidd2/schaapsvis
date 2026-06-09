import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PhotoPlaceholder } from "@/components/shared/PhotoPlaceholder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("assortimentTitle"),
    description: t("assortimentDesc"),
    alternates: {
      canonical: `/${locale}/assortiment`,
      languages: {
        nl: "/nl/assortiment",
        en: "/en/assortiment",
        de: "/de/assortiment",
      },
    },
  };
}

const products = [
  { name: "Kibbeling",                desc: "Knapperig gebakken, de Hollandse klassieker. Goudbruin van buiten, mals van binnen.",  fotoLabel: "FOTO TOEVOEGEN: Kibbeling op bakpapier",              highlight: false },
  { name: "Lekkerbek",                desc: "Verse wijting in een luchtig beslag. Heerlijk licht en knapperig.",                     fotoLabel: "FOTO TOEVOEGEN: Lekkerbek in beslag",                 highlight: false },
  { name: "Broodje Haring",           desc: "Vers, rauw, zoals het hoort. Met ui en augurk op een zacht broodje.",                   fotoLabel: "FOTO TOEVOEGEN: Broodje haring met ui en augurk",     highlight: false },
  { name: "Vissoep",                  desc: "Huisgemaakte soep vol smaak, elke dag vers bereid.",                                     fotoLabel: "FOTO TOEVOEGEN: Kom vissoep",                          highlight: false },
  { name: "Vispotje",                 desc: "Een verwend tussendoortje. Vol met lekkere stukken vis in een romige saus.",             fotoLabel: "FOTO TOEVOEGEN: Vispotje in schaaltje",               highlight: false },
  { name: "Feestelijke Visschotel",   desc: "Voor bijzondere gelegenheden. Een prachtige schaal met de beste vis.",                  fotoLabel: "FOTO TOEVOEGEN: Gevulde visschotel",                  highlight: false },
  { name: "Varlaks Biologische Zalm", desc: "Premium Noorse biologische zalm — zonder antibiotica, GMO of hormonen.",                fotoLabel: "FOTO TOEVOEGEN: Varlaks zalmfilet",                   highlight: true  },
  { name: "Verse Vis (Seizoensaanbod)",desc: "Vers dagaanbod wisselt per seizoen. Vraag ons naar het aanbod van de dag.",            fotoLabel: "FOTO TOEVOEGEN: Dag-aanbod verse vis op ijs",         highlight: false },
];

function AssortimentContent() {
  const t = useTranslations("assortimentPage");
  const locale = useLocale();

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 text-center px-4">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          {t("title")}
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-5" style={{ color: "rgba(247,240,227,0.75)" }}>
          {t("sub")}
        </p>
        <div
          className="inline-block px-4 py-2 text-sm"
          style={{ backgroundColor: "rgba(247,240,227,0.1)", color: "rgba(247,240,227,0.6)" }}
        >
          {t("note")}
        </div>
      </section>

      {/* Grid */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(({ name, desc, fotoLabel, highlight }) => (
              <article
                key={name}
                className={`overflow-hidden ${highlight ? "outline outline-2 outline-[var(--seafoam)]" : ""}`}
              >
                <div className="relative">
                  <PhotoPlaceholder label={fotoLabel} aspectRatio="aspect-square" />
                  {highlight && (
                    <div
                      className="absolute top-3 left-3 text-xs font-semibold px-2 py-0.5"
                      style={{ backgroundColor: "var(--seafoam)", color: "var(--cream)" }}
                    >
                      Biologisch
                    </div>
                  )}
                </div>
                <div
                  className="p-4"
                  style={{ backgroundColor: highlight ? "var(--sand)" : "white" }}
                >
                  <h3
                    className="font-bold text-base mb-1"
                    style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                  >
                    {name}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
                    {desc}
                  </p>
                  {highlight && (
                    <Link
                      href={`/${locale}/varlaks`}
                      className="inline-block mt-3 text-xs font-semibold underline underline-offset-2"
                      style={{ color: "var(--seafoam)" }}
                    >
                      Meer over Varlaks &rarr;
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-12 text-center px-4">
        <p className="font-bold text-xl mb-2" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
          Kom langs voor verse vis
        </p>
        <p className="text-sm mb-5" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
          Geen webshop — bel of kom langs voor actuele prijzen en aanbod.
        </p>
        <a
          href="tel:+31715149802"
          className="inline-block font-medium px-7 py-4 text-base text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--navy)" }}
        >
          071 514 9802
        </a>
      </section>
    </>
  );
}

export default async function AssortimentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <>
      <JsonLd />
      <AssortimentContent />
    </>
  );
}
