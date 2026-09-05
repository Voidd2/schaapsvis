import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { SeizoensBanner } from "@/components/shared/SeizoensBanner";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { AssortimentFilter } from "./AssortimentFilter";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { bezorgdagenTekst } from "@/lib/bezorging";
import { products } from "@/lib/assortiment-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return paginaMetadata({
    locale,
    pad: "/assortiment",
    title: t("assortimentTitle"),
    description: t("assortimentDesc"),
  });
}

export default async function AssortimentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assortimentPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const h = await getTranslations({ locale, namespace: "home" });

  // Alleen de adressen, geen volledige productgegevens. Die staan al op de
  // detailpagina's zelf, en 129 producten mét beschrijving en allergenen maakte
  // deze pagina 78 KB zwaarder — dat gaat ten koste van de laadscores waar
  // Google op let, zonder dat het iets oplevert.
  const lijstSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Assortiment ${BEDRIJF.naam}, Leiden`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BEDRIJF.domein}/${locale}/assortiment/${p.slug}`,
      name: p.naam,
    })),
  };

  return (
    <>
      <JsonLd locale={locale} />
      <Schema
        data={[
          lijstSchema,
          kruimelSchema(locale, [
            { naam: BEDRIJF.naamKort, pad: "/" },
            { naam: nav("assortiment"), pad: "/assortiment" },
          ]),
        ]}
      />

      <SeizoensBanner locale={locale} />

      <PaginaKop
        kruimels={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: nav("assortiment") }]}
        label={h("assortimentLabel")}
        titel={t("title")}
        intro={t("sub")}
        knoppen={[
          { label: nav("bestellen"), href: `/${locale}/bestellen` },
          { label: nav("visschalen"), href: `/${locale}/visschalen`, soort: "lijn" },
        ]}
        zijkant={
          <div style={{ borderTop: "1px solid rgba(250,246,239,0.3)" }} className="pt-4">
            <p className="kapitaal kapitaal-licht mb-2">{h("bezorgLabel")}</p>
            <p className="text-[0.95rem] leading-relaxed" style={{ color: "rgba(250,246,239,0.82)" }}>
              {h("bezorgWel1")}. {h("bezorgNiet1")} — {h("bezorgNietKop").toLowerCase()}.
            </p>
            <Link
              href={`/${locale}/bezorgen`}
              className="inline-block mt-3 text-sm font-semibold underline underline-offset-4"
              style={{ color: "var(--cream)" }}
            >
              {h("bezorgLink")} &rarr;
            </Link>
          </div>
        }
      />

      <AssortimentFilter />

      <PaginaSlot
        titel={h("bezorgKop")}
        tekst={`${h("bezorgTekst")} ${bezorgdagenTekst()}.`}
        knoppen={[
          { label: nav("bestellen"), href: `/${locale}/bestellen` },
          { label: nav("visschalen"), href: `/${locale}/visschalen`, soort: "lijn" },
          { label: nav("locaties"), href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
      />

    </>
  );
}
