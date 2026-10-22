import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteAnalyticsPortal } from "@/components/account/SiteAnalyticsPortal";
import { paginaMetadata } from "@/lib/seo";

const locales = ["nl", "en", "de"] as const;
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  const title = locale === "de" ? "Website-Statistiken" : locale === "en" ? "Website analytics" : "Website-statistieken";
  return { ...paginaMetadata({ locale, pad: "/beheer/overzicht", title, description: title, geenIndex: true }), robots: { index: false, follow: false } };
}
export default async function AnalyticsAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  return <SiteAnalyticsPortal locale={locale} />;
}
