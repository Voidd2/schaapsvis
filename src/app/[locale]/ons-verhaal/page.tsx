import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return paginaMetadata({
    locale,
    pad: "/ons-verhaal",
    title: t("verhaalTitle"),
    description: t("verhaalDesc"),
  });
}

/**
 * De tijdlijn.
 *
 * Eerder stond hier een raster van afwisselend links en rechts een tekenfilm-
 * illustratie, met het jaartal als reuzencijfer op vijftien procent dekking
 * eroverheen. Dat is de opmaak van een sjabloon. Nu staat het jaartal in de
 * kantlijn, zoals in een boek, en houdt de tekst één leeskolom.
 */
const TIJDLIJN = [
  { jaar: "1938", titel: "t1title", tekst: "t1text", citaat: null },
  { jaar: "1957", titel: "t2title", tekst: "t2text", citaat: null },
  { jaar: "2009", titel: "t3title", tekst: "t3text", citaat: "t3quote" },
  { jaar: "2018", titel: "t4title", tekst: "t4text", citaat: "t4quote" },
  { jaar: "Nu", titel: "t5title", tekst: "t5text", citaat: null },
] as const;

export default async function OnsVerhaalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "verhaalPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const gedeeld = await getTranslations({ locale, namespace: "gedeeld" });

  return (
    <>
      <JsonLd />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: nav("verhaal") },
        ]}
        label={gedeeld("sinds1938")}
        titel={t("heroTitle")}
        intro={t("heroSub")}
        knoppen={[
          { label: nav("bestellen"), href: `/${locale}/bestellen` },
          { label: nav("locaties"), href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
        feiten={[
          { label: gedeeld("labelGeneraties"), waarde: gedeeld("waardeVier") },
          { label: gedeeld("labelWinkel"), waarde: BEDRIJF.adres.straat },
          { label: gedeeld("labelEigenaar"), waarde: "Aldert Haasnoot" },
        ]}
      />

      <Sectie grond="zand" smal>
        <p className="citaat">{t("intro")}</p>
      </Sectie>

      {/* ── Tijdlijn ──────────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <Kop label="Vier generaties" titel="De tijdlijn" als="h2" />
        <ol style={{ borderTop: "1px solid var(--linen)" }}>
          {TIJDLIJN.map((punt) => (
            <li
              key={punt.jaar}
              className="grid md:grid-cols-[7rem_1fr] gap-x-10 gap-y-2 py-8"
              style={{ borderBottom: "1px solid var(--linen)" }}
            >
              <p
                className="text-[1.6rem] leading-none pt-1"
                style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
              >
                {punt.jaar}
              </p>
              <div className="lees">
                <h3 className="text-[1.3rem] mb-2">{t(punt.titel)}</h3>
                <p style={{ color: "var(--charcoal)" }}>{t(punt.tekst)}</p>
                {punt.citaat && (
                  <blockquote className="citaat mt-5 text-[1.1rem]">
                    {t(punt.citaat)}
                  </blockquote>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Sectie>

      {/* ── Slotcitaat ────────────────────────────────────────────────────── */}
      <Sectie grond="zand" smal>
        <blockquote className="citaat text-[1.5rem] md:text-[1.9rem]">
          {t("outroQuote")}
        </blockquote>
        <cite className="kapitaal not-italic block mt-5">{t("outroAuthor")}</cite>
      </Sectie>

      <PaginaSlot
        titel={gedeeld("slotTitel")}
        tekst={gedeeld("slotTekst")}
        knoppen={[
          { label: nav("visschalen"), href: `/${locale}/visschalen` },
          { label: nav("bestellen"), href: `/${locale}/bestellen`, soort: "lijn" },
          { label: nav("locaties"), href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
      />
    </>
  );
}
