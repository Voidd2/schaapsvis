import type { Metadata } from "next";
import { ComingSoon } from "./ComingSoon";
import { FONT_KLASSEN } from "@/lib/fonts";

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
  // Deze pagina valt buiten de taal-layout en krijgt de lettertypen daar dus
  // niet van mee. Zonder deze klassen viel het wachtwoordscherm terug op de
  // systeemletter — en dat is het eerste wat een bezoeker van de site ziet.
  return (
    <html lang="nl" className={FONT_KLASSEN}><body>
      <ComingSoon error={sp.error === "1"} />
    </body></html>
  );
}
