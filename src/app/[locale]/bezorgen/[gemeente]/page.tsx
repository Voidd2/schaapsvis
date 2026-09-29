import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { PostcodeCheck } from "@/components/bezorgen/PostcodeCheck";
import { paginaMetadata, alternates, kruimelSchema, vraagSchema, LOCALES } from "@/lib/seo";
import { BEDRIJF, euro, whatsappLink } from "@/lib/bedrijf";
import {
  BEZORGING,
  GEMEENTEN,
  gemeenteBySlug,
  kostenVoor,
  bezorgdagenTekst,
} from "@/lib/bezorging";

/**
 * Een eigen pagina per gemeente.
 *
 * Niemand zoekt op "vis bezorgen". Mensen zoeken op "vis bezorgen Wassenaar" of
 * "verse vis thuisbezorgd Leiderdorp". Eén algemene bezorgpagina wint zo'n
 * zoekopdracht nooit van een pagina die letterlijk over die plaats gaat — met de
 * wijknamen, het tarief en de rijtijd die daar gelden. Vandaar deze vijf.
 *
 * Belangrijk: elke pagina moet iets eigens te melden hebben. Vijf keer dezelfde
 * tekst met een andere plaatsnaam is dunne inhoud en levert eerder een straf op
 * dan een positie.
 */

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    GEMEENTEN.map((g) => ({ locale, gemeente: g.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; gemeente: string }>;
}): Promise<Metadata> {
  const { locale, gemeente } = await params;
  const gem = gemeenteBySlug(gemeente);
  if (!gem) return {};

  const t = await getTranslations({ locale, namespace: "meta" });
  const dagen = bezorgdagenTekst(locale);

  return {
    ...paginaMetadata({
      locale,
      pad: `/bezorgen/${gem.slug}`,
      title: t("bezorgenPlaatsTitle", { plaats: gem.naam }),
      description: t("bezorgenPlaatsDesc", { plaats: gem.naam, dagen }),
    }),
    alternates: alternates(locale, `/bezorgen/${gem.slug}`),
  };
}

export default async function GemeentePage({
  params,
}: {
  params: Promise<{ locale: string; gemeente: string }>;
}) {
  const { locale, gemeente } = await params;
  const gem = gemeenteBySlug(gemeente);
  if (!gem) notFound();

  const t = await getTranslations({ locale, namespace: "bezorgen" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const h = await getTranslations({ locale, namespace: "home" });
  const plaatsen = await getTranslations({ locale, namespace: "gemeenten" });

  const dagen = bezorgdagenTekst(locale);
  const kosten = kostenVoor(gem);
  const intro = plaatsen(`${gem.slug}Intro`);
  const andere = GEMEENTEN.filter((x) => x.slug !== gem.slug);

  // De algemene vragen, met de eerste toegespitst op deze plaats.
  const algemeen = t.raw("faq") as { v: string; a: string }[];
  const vragen = [
    {
      v: t("plaatsKop", { plaats: gem.naam }) + "?",
      a: `${intro} ${t("dagen", { dagen })} ${t("plaatsRijtijd", { tijd: gem.rijtijd })} ${t(
        "plaatsKostenKop",
        { plaats: gem.naam }
      )}: ${euro(kosten)}. ${t("gratisVanaf", { bedrag: euro(BEZORGING.gratisVanaf) })}`,
    },
    ...algemeen.slice(1),
  ];

  return (
    <>
      <JsonLd locale={locale} />
      <Schema
        data={[
          vraagSchema(vragen),
          kruimelSchema(locale, [
            { naam: BEDRIJF.naamKort, pad: "/" },
            { naam: nav("bezorgen"), pad: "/bezorgen" },
            { naam: gem.naam, pad: `/bezorgen/${gem.slug}` },
          ]),
        ]}
      />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: nav("bezorgen"), href: `/${locale}/bezorgen` },
          { naam: gem.naam },
        ]}
        label={t("plaatsEyebrow")}
        titel={t("plaatsKop", { plaats: gem.naam })}
        intro={intro}
        uitgelijnd="boven"
        feiten={[
          { label: t("kolomKosten"), waarde: euro(kosten) },
          { label: t("kolomRijtijd"), waarde: gem.rijtijd },
          { label: g("bezorgen"), waarde: dagen },
        ]}
        zijkant={
          <div
            className="p-6 md:p-7"
            style={{ backgroundColor: "var(--cream)", border: "1px solid var(--linen)" }}
          >
            <h2 className="text-[1.3rem] mb-1">{t("checkKop")}</h2>
            <p className="text-sm mb-4" style={{ color: "var(--grijs)" }}>
              {t("checkTekst")}
            </p>
            <PostcodeCheck />
          </div>
        }
      />

      {/* ── Wijken ────────────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <Kop
          titel={t("plaatsWijkenKop", { plaats: gem.naam })}
          intro={t("plaatsWijkenTekst", { plaats: gem.naam })}
        />
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6">
          {gem.wijken.map((wijk) => (
            <li
              key={wijk}
              className="py-2.5 text-[0.98rem]"
              style={{ borderTop: "1px solid var(--linen)", color: "var(--charcoal)" }}
            >
              {wijk}
            </li>
          ))}
        </ul>
      </Sectie>

      {/* ── Wat we brengen ────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16">
          <div>
            <Kop titel={t("watKop")} />
            <p className="lees" style={{ color: "var(--charcoal)" }}>
              {t("watTekst")}
            </p>
            <p className="mt-4 text-[0.95rem]" style={{ color: "var(--charcoal)" }}>
              {t("besteltijd", { tijd: BEZORGING.uitersteBesteltijd })}{" "}
              {t("minimum", { bedrag: euro(BEZORGING.minimumBedrag) })}{" "}
              {t("gratisVanaf", { bedrag: euro(BEZORGING.gratisVanaf) })}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 self-center">
            {[
              { kop: h("bezorgWelKop"), kleur: "var(--seafoam)", regels: [h("bezorgWel1"), h("bezorgWel2")] },
              { kop: h("bezorgNietKop"), kleur: "var(--grijs)", regels: [h("bezorgNiet1"), h("bezorgNiet2")] },
            ].map(({ kop, kleur, regels }) => (
              <div key={kop}>
                <h3 className="kapitaal mb-3" style={{ color: kleur }}>
                  {kop}
                </h3>
                <ul className="text-[0.98rem]" style={{ color: "var(--charcoal)" }}>
                  {regels.map((regel) => (
                    <li
                      key={regel}
                      className="py-2.5 leading-snug"
                      style={{ borderTop: "1px solid var(--linen)" }}
                    >
                      {regel}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Sectie>

      {/* ── Vragen ────────────────────────────────────────────────────────── */}
      <Sectie grond="papier" smal>
        <Kop titel={t("faqKop")} />
        <Vragen vragen={vragen} />
      </Sectie>

      {/* ── Andere gemeenten ──────────────────────────────────────────────── */}
      <Sectie grond="zand" smal>
        <h2 className="kapitaal mb-4">{t("plaatsAndere")}</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {andere.map((x) => (
            <li key={x.slug}>
              <Link
                href={`/${locale}/bezorgen/${x.slug}`}
                className="underline underline-offset-4 font-semibold"
                style={{ color: "var(--navy)" }}
              >
                {x.naam}
              </Link>
            </li>
          ))}
        </ul>
      </Sectie>

      <PaginaSlot
        titel={t("plaatsCtaKop", { plaats: gem.naam })}
        tekst={t("plaatsCtaTekst", { tijd: BEZORGING.uitersteBesteltijd, dagen })}
        knoppen={[
          { label: nav("visschalen"), href: `/${locale}/visschalen` },
          { label: nav("visschalen"), href: `/${locale}/visschalen`, soort: "lijn" },
          {
            label: g("whatsapp"),
            href: whatsappLink(
              `Hallo Schaap's Vishandel, ik wil graag verse vis laten bezorgen in ${gem.naam}.`
            ),
            extern: true,
            soort: "lijn",
          },
        ]}
      />

    </>
  );
}
