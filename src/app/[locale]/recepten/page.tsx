import type { Metadata } from "next";
import { ReceptenClient } from "./ReceptenClient";
import { JsonLd } from "@/components/JsonLd";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { eenTaalMetadata } from "@/lib/seo";
import { recepten } from "@/lib/recepten";
import { BEDRIJF } from "@/lib/bedrijf";

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

  return (
    <>
      <JsonLd />

      <PaginaKop
        kruimels={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: "Recepten" }]}
        label="Koken met verse vis"
        titel="Recepten met vis van de Herenstraat"
        intro="Bij elk recept staat wat u bij ons haalt en wat u nog even in de supermarkt meeneemt. Van vijftien minuten tot een middag werk — en eerlijk over hoe lastig het is."
        knoppen={[
          { label: "Verse vis bestellen", href: `/${locale}/bestellen` },
          { label: "De viskalender", href: `/${locale}/viskalender`, soort: "lijn" },
        ]}
        feiten={[
          { label: "Recepten", waarde: `${recepten.length}` },
          { label: "Snelste", waarde: "15 minuten" },
          { label: "Vis", waarde: "Van onze eigen toonbank" },
        ]}
      />

      <Sectie grond="papier">
        <Kop
          label="Kies op label"
          titel="Alle recepten"
          intro="Filter op waar u zin in heeft, of scroll gewoon door de lijst."
        />
        <ReceptenClient locale={locale} />
      </Sectie>

      {/* ── Waar de recepten vandaan komen ───────────────────────────────── */}
      <Sectie grond="zand" smal>
        <Kop titel="Waar deze recepten vandaan komen" />
        <p className="lees" style={{ color: "var(--charcoal)" }}>
          De meeste recepten op deze pagina zijn met toestemming overgenomen van{" "}
          <a
            href="https://visrecepten.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4"
            style={{ color: "var(--navy)" }}
          >
            visrecepten.nl
          </a>{" "}
          en aangepast naar wat wij in de winkel hebben liggen.
        </p>
      </Sectie>

      <PaginaSlot
        titel="Eerst de vis, dan het recept"
        tekst="Herenstraat 48 in Leiden, dinsdag tot en met zaterdag. Bestel vooruit, dan ligt het klaar — en vraag gerust wat er die dag het mooist is."
        knoppen={[
          { label: "Verse vis bestellen", href: `/${locale}/bestellen` },
          { label: "Visschaal samenstellen", href: `/${locale}/visschalen`, soort: "lijn" },
          { label: "Openingstijden en route", href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
      />
    </>
  );
}
