import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Kruimels } from "@/components/ui/Sectie";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { BEDRIJF, ADRES_REGEL, euro } from "@/lib/bedrijf";
import { BEZORGING, GEMEENTEN, bezorgdagenTekst } from "@/lib/bezorging";

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
    dagen: [["vr", "08:30 – 17:30"]],
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
  const b = await getTranslations({ locale, namespace: "bezorgen" });
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

      {/* ── Kop ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Kruimels
            donker
            items={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: nav("locaties") }]}
          />
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 items-end">
            <div>
              <p className="kapitaal kapitaal-licht mb-3">{BEDRIJF.adres.plaats}</p>
              <h1 className="text-[2.1rem] md:text-[2.9rem] mb-4" style={{ color: "var(--cream)" }}>
                {t("title")}
              </h1>
              <p
                className="text-[1.05rem] leading-relaxed max-w-2xl"
                style={{ color: "rgba(250,246,239,0.82)" }}
              >
                {t("sub")}
              </p>
            </div>
            <div style={{ borderTop: "1px solid rgba(250,246,239,0.3)" }} className="pt-4">
              <p className="kapitaal kapitaal-licht mb-1">{g("telefoonLabel")}</p>
              <a
                href={`tel:${BEDRIJF.telefoon.e164}`}
                className="text-[1.8rem] leading-tight"
                style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
              >
                {BEDRIJF.telefoon.weergave}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── De plekken ────────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <ul>
          {PLEKKEN.map((plek) => (
            <li
              key={plek.id}
              className="grid md:grid-cols-[1fr_1.3fr_auto] gap-4 md:gap-10 py-7 items-start"
              style={{ borderTop: "1px solid var(--linen)" }}
            >
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

      {/* ── Of laat het brengen ───────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 md:items-end">
          <div>
            <Kop label={b("eyebrow")} titel={b("kop")} />
            <p className="lees" style={{ color: "var(--charcoal)" }}>
              {b("gebiedTekst")}
            </p>
            <p className="mt-4 text-[0.95rem]" style={{ color: "var(--charcoal)" }}>
              {GEMEENTEN.map((gem) => gem.naam).join(" · ")} &middot;{" "}
              {b("dagen", { dagen: bezorgdagenTekst() })}{" "}
              {b("gratisVanaf", { bedrag: euro(BEZORGING.gratisVanaf) })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/bezorgen`} className="knop knop-navy">
              {nav("bezorgen")}
            </Link>
            <Link href={`/${locale}/bestellen`} className="knop knop-lijn">
              {nav("bestellen")}
            </Link>
          </div>
        </div>
      </Sectie>
    </>
  );
}
