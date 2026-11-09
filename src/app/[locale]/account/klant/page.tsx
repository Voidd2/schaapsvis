import { notFound, permanentRedirect } from "next/navigation";

export default async function FormerCustomerAccount({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  permanentRedirect(`/${locale}/aanbiedingen`);
}
