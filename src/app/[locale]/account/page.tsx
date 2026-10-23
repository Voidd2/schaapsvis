import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountPortal } from "@/components/account/AccountPortal";
import { paginaMetadata } from "@/lib/seo";
import Link from "next/link";

const locales = ["nl", "en", "de"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  const title = locale === "de" ? "Konto und Studentenrabatt" : locale === "en" ? "Account and student discount" : "Account en studentenkorting";
  const description = locale === "de"
    ? "Erstellen Sie ein Konto bei Schaap's Vishandel und beantragen Sie den Studentenrabatt in Leiden."
    : locale === "en"
      ? "Create a Schaap's Vishandel account and apply for the student discount in Leiden."
      : "Maak een account bij Schaap's Vishandel en vraag studentenkorting in Leiden aan.";
  return { ...paginaMetadata({ locale, pad: "/account", title, description }), robots: { index: false, follow: false } };
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  const customerLabel = locale === "de" ? "Kundenkonto" : locale === "en" ? "Customer account" : "Klantaccount";
  const customerIntro = locale === "de"
    ? "Kundenkonten für Lieferung und Treuepunkte sind noch in Entwicklung."
    : locale === "en"
      ? "Customer accounts for delivery and loyalty points are still in development."
      : "Klantaccounts voor bezorging en spaarpunten zijn nog in ontwikkeling.";
  const customerLink = locale === "de" ? "Zum Kundenkonto →" : locale === "en" ? "Go to customer account →" : "Naar het klantaccount →";
  return <>
    <AccountPortal locale={locale} />
    <div className="section-wrap -mt-5 max-w-5xl pb-12">
      <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
        <h2 className="font-display text-xl font-bold text-slate-900">{customerLabel}</h2>
        <p className="mt-2 leading-relaxed text-slate-700">{customerIntro}</p>
        <Link href={`/${locale}/account/klant`} className="mt-3 inline-block font-semibold text-sky-800 underline underline-offset-4">{customerLink}</Link>
      </section>
    </div>
  </>;
}
