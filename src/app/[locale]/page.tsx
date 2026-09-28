import Image from "next/image";
import Link from "next/link";
import { bestelContact } from "@/lib/bestel-contact";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { Beeld, heeftBeeld } from "@/components/ui/Beeld";

import { SeizoensBanner } from "@/components/shared/SeizoensBanner";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF, VERKOOPPUNTEN, euro, type VerkooppuntId } from "@/lib/bedrijf";
import type { BeeldNaam } from "@/lib/beeld";
import { bezorgdagenTekst } from "@/lib/bezorging";
import { VANAF_BEDRAG } from "@/lib/visschaal";
import { products, CATEGORIE_LABELS, type Categorie } from "@/lib/assortiment-data";
import { googleReviews, googleRating, googleReviewCount, googleMapsUrl } from "@/lib/reviews";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return paginaMetadata({
    locale,
    pad: "/",
    title: t("homeTitle"),
    description: t("homeDesc"),
  });
}

/* Zes producten waar we echte foto's van hebben. Liever zes echte dan twaalf
   met een tekening ertussen — een gemengde rij valt meteen op. */
const UITGELICHT = [
  "kabeljauwfilet",
  "hollandse-garnalen",
  "zeetong",
  "gerookte-heilbot",
  "coquilles",
  "haring",
];

/** Welke foto bij welk verkooppunt hoort. Zie `src/lib/beeld.ts`. */
const BEELD_PER_PUNT: Partial<Record<VerkooppuntId, BeeldNaam>> = {
  winkel: "winkelGevel",
  markt: "marktZaterdag",
  "markt-woensdag": "marktWoensdag",
  voorschoten: "marktVoorschoten",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const h = await getTranslations({ locale, namespace: "home" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });

  const v = await getTranslations({ locale, namespace: "visschaal" });

  const dagen = bezorgdagenTekst();
  const categorieAantallen = (Object.keys(CATEGORIE_LABELS) as Categorie[]).map((cat) => ({
    cat,
    aantal: products.filter((p) => p.categorie === cat).length,
  }));

  return (
    <>
      <JsonLd locale={locale} />

      {/* ── Kop ───────────────────────────────────────────────────────────── */}
      {/* Wat hier stond: "Verse vis uit de Herenstraat, nu ook bij u thuis", met
          een uitsnede van gerookte zalm ernaast. Dat maakte van tachtig jaar
          winkel een bezorgdienst die toevallig 1938 in de tekst heeft staan.
          De zaak zelf is het verhaal; bezorgen is een dienst die erbij is
          gekomen en staat daarom verderop. */}
      <section style={{ backgroundColor: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center py-12 md:py-20">
          <div>
            <p className="kapitaal mb-4">{h("eyebrow")}</p>
            <h1 className="text-[2.3rem] md:text-[3.4rem] leading-[1.08] mb-6">{h("kop")}</h1>
            <p
              className="text-[1.1rem] leading-relaxed max-w-xl mb-8"
              style={{ color: "var(--charcoal)" }}
            >
              {h("inleiding")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/assortiment`} className="knop knop-rood">
                {h("knopVandaag")}
              </Link>
              <Link href={`/${locale}/visschalen`} className="knop knop-lijn">
                {nav("visschalen")}
              </Link>
            </div>
          </div>

          {/* De winkel zelf, zodra die foto er is. Geen close-up van vis: die
              heeft elke vishandel, een gevel aan de Herenstraat niet. */}
          <Image src="/images/recepten/zalm-citroen-dille.webp" alt={locale === "nl" ? "Zalm uit de oven met citroen en dille" : locale === "de" ? "Ofenlachs mit Zitrone und Dill" : "Oven-baked salmon with lemon and dill"} width={1400} height={933} sizes="(max-width: 800px) 100vw, 50vw" className="rounded-2xl w-full" fetchPriority="high" />
        </div>
      </section>

      <SeizoensBanner locale={locale} />

      {/* ── Drie pijlers ──────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <Kop label={h("pijlerLabel")} titel={h("pijlerKop")} />
        <ul className="grid sm:grid-cols-3 gap-x-8 gap-y-10">
          {[
            {
              beeld: "gebakkenVis" as const,
              kop: h("pijlerGebakkenKop"),
              tekst: h("pijlerGebakkenTekst"),
              href: `/${locale}/assortiment`,
            },
            {
              beeld: "toonbank" as const,
              kop: h("pijlerVersKop"),
              tekst: h("pijlerVersTekst"),
              href: `/${locale}/assortiment`,
            },
            {
              beeld: "schaalBorrel" as const,
              kop: h("pijlerSchaalKop"),
              tekst: h("pijlerSchaalTekst"),
              href: `/${locale}/visschalen`,
            },
          ].map(({ beeld, kop, tekst, href }) => (
            <li key={kop}>
              <Link href={href} className="group block">
                <Beeld naam={beeld} verhouding="liggend" streep="var(--navy)" />
                <h3 className="text-[1.3rem] mt-4 mb-2 group-hover:underline underline-offset-4">
                  {kop}
                </h3>
                <p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>
                  {tekst}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Sectie>

      {/* ── Sinds 1938 ────────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className={`grid ${heeftBeeld("historie1938") ? "lg:grid-cols-[0.95fr_1.05fr]" : "max-w-3xl"} gap-10 lg:gap-16 items-center`}>
          <Beeld naam="historie1938" streep="var(--navy)" />
          <div>
            <Kop label={h("verhaalLabel")} titel={h("verhaalKop")} />
            <p className="lees mb-7" style={{ color: "var(--charcoal)" }}>
              {h("verhaalTekst")}
            </p>
            <blockquote
              className="text-[1.5rem] md:text-[1.8rem] leading-[1.35] italic mb-3"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              &ldquo;{h("verhaalCitaat")}&rdquo;
            </blockquote>
            <p className="text-sm mb-7" style={{ color: "var(--grijs)" }}>
              &mdash; {h("verhaalBron")}
            </p>
            <Link
              href={`/${locale}/ons-verhaal`}
              className="font-semibold underline underline-offset-4"
              style={{ color: "var(--navy)" }}
            >
              {h("verhaalLink")} &rarr;
            </Link>
          </div>
        </div>
      </Sectie>

      {/* ── Gebakken vis ──────────────────────────────────────────────────── */}
      {/* Dit stond alleen als "dit bezorgen we niet" onder het bezorgblok. Voor
          een zaak die er juist om bekendstaat is dat de verkeerde kant van
          hetzelfde verhaal. */}
      <Sectie grond="papier">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
          <div>
            <Kop label={h("gebakkenLabel")} titel={h("gebakkenKop")} />
            <p className="lees mb-6" style={{ color: "var(--charcoal)" }}>
              {h("gebakkenTekst")}
            </p>
            <p
              className="lees pl-5 mb-7"
              style={{ borderLeft: "2px solid var(--gold)", color: "var(--charcoal)" }}
            >
              {h("gebakkenNiet")}
            </p>
            <Link href={`/${locale}/bezoek-ons`} className="knop knop-navy">
              {h("gebakkenLink")}
            </Link>
          </div>
          <Beeld naam="gebakkenVis" streep="var(--rood)" />
        </div>
      </Sectie>

      {/* ── Drie feiten ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-8">
        <dl className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-6">
          {[
            [h("feit1Kop"), h("feit1Tekst", { dagen })],
            [h("feit2Kop"), h("feit2Tekst")],
            [h("feit3Kop"), h("feit3Tekst")],
          ].map(([kop, tekst]) => (
            <div key={kop}>
              <dt className="kapitaal kapitaal-licht mb-1">{kop}</dt>
              <dd style={{ color: "var(--cream)", fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>
                {tekst}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Visschalen ────────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <Beeld naam="schaalBorrel" verhouding="liggend" streep="var(--navy)" />
          </div>
          <div className="order-1 lg:order-2">
            <Kop label={h("visschaalLabel")} titel={h("visschaalKop")} />
            <p className="lees mb-7" style={{ color: "var(--charcoal)" }}>
              {h("visschaalTekst")}
            </p>
            <p className="mb-8">
              <span className="kapitaal block mb-1.5">{h("visschaalVanaf")}</span>
              <span
                className="bedrag text-[2.6rem] leading-none"
                style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
              >
                {euro(VANAF_BEDRAG)}
              </span>
              <span className="ml-2 text-[0.95rem]" style={{ color: "var(--grijs)" }}>
                {v("perSchaal")}
              </span>
            </p>
            <Link href={`/${locale}/visschalen`} className="knop knop-rood">
              {h("visschaalLink")}
            </Link>
          </div>
        </div>
      </Sectie>

      {/* ── Assortiment ───────────────────────────────────────────────────── */}
      {/* Wit als ondergrond, met opzet: de productfoto's zijn uitsneden op wit.
          Op een zandkleurig vlak worden dat harde witte rechthoeken die eruit
          zien als kapotte plaatjes. Op wit ligt de vis gewoon op de pagina. */}
      <Sectie grond="wit">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16">
          <div>
            <Kop label={h("assortimentLabel")} titel={h("assortimentKop")} />
            <p className="leading-relaxed mb-6" style={{ color: "var(--charcoal)" }}>
              {h("assortimentTekst")}
            </p>
            <ul className="mb-7">
              {categorieAantallen.map(({ cat, aantal }) => (
                <li
                  key={cat}
                  className="flex items-baseline justify-between gap-4 py-2.5"
                  style={{ borderTop: "1px solid var(--linen)" }}
                >
                  <span style={{ color: "var(--ink)", fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>
                    {CATEGORIE_LABELS[cat]}
                  </span>
                  <span className="text-sm bedrag" style={{ color: "var(--grijs)" }}>
                    {h("assortimentAantal", { aantal })}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/assortiment`}
              className="font-semibold underline underline-offset-4"
              style={{ color: "var(--navy)" }}
            >
              {h("assortimentLink")} &rarr;
            </Link>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
            {UITGELICHT.map((slug) => {
              const p = products.find((x) => x.slug === slug);
              if (!p) return null;
              return (
                <li key={slug}>
                  <Link href={`/${locale}/assortiment/${p.slug}`} className="block group">
                    {/* Geen kader en geen eigen achtergrond: de uitsnede staat
                        al op wit, dus zo lijkt de vis op de pagina te liggen. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.photo}
                      alt={`${p.naam} bij Schaap's Vishandel in Leiden`}
                      loading="lazy"
                      className="w-full aspect-[3/2] object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                    <span
                      className="block mt-3 pt-2.5 text-[1rem] group-hover:underline underline-offset-4"
                      style={{
                        color: "var(--ink)",
                        fontFamily: "var(--font-display)",
                        borderTop: "1px solid var(--linen)",
                      }}
                    >
                      {p.naam}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Sectie>

      <Sectie grond="zand"><Kop label={locale === "nl" ? "Van de toonbank naar uw keuken" : "Recepten · Nederlands"} titel={locale === "nl" ? "Wat eten we vanavond?" : "Cooking inspiration"} intro={locale === "nl" ? "Zalm uit de oven, romige pasta of kabeljauw met citroen: vind een gerecht op vissoort, bereidingstijd en moeilijkheid." : "Discover our Dutch-language fish recipes."} /><div className="flex flex-wrap gap-3"><Link href="/nl/recepten" className="knop knop-navy">{nav("recepten")}</Link><Link href="/nl/blog" className="knop knop-lijn">{nav("blog")}</Link></div></Sectie>

      {/* ── Herkomst ──────────────────────────────────────────────────────── */}
      <Sectie grond="navy" smal>
        <Kop label={h("biologischLabel")} titel={h("biologischKop")} donker />
        <p className="lees mb-7" style={{ color: "rgba(250,246,239,0.8)" }}>
          {h("biologischTekst")}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/${locale}/biologische-vis`} className="knop knop-lijn-licht">
            {h("biologischLink")}
          </Link>
          <Link href={`/${locale}/varlaks`} className="knop knop-lijn-licht">
            {h("varlaksLink")}
          </Link>
        </div>
      </Sectie>

      {/* ── Beoordelingen ─────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <Kop label={h("reviewLabel")} titel={h("reviewKop")} />
          <p className="mb-8" style={{ color: "var(--charcoal)" }}>
            <span className="bedrag text-[1.6rem] font-semibold" style={{ color: "var(--navy)" }}>
              {googleRating}
            </span>
            <span className="text-sm" style={{ color: "var(--grijs)" }}>
              {" "}
              / 5 &middot; {googleReviewCount}
            </span>
          </p>
        </div>

        <ul className="grid md:grid-cols-3 gap-x-8">
          {googleReviews.slice(0, 3).map((review) => (
            <li key={review.name} className="pt-4" style={{ borderTop: "2px solid var(--navy)" }}>
              <blockquote
                className="text-[0.98rem] leading-relaxed mb-3"
                style={{ color: "var(--charcoal)" }}
              >
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <p className="text-sm" style={{ color: "var(--grijs)" }}>
                {review.name} &middot; {review.date}
              </p>
            </li>
          ))}
        </ul>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 font-semibold underline underline-offset-4"
          style={{ color: "var(--navy)" }}
        >
          {h("reviewAlle", { aantal: googleReviewCount })} &rarr;
        </a>
      </Sectie>

      {/* ── Waar u ons vindt ──────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <Kop label={h("locatiesLabel")} titel={h("locatiesKop")} />
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {VERKOOPPUNTEN.map((punt) => (
            <li key={punt.id}>
              {/* Een foto per plek: zo weet iemand letterlijk waar hij naar
                  moet zoeken — de kraam bij de Waag ziet er anders uit dan de
                  kraam op de parkeerplaats bij Hoogvliet. */}
              {BEELD_PER_PUNT[punt.id] && (
                <Beeld
                  naam={BEELD_PER_PUNT[punt.id]!}
                  verhouding="liggend"
                  streep="var(--navy)"
                  klasse="mb-4"
                />
              )}
              <h3 className="text-[1.2rem] mb-1">{punt.naam}</h3>
              <p style={{ color: "var(--charcoal)" }}>
                {punt.adres}
                <br />
                {punt.plaats}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--grijs)" }}>
                {punt.dagen}
              </p>
              <a
                href={punt.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm font-semibold underline underline-offset-4"
                style={{ color: "var(--navy)" }}
              >
                {h("routeLink")} &rarr;
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 pt-8" style={{ borderTop: "1px solid var(--linen)", color: "var(--charcoal)" }}>
          <a
            href={`tel:${BEDRIJF.telefoon.e164}`}
            className="font-semibold underline underline-offset-4"
            style={{ color: "var(--navy)" }}
          >
            {g("bellen", { nummer: BEDRIJF.telefoon.weergave })}
          </a>{" "}
          &middot;{" "}
          <Link href={`/${locale}/bezoek-ons`} className="underline underline-offset-4">
            {nav("locaties")}
          </Link>
        </p>
      </Sectie>

      <PaginaSlot
        titel={g("slotTitel")}
        tekst={g("slotTekst")}
        knoppen={[
          { label: nav("visschalen"), href: `/${locale}/visschalen` },
          { ...bestelContact(locale), extern: true, soort: "lijn" },
          { label: nav("locaties"), href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
      />
    </>
  );
}
