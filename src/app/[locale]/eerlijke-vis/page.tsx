import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PhotoPlaceholder } from "@/components/shared/PhotoPlaceholder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("eerlijkeVisTitle"),
    description: t("eerlijkeVisDesc"),
    alternates: {
      canonical: `/${locale}/eerlijke-vis`,
      languages: {
        nl: "/nl/eerlijke-vis",
        en: "/en/eerlijke-vis",
        de: "/de/eerlijke-vis",
      },
    },
    openGraph: {
      title: t("eerlijkeVisTitle"),
      description: t("eerlijkeVisDesc"),
      locale,
      type: "website",
    },
  };
}

const certifications = [
  {
    key: "cert1" as const,
    label: "MSC",
    color: "#1a6b8a",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12a9 9 0 1 0 18 0A9 9 0 0 0 3 12z" />
        <path d="M8 12c0-2.5 1.5-4 4-4s4 1.5 4 4-1.5 4-4 4" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "cert2" as const,
    label: "ASC",
    color: "#2e6b5e",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    key: "cert3" as const,
    label: "BIO",
    color: "#3a6b2e",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22V12" />
        <path d="M5 12C5 7 8 4 12 4c4 0 7 3 7 8s-3 7-7 7" />
        <path d="M5 12h7" />
      </svg>
    ),
  },
  {
    key: "cert4" as const,
    label: "100%",
    color: "#8b5e14",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

const ourFish = [
  {
    name: "Noordzee Garnalen",
    badge: "MSC",
    badgeColor: "#1a6b8a",
    opAanvraag: true,
    foto: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80",
    tagline: "Dagvers · Waddenkust · Familie depuis 1620",
    herkomst:
      "Gevangen door de 'Mannen van zee' — een rederij die al since 1620 in de familie is (Henk, Lammert, Johan en Lammert). MSC-gecertificeerd via SOLT. Dagvers aangevoerd, gekookt en gepeld aan de Waddenkust. Dit zijn echte Hollandse garnalen.",
    leverancier: "SOLT · Waddenzee",
  },
  {
    name: "Fine de Claire Oesters",
    badge: "Premium",
    badgeColor: "#8b5e14",
    opAanvraag: false,
    foto: "https://images.unsplash.com/photo-1627898292764-6733087b55ac?w=800&q=80",
    tagline: "Crassostrea gigas · 60–90 g · France / Jersey",
    herkomst:
      "Geteeld in claires — kleirijke vijvers langs de Atlantische kust van Frankrijk of Jersey. NL 6075 EQ gecertificeerd. De naam 'Fine de Claire' staat voor een zorgvuldig kweekproces dat de oester een milde, nootachtige smaak geeft. Per 12 stuks verkrijgbaar.",
    leverancier: "NL 6075 EQ",
  },
  {
    name: "Gestoomde Makreel",
    badge: "FAO 27",
    badgeColor: "#2e6b5e",
    opAanvraag: false,
    foto: "https://images.unsplash.com/photo-1567087978459-8a8eeac7bc75?w=800&q=80",
    tagline: "Scomber scombrus · Noordoost Atlantisch",
    herkomst:
      "Makreel (Scomber scombrus) uit het Noordoost Atlantische gebied — FAO-zone 27. Denk aan de Noordzee en de Noorse Zee. Gestoomd met slechts drie ingrediënten: makreel, zout en rook. Geen toevoegingen. Een schoon product boordevol omega-3.",
    leverancier: "FAO 27 · Noordzee / Noorse Zee",
  },
  {
    name: "Tonijn AA Chunk",
    badge: "AA",
    badgeColor: "#b8832e",
    opAanvraag: false,
    foto: "https://images.unsplash.com/photo-1772329320539-d297125453c1?w=800&q=80",
    tagline: "Sri Lanka · Topkwaliteit stukken",
    herkomst:
      "AA-kwaliteit tonijn van John Searson & Co Ltd uit Sri Lanka. Geïmporteerd via W.G. Den Heijer & Zn. in Scheveningen (Vissershavenweg 50) — een van de oudste en meest betrouwbare visgrossiers van Nederland. Dikke, stevige chunks van verse tonijn.",
    leverancier: "John Searson & Co Ltd · Sri Lanka via Den Heijer Scheveningen",
  },
  {
    name: "Gerookte Zalm Snippers",
    badge: "Premium",
    badgeColor: "#8b5e14",
    opAanvraag: false,
    foto: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    tagline: "High Seas · Scheveningen vissershaven",
    herkomst:
      "Van het merk High Seas, via W.G. Den Heijer & Zn. in Scheveningen. Zalm snippers zijn de royale restukken bij het filetteren van heel grote zalmfilets — vol van smaak, ideaal voor op de borrelplank, door pasta of op een bagel. Per kilo verkrijgbaar.",
    leverancier: "High Seas · W.G. Den Heijer & Zn., Scheveningen",
  },
];

function EerlijkeVisContent() {
  const t = useTranslations("eerlijkeVisPage");
  const locale = useLocale();

  return (
    <>
      {/* Hero */}
      <section
        className="relative py-28 px-6 text-center overflow-hidden"
        style={{ backgroundColor: "#0f2218" }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 25% 60%, #2e8b57 0%, transparent 55%), radial-gradient(ellipse at 75% 40%, #1a6b8a 0%, transparent 55%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p
            className="text-xs uppercase tracking-[0.35em] mb-6 font-medium"
            style={{ color: "#6ec89a" }}
          >
            Schaap&apos;s Vis · Leiden · Bewust kiezen
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white"
            style={{ fontFamily: "Playfair Display, serif", letterSpacing: "-0.02em" }}
          >
            {t("heroTitle")}
          </h1>
          <p
            className="text-lg md:text-xl font-light max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {t("heroSub")}
          </p>
        </div>
      </section>

      {/* Waarom */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase mb-4 font-semibold opacity-50"
              style={{ color: "var(--navy)" }}
            >
              Onze overtuiging
            </p>
            <h2
              className="text-4xl font-bold mb-6 leading-tight"
              style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
            >
              {t("whyTitle")}
            </h2>
            <p className="leading-relaxed mb-4" style={{ color: "var(--charcoal)", opacity: 0.8 }}>
              {t("whyText1")}
            </p>
            <p className="leading-relaxed font-medium" style={{ color: "var(--charcoal)", opacity: 0.9 }}>
              {t("whyText2")}
            </p>
          </div>
          <PhotoPlaceholder
            label="FOTO TOEVOEGEN: Vis op ijs in de winkel of toonbank Schaap's Vis"
            aspectRatio="aspect-[4/3]"
          />
        </div>
      </section>

      {/* Keurmerken */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-3"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            {t("certTitle")}
          </h2>
          <p className="text-center text-sm mb-12 opacity-60" style={{ color: "var(--charcoal)" }}>
            Wat betekenen die keurmerken eigenlijk?
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map(({ key, label, color, icon }) => (
              <div
                key={key}
                className="p-6 bg-white"
                style={{ borderTop: `4px solid ${color}` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ color }}>{icon}</div>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color }}
                  >
                    {label}
                  </span>
                </div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                >
                  {t(key)}
                </h3>
                <p className="text-xs leading-relaxed opacity-70" style={{ color: "var(--charcoal)" }}>
                  {t(`${key}desc` as Parameters<typeof t>[0])}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Varlaks */}
      <section style={{ backgroundColor: "#0a1628" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80"
            alt="Varlaks biologische zalm"
            className="w-full aspect-square object-cover"
          />
          <div>
            <span
              className="inline-block text-xs tracking-widest uppercase font-semibold px-3 py-1 mb-5 text-white"
              style={{ backgroundColor: "#2e6b5e" }}
            >
              Biologisch gecertificeerd
            </span>
            <h2
              className="text-4xl font-bold mb-5 leading-tight text-white"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t("varlaksTitle")}
            </h2>
            <p className="leading-relaxed mb-8 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              {t("varlaksText")}
            </p>
            <Link
              href={`/${locale}/varlaks`}
              className="text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: "#7ec8d4" }}
            >
              {t("varlaksLink")}
            </Link>
          </div>
        </div>
      </section>

      {/* Ons aanbod — real fish cards */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-3"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            {t("listTitle")}
          </h2>
          <p
            className="text-center text-sm mb-14 max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--charcoal)", opacity: 0.7 }}
          >
            Elk product met zijn eigen verhaal — waar het vandaan komt, hoe het gevangen of
            gekweekt is, en waarom wij het bewust aanbieden.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ourFish.map((fish) => (
              <article
                key={fish.name}
                className="bg-white flex flex-col"
                style={{ border: "1px solid rgba(26,53,48,0.08)" }}
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fish.foto}
                    alt={fish.name}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                  <span
                    className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 text-white"
                    style={{ backgroundColor: fish.badgeColor }}
                  >
                    {fish.badge}
                  </span>
                  {fish.opAanvraag && (
                    <span
                      className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 text-white"
                      style={{ backgroundColor: "var(--salmon)" }}
                    >
                      Op aanvraag
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3
                    className="text-xl font-bold mb-1 leading-tight"
                    style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                  >
                    {fish.name}
                  </h3>
                  <p
                    className="text-xs italic mb-4"
                    style={{ color: "var(--charcoal)", opacity: 0.55 }}
                  >
                    {fish.tagline}
                  </p>
                  <p
                    className="text-xs leading-relaxed flex-1"
                    style={{ color: "var(--charcoal)", opacity: 0.75 }}
                  >
                    {fish.herkomst}
                  </p>
                  <div
                    className="mt-4 pt-4 text-xs"
                    style={{
                      borderTop: "1px solid var(--sand)",
                      color: "var(--navy)",
                      opacity: 0.5,
                    }}
                  >
                    {fish.leverancier}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div
            className="mt-12 p-8 text-center"
            style={{ backgroundColor: "var(--sand)", borderLeft: "4px solid var(--seafoam)" }}
          >
            <p
              className="text-sm leading-relaxed max-w-xl mx-auto"
              style={{ color: "var(--charcoal)", opacity: 0.8 }}
            >
              Niet zeker welke vis u zoekt? Kom langs — we leggen u graag uit waar elke vis
              vandaan komt en wat u er het beste mee kunt doen.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 px-6 text-center">
        <h2
          className="text-3xl font-bold mb-4 text-white"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {t("ctaTitle")}
        </h2>
        <p
          className="text-sm mb-8 max-w-md mx-auto leading-relaxed"
          style={{ color: "rgba(247,240,227,0.7)" }}
        >
          Herenstraat 48, Leiden · Maandag t/m zaterdag · 071 514 9802
        </p>
        <Link
          href={`/${locale}/bezoek-ons`}
          className="inline-block text-white px-8 py-4 tracking-wide font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--salmon)" }}
        >
          {t("ctaButton")} &rarr;
        </Link>
      </section>
    </>
  );
}

export default async function EerlijkeVisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <>
      <JsonLd />
      <EerlijkeVisContent />
    </>
  );
}
