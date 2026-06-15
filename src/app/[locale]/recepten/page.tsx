import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReceptenClient } from "./ReceptenClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("receptenTitle"),
    description: t("receptenDesc"),
    alternates: {
      canonical: `/${locale}/recepten`,
      languages: { nl: "/nl/recepten", en: "/en/recepten", de: "/de/recepten", "x-default": "/nl/recepten" },
    },
  };
}

export default async function ReceptenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ReceptenClient locale={locale} />;
}
