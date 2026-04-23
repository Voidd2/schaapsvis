import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BestellenForm } from "./BestellenForm";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("bestellenTitle"),
    description: t("bestellenDesc"),
    alternates: {
      canonical: `/${locale}/bestellen`,
      languages: {
        nl: "/nl/bestellen",
        en: "/en/bestellen",
        de: "/de/bestellen",
      },
    },
  };
}

export default async function BestellenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <>
      <JsonLd />
      <BestellenForm />
    </>
  );
}
