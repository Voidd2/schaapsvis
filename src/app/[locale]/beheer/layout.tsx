import type { ReactNode } from "react";
import { AdminNavigation } from "@/components/account/AdminNavigation";

export default async function AdminLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <div className="admin-workspace"><AdminNavigation locale={locale} />{children}</div>;
}
