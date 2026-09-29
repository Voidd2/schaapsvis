import type { Metadata } from "next";
import { actieveBon } from "@/lib/kortingsbonnen";
import { Kortingsbon } from "./Kortingsbon";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params; return {title: `${locale === "de" ? "Rabattgutschein" : locale === "en" ? "Discount voucher" : "Kortingsbon"} — Schaap’s Vishandel`,robots:{index:false,follow:false}};}

export default async function KortingsbonPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { code } = await params;
  return <Kortingsbon code={code} bon={actieveBon} />;
}
