import Link from "next/link";
import { bestelContact } from "@/lib/bestel-contact";
import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { eenTaalMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { BEDRIJF, ADRES_REGEL, VERKOOPPUNTEN, whatsappLink } from "@/lib/bedrijf";

export async function generateMetadata(): Promise<Metadata> {
  // Deutschsprachige Landingpage; das niederländische Gegenstück steht unter
  // /nl/viswinkel-leiden.
  return eenTaalMetadata({
    taal: "de",
    pad: "/frischer-fisch-leiden",
    title: "Frischer Fisch in Leiden seit 1938 | Schaap's Vis",
    description:
      "Echter holländischer Fisch in Leiden: Kibbeling, Matjes, frische Nordseekrabben und Bio-Lachs. Fischgeschäft in der Herenstraat 48 und Wochenmarkt Mi und Sa. Seit 1938.",
    paren: { nl: "/viswinkel-leiden" },
  });
}

const FRAGEN = [
  {
    v: "Was ist Kibbeling?",
    a: "Kibbeling ist ein typisch holländisches Streetfood: knusprig frittierte Stücke von weißem Fisch (Kabeljau oder MSC-zertifizierter Alaska-Seelachs) in einem leichten, goldbraunen Teig, traditionell mit Knoblauchsauce. Bei uns täglich frisch zubereitet.",
  },
  {
    v: "Was ist Hollandse Nieuwe / Matjes und wann gibt es ihn?",
    a: "Hollandse Nieuwe ist roher, leicht gesalzener Hering aus dem Nordmeer — zarter, milder und fetter als normaler Hering, weil er vor dem Laichen gefangen wird. Die Saison beginnt traditionell Mitte Juni.",
  },
  {
    v: "Wann und wo ist der Fischmarkt in Leiden?",
    a: "Unser Marktstand steht mittwochs und samstags im Stadtzentrum von Leiden, von 08:30 bis 17:00 Uhr — samstags am Aalmarkt bei der Waag, mittwochs bei Dille & Camille. Das Geschäft in der Herenstraat 48 ist dienstags bis freitags von 09:00 bis 18:00 und samstags von 09:00 bis 17:00 geöffnet; montags geschlossen.",
  },
  {
    v: "Wie isst man holländischen Hering?",
    a: "Am Schwanz halten und in einem Stück in den Mund gleiten lassen — das ist die traditionelle Art. Oder auf einem weichen Brötchen mit fein gehackten Zwiebeln und Gurken. Beides bekommen Sie am Stand.",
  },
  {
    v: "Liefern Sie auch nach Hause?",
    a: "Frischen Fisch und Fischplatten liefern wir in Leiden, Leiderdorp, Voorschoten, Wassenaar und Leidschendam. Gebackenen Fisch liefern wir nicht: Kibbeling schmeckt nach zwanzig Minuten in der Schachtel nicht mehr.",
  },
];

const PROBIEREN = [
  {
    naam: "Kibbeling",
    badge: "MSC",
    tekst:
      "Knusprig frittierte Stücke von weißem Fisch in leichtem, goldbraunem Teig, serviert mit Knoblauchsauce. Das beliebteste Fisch-Streetfood der Niederlande.",
    tip: "Am Stand essen, solange es warm ist.",
  },
  {
    naam: "Hollandse Nieuwe / Matjes",
    badge: "Saison: Juni–August",
    tekst:
      "Roher, leicht gesalzener Hering aus dem Nordmeer — zarter und fetter als normaler Hering. Ab Mitte Juni täglich frisch.",
    tip: "Am Schwanz halten und in einem Stück — die traditionelle Art.",
  },
  {
    naam: "Nordseegarnelen",
    badge: "MSC",
    tekst:
      "Die kleinen, aromatischen Nordseegarnelen (Crangon crangon) sind eine holländische Spezialität. Von Hand gepult, täglich frisch von der Wattenküste.",
    tip: "Auf Toast, im Brötchen oder pur.",
  },
  {
    naam: "Bio-Lachs Varlaks",
    badge: "BIO · ASC",
    tekst:
      "Bio-Lachs aus Nordnorwegen, über dem Polarkreis gezüchtet — ohne Antibiotika, ohne Gentechnik, ASC-zertifiziert. Deutlich vollerer Geschmack als normaler Zuchtlachs.",
    tip: "Auch kalt geräuchert erhältlich.",
  },
];

/** Marktzeiten auf Deutsch; Adresse und Route kommen aus den Firmendaten. */
const DAGEN_DE: Record<string, string> = {
  winkel: "Di–Fr 09:00–18:00 · Sa 09:00–17:00 Uhr",
  markt: "Samstags 08:30–17:00 Uhr",
  "markt-woensdag": "Mittwochs 08:30–17:00 Uhr",
  voorschoten: "Freitags 08:00–17:30 Uhr",
};

const NAAM_DE: Record<string, string> = {
  winkel: "Das Geschäft — Herenstraat",
  markt: "Wochenmarkt Leiden — Aalmarkt",
  "markt-woensdag": "Wochenmarkt Leiden — Dille & Camille",
  voorschoten: "Marktstand Voorschoten — bei Hoogvliet",
};

export default async function FrischerFischLeidenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Duitstalige content: alleen canoniek onder /de/. Andere talen 308-redirecten
  // naar de Duitse URL, zodat html lang="de" klopt en er geen dubbele content ontstaat.
  if (locale !== "de") {
    permanentRedirect("/de/frischer-fisch-leiden");
  }

  return (
    <>
      <JsonLd />
      <Schema
        data={[
          { ...vraagSchema(FRAGEN), inLanguage: "de-DE" },
          kruimelSchema("de", [
            { naam: BEDRIJF.naamKort, pad: "/" },
            { naam: "Frischer Fisch in Leiden", pad: "/frischer-fisch-leiden" },
          ]),
        ]}
      />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: "/de" },
          { naam: "Frischer Fisch in Leiden" },
        ]}
        label={`${ADRES_REGEL} · seit 1938`}
        titel="Frischer Fisch in Leiden — seit vier Generationen"
        intro="Sie besuchen Leiden? Probieren Sie echten holländischen Fisch dort, wo die Einheimischen seit 1938 einkaufen. Kibbeling, Matjes, frische Nordseegarnelen und zertifizierter Bio-Lachs."
        knoppen={[
          { label: bestelContact("de").label, href: bestelContact("de").href, extern: true },
          { label: "Fischplatte zusammenstellen", href: "/de/visschalen", soort: "lijn" },
          {
            label: BEDRIJF.telefoon.weergave,
            href: `tel:${BEDRIJF.telefoon.e164}`,
            extern: true,
            soort: "lijn",
          },
        ]}
        feiten={[
          { label: "Geschäft", waarde: ADRES_REGEL },
          { label: "Markt", waarde: "Mittwoch und Samstag, 08:30–17:00" },
          { label: "Seit", waarde: "1938 — vier Generationen" },
        ]}
      />

      {/* ── Was probieren ────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <Kop
          label="Vier Klassiker"
          titel="Was Sie probieren sollten"
          intro="Holländischer Fisch hat wenig mit dem gemeinsam, was Sie aus dem Supermarkt kennen. Diese vier verpasst kein Leiden-Besucher."
        />
        <ul style={{ borderTop: "1px solid var(--linen)" }}>
          {PROBIEREN.map((item) => (
            <li
              key={item.naam}
              className="grid md:grid-cols-[16rem_1fr] gap-x-10 gap-y-2 py-6"
              style={{ borderBottom: "1px solid var(--linen)" }}
            >
              <div>
                <h3 className="text-[1.2rem] mb-1">{item.naam}</h3>
                <span className="kapitaal" style={{ color: "var(--seafoam)" }}>
                  {item.badge}
                </span>
              </div>
              <div>
                <p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>
                  {item.tekst}
                </p>
                <p className="text-sm mt-2" style={{ color: "var(--gold)" }}>
                  {item.tip}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Sectie>

      {/* ── Matjessaison ─────────────────────────────────────────────────── */}
      <Sectie grond="navy" smal>
        <Kop
          donker
          label="Saisonal · Juni bis August"
          titel="Matjessaison — der Höhepunkt des holländischen Fischkalenders"
          intro="Ab Mitte Juni beginnt die Hollandse-Nieuwe-Saison: der erste frische Hering des Jahres, zart und fett. In den Niederlanden gilt das als kleines Nationalfest, Warteschlange vor dem Fischstand inklusive."
        />
        <Link href="/de/viskalender" className="knop knop-lijn-licht">
          Zum Fischjahreskalender
        </Link>
      </Sectie>

      {/* ── Wann und wo ──────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <Kop label="Vier Adressen" titel="Wann und wo" />
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {VERKOOPPUNTEN.map((punt) => (
            <li key={punt.id} className="pt-4" style={{ borderTop: "2px solid var(--navy)" }}>
              <h3 className="text-[1.1rem] mb-2 leading-snug">{NAAM_DE[punt.id]}</h3>
              <p style={{ color: "var(--charcoal)" }}>
                {punt.adres}
                <br />
                {punt.plaats}
              </p>
              <p className="text-sm mt-1 font-semibold" style={{ color: "var(--navy)" }}>
                {DAGEN_DE[punt.id]}
              </p>
              <a
                href={punt.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm font-semibold underline underline-offset-4"
                style={{ color: "var(--navy)" }}
              >
                Route &rarr;
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-9 max-w-3xl" style={{ color: "var(--charcoal)" }}>
          Der Markt liegt im historischen Stadtzentrum, fußläufig von den Grachten, dem
          Rijksmuseum van Oudheden und der ältesten Universität der Niederlande (gegründet 1575).
          Verbinden Sie den Marktbesuch mit einem Stadtspaziergang.
        </p>
      </Sectie>

      {/* ── Fragen ───────────────────────────────────────────────────────── */}
      <Sectie grond="papier" smal>
        <Kop titel="Häufige Fragen" />
        <Vragen vragen={FRAGEN} />
      </Sectie>

      <PaginaSlot
        titel="Fragen Sie uns — oder kommen Sie vorbei"
        tekst="Nur Fischplatten können Sie online bestellen. Für Kibbeling, Hering und andere Produkte schreiben Sie uns per WhatsApp. Gemeinsam besprechen wir Verfügbarkeit und Möglichkeiten."
        knoppen={[
          { label: bestelContact("de").label, href: bestelContact("de").href, extern: true },
          { label: "Fischplatte zusammenstellen", href: "/de/visschalen", soort: "lijn" },
          {
            label: "WhatsApp",
            href: whatsappLink(
              `Hallo ${BEDRIJF.naamKort}, ich möchte gerne frischen Fisch vorbestellen.`
            ),
            extern: true,
            soort: "lijn",
          },
        ]}
      />
    </>
  );
}
