import type { Metadata } from "next";
import { ReceptenClient } from "./ReceptenClient";
import { eenTaalMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  // De recepten zijn alleen in het Nederlands geschreven; één canonical
  // voorkomt dat dezelfde teksten onder /en/ en /de/ als aparte pagina's
  // meedoen en elkaar wegdrukken.
  return eenTaalMetadata({
    taal: "nl",
    pad: "/recepten",
    title: "Visrecepten van Schaap's Vis Leiden — kibbeling, zalm, haring en meer",
    description:
      "Recepten met vis van de Herenstraat: van kibbeling met knoflooksaus tot gravad lax en romige vissoep. Met boodschappenlijstje, bereidingstijd en wat je bij ons in de winkel haalt.",
  });
}

export default async function ReceptenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ReceptenClient locale={locale} />;
}
