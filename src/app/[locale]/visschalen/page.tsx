import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { RevealGroup } from "@/components/shared/RevealGroup";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = "Visschalen & Feestschotels Leiden | Schaap's Vishandel — borrel & feest";
  const description =
    "Laat een visschaal of feestschotel samenstellen bij Schaap's Vis Leiden: gerookte vis, garnalen, zeevruchten en salades. Perfect voor borrel, verjaardag, kerst of feest. Op bestelling, samenstelling in overleg.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/visschalen`,
      languages: {
        nl: "/nl/visschalen",
        en: "/en/visschalen",
        de: "/de/visschalen",
        "x-default": "/nl/visschalen",
      },
    },
    openGraph: { title, description, locale, type: "website" },
  };
}

const schalen = [
  {
    naam: "Borrel- & visplank",
    voor: "4–8 personen",
    tekst:
      "Een royale plank met gerookte zalm, makreel, gerookte heilbot, garnalen, haring en Hollandse hapjes. De klassieker voor een gezellige borrel.",
    accent: "var(--gold)",
  },
  {
    naam: "Feestelijke visschotel",
    voor: "6–12 personen",
    tekst:
      "Onze indrukwekkende schaal met een selectie van het beste dat we in huis hebben — verse én gerookte vis, schaaldieren, salades en garnering. Een showstopper op tafel.",
    accent: "var(--seafoam)",
  },
  {
    naam: "Luxe zeevruchtenschaal",
    voor: "op maat",
    tekst:
      "Oesters, coquilles, gamba's, langoustines, krab en kreeft — een plateau fruits de mer op zijn Hollands. Voor wie echt wil uitpakken.",
    accent: "var(--salmon)",
  },
];

const stappen = [
  ["1", "Neem contact op", "Bel, WhatsApp of vul het bestelformulier in. Vertel voor hoeveel personen en wat u lekker vindt."],
  ["2", "Wij stellen het samen", "We denken met u mee over inhoud en budget, en bevestigen de prijs. Even vooruit plannen loont — bestel liefst een paar dagen van tevoren."],
  ["3", "Vers opgehaald", "U haalt uw schaal vers en mooi opgemaakt op in de winkel aan de Herenstraat 48, klaar voor uw gelegenheid."],
];

const faq = [
  {
    q: "Hoeveel personen kan een visschaal bedienen?",
    a: "Van een borrelplank voor 4 personen tot een feestschotel voor een hele verjaardag of receptie — we stellen elke schaal op maat samen. Vertel ons het aantal personen en de gelegenheid, dan adviseren we de juiste maat.",
  },
  {
    q: "Hoe ver van tevoren moet ik een feestschotel bestellen?",
    a: "Voor een mooie schaal plannen we graag een paar dagen vooruit, zodat we alles vers en op tijd voor u kunnen samenstellen. Rond feestdagen (Kerst, Oud & Nieuw) adviseren we om ruim op tijd te bestellen — die weken zijn druk.",
  },
  {
    q: "Wat kost een visschaal of feestschotel?",
    a: "De prijs hangt af van de inhoud en het aantal personen. We stellen de schaal samen binnen uw budget en bevestigen de prijs altijd vooraf — geen verrassingen achteraf.",
  },
  {
    q: "Kan ik zelf de inhoud bepalen?",
    a: "Zeker. Houdt iemand niet van schaaldieren, of wilt u juist extra gerookte zalm of oesters? Alles kan in overleg. Geef uw wensen door en wij passen de schaal aan.",
  },
  {
    q: "Kan een visschaal ook zonder rauwe vis of schaaldieren?",
    a: "Ja. We kunnen een schaal samenstellen met alleen gerookte en bereide vis, of rekening houden met allergieën. Laat het ons weten bij uw bestelling.",
  },
];

export default async function VisschalenPage({
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
      { "@type": "ListItem", position: 2, name: "Visschalen", item: `https://www.schaapsvishandel.nl/${locale}/visschalen` },
    ],
  };

  return (
    <>
      <JsonLd />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: "var(--navy)" }}>
        <p className="text-xs tracking-[0.25em] uppercase mb-4 font-semibold" style={{ color: "rgba(246,250,253,0.6)" }}>
          Borrel · Verjaardag · Feest · Kerst
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "Playfair Display, serif" }}>
          Visschalen &amp; feestschotels
        </h1>
        <p className="max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: "rgba(246,250,253,0.85)" }}>
          Maak van uw borrel of feest iets bijzonders. Wij stellen een verse visschaal
          voor u samen — van een gezellige borrelplank tot een indrukwekkende
          feestschotel. Op bestelling, helemaal naar uw wens.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href={`/${locale}/bestellen?product=feestschotel`}
            className="inline-block px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--salmon)", borderRadius: "6px" }}
          >
            Visschaal bestellen &rarr;
          </Link>
          <a
            href="https://wa.me/31715149802?text=Hallo%20Schaap's%20Vishandel,%20ik%20wil%20graag%20een%20visschaal%20of%20feestschotel%20bestellen."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#25D366", borderRadius: "6px" }}
          >
            Overleg via WhatsApp
          </a>
        </div>
      </section>

      <RevealGroup>
      {/* Schalen */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Kies uw stijl — wij maken het op maat
          </h2>
          <p className="text-center text-sm mb-10 max-w-xl mx-auto opacity-70" style={{ color: "var(--charcoal)" }}>
            Dit zijn onze favorieten om mee te beginnen. Elke schaal wordt vers en op
            maat samengesteld, dus de inhoud bepaalt u samen met ons.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {schalen.map((s) => (
              <div key={s.naam} className="bg-white p-6 flex flex-col" style={{ borderTop: `3px solid ${s.accent}` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: s.accent }}>
                  {s.voor}
                </p>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
                  {s.naam}
                </h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--charcoal)", opacity: 0.78 }}>
                  {s.tekst}
                </p>
                <Link
                  href={`/${locale}/bestellen?product=feestschotel`}
                  className="mt-4 text-sm font-semibold underline underline-offset-2"
                  style={{ color: "var(--navy)" }}
                >
                  Deze aanvragen &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zo werkt het */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Zo bestelt u een visschaal
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {stappen.map(([num, titel, tekst]) => (
              <div key={num} className="bg-white p-6 text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white mx-auto mb-4"
                  style={{ backgroundColor: "var(--navy)" }}
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

      {/* FAQ */}
      <section style={{ backgroundColor: "white" }} className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Veelgestelde vragen over visschalen
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
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white" style={{ fontFamily: "Playfair Display, serif" }}>
          Klaar om te bestellen?
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "rgba(246,250,253,0.7)" }}>
          Vertel ons de gelegenheid en het aantal personen — wij maken er iets moois van.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href={`/${locale}/bestellen?product=feestschotel`}
            className="inline-block px-8 py-4 tracking-wide font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--salmon)" }}
          >
            Visschaal bestellen &rarr;
          </Link>
          <a
            href="tel:+31715149802"
            className="inline-block px-8 py-4 tracking-wide font-medium border transition-opacity hover:opacity-80"
            style={{ borderColor: "rgba(246,250,253,0.4)", color: "var(--cream)" }}
          >
            Bel 071 514 9802
          </a>
        </div>
      </section>
      </RevealGroup>
    </>
  );
}
