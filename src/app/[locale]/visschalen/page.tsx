import { connection } from "next/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen, Kruimels } from "@/components/ui/Sectie";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { SelectieAanvraag } from "./SelectieAanvraag";
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
        <h1>{t("kop")}</h1>
        <p className="platter-intro-text">{t("inleiding")}</p>
        <nav className="platter-family-links" aria-label={t("schaalKop")}>
          {(["klassiek", "luxe", "hapjes"] as const).map((family, i) => <a key={family} href={`#schalen-${family}`}>{(locale === "de" ? ["Klassisch", "Deluxe", "Häppchen"] : locale === "en" ? ["Classic", "Deluxe", "Bites"] : ["Klassiek", "Luxe", "Hapjes"])[i]} ↓</a>)}
        </nav>
        <a className="platter-advice-link" href={bestelContact(locale, nav("visschalen")).href} target="_blank" rel="noopener noreferrer">{t("adviesLink")}</a>
      </section>

      {/* ── Samenstellen ──────────────────────────────────────────────────── */}
      <Sectie grond="papier" id="samenstellen">
        <SelectieAanvraag locale={locale} showSpecial={false} showBarbecue={false} showPlatters />
      </Sectie>

      <aside className="section-wrap pb-8 text-sm"><p className="border-t pt-5 border-[var(--linen)]">{t("maatwerkRichtbedrag")}</p></aside>

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
