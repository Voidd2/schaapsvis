import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { VisschaalConfigurator } from "./VisschaalConfigurator";
import { paginaMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { BEDRIJF, euro, whatsappLink } from "@/lib/bedrijf";
import { MARKT, MINIMUM_BEDRAG, ONDERDELEN } from "@/lib/visschaal";
import { GEMEENTEN } from "@/lib/bezorging";

/** De goedkoopste regel per 100 gram — waarmee de pagina "vanaf" kan zeggen. */
const GOEDKOOPSTE = Math.min(
  ...ONDERDELEN.filter((o) => !o.perStuk).map((o) => o.prijs)
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return paginaMetadata({
    locale,
    pad: "/visschalen",
    title: t("visschalenTitle", { bedrag: euro(GOEDKOOPSTE) }),
    description: t("visschalenDesc", { bedrag: euro(GOEDKOOPSTE) }),
  });
}

export default async function VisschalenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "visschaal" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const vragen = t.raw("faq") as { v: string; a: string }[];

  const duurste = Math.max(...ONDERDELEN.filter((o) => !o.perStuk).map((o) => o.prijs));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name:
      locale === "de"
        ? "Fischplatte nach Gewicht zusammenstellen"
        : locale === "en"
          ? "Build-your-own seafood platter, by weight"
          : "Visschaal samenstellen per 100 gram",
    description:
      locale === "de"
        ? `Sie wählen selbst, was auf die Platte kommt und wie viel, pro 100 Gramm — ab ${euro(GOEDKOOPSTE)} pro 100 g. Kein festes Paket.`
        : locale === "en"
          ? `You choose what goes on the platter and how much, per 100 grams — from ${euro(GOEDKOOPSTE)} per 100 g. No fixed package.`
          : `U kiest zelf wat er op de schaal komt en hoeveel, per 100 gram — vanaf ${euro(GOEDKOOPSTE)} per 100 g. Geen vast pakket.`,
    brand: { "@type": "Brand", name: BEDRIJF.naam },
    category: "Seafood platter",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: GOEDKOOPSTE.toFixed(2),
      highPrice: duurste.toFixed(2),
      offerCount: ONDERDELEN.length,
      availability: "https://schema.org/InStock",
      seller: { "@id": `${BEDRIJF.domein}/#winkel` },
      areaServed: GEMEENTEN.map((x) => ({ "@type": "City", name: x.naam })),
      url: `${BEDRIJF.domein}/${locale}/visschalen`,
    },
  };

  return (
    <>
      <JsonLd locale={locale} />
      <Schema
        data={[
          productSchema,
          vraagSchema(vragen),
          kruimelSchema(locale, [
            { naam: BEDRIJF.naamKort, pad: "/" },
            { naam: nav("visschalen"), pad: "/visschalen" },
          ]),
        ]}
      />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: nav("visschalen") },
        ]}
        label={t("eyebrow")}
        titel={t("kop")}
        intro={t("inleiding")}
        cijfer={{ label: g("vanaf"), waarde: euro(GOEDKOOPSTE), onder: t("per100") }}
      />

      {/* ── Samenstellen ──────────────────────────────────────────────────── */}
      <Sectie grond="papier" id="samenstellen">
        <VisschaalConfigurator />
      </Sectie>

      {/* ── Praktisch ─────────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="text-[1.4rem] mb-3">{t("levertijdKop")}</h2>
            <p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>
              {t("levertijdTekst")}
            </p>
            <p className="mt-3 text-[0.95rem]" style={{ color: "var(--grijs)" }}>
              {t("minimum", { bedrag: euro(MINIMUM_BEDRAG) })}
            </p>
          </div>
          <div>
            <h2 className="text-[1.4rem] mb-3">{t("allergieKop")}</h2>
            <p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>
              {t("allergieTekst")}
            </p>
          </div>
        </div>
      </Sectie>

      {/* ── Vragen ────────────────────────────────────────────────────────── */}
      <Sectie grond="papier" smal>
        <Kop titel={t("faqKop")} />
        <Vragen vragen={vragen} />
      </Sectie>

      <PaginaSlot
        titel={t("kop")}
        tekst={t("vergelijkingKort", { markt: euro(MARKT.goedkoopstePerPersoon) })}
        knoppen={[
          { label: t("naarBestellen"), href: "#samenstellen", extern: true },
          { label: nav("bezorgen"), href: `/${locale}/bezorgen`, soort: "lijn" },
          {
            label: g("whatsapp"),
            href: whatsappLink("Hallo Schaap's Vishandel, ik heb een vraag over een visschaal."),
            extern: true,
            soort: "lijn",
          },
        ]}
      />

    </>
  );
}
