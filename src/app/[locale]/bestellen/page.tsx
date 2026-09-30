import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { VisschaalAanvraag } from "./VisschaalAanvraag";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie } from "@/components/ui/Sectie";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { BEDRIJF, euro } from "@/lib/bedrijf";
import { BEZORGING, bezorgdagenTekst } from "@/lib/bezorging";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return paginaMetadata({
    locale,
    pad: "/bestellen",
    geenIndex: true,
    title: t("bestellenTitle"),
    description: t("bestellenDesc"),
  });
}

export default async function BestellenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bestel" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });

  const aanvraagIntro = {
    nl: "We rekenen gemiddeld op ongeveer € 17,50 per persoon. Vertel ons via WhatsApp voor hoeveel gasten en welke gelegenheid de visschaal is; we denken graag mee over wat u lekker vindt.",
    en: "As a guide, we average around €17.50 per person. Tell us on WhatsApp how many guests and what occasion the platter is for; we are happy to help choose a selection.",
    de: "Als Richtwert rechnen wir im Durchschnitt mit etwa 17,50 € pro Person. Teilen Sie uns per WhatsApp Gästezahl und Anlass mit; wir beraten Sie gern zur Auswahl.",
  };

  return (
    <>
      <JsonLd locale={locale} />
      <Schema
        data={kruimelSchema(locale, [
          { naam: BEDRIJF.naamKort, pad: "/" },
          { naam: nav("bestellen"), pad: "/bestellen" },
        ])}
      />

      <PaginaKop
        kruimels={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: nav("bestellen") }]}
        label={t("eyebrow")}
        titel={t("kop")}
        intro={process.env.BESTELLING_WEBHOOK_URL ? t("inleiding") : (aanvraagIntro[locale as keyof typeof aanvraagIntro] ?? aanvraagIntro.nl)}
        feiten={[
          { label: g("bezorgen"), waarde: bezorgdagenTekst(locale) },
          {
            label: g("gratis"),
            waarde: `${g("vanaf")} ${euro(BEZORGING.gratisVanaf)}`,
          },
          { label: g("afhalen"), waarde: `${g("gratis")} — ${BEDRIJF.adres.straat}` },
        ]}
      />

      <Sectie grond="papier">
        <VisschaalAanvraag />
      </Sectie>

      <PaginaSlot
        titel={g("slotTitel")}
        tekst={g("slotTekst")}
        knoppen={[
          { label: nav("visschalen"), href: `/${locale}/visschalen` },

          { label: nav("locaties"), href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
      />
    </>
  );
}
