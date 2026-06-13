import Link from "next/link";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("varlaksTitle"),
    description: t("varlaksDesc"),
    alternates: {
      canonical: `/${locale}/varlaks`,
      languages: { nl: "/nl/varlaks", en: "/en/varlaks", de: "/de/varlaks" },
    },
  };
}

const whatYouGet = [
  [
    "Skjerstadfjorden, Nordland",
    "Boven de poolcirkel, nabij Bodø — hier is het water koud, schoon en zuurstofrijk. Een van de weinige plekken ter wereld waar zalm werkelijk optimaal kan opgroeien.",
  ],
  [
    "Wenberg & Edelfarm",
    "Twee familieboerderijen — Wenberg Fiskeoppdrett in Fauske en Edelfarm in Saltdal — gekweekt op lage bezettingsdichtheid, geen grote industrie.",
  ],
  [
    "ASC gecertificeerd",
    "Aquaculture Stewardship Council — de internationale standaard voor verantwoorde visteelt. Seafood Watch kent Skjerstadfjorden zijn hoogste milieubeoordeling toe.",
  ],
  [
    "100% traceerbaar",
    "Van eitje tot filet elke stap aantoonbaar. Verwerking via Salten Salmon in Bodø, onder toezicht van onafhankelijke certificeerders.",
  ],
  [
    "Laserbehandeling",
    "24/7 onderwatercamera's bewaken elk individueel dier. Detecteert een camera een zeeluis, vuurt een laser in een fractie van een seconde — geen chemicaliën, geen stress voor de vis.",
  ],
  [
    "Panaferd-AX — echte kleur",
    "Vrijwel alle gekweekte zalm ter wereld kleurt roze door synthetische astaxanthine (petrochemisch). Varlaks gebruikt Panaferd-AX: natuurlijke astaxanthine gewonnen uit gefermenteerde bacteriën. De roze kleur is echt, niet kunstmatig.",
  ],
] as const;

const whatIsNot = [
  ["Antibiotica", "De schone omgeving en lage bezettingsdichtheid maken het overbodig"],
  ["Chemicaliën", "Geen pesticiden, geen kunstmatige middelen — ook geen chemische luisbestrijding"],
  ["GMO", "Gewone zalm, zoals de natuur hem bedoeld heeft"],
  ["Hormonen", "Groeit in zijn eigen tempo — niet kunstmatig versneld"],
  [
    "Synthetische kleurstof",
    "Geen petrochemische astaxanthine — de roze kleur komt van Panaferd-AX, een natuurlijke bron",
  ],
] as const;

function VarlaksContent() {
  const locale = useLocale();

  return (
    <>
      {/* ── Hero met video achtergrond ─────────────────────────────── */}
      {/* De header is fixed+transparant op deze pagina (zie Header.tsx) */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ backgroundColor: "#0a1628" }}
      >
        {/* Achtergrondvideo van varlaks.no — fallback naar Unsplash als video blokkeerd */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.4 }}
        >
          <source
            src="https://varlaks.no/wp-content/uploads/2024/03/682448_Norway-Winter-Archipelago-Water_By_Up_North_Studio_Artlist_4K_1.mp4"
            type="video/mp4"
          />
        </video>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,22,40,0.3) 0%, transparent 40%, rgba(10,22,40,0.8) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-40 w-full">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-6 font-medium"
            style={{ color: "#7ec8d4" }}
          >
            Verkrijgbaar bij Schaap&apos;s Vis · Leiden
          </p>
          <h1
            className="text-7xl md:text-9xl font-bold leading-none mb-8 text-white"
            style={{
              fontFamily: "Playfair Display, serif",
              letterSpacing: "-0.03em",
            }}
          >
            VARLAKS
          </h1>
          <p
            className="text-xl md:text-2xl max-w-2xl mb-4 font-light"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Zalm uit de Skjerstadfjorden — boven de poolcirkel in Noorwegen.
          </p>
          <p
            className="text-base max-w-xl mb-14"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Gekweekt door Wenberg Fiskeoppdrett en Edelfarm, boven de poolcirkel
            in Nordland, in het koudste en schoonste water ter wereld.
          </p>
          <a
            href="#verhaal"
            className="inline-block border text-white text-sm tracking-widest uppercase px-8 py-3 transition-colors hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.4)" }}
          >
            Ontdek het verhaal ↓
          </a>
        </div>
      </section>

      {/* ── Brand film (Vimeo embed) ───────────────────────────────── */}
      <section
        style={{ backgroundColor: "#0a1628" }}
        className="py-24 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-4"
            style={{ color: "#7ec8d4" }}
          >
            Brand Film
          </p>
          <h2
            className="text-4xl font-bold text-white mb-12"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Zo groeit onze zalm op
          </h2>

          {/* Vimeo 16:9 responsive embed */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://player.vimeo.com/video/932791452?autoplay=0&title=0&byline=0&portrait=0&color=7ec8d4"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Varlaks Brand Film"
            />
          </div>
          <p
            className="text-sm mt-4"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Film door VARLAKS · varlaks.no
          </p>
        </div>
      </section>

      {/* ── Cut the crap — wat erin zit vs wat er niet in zit ─────── */}
      <section
        id="verhaal"
        style={{ backgroundColor: "#0d1e33" }}
        className="py-24 px-6"
      >
        <div className="max-w-5xl mx-auto">
          {/* Certificeringsbadges */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <span
              className="text-xs uppercase tracking-[0.2em] px-4 py-2 border font-medium"
              style={{ borderColor: "#7ec8d4", color: "#7ec8d4" }}
            >
              ASC Gecertificeerd
            </span>
            <span
              className="text-xs uppercase tracking-[0.2em] px-4 py-2 border font-medium"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.6)" }}
            >
              Biologisch gecertificeerd
            </span>
            <span
              className="text-xs uppercase tracking-[0.2em] px-4 py-2 border font-medium"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.6)" }}
            >
              Seafood Watch — hoogste score
            </span>
          </div>

          <div
            className="grid md:grid-cols-2 gap-0 border"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            {/* Wat je WEL krijgt */}
            <div
              className="p-10 md:p-12 border-b md:border-b-0 md:border-r"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <p
                className="text-xs uppercase tracking-[0.25em] mb-8"
                style={{ color: "#7ec8d4" }}
              >
                Wat je krijgt
              </p>
              {whatYouGet.map(([title, desc]) => (
                <div key={title} className="mb-8 last:mb-0">
                  <p className="text-white font-medium mb-1">{title}</p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Wat er NIET in zit */}
            <div
              className="p-10 md:p-12"
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <p
                className="text-xs uppercase tracking-[0.25em] mb-8"
                style={{ color: "rgba(248,113,113,0.7)" }}
              >
                Wat er niet in zit
              </p>
              {whatIsNot.map(([title, desc]) => (
                <div key={title} className="mb-8 last:mb-0">
                  <p className="text-white font-medium mb-1">{title}</p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Waar te koop — terug naar warme huisstijl ─────────────── */}
      <section
        style={{ backgroundColor: "var(--navy)" }}
        className="py-20 px-6 text-center"
      >
        <p
          className="text-xs uppercase tracking-[0.25em] mb-4"
          style={{ color: "#7ec8d4" }}
        >
          Vers verkrijgbaar
        </p>
        <h2
          className="text-4xl font-bold text-white mb-6"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Varlaks zalm bij Schaap&apos;s Vis
        </h2>
        <p
          className="max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: "rgba(246,250,253,0.7)" }}
        >
          We halen de Varlaks zalm vers op. Dagelijks in de winkel aan de
          Herenstraat, woensdag en zaterdag op de markt in Leiden, en vrijdag
          bij Hoogvliet in Voorschoten.
        </p>
        <Link
          href={`/${locale}/bestellen`}
          className="inline-block text-white px-8 py-4 tracking-wide transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--salmon)" }}
        >
          Vooruit bestellen →
        </Link>
      </section>
    </>
  );
}

export default async function VarlaksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <>
      <JsonLd />
      <VarlaksContent />
    </>
  );
}
