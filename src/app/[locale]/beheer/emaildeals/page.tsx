import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsletterCampaignPortal } from "@/components/account/NewsletterCampaignPortal";
import { paginaMetadata } from "@/lib/seo";

const locales = ["nl", "en", "de"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  const title = locale === "de" ? "E-Mail-Angebote verwalten" : locale === "en" ? "Manage email offers" : "E-maildeals beheren";
  const description = locale === "de" ? "Interne Verwaltung für den Versand bestätigter E-Mail-Angebote." : locale === "en" ? "Internal management for sending email offers to confirmed subscribers." : "Interne omgeving voor e-maildeals aan bevestigde inschrijvers.";
  return { ...paginaMetadata({ locale, pad: "/beheer/emaildeals", title, description, geenIndex: true }), robots: { index: false, follow: false } };
}

export default async function EmailOffersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  return <NewsletterCampaignPortal locale={locale} />;
}
