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
import { VANAF_BEDRAG } from "@/lib/visschaal";
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
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "visschaal" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const vragen = t.raw("faq") as { v: string; a: string }[];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: locale === "de" ? "Fischplatten für Veranstaltungen in Leiden" : locale === "en" ? "Seafood platters for events in Leiden" : "Visschalen voor evenementen in Leiden",
    description:
      locale === "de"
        ? `Fischplatten für Veranstaltungen in Leiden. Wir rechnen durchschnittlich mit etwa 17,50 € pro Person und beraten Sie per WhatsApp zu Auswahl und Anlass.`
        : locale === "en"
        ? `Seafood platters for events in Leiden. We average around €17.50 per person and advise on selections for each occasion via WhatsApp.`
          : `Visschalen voor evenementen in Leiden. We rekenen gemiddeld circa € 17,50 per persoon en denken via WhatsApp mee over smaak en gelegenheid.`,
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

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: nav("visschalen") },
        ]}
        label={t("eyebrow")}
        titel={t("kop")}
        intro={t("inleiding")}
        cijfer={{ label: t("gemiddeld"), waarde: euro(VANAF_BEDRAG), onder: t("perSchaal") }}
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
          { label: t("schaalKop"), href: "#samenstellen" },
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
