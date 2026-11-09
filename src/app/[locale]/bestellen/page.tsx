import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
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
    "nl": "De standaard visschaal kost € 16,50 per persoon en de luxe visschaal € 18,50. Extra producten betaalt u tegen winkelprijs.",
    "en": "The standard seafood platter costs €16.50 per person and the deluxe platter €18.50. Extras are charged at shop prices.",
    "de": "Die Standard-Fischplatte kostet 16,50 € pro Person, die Deluxe-Fischplatte 18,50 €. Extras berechnen wir zum Ladenpreis."
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
        intro={aanvraagIntro[locale as keyof typeof aanvraagIntro] ?? aanvraagIntro.nl}
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
        <Link className="knop knop-navy" href={`/${locale}/visschalen#maatwerk`}>{locale === "de" ? "Fischplatte zusammenstellen" : locale === "en" ? "Build your seafood platter" : "Stel uw visschaal samen"} →</Link>
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
