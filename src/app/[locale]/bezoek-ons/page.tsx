import { bestelContact } from "@/lib/bestel-contact";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { BEDRIJF, ADRES_REGEL } from "@/lib/bedrijf";

import { BEELD } from "@/lib/beeld";
import { Beeld } from "@/components/ui/Beeld";
import type { BeeldNaam } from "@/lib/beeld";

/** Welke foto bij welke plek hoort. Zie `src/lib/beeld.ts`. */
const BEELD_PER_PLEK: Record<string, BeeldNaam> = {
  winkel: "winkelGevel",
  zaterdag: "marktZaterdag",
  woensdag: "marktWoensdag",
  voorschoten: "marktVoorschoten",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return paginaMetadata({
    locale,
    pad: "/bezoek-ons",
    title: t("bezoekTitle"),
    description: t("bezoekDesc"),
  });
}

/**
 * Waar je ons vindt.
 *
 * De plekken staan onder elkaar als een dienstregeling: adres, dagen, tijden,
 * route. Dat leest sneller dan vier kaarten met een cijfer in een rondje, en
 * het is precies wat iemand zoekt die wil weten of we er vanmiddag staan.
 *
 * De openingstijden staan hier in gewone tekst én in de schema.org-gegevens van
 * `JsonLd`. Ze moeten met elkaar overeenkomen — Google leest allebei, en een
 * verschil telt als een fout.
 */
const PLEKKEN = [
  {
    id: "winkel",
    adres: ADRES_REGEL,
    /** Dagen als [sleutel van de dag, tijd]. "gesloten" krijgt zijn eigen sleutel. */
    dagen: [
      ["diVr", "09:00 – 18:00"],
      ["za", "09:00 – 17:00"],
      ["zoMa", null],
    ],
    telefoon: true,
    maps: BEDRIJF.maps.route,
  },
  {
    id: "zaterdag",
    dagen: [["za", "08:30 – 17:00"]],
    telefoon: false,
    maps: "https://maps.google.com/?q=Aalmarkt+Leiden",
  },
  {
    id: "woensdag",
    dagen: [["wo", "08:30 – 17:00"]],
    telefoon: false,
    maps: "https://maps.google.com/?q=Dille+en+Camille+Leiden+Haarlemmerstraat",
  },
  {
    id: "voorschoten",
    dagen: [["vr", "08:00 – 17:30"]],
    telefoon: false,
    maps: "https://maps.google.com/?q=Hoogvliet+Voorschoterweg+Voorschoten",
  },
] as const;

export default async function BezoekOnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bezoekPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });

  const p = await getTranslations({ locale, namespace: "plekken" });

  return (
    <>
      <JsonLd locale={locale} />
      <Schema
        data={kruimelSchema(locale, [
          { naam: BEDRIJF.naamKort, pad: "/" },
          { naam: nav("locaties"), pad: "/bezoek-ons" },
        ])}
      />

      <PaginaKop
        kruimels={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: nav("locaties") }]}
        label={BEDRIJF.adres.plaats}
        titel={t("title")}
        intro={t("sub")}
        knoppen={[
          { label: nav("visschalen"), href: `/${locale}/visschalen` },
          {
            label: g("bellen", { nummer: BEDRIJF.telefoon.weergave }),
            href: `tel:${BEDRIJF.telefoon.e164}`,
            extern: true,
            soort: "lijn",
          },
        ]}
        feiten={[
          { label: g("telefoonLabel"), waarde: BEDRIJF.telefoon.weergave },
          { label: g("labelWinkel"), waarde: ADRES_REGEL },

        ]}
      />

      {/* ── De plekken ────────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <ul className="grid lg:grid-cols-2 gap-6">
          {PLEKKEN.map((plek) => (
            <li
              key={plek.id}
              className="location-card flex flex-col gap-5 p-7"
              style={{ border: "1px solid #d4e8f2", borderRadius: "14px", background: "#f0f8fc" }}
            >
              {/* Een foto per plek. De kraam bij de Waag ziet er anders uit dan
                  die op de parkeerplaats bij Hoogvliet — met een foto weet
                  iemand waar hij naar moet zoeken. */}
              {BEELD[BEELD_PER_PLEK[plek.id]].bestand && <Beeld naam={BEELD_PER_PLEK[plek.id]} verhouding="liggend" streep="var(--navy)" />}

              <div>
                <h2 className="text-[1.35rem] mb-1">{p(`${plek.id}Naam`)}</h2>
                <p className="text-[0.95rem]" style={{ color: "var(--grijs)" }}>
                  {"adres" in plek ? plek.adres : p(`${plek.id}Adres`)}
                </p>
              </div>

              <div>
                <dl className="text-[0.95rem]">
                  {plek.dagen.map(([dag, tijd]) => (
                    <div key={dag} className="flex flex-wrap gap-x-3 py-0.5">
                      <dt style={{ color: "var(--ink)", fontWeight: 600, minWidth: "11rem" }}>
                        {p(dag)}
                      </dt>
                      <dd className="bedrag" style={{ color: "var(--charcoal)" }}>
                        {tijd ?? p("gesloten")}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="text-[0.92rem] mt-2 leading-relaxed" style={{ color: "var(--charcoal)" }}>
                  {p(`${plek.id}Toelichting`)}
                </p>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <a
                  href={plek.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold underline underline-offset-4 whitespace-nowrap"
                  style={{ color: "var(--navy)" }}
                >
                  {g("route")} &rarr;
                </a>
                {plek.telefoon && (
                  <a
                    href={`tel:${BEDRIJF.telefoon.e164}`}
                    className="text-sm whitespace-nowrap"
                    style={{ color: "var(--grijs)" }}
                  >
                    {BEDRIJF.telefoon.weergave}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Sectie>

      <PaginaSlot
        titel={nav("visschalen")}
        tekst={locale === "nl" ? "Alleen visschalen kunt u online bestellen. Zoekt u andere vis? Stuur ons een WhatsApp-bericht, dan kijken we wat mogelijk is." : locale === "de" ? "Nur Fischplatten können Sie online bestellen. Für andere Produkte kontaktieren Sie uns über WhatsApp." : "Only seafood platters can be ordered online. For other products, contact us on WhatsApp."}
        knoppen={[
          { label: nav("visschalen"), href: `/${locale}/visschalen` },
          { ...bestelContact(locale), extern: true, soort: "lijn" },

        ]}
      />

    </>
  );
}
