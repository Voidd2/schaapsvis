import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminBootstrapPortal } from "@/components/account/AdminBootstrapPortal";
import { paginaMetadata } from "@/lib/seo";

const locales = ["nl", "en", "de"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  const title = locale === "de" ? "Verwaltungskonto aktivieren" : locale === "en" ? "Activate admin account" : "Beheeraccount activeren";
  return { ...paginaMetadata({ locale, pad: "/beheer/start", title, description: title, geenIndex: true }), robots: { index: false, follow: false } };
}

export default async function AdminBootstrapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  return <AdminBootstrapPortal locale={locale} />;
}
