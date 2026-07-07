import type { Metadata } from "next";
import { actieveBon } from "@/lib/kortingsbonnen";
import { Kortingsbon } from "./Kortingsbon";

export const metadata: Metadata = {
  title: "Kortingsbon — Schaap's Vishandel",
  robots: { index: false, follow: false },
};

export default async function KortingsbonPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { code } = await params;
  return <Kortingsbon code={code} bon={actieveBon} />;
}
