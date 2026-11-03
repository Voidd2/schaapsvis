"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardCheck, ShieldCheck, Mail, Users, ArrowLeft } from "lucide-react";

export function AdminNavigation({ locale }: { locale: string }) {
  const pathname = usePathname();
  const language = locale === "en" || locale === "de" ? locale : "nl";
  const copy = {
    nl: { title: "Beheeromgeving", back: "Naar de website", nav: "Beheernavigatie", labels: ["Statistieken", "Studentenaanvragen", "Pasbeveiliging", "E-mailaanbiedingen", "Klantaccounts"] },
    en: { title: "Administration", back: "Back to website", nav: "Administration navigation", labels: ["Analytics", "Student applications", "Pass security", "Email offers", "Customer accounts"] },
    de: { title: "Verwaltung", back: "Zur Website", nav: "Verwaltungsnavigation", labels: ["Statistiken", "Studentenanträge", "Pass-Sicherheit", "E-Mail-Angebote", "Kundenkonten"] },
  }[language];
  const items = [
    { path: "overzicht", icon: BarChart3 }, { path: "studenten", icon: ClipboardCheck },
    { path: "beveiliging", icon: ShieldCheck }, { path: "emaildeals", icon: Mail }, { path: "klanten", icon: Users },
  ];
  return <div className="admin-navigation section-wrap">
    <div className="admin-navigation-heading"><strong>{copy.title}</strong><Link href={`/${locale}`}><ArrowLeft size={18} aria-hidden />{copy.back}</Link></div>
    <nav aria-label={copy.nav}>{items.map(({ path, icon: Icon }, index) => {
      const href = `/${locale}/beheer/${path}`;
      return <Link key={path} href={href} aria-current={pathname === href ? "page" : undefined}><Icon size={20} aria-hidden /><span>{copy.labels[index]}</span></Link>;
    })}</nav>
  </div>;
}
