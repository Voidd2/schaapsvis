import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen, Kruimels } from "@/components/ui/Sectie";
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

      {/* ── Kop ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--navy)" }} className="pt-10 pb-14 md:pt-12 md:pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <Kruimels
            donker
            items={[
              { naam: BEDRIJF.naamKort, href: `/${locale}` },
              { naam: nav("visschalen") },
            ]}
          />
          <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-10 lg:gap-16 items-end">
            <div>
              <p className="kapitaal kapitaal-licht mb-4">{t("eyebrow")}</p>
              <h1
                className="text-[2.3rem] md:text-[3.4rem] leading-[1.06] mb-6"
                style={{ color: "var(--cream)" }}
              >
                {t("kop")}
              </h1>
              <p
                className="text-[1.05rem] leading-relaxed max-w-2xl"
                style={{ color: "rgba(250,246,239,0.82)" }}
              >
                {t("inleiding")}
              </p>
            </div>

            {/* Het cijfer waar het om draait, groot gezet. */}
            <div style={{ borderTop: "2px solid var(--gold)" }} className="pt-5">
              <p className="kapitaal kapitaal-licht mb-2">{g("vanaf")}</p>
              <p
                className="bedrag text-[3rem] leading-none"
                style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
              >
                {euro(GOEDKOOPSTE)}
              </p>
              <p className="text-[0.9rem] mt-2" style={{ color: "rgba(250,246,239,0.65)" }}>
                {t("per100")}
              </p>
            </div>
          </div>
        </div>
      </section>

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

      {/* ── Afsluiting ────────────────────────────────────────────────────── */}
      <Sectie grond="navy" smal>
        <h2 className="text-[1.8rem] mb-3" style={{ color: "var(--cream)" }}>
          {t("kop")}
        </h2>
        <p className="mb-7 leading-relaxed" style={{ color: "rgba(250,246,239,0.78)" }}>
          {t("vergelijkingKort", { markt: euro(MARKT.goedkoopstePerPersoon) })}
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#samenstellen" className="knop knop-rood">
            {t("naarBestellen")}
          </a>
          <Link href={`/${locale}/bezorgen`} className="knop knop-lijn-licht">
            {nav("bezorgen")}
          </Link>
          <a
            href={whatsappLink("Hallo Schaap's Vishandel, ik heb een vraag over een visschaal.")}
            target="_blank"
            rel="noopener noreferrer"
            className="knop knop-lijn-licht"
          >
            {g("whatsapp")}
          </a>
        </div>
      </Sectie>
    </>
  );
}
