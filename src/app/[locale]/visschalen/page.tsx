import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { VisschaalConfigurator } from "./VisschaalConfigurator";
import { SelectieAanvraag } from "./SelectieAanvraag";
import { paginaMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { bestelContact } from "@/lib/bestel-contact";
import { BEDRIJF, euro } from "@/lib/bedrijf";
import { SCHALEN, VANAF_BEDRAG } from "@/lib/visschaal";
import { GEMEENTEN } from "@/lib/bezorging";

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
    title: t("visschalenTitle", { bedrag: euro(VANAF_BEDRAG) }),
    description: t("visschalenDesc", { bedrag: euro(VANAF_BEDRAG) }),
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

  const duurste = Math.max(...SCHALEN.map((schaal) => schaal.prijs));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name:
      locale === "de"
        ? "Fischplatte von Schaap's Vishandel"
        : locale === "en"
          ? "Seafood platter from Schaap's Vishandel"
          : "Visschaal van Schaap's Vishandel",
    description:
      locale === "de"
        ? `Fischplatten ab ${euro(VANAF_BEDRAG)}, mit Extras nach Wunsch. Abholen in Leiden oder liefern lassen.`
        : locale === "en"
          ? `Seafood platters from ${euro(VANAF_BEDRAG)}, with extras of your choosing. Collect in Leiden or have it delivered.`
          : `Visschalen vanaf ${euro(VANAF_BEDRAG)}, met extra's naar keuze. Afhalen in Leiden of laten bezorgen.`,
    brand: { "@type": "Brand", name: BEDRIJF.naam },
    category: "Seafood platter",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: VANAF_BEDRAG.toFixed(2),
      highPrice: duurste.toFixed(2),
      offerCount: SCHALEN.length,
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
        cijfer={{ label: g("vanaf"), waarde: euro(VANAF_BEDRAG), onder: t("perSchaal") }}
      />

      {/* ── Samenstellen ──────────────────────────────────────────────────── */}
      <Sectie grond="papier" id="samenstellen">
        <VisschaalConfigurator />
      </Sectie>

      <Sectie grond="zand">
        <SelectieAanvraag locale={locale} showBarbecue={false} />
      </Sectie>

      {/* ── Praktisch ─────────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="text-[1.4rem] mb-3">{t("levertijdKop")}</h2>
            <p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>
              {t("levertijdTekst")}
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
        tekst={t("schaalUitleg")}
        knoppen={[
          { label: t("naarBestellen"), href: "#samenstellen", extern: true },
          {
            label: g("whatsapp"),
            href: bestelContact(locale,nav("visschalen")).href,
            extern: true,
            soort: "lijn",
          },
        ]}
      />

    </>
  );
}
