import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { googleRating, googleReviewCount, googleMapsUrl } from "@/lib/reviews";
import { eenTaalMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { BEDRIJF, ADRES_REGEL } from "@/lib/bedrijf";

export async function generateMetadata(): Promise<Metadata> {
  return eenTaalMetadata({
    taal: "nl",
    pad: "/too-good-to-go",
    title: "Too Good To Go bij Schaap's Vis Leiden — vis die niet mag verdwijnen",
    description:
      "Schaap's Vishandel doet mee aan Too Good To Go in Leiden: verse en gerookte vis die aan het eind van de dag over is, voor een fractie van de prijs. Geen verspilling.",
  });
}

const APP_URL = "https://toogoodtogo.com/nl/consumer";

const STAPPEN = [
  ["Download de app", "Installeer de gratis Too Good To Go-app en zoek op “Schaap's Vis Leiden”."],
  ["Reserveer een pakket", "Staat er een pakket klaar, dan reserveert en betaalt u het in de app."],
  ["Haal het op", "Ophalen in de winkel aan de Herenstraat 48, binnen het tijdvak dat in de app staat."],
];

const FAQ = [
  {
    v: "Doet Schaap's Vishandel mee aan Too Good To Go?",
    a: "Ja. Via de Too Good To Go-app bieden we regelmatig verrassingspakketten aan met verse en gerookte vis die aan het eind van de dag over is — tegen een flink lagere prijs, zodat er niets wordt weggegooid.",
  },
  {
    v: "Wat zit er in een Too Good To Go-pakket?",
    a: "Dat is elke keer een verrassing, afhankelijk van wat er die dag over is. Denk aan verse vis, gerookte vis, salades of een bereid product. De inhoud is altijd ruim de prijs waard.",
  },
  {
    v: "Hoeveel kost een pakket?",
    a: "De prijs staat in de Too Good To Go-app en is altijd een fractie van de normale waarde. U betaalt in de app en haalt het pakket bij ons op.",
  },
  {
    v: "Waar haal ik mijn Too Good To Go-pakket op?",
    a: "In onze winkel aan de Herenstraat 48 in Leiden, binnen het ophaaltijdvak dat in de app staat — meestal aan het einde van de dag.",
  },
];

export default async function TooGoodToGoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd />
      <Schema
        data={[
          vraagSchema(FAQ),
          kruimelSchema("nl", [
            { naam: BEDRIJF.naamKort, pad: "/" },
            { naam: "Too Good To Go", pad: "/too-good-to-go" },
          ]),
        ]}
      />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: "Too Good To Go" },
        ]}
        label="Tegen voedselverspilling · Leiden"
        titel="Too Good To Go bij Schaap's Vishandel"
        intro="Verse en gerookte vis die aan het eind van de dag over is, verdient geen prullenbak. Via Too Good To Go redt u een verrassingspakket vis in Leiden — voordelig, en niets gaat verloren."
        knoppen={[
          { label: "Naar de Too Good To Go-app", href: APP_URL, extern: true },
          { label: "Bezoek de winkel", href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
        feiten={[
          { label: "Ophalen", waarde: ADRES_REGEL },
          { label: "Wanneer", waarde: "Einde van de dag, zie de app" },
          { label: "Google", waarde: `${googleRating} van 5 (${googleReviewCount})` },
        ]}
      />

      {/* ── Waarom ───────────────────────────────────────────────────────── */}
      <Sectie grond="papier" smal>
        <Kop titel="Waarom wij meedoen" />
        <div className="lees">
          <p>
            Voedselverspilling is zonde — van het eten, van het werk van de vissers, en van de
            zee. We proberen zo min mogelijk weg te gooien. Wat aan het eind van de dag over is
            maar nog perfect vers, bieden we aan via Too Good To Go, zodat een ander er nog van
            geniet.
          </p>
          <p>
            Het past bij hoe wij naar vis kijken: bewust en eerlijk. Meer daarover leest u op{" "}
            <Link
              href={`/${locale}/biologische-vis`}
              className="font-semibold underline underline-offset-4"
              style={{ color: "var(--seafoam)" }}
            >
              onze pagina over biologische en duurzame vis
            </Link>
            .
          </p>
        </div>
      </Sectie>

      {/* ── Zo werkt het ─────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <Kop label="In drie stappen" titel="Zo werkt het" />
        <ol className="grid sm:grid-cols-3 gap-x-10 gap-y-8">
          {STAPPEN.map(([titel, tekst], i) => (
            <li key={titel} className="pt-4" style={{ borderTop: "2px solid var(--navy)" }}>
              <p className="kapitaal mb-2">Stap {i + 1}</p>
              <h3 className="text-[1.15rem] mb-2">{titel}</h3>
              <p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>
                {tekst}
              </p>
            </li>
          ))}
        </ol>
      </Sectie>

      {/* ── Wat klanten zeggen ───────────────────────────────────────────── */}
      <Sectie grond="papier" smal>
        <p className="kapitaal mb-2">Beoordelingen</p>
        <p
          className="bedrag text-[2.4rem] leading-none mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
        >
          {googleRating} van 5 op Google
        </p>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-4"
          style={{ color: "var(--navy)" }}
        >
          {googleReviewCount} beoordelingen lezen &rarr;
        </a>
      </Sectie>

      {/* ── Vragen ───────────────────────────────────────────────────────── */}
      <Sectie grond="zand" smal>
        <Kop titel="Veelgestelde vragen over Too Good To Go" />
        <Vragen vragen={FAQ} />
      </Sectie>

      <PaginaSlot
        titel="Red mee tegen verspilling"
        tekst="Zoek “Schaap's Vis Leiden” in de Too Good To Go-app. Of kom gewoon langs in de winkel — daar ligt de verse vis van vandaag."
        knoppen={[
          { label: "Naar de app", href: APP_URL, extern: true },
          { label: "Bezoek de winkel", href: `/${locale}/bezoek-ons`, soort: "lijn" },
          { label: "Verse vis bestellen", href: `/${locale}/bestellen`, soort: "lijn" },
        ]}
      />
    </>
  );
}
