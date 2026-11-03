import { PlatterInquiry } from "@/components/PlatterInquiry";
import { inquiryText } from "@/lib/platter-inquiry";
import { platterPresentation } from "@/lib/platter-presentation";
import { connection } from "next/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen, Kruimels } from "@/components/ui/Sectie";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { SeafoodCatalog } from "@/components/catalog/SeafoodCatalog";
import { RequestListLink } from "@/components/catalog/RequestControls";
import { catalogText } from "@/lib/catalog-copy";
import { paginaMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { bestelContact } from "@/lib/bestel-contact";
import { BEDRIJF } from "@/lib/bedrijf";
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
    title: t("visschalenTitle"),
    description: t("visschalenDesc"),
  });
}

export default async function VisschalenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await connection();
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "visschaal" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const catalog = catalogText(locale);
  const presentation = platterPresentation(locale);
  const vragen = t.raw("faq") as { v: string; a: string }[];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: locale === "de" ? "Fischplatten für Veranstaltungen in Leiden" : locale === "en" ? "Seafood platters for events in Leiden" : "Visschalen voor evenementen in Leiden",
    description: vragen[0].a,
    serviceType: locale === "de" ? "Fischplatten für Feiern und Veranstaltungen" : locale === "en" ? "Seafood platters for parties and events" : "Visschalen voor borrels en evenementen",
    provider: { "@id": `${BEDRIJF.domein}/#winkel` },
    areaServed: GEMEENTEN.map((x) => ({ "@type": "City", name: x.naam })),
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

      <section className="platter-intro section-wrap">
        <Kruimels items={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: nav("visschalen") }]} />
        <p className="kapitaal mb-3">{t("eyebrow")}</p>
        <h1>{catalog.title}</h1>
        <p className="platter-intro-text">{catalog.intro}</p>
        <nav className="catalog-intro-links" aria-label={catalog.title}>
          <a href="#visschalen">{catalog.platters} ↓</a><a href="#gourmet">{catalog.gourmet} ↓</a><a href="#maatwerk">{catalog.custom}</a><RequestListLink locale={locale} />
        </nav>
      </section>
      <SeafoodCatalog locale={locale} />

      <Sectie grond="zand" id="maatwerk">
        <Kop titel={presentation.custom} intro={inquiryText(locale).intro} />
        <PlatterInquiry locale={locale} />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed">{t("maatwerkRichtbedrag")}</p>
      </Sectie>
      <Sectie grond="papier">
        <Kop titel={presentation.stepsTitle} />
        <ol className="grid gap-6 md:grid-cols-3">{presentation.steps.map((step, i) => <li key={step} className="border-t border-[var(--linen)] pt-4"><strong className="mr-3">{i + 1}.</strong>{step}</li>)}</ol>
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
        titel={t("hulpKop")}
        tekst={t("schaalUitleg")}
        knoppen={[
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
