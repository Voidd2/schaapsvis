import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountPortal } from "@/components/account/AccountPortal";
import { paginaMetadata } from "@/lib/seo";

const locales = ["nl", "en", "de"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  const title = locale === "de" ? "Konto und Studentenrabatt" : locale === "en" ? "Account and student discount" : "Account en studentenkorting";
  const description = locale === "de"
    ? "Erstellen Sie ein Konto bei Schaap's Vishandel und beantragen Sie den Studentenrabatt mit Ihrer Hochschul-E-Mail oder einem aktuellen Studiennachweis."
    : locale === "en"
      ? "Create a Schaap's Vishandel account and apply for the student discount with your school email or current proof of enrolment."
      : "Maak een account bij Schaap's Vishandel en vraag studentenkorting aan met uw schoolmail of een actueel inschrijvingsbewijs.";
  return { ...paginaMetadata({ locale, pad: "/account", title, description }), robots: { index: false, follow: false } };
}

export default async function AccountPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ mode?: string | string[] }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  const initialMode = (await searchParams).mode === "register" ? "register" : "login";
  return <AccountPortal key={initialMode} locale={locale} initialMode={initialMode} />;
}
