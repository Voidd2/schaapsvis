import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { VisschaalAanvraag } from "./VisschaalAanvraag";
import { BestellenForm } from "./BestellenForm";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie } from "@/components/ui/Sectie";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { sumupBeschikbaar } from "@/lib/betalen";
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

  // Of online betalen al kan, wordt op de server bepaald: de SumUp-sleutels
  // horen nooit in de browser terecht te komen.
  const sumupActief = sumupBeschikbaar();
  const aanvraagIntro = {
    nl: "Controleer uw visschaal en stuur uw aanvraag via WhatsApp. Wij bevestigen beschikbaarheid, afhalen of bezorgen en de definitieve prijs. Zoekt u andere vis? Neem contact met ons op; we kijken graag wat mogelijk is.",
    en: "Check your platter and send your enquiry on WhatsApp. We confirm availability, collection or delivery and the final price. Looking for other fish? Contact us to discuss what is possible.",
    de: "Prüfen Sie Ihre Fischplatte und senden Sie Ihre Anfrage per WhatsApp. Wir bestätigen Verfügbarkeit, Abholung oder Lieferung und den Endpreis. Andere Fischwünsche? Kontaktieren Sie uns; wir prüfen die Möglichkeiten.",
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
        <Suspense
          fallback={
            <p className="py-10 text-center" style={{ color: "var(--grijs)" }}>
              {t("bezig")}
            </p>
          }
        >
          {process.env.BESTELLING_WEBHOOK_URL ? <BestellenForm sumupActief={sumupActief} /> : <VisschaalAanvraag />}
        </Suspense>
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
