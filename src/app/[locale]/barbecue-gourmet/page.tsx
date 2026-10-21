import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { BEDRIJF } from "@/lib/bedrijf";
import { bestelContact } from "@/lib/bestel-contact";
import { DIRKS_BARBECUE, selectieNaam } from "@/lib/dirks-selectie";
import { kruimelSchema, paginaMetadata, vraagSchema } from "@/lib/seo";
import { SelectieAanvraag } from "../visschalen/SelectieAanvraag";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return paginaMetadata({
    locale,
    pad: "/barbecue-gourmet",
    title: t("barbecueTitle"),
    description: t("barbecueDesc"),
    image: "/images/dirks/barbecuepakket.webp",
  });
}

export default async function BarbecueGourmetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "barbecuePage" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const vragen = t.raw("faq") as { v: string; a: string }[];
  const contact = bestelContact(locale, t("contactProduct"));

  return (
    <>
      <JsonLd locale={locale} />
      <Schema
        data={[
          kruimelSchema(locale, [
            { naam: BEDRIJF.naamKort, pad: "/" },
            { naam: nav("assortiment"), pad: "/assortiment" },
            { naam: t("crumb"), pad: "/barbecue-gourmet" },
          ]),
          vraagSchema(vragen),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t("selectieKop"),
            numberOfItems: DIRKS_BARBECUE.length,
            itemListElement: DIRKS_BARBECUE.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: selectieNaam(item.slug, locale),
              url: `${BEDRIJF.domein}/${locale}/barbecue-gourmet#${item.slug}`,
            })),
          },
        ]}
      />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: nav("assortiment"), href: `/${locale}/assortiment` },
          { naam: t("crumb") },
        ]}
        label={t("label")}
        titel={t("title")}
        intro={t("intro")}
        knoppen={[
          { label: t("browse"), href: "#barbecue-gourmet", soort: "lijn" },
          { label: contact.label, href: contact.href, extern: true },
        ]}
      />

      <Sectie grond="papier" id="selectie">
        <SelectieAanvraag
          locale={locale}
          showSpecial={false}
          heading={t("selectieKop")}
          intro={t("selectieIntro")}
          photoCaption={t("photoCaption")}
        />
      </Sectie>

      <Sectie grond="zand" smal>
        <Kop titel={t("faqHeading")} />
        <Vragen vragen={vragen} />
      </Sectie>

      <PaginaSlot
        titel={t("slotTitle")}
        tekst={t("slotText")}
        knoppen={[
          { label: contact.label, href: contact.href, extern: true },
          { label: nav("assortiment"), href: `/${locale}/assortiment`, soort: "lijn" },
        ]}
      />
    </>
  );
}
