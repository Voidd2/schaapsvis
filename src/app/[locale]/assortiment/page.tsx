import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { SeizoensBanner } from "@/components/shared/SeizoensBanner";
import { Sectie, Kruimels } from "@/components/ui/Sectie";
import { AssortimentFilter } from "./AssortimentFilter";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { bezorgdagenTekst } from "@/lib/bezorging";
import { products, CATEGORIE_LABELS, type Categorie } from "@/lib/assortiment-data";

const SCENE: Record<Categorie, string> = {
  "verse-vis": "/images/scene-vis.svg",
  "gerookte-vis": "/images/scene-gerookt.svg",
  "schaal-schelp": "/images/scene-schaaldier.svg",
  vissalades: "/images/scene-vis.svg",
  bereid: "/images/scene-vis.svg",
};

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

  const lijstSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Assortiment ${BEDRIJF.naam}, Leiden`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BEDRIJF.domein}/${locale}/assortiment/${p.slug}`,
      item: {
        "@type": "Product",
        name: p.naam,
        url: `${BEDRIJF.domein}/${locale}/assortiment/${p.slug}`,
        description: `${p.desc} Ingrediënten en allergenen: ${p.ingredienten}`,
        category: CATEGORIE_LABELS[p.categorie],
        brand: { "@type": "Brand", name: BEDRIJF.naam },
        image: `${BEDRIJF.domein}${p.photo ?? SCENE[p.categorie]}`,
        ...(p.badge ? { award: p.badge } : {}),
      },
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

      {/* ── Kop ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Kruimels
            donker
            items={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: nav("assortiment") }]}
          />
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 items-end">
            <div>
              <p className="kapitaal kapitaal-licht mb-3">{h("assortimentLabel")}</p>
              <h1 className="text-[2.1rem] md:text-[2.9rem] mb-4" style={{ color: "var(--cream)" }}>
                {t("title")}
              </h1>
              <p
                className="text-[1.05rem] leading-relaxed max-w-2xl"
                style={{ color: "rgba(250,246,239,0.82)" }}
              >
                {t("sub")}
              </p>
            </div>

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
          </div>
        </div>
      </section>

      <AssortimentFilter />

      {/* ── Afsluiting ────────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 md:items-end">
          <div>
            <h2 className="text-[1.6rem] mb-3">{h("bezorgKop")}</h2>
            <p className="lees" style={{ color: "var(--charcoal)" }}>
              {h("bezorgTekst")}
            </p>
            <p className="mt-3 text-[0.95rem]" style={{ color: "var(--charcoal)" }}>
              {bezorgdagenTekst()}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/bestellen`} className="knop knop-rood">
              {nav("bestellen")}
            </Link>
            <Link href={`/${locale}/bezoek-ons`} className="knop knop-lijn">
              {nav("locaties")}
            </Link>
          </div>
        </div>
      </Sectie>
    </>
  );
}
