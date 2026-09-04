import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen, Kruimels } from "@/components/ui/Sectie";
import { VisschaalConfigurator } from "./VisschaalConfigurator";
import { paginaMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { BEDRIJF, euro, whatsappLink } from "@/lib/bedrijf";
import { BASISSCHAAL, EXTRAS, STARTBEDRAG } from "@/lib/visschaal";
import { GEMEENTEN } from "@/lib/bezorging";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const bedrag = euro(STARTBEDRAG);
  return paginaMetadata({
    locale,
    pad: "/visschalen",
    title: t("visschalenTitle", { bedrag }),
    description: t("visschalenDesc", { bedrag }),
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

  // De schaal als product. Het hoogste bedrag is de basis plus één van alles —
  // niet meer dan een bovengrens, maar zo klopt het bereik met wat er te kiezen valt.
  const hoogste = STARTBEDRAG + EXTRAS.reduce((som, e) => som + e.prijs, 0);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name:
      locale === "de"
        ? "Fischplatte nach Wunsch"
        : locale === "en"
          ? "Made-to-order seafood platter"
          : "Visschaal op maat",
    description:
      locale === "de"
        ? `Grundplatte mit Räucherlachs, Makrele, Nordseekrabben, Salaten und Heringshäppchen, ab ${euro(STARTBEDRAG)}. Alle weiteren Zutaten wählen Sie selbst.`
        : locale === "en"
          ? `Base platter with smoked salmon, mackerel, Dutch shrimp, salads and herring bites from ${euro(STARTBEDRAG)}. You choose everything else that goes on it.`
          : `Basisschaal met gerookte zalm, makreel, Hollandse garnalen, salades en haringhapjes vanaf ${euro(STARTBEDRAG)}. Alles wat er verder op komt, kiest u zelf.`,
    brand: { "@type": "Brand", name: BEDRIJF.naam },
    category: "Seafood platter",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: STARTBEDRAG.toFixed(2),
      highPrice: hoogste.toFixed(2),
      offerCount: EXTRAS.length + 1,
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
      <section style={{ backgroundColor: "var(--navy)" }} className="py-14 md:py-18">
        <div className="max-w-6xl mx-auto px-4">
          <Kruimels
            donker
            items={[
              { naam: BEDRIJF.naamKort, href: `/${locale}` },
              { naam: nav("visschalen") },
            ]}
          />
          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-16 items-end">
            <div>
              <p className="kapitaal kapitaal-licht mb-3">{t("eyebrow")}</p>
              <h1 className="text-[2.1rem] md:text-[3.1rem] mb-5" style={{ color: "var(--cream)" }}>
                {t("kop")}
              </h1>
              <p
                className="text-[1.05rem] leading-relaxed max-w-2xl"
                style={{ color: "rgba(250,246,239,0.82)" }}
              >
                {t("inleiding", { bedrag: euro(STARTBEDRAG) })}
              </p>
            </div>
            <div style={{ borderTop: "2px solid var(--gold)" }} className="pt-4">
              <p className="kapitaal kapitaal-licht mb-1">{t("startbedrag")}</p>
              <p
                className="bedrag text-[2.6rem] leading-none"
                style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
              >
                {euro(STARTBEDRAG)}
              </p>
              <p className="text-sm mt-2" style={{ color: "rgba(250,246,239,0.6)" }}>
                {t("basisVoor", { personen: BASISSCHAAL.personen })}
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
        <p className="mb-7" style={{ color: "rgba(250,246,239,0.78)" }}>
          {t("extrasTekst")}
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#samenstellen" className="knop knop-rood">
            {t("naarBestellen")}
          </a>
          <Link href={`/${locale}/bezorgen`} className="knop knop-lijn-licht">
            {nav("bezorgen")}
          </Link>
          <a
            href={whatsappLink(
              "Hallo Schaap's Vishandel, ik heb een vraag over een visschaal."
            )}
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
