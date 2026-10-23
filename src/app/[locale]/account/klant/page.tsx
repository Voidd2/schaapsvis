import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { paginaMetadata } from "@/lib/seo";

const copy = {
  nl: {
    title: "Klantaccount | Schaap’s Vishandel",
    description: "Klantaccounts voor bezorgen en spaarpunten zijn in ontwikkeling bij Schaap’s Vishandel.",
    eyebrow: "VOOR KLANTEN",
    heading: "Een klantaccount komt eraan.",
    intro: "We bereiden een klantaccount voor waarmee u later bestellingen, bezorging en spaarpunten kunt beheren. Inloggen en registreren zijn nog niet beschikbaar; we activeren dit pas als de accountservice en opslag goed zijn ingericht.",
    button: "Bekijk ons assortiment",
    student: "Student? Naar het studentenaccount →",
    contact: "Heeft u een vraag? Neem contact op via WhatsApp.",
  },
  en: {
    title: "Customer account | Schaap’s Vishandel",
    description: "Customer accounts for delivery and loyalty points are in development at Schaap’s Vishandel.",
    eyebrow: "FOR CUSTOMERS",
    heading: "A customer account is coming.",
    intro: "We are preparing a customer account where you can manage orders, delivery and loyalty points in the future. Sign-in and registration are not available yet; we will enable them only after the account service and storage are properly configured.",
    button: "Explore our range",
    student: "Student? Go to the student account →",
    contact: "Have a question? Contact us on WhatsApp.",
  },
  de: {
    title: "Kundenkonto | Schaap’s Vishandel",
    description: "Kundenkonten für Lieferung und Treuepunkte sind bei Schaap’s Vishandel in Vorbereitung.",
    eyebrow: "FÜR KUNDEN",
    heading: "Ein Kundenkonto kommt bald.",
    intro: "Wir bereiten ein Kundenkonto vor, mit dem Sie später Bestellungen, Lieferung und Treuepunkte verwalten können. Anmeldung und Registrierung sind noch nicht verfügbar. Wir schalten sie erst frei, wenn Kontodienst und Speicher sicher eingerichtet sind.",
    button: "Sortiment ansehen",
    student: "Student? Zum Studentenkonto →",
    contact: "Haben Sie eine Frage? Schreiben Sie uns per WhatsApp.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in copy)) notFound();
  const c = copy[locale as keyof typeof copy];
  return {
    ...paginaMetadata({ locale, pad: "/account/klant", title: c.title, description: c.description }),
    robots: { index: false, follow: false },
  };
}

export default async function CustomerAccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in copy)) notFound();
  const c = copy[locale as keyof typeof copy];

  return <main className="section-wrap max-w-4xl py-14 md:py-20">
    <p className="kapitaal">{c.eyebrow}</p>
    <h1 className="mt-3 font-display text-4xl font-bold text-slate-900 md:text-5xl">{c.heading}</h1>
    <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">{c.intro}</p>
    <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <Link className="knop knop-navy" href={`/${locale}/assortiment`}>{c.button}</Link>
      <Link className="font-semibold text-sky-800 underline underline-offset-4" href={`/${locale}/account`}>{c.student}</Link>
    </div>
    <p className="mt-10 border-t border-sky-200 pt-6 text-sm text-slate-600">
      {c.contact} {" "}
      <a className="font-semibold text-sky-800 underline underline-offset-4" href={`https://wa.me/31624811678?text=${encodeURIComponent("Hallo Schaap’s Vishandel, ik heb een vraag over mijn account.")}`}>WhatsApp →</a>
    </p>
  </main>;
}
