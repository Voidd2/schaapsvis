import Link from "next/link";
import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  // Deze landingspagina is Duitstalig en hoort canoniek onder /de/ thuis.
  return {
    title: "Frischer Fisch in Leiden — Fischgeschäft seit 1938 | Schaap's Vishandel",
    description:
      "Entdecken Sie echten holländischen Fisch in Leiden: Kibbeling, Matjes/Hollandse Nieuwe, frische Nordseekrabben und Biolachs. Fischgeschäft Herenstraat 48 + Wochenmarkt Mi + Sa. Seit 1938.",
    alternates: {
      canonical: "/de/frischer-fisch-leiden",
      languages: {
        de: "/de/frischer-fisch-leiden",
        nl: "/nl/viswinkel-leiden",
        "x-default": "/de/frischer-fisch-leiden",
      },
    },
    openGraph: {
      title: "Frischer Fisch in Leiden — Fischgeschäft seit 1938",
      description:
        "Kibbeling, Matjes, frische Nordseegarnelen und Bio-Lachs in Leiden. Vier Generationen Fischhändler auf der Herenstraat.",
      locale: "de_DE",
      type: "website",
    },
  };
}

// ── FAQ schema (DE) ───────────────────────────────────────────────────────────
const faqSchemaDE = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "de-DE",
  mainEntity: [
    {
      "@type": "Question",
      name: "Was ist Kibbeling?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kibbeling ist ein typisch holländisches Streetfood: knusprig frittierte Stücke von weißem Fisch (Kabeljau oder Alaska-Seelachs/Pollack) in einem leichten, goldbraunen Teig. Wird traditionell mit Knoblauchsauce serviert. Bei uns täglich frisch zubereitet.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist Hollandse Nieuwe / Matjes und wann gibt es ihn?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hollandse Nieuwe (auf Deutsch ähnlich dem 'Matjes') ist roher, leicht gesalzener Hering aus dem Nordmeer — zarter, milder und fetter als normaler Hering, da er vor dem Laichen gefangen wird. Die Saison beginnt traditionell ab Mitte Juni. Wir informieren unsere Newsletter-Abonnenten, sobald das erste Fässchen ankommt.",
      },
    },
    {
      "@type": "Question",
      name: "Wann und wo ist der Fischmarkt in Leiden?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unser Marktstand steht jeden Mittwoch und Samstag am Nieuwe Rijn im Stadtzentrum von Leiden, von 09:00 bis 17:00 Uhr. Das Geschäft auf der Herenstraat 48 ist Montag bis Samstag von 08:30 bis 17:30 geöffnet.",
      },
    },
    {
      "@type": "Question",
      name: "Wie isst man holländischen Hering?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Den Hering am Schwanz halten und in einem Stück in den Mund lassen — das ist die traditionelle Methode. Oder auf einem weichen Brötchen mit fein gehackten Zwiebeln und Gurken. Beides schmeckt hervorragend und wird am Stand serviert.",
      },
    },
  ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaDE) }}
      />

      {/* Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--navy-dark)" }} className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase mb-4 opacity-60" style={{ color: "var(--sand)" }}>
            Herenstraat 48 · Leiden · Seit 1938
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-5 leading-tight"
            style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
          >
            Frischer Fisch in Leiden —<br />seit vier Generationen
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-8" style={{ color: "rgba(246,250,253,0.78)" }}>
            Sie besuchen Leiden? Probieren Sie echten holländischen Fisch dort, wo die Einheimischen
            seit 1938 einkaufen: Schaap&apos;s Vishandel auf der Herenstraat 48. Kibbeling, Matjes
            (Hollandse Nieuwe), frische Nordseegarnelen und zertifizierten Bio-Lachs.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/bestellen`}
              className="font-semibold px-6 py-3 text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--salmon)" }}
            >
              Jetzt vorbestellen
            </Link>
            <a
              href="https://wa.me/31715149802"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold px-6 py-3 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--seafoam)", color: "var(--cream)" }}
            >
              WhatsApp
            </a>
            <a
              href="tel:+31715149802"
              className="font-semibold px-6 py-3 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "var(--cream)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              +31 71 514 9802
            </a>
          </div>
        </div>
      </section>

      {/* Was sollten Sie probieren? ───────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            Was sollten Sie probieren?
          </h2>
          <p className="text-base mb-10 max-w-2xl" style={{ color: "var(--charcoal)", opacity: 0.75 }}>
            Holländischer Fisch hat wenig mit dem gemeinsam, was Sie vielleicht aus dem
            Supermarkt kennen. Hier sind die vier Klassiker, die kein Leidenbesucher verpassen sollte.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                name: "Kibbeling",
                desc: "Knusprig frittierte Stücke von weißem Fisch (Kabeljau oder MSC-zertifiziertem Alaska-Seelachs) in einem leichten, goldbraunen Teig — serviert mit Knoblauchsauce. Das beliebteste Fisch-Streetfood der Niederlande.",
                badge: "MSC",
                tip: "Tipp: direkt am Stand genießen, solange es warm ist",
              },
              {
                name: "Hollandse Nieuwe / Matjes",
                desc: "Roher, leicht gesalzener Hering aus dem Nordmeer — zarter und fetter als normaler Hering. Ab Mitte Juni täglich frisch. Entweder traditionell am Schwanz gehalten oder auf einem weichen Brötchen mit Zwiebeln und Gürkchen.",
                badge: "Saison: juni–aug",
                tip: "Tipp: am Schwanz halten und in einem Stück — die traditionelle Art",
              },
              {
                name: "Nordseegarnelen (Hollandse Garnalen)",
                desc: "Die kleinen, aromatischen Nordseegarnelen (Crangon crangon) sind eine holländische Spezialität. MSC-zertifiziert, täglich frisch von der Wattenküste. Auf Toast, in einem Sandwich oder pur als Snack.",
                badge: "MSC",
                tip: "Tipp: fragen Sie nach dem Tagesangebot — manchmal gibt es sie mit Garnelensandwich",
              },
              {
                name: "Bio-Lachs Varlaks",
                desc: "Unser Premium-Biola­chs aus Nordnorwegen, über dem Polarkreis gezüchtet — ohne Antibiotika, ohne GMO, ASC-zertifiziert. Reich an Omega-3, mit einem deutlich volleren Geschmack als normaler Zuchtlachs.",
                badge: "BIO · ASC",
                tip: "Tipp: auch als Räucherlachs (kalt geräuchert) erhältlich",
              },
            ].map(({ name, desc, badge, tip }) => (
              <div key={name} className="p-6" style={{ backgroundColor: "white", border: "1px solid var(--sand)" }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-xl" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
                    {name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 ml-2 flex-shrink-0" style={{ backgroundColor: "var(--seafoam)", color: "white" }}>
                    {badge}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--charcoal)", opacity: 0.78 }}>
                  {desc}
                </p>
                <p className="text-xs font-medium" style={{ color: "var(--gold)" }}>
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matjes-Saison highlight ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-1">
            <p className="text-xs tracking-widest uppercase mb-3 font-semibold" style={{ color: "var(--gold)" }}>
              Saisonal · Juni bis August
            </p>
            <h2
              className="text-3xl font-bold mb-4 leading-tight"
              style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
            >
              Matjessaison — der Höhepunkt des holländischen Fischkalenders
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(246,250,253,0.75)" }}>
              Ab Mitte Juni beginnt die &ldquo;Hollandse Nieuwe&rdquo;-Saison: der erste frische Hering des
              Jahres, zart, fett und unvergleichlich im Geschmack. Dieser Moment gilt in den
              Niederlanden als kleines Nationalfest — Warteschlangen vor dem Fischstand inklusive.
              Melden Sie sich für unseren Newsletter an und erfahren Sie als Erster, wann das
              erste Fässchen ankommt.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href={`/${locale}/viskalender`}
              className="block text-sm font-semibold px-6 py-3 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}
            >
              Fischjahreskalender →
            </Link>
          </div>
        </div>
      </section>

      {/* Wann & Wo ───────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold mb-10"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            Wann &amp; Wo
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                name: "Laden — Herenstraat",
                addr: "Herenstraat 48, 2313 AL Leiden",
                hours: "Mo–Sa 08:30–17:30 Uhr",
                maps: "https://maps.google.com/?q=Herenstraat+48+Leiden",
              },
              {
                name: "Wochenmarkt Leiden",
                addr: "Nieuwe Rijn (Stadtzentrum)",
                hours: "Mi + Sa 09:00–17:00 Uhr",
                maps: "https://maps.google.com/?q=Nieuwe+Rijn+Leiden",
              },
              {
                name: "Voorschoten (Hoogvliet)",
                addr: "Bij Hoogvliet Voorschoten",
                hours: "Jeden Freitag",
                maps: "https://maps.google.com/?q=Hoogvliet+Voorschoten",
              },
            ].map(({ name, addr, hours, maps }) => (
              <div key={name} className="p-6" style={{ backgroundColor: "white", border: "1px solid var(--sand)" }}>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
                  {name}
                </h3>
                <p className="text-sm mb-1" style={{ color: "var(--charcoal)", opacity: 0.75 }}>{addr}</p>
                <p className="text-sm mb-4 font-medium" style={{ color: "var(--navy)" }}>{hours}</p>
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                  style={{ color: "var(--salmon)" }}
                >
                  Route →
                </a>
              </div>
            ))}
          </div>
          <p className="text-sm" style={{ color: "var(--charcoal)", opacity: 0.65 }}>
            Der Wochenmarkt am <strong>Nieuwe Rijn</strong> liegt im historischen Stadtzentrum von Leiden, fußläufig von den Grachten, dem Rijksmuseum van Oudheden und der ältesten Universität der Niederlande (gegr. 1575). Verbinden Sie den Marktbesuch mit einer Stadtrundfahrt.
          </p>
        </div>
      </section>

      {/* FAQ ─────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--navy-dark)" }} className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl font-bold mb-10"
            style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
          >
            Häufige Fragen
          </h2>
          <div className="space-y-6">
            {faqSchemaDE.mainEntity.map((faq) => (
              <div key={faq.name} className="border-b pb-6" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                <h3 className="font-bold mb-2" style={{ color: "var(--gold)" }}>
                  {faq.name}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(246,250,253,0.75)" }}>
                  {faq.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--gold)" }} className="py-12 px-6 text-center">
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--navy-dark)", fontFamily: "Playfair Display, serif" }}
        >
          Vorbestellen oder direkt vorbeikommen
        </h2>
        <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: "var(--navy-dark)", opacity: 0.8 }}>
          Über unser Online-Bestellformular können Sie Kibbeling, Hering oder eine Festplatte vorbestellen — wir bereiten es frisch vor und informieren Sie per SMS oder WhatsApp.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={`/${locale}/bestellen`}
            className="font-semibold px-8 py-3.5 text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--navy-dark)" }}
          >
            Jetzt bestellen →
          </Link>
          <a
            href="https://wa.me/31715149802"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold px-8 py-3.5 transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--seafoam)", color: "white" }}
          >
            WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
