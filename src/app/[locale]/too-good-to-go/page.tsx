import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { googleRating, googleReviewCount, googleMapsUrl } from "@/lib/reviews";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = "Too Good To Go bij Schaap's Vis Leiden | Duurzame vis tegen verspilling";
  const description =
    "Schaap's Vishandel doet mee aan Too Good To Go in Leiden: verse en gerookte vis die anders zou worden weggegooid, tegen een fractie van de prijs. Duurzaam, lekker en zonder verspilling.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/too-good-to-go`,
      languages: {
        nl: "/nl/too-good-to-go",
        en: "/en/too-good-to-go",
        de: "/de/too-good-to-go",
        "x-default": "/nl/too-good-to-go",
      },
    },
    openGraph: { title, description, locale, type: "website" },
  };
}

const stappen = [
  ["1", "Download de app", "Installeer de gratis Too Good To Go-app en zoek op “Schaap's Vis Leiden”."],
  ["2", "Reserveer een pakket", "Zie je een pakket beschikbaar? Reserveer het in de app en reken direct af."],
  ["3", "Haal het op", "Kom je pakket ophalen in de winkel aan de Herenstraat 48, binnen het aangegeven tijdvak."],
];

const faq = [
  {
    q: "Doet Schaap's Vishandel mee aan Too Good To Go?",
    a: "Ja. Via de Too Good To Go-app bieden we regelmatig verrassingspakketten aan met verse en gerookte vis die aan het eind van de dag over is — tegen een flink lagere prijs, zodat er niets wordt weggegooid.",
  },
  {
    q: "Wat zit er in een Too Good To Go-pakket?",
    a: "Dat is elke keer een verrassing, afhankelijk van wat er die dag over is. Denk aan verse vis, gerookte vis, salades of een bereid product. De inhoud is altijd ruim de prijs waard.",
  },
  {
    q: "Hoeveel kost een pakket?",
    a: "De prijs staat in de Too Good To Go-app en is altijd een fractie van de normale waarde. Je betaalt direct in de app en haalt het pakket bij ons op.",
  },
  {
    q: "Waar haal ik mijn Too Good To Go-pakket op?",
    a: "In onze winkel aan de Herenstraat 48 in Leiden, binnen het ophaaltijdvak dat in de app staat (meestal aan het einde van de dag).",
  },
];

export default async function TooGoodToGoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `https://www.schaapsvishandel.nl/${locale}` },
      { "@type": "ListItem", position: 2, name: "Too Good To Go", item: `https://www.schaapsvishandel.nl/${locale}/too-good-to-go` },
    ],
  };

  return (
    <>
      <JsonLd />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: "#1a9e53" }}>
        <p className="text-xs tracking-[0.25em] uppercase mb-4 font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
          Tegen voedselverspilling · Leiden
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "Playfair Display, serif" }}>
          Too Good To Go bij Schaap&apos;s Vishandel
        </h1>
        <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.9)" }}>
          Verse en gerookte vis die aan het eind van de dag over is, verdient geen prullenbak.
          Via Too Good To Go redt u een verrassingspakket vis in Leiden — duurzaam, lekker en voordelig.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a
            href="https://toogoodtogo.com/nl/consumer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-sm font-bold border-2 border-white text-white transition-opacity hover:opacity-90"
            style={{ borderRadius: "6px" }}
          >
            Download de app &rarr;
          </a>
        </div>
      </section>

      {/* Waarom */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-5" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Waarom wij meedoen
          </h2>
          <p className="leading-relaxed mb-4" style={{ color: "var(--charcoal)", opacity: 0.85 }}>
            Voedselverspilling is zonde — van het eten, van het werk van de vissers, en van de zee.
            Bij Schaap&apos;s Vishandel proberen we zo min mogelijk weg te gooien. Wat aan het eind van de
            dag over is maar nog perfect vers, bieden we aan via Too Good To Go, zodat een ander er nog
            van geniet in plaats van dat het verloren gaat.
          </p>
          <p className="leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.85 }}>
            Het past bij hoe wij naar vis kijken: bewust, eerlijk en met respect voor de zee. Lees meer
            over onze{" "}
            <Link href={`/${locale}/biologische-vis`} className="underline font-semibold" style={{ color: "var(--seafoam)" }}>
              biologische &amp; duurzame vis
            </Link>.
          </p>
        </div>
      </section>

      {/* Hoe werkt het */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Zo werkt het
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {stappen.map(([num, titel, tekst]) => (
              <div key={num} className="bg-white p-6 text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white mx-auto mb-4"
                  style={{ backgroundColor: "#1a9e53" }}
                >
                  {num}
                </div>
                <p className="font-bold text-base mb-1" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>{titel}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.75 }}>{tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vertrouwen — echte Google-score */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-12 px-6 text-center">
        <p className="text-sm mb-2" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
          Onze klanten waarderen ons met een
        </p>
        <p className="text-3xl font-bold mb-2" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
          {googleRating} op Google
        </p>
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: "var(--navy)" }}>
          {googleReviewCount} beoordelingen &rarr;
        </a>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: "white" }} className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Veelgestelde vragen over Too Good To Go
          </h2>
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group p-5" style={{ border: "1px solid var(--sand)" }}>
                <summary className="flex items-center justify-between gap-3 cursor-pointer select-none font-bold" style={{ listStyle: "none", color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
                  {f.q}
                  <svg className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.8 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-14 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: "Playfair Display, serif" }}>
          Red mee tegen verspilling
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "rgba(246,250,253,0.7)" }}>
          Zoek &ldquo;Schaap&apos;s Vis Leiden&rdquo; in de Too Good To Go-app, of kom gewoon langs in de winkel.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://toogoodtogo.com/nl/consumer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white px-8 py-4 tracking-wide font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1a9e53" }}
          >
            Naar de app &rarr;
          </a>
          <Link
            href={`/${locale}/bezoek-ons`}
            className="inline-block px-8 py-4 tracking-wide font-medium border transition-opacity hover:opacity-80"
            style={{ borderColor: "rgba(246,250,253,0.4)", color: "var(--cream)" }}
          >
            Bezoek de winkel
          </Link>
        </div>
      </section>
    </>
  );
}
