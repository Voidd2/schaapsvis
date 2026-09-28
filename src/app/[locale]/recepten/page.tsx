import { Schema } from "@/components/Schema";
import type { Metadata } from "next";
import { bestelContact } from "@/lib/bestel-contact";
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
    title: "Visrecepten met zalm, kabeljauw en meer | Schaap’s Vis",
    description:
      "Vind uw visrecept op vissoort, tijd en moeilijkheid. Met stappen, boodschappenlijst en advies van Schaap’s Vishandel in Leiden.",
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
      <Schema data={{ "@context": "https://schema.org", "@type": "ItemList", name: "Visrecepten", itemListElement: recepten.map((r, i) => ({ "@type": "ListItem", position: i + 1, url: `${BEDRIJF.domein}/nl/recepten/${r.slug}`, name: r.title })) }} />

      <PaginaKop
        kruimels={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: "Recepten" }]}
        label="Koken met verse vis"
        titel="Goed eten begint bij goede vis."
        intro="39 visrecepten voor doordeweeks, een lange lunch of een bijzonder diner. Kies uw vis, vind een gerecht en neem een handig boodschappenlijstje mee."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          { label: "De viskalender", href: `/${locale}/viskalender`, soort: "lijn" },
        ]}
        feiten={[
          { label: "Recepten", waarde: `${recepten.length}` },
          { label: "Snelste", waarde: "5 minuten" },
          { label: "Vis", waarde: "Van onze eigen toonbank" },
        ]}
      />

      <Sectie grond="papier">
        <Kop
          label="Vind uw volgende favoriet"
          titel="Alle recepten"
          intro="Zoek een gerecht of kies de vis, tijd en moeilijkheid die bij uw avond passen."
        />
        <ReceptenClient />
      </Sectie>

      {/* ── Waar de recepten vandaan komen ───────────────────────────────── */}
      <Sectie grond="zand" smal>
        <Kop titel="Waar deze recepten vandaan komen" />
        <p className="lees" style={{ color: "var(--charcoal)" }}>
          Inspiratie voor een deel van de recepten komt van{" "}
          <a
            href="https://visrecepten.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4"
            style={{ color: "var(--navy)" }}
          >
            visrecepten.nl
          </a>
          . We hebben deze aangepast aan ons assortiment.
        </p>
      </Sectie>

      <PaginaSlot
        titel="Eerst de vis, dan het recept"
        tekst="Op zoek naar vis voor uw recept? Stuur ons een WhatsApp-bericht. We kijken graag wat mogelijk is. Alleen visschalen kunt u online bestellen."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          { label: "Visschaal samenstellen", href: `/${locale}/visschalen`, soort: "lijn" },
          { label: "Openingstijden en route", href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
      />
    </>
  );
}
