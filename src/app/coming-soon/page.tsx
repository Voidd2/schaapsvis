import type { Metadata } from "next";
import { ComingSoon } from "./ComingSoon";

export const metadata: Metadata = {
  title: "Binnenkort online — Schaap's Vishandel Leiden",
  description:
    "We werken aan onze nieuwe website. Binnenkort: visrecepten, online bestellingen en informatie over de herkomst van onze vis. Schaap's Vishandel, Herenstraat 48 Leiden.",
  // Tijdens de onderhoudsfase niet indexeren.
  robots: { index: false, follow: false },
};

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return <ComingSoon error={sp.error === "1"} />;
}
