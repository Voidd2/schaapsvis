import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentSecurityPortal } from "@/components/account/StudentSecurityPortal";
import { paginaMetadata } from "@/lib/seo";

const locales = ["nl", "en", "de"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  const title = locale === "de" ? "Studentenpass-Sicherheit" : locale === "en" ? "Student pass security" : "Studentenpas Beveiliging";
  return { ...paginaMetadata({ locale, pad: "/beheer/beveiliging", title, description: title, geenIndex: true }), robots: { index: false, follow: false } };
}

export default async function StudentSecurityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  return <StudentSecurityPortal locale={locale} />;
}
