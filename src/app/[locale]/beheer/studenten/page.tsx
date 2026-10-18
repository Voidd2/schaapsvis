import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentReviewPortal } from "@/components/account/StudentReviewPortal";
import { paginaMetadata } from "@/lib/seo";

const locales = ["nl", "en", "de"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  const title = locale === "de" ? "Studentenanträge verwalten" : locale === "en" ? "Review student applications" : "Studentaanvragen beoordelen";
  const description = locale === "de" ? "Interne Verwaltung für Studierendenanträge und Rabattpässe." : locale === "en" ? "Internal management of student applications and discount passes." : "Interne omgeving voor studentenaanvragen en kortingspassen.";
  return { ...paginaMetadata({ locale, pad: "/beheer/studenten", title, description, geenIndex: true }), robots: { index: false, follow: false } };
}

export default async function StudentApplicationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  return <StudentReviewPortal locale={locale} />;
}
