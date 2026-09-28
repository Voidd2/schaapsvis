import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF, whatsappLink } from "@/lib/bedrijf";
import { Beeld } from "@/components/ui/Beeld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return paginaMetadata({
    locale,
    pad: "/varlaks",
    title: t("varlaksTitle"),
    description: t("varlaksDesc"),
  });
}

interface Punt {
  t: string;
  d: string;
}

/**
 * De Varlaks-pagina.
 *
 * Deze pagina had een eigen huisstijl: een schermvullende hero met een
 * verlopende overlay, ijsblauwe accenten en twee eigen donkerblauwtinten die
 * nergens anders op de site voorkwamen. Dat leest als een tweede website. De
 * inhoud is gebleven — die is inhoudelijk sterk — maar staat nu in dezelfde
 * kop, secties en afsluiting als elke andere pagina.
 */
export default async function VarlaksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "varlaksPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const gedeeld = await getTranslations({ locale, namespace: "gedeeld" });

  const wel = t.raw("wel") as Punt[];
  const niet = t.raw("niet") as Punt[];

  return (
    <>
      <JsonLd />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: nav("varlaks") },
        ]}
        label={t("label")}
        titel={t("heroTitle")}
        intro={t("heroSub")}
        knoppen={[
          { label: nav("contact"), href: `/${locale}/contact` },
          {
            label: BEDRIJF.telefoon.weergave,
            href: `tel:${BEDRIJF.telefoon.e164}`,
            extern: true,
            soort: "lijn",
          },
        ]}
        feiten={[
          { label: t("feitHerkomstLabel"), waarde: t("feitHerkomstWaarde") },
          { label: t("feitKeurmerkLabel"), waarde: t("feitKeurmerkWaarde") },
          { label: t("feitTeKoopLabel"), waarde: t("feitTeKoopWaarde") },
        ]}
      />

      {/* ── Het verhaal ───────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
          <div>
            <Kop titel={t("storyTitle")} />
            <p className="lees" style={{ color: "var(--charcoal)" }}>
              {t("story")}
            </p>
          </div>
          {/* Jullie eigen filet op jullie eigen toonbank. Overtuigender dan de
              persfoto van de kweker, want die kan iedereen laten zien. */}
          <Beeld naam="varlaksFilet" verhouding="liggend" streep="var(--navy)" />
        </div>
      </Sectie>

      {/* ── Wat er wel en niet in zit ─────────────────────────────────────── */}
      <Sectie grond="zand">
        <Kop label="ASC · biologisch" titel={t("featuresTitle")} />
        <div className="grid md:grid-cols-2 gap-x-14 gap-y-10">
          <div>
            <p className="kapitaal mb-5" style={{ color: "var(--seafoam)" }}>
              {t("welTitle")}
            </p>
            <dl style={{ borderTop: "1px solid var(--linen)" }}>
              {wel.map((punt) => (
                <div key={punt.t} className="py-4" style={{ borderBottom: "1px solid var(--linen)" }}>
                  <dt
                    className="text-[1.05rem] mb-1"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                  >
                    {punt.t}
                  </dt>
                  <dd className="text-[0.97rem] leading-relaxed" style={{ color: "var(--charcoal)" }}>
                    {punt.d}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <p className="kapitaal mb-5" style={{ color: "var(--rood)" }}>
              {t("nietTitle")}
            </p>
            <dl style={{ borderTop: "1px solid var(--linen)" }}>
              {niet.map((punt) => (
                <div key={punt.t} className="py-4" style={{ borderBottom: "1px solid var(--linen)" }}>
                  <dt
                    className="text-[1.05rem] mb-1"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                  >
                    {punt.t}
                  </dt>
                  <dd className="text-[0.97rem] leading-relaxed" style={{ color: "var(--charcoal)" }}>
                    {punt.d}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Sectie>

      {/* ── De film van de kwekerij ───────────────────────────────────────── */}
      <Sectie grond="navy" smal>
        <Kop donker label="Nordland" titel={t("filmTitle")} />
        <div
          className="relative w-full"
          style={{ paddingBottom: "56.25%", border: "1px solid rgba(250,246,239,0.22)" }}
        >
          <iframe
            src="https://player.vimeo.com/video/932791452?title=0&byline=0&portrait=0"
            className="absolute inset-0 w-full h-full"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            title={t("filmTitle")}
          />
        </div>
        <p className="text-sm mt-3" style={{ color: "rgba(250,246,239,0.55)" }}>
          {t("filmBron")}
        </p>
      </Sectie>

      <PaginaSlot
        titel={t("slotTitle")}
        tekst={t("slotText")}
        knoppen={[
          { label: nav("contact"), href: `/${locale}/contact` },
          {
            label: nav("visschalen"),
            href: `/${locale}/visschalen`,
            soort: "lijn",
          },
          {
            label: gedeeld("whatsapp"),
            href: whatsappLink(
              `Hallo ${BEDRIJF.naamKort}, ik wil graag Varlaks biologische zalm bestellen.`
            ),
            extern: true,
            soort: "lijn",
          },
        ]}
      />
    </>
  );
}
