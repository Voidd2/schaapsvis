import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { PostcodeCheck } from "@/components/bezorgen/PostcodeCheck";
import { SeizoensBanner } from "@/components/shared/SeizoensBanner";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF, VERKOOPPUNTEN, euro } from "@/lib/bedrijf";
import { BEZORGING, GEMEENTEN, bezorgdagenTekst } from "@/lib/bezorging";
import { ONDERDELEN } from "@/lib/visschaal";
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const h = await getTranslations({ locale, namespace: "home" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });
  const b = await getTranslations({ locale, namespace: "bezorgen" });
  const v = await getTranslations({ locale, namespace: "visschaal" });

  const dagen = bezorgdagenTekst();
  // De goedkoopste regel per 100 gram — daarmee kan de homepage "vanaf" zeggen
  // zonder dat er ergens een tweede bedrag onderhouden moet worden.
  const goedkoopstePer100 = Math.min(
    ...ONDERDELEN.filter((o) => !o.perStuk).map((o) => o.prijs)
  );
  const categorieAantallen = (Object.keys(CATEGORIE_LABELS) as Categorie[]).map((cat) => ({
    cat,
    aantal: products.filter((p) => p.categorie === cat).length,
  }));

  return (
    <>
      <JsonLd locale={locale} />

      {/* ── Kop ───────────────────────────────────────────────────────────── */}
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
              <Link href={`/${locale}/bestellen`} className="knop knop-rood">
                {h("knopBestellen")}
              </Link>
              <Link href={`/${locale}/visschalen`} className="knop knop-lijn">
                {h("knopVisschaal")}
              </Link>
            </div>
          </div>

          {/* Eén stuk vis, groot en op wit, met een bijschrift eronder — als een
              plaat in een catalogus. De tekenfilm-winkelpui die hier stond zag
              er naast de echte productfoto's uit als plaatjesvulling.
              De foto's zijn 300×200: daarom tonen we ze op ware grootte in een
              royaal wit vlak in plaats van uitgerekt over de hele kolom. */}
          <figure
            className="w-full flex flex-col justify-center py-10 px-6"
            style={{ backgroundColor: "#fff", border: "1px solid var(--linen)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/producten/gerookte-zalm-high-seas.png"
              alt="Gerookte zalm van het mes gesneden bij Schaap's Vishandel aan de Herenstraat in Leiden"
              width={300}
              height={200}
              className="w-full max-w-[22rem] mx-auto h-auto"
            />
            <figcaption
              className="mt-6 pt-3 text-center text-[0.95rem] mx-auto w-full max-w-[22rem]"
              style={{
                borderTop: "1px solid var(--linen)",
                color: "var(--ink)",
                fontFamily: "var(--font-display)",
              }}
            >
              {h("heroBijschrift")}
            </figcaption>
          </figure>
        </div>
      </section>

      <SeizoensBanner locale={locale} />

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

      {/* ── Bezorgen ──────────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16">
          <div>
            <Kop label={h("bezorgLabel")} titel={h("bezorgKop")} />
            <p className="lees mb-7" style={{ color: "var(--charcoal)" }}>
              {h("bezorgTekst")}
            </p>

            <div className="grid sm:grid-cols-2 gap-8 mb-8">
              {[
                { kop: h("bezorgWelKop"), kleur: "var(--seafoam)", regels: [h("bezorgWel1"), h("bezorgWel2")] },
                { kop: h("bezorgNietKop"), kleur: "var(--grijs)", regels: [h("bezorgNiet1"), h("bezorgNiet2")] },
              ].map(({ kop, kleur, regels }) => (
                <div key={kop}>
                  <h3 className="kapitaal mb-2" style={{ color: kleur }}>
                    {kop}
                  </h3>
                  <ul className="text-[0.96rem]" style={{ color: "var(--charcoal)" }}>
                    {regels.map((regel) => (
                      <li
                        key={regel}
                        className="py-2 leading-snug"
                        style={{ borderTop: "1px solid var(--linen)" }}
                      >
                        {regel}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="text-[0.95rem] mb-5" style={{ color: "var(--charcoal)" }}>
              {b("dagen", { dagen })} {b("besteltijd", { tijd: BEZORGING.uitersteBesteltijd })}{" "}
              {b("gratisVanaf", { bedrag: euro(BEZORGING.gratisVanaf) })}
            </p>

            <Link
              href={`/${locale}/bezorgen`}
              className="font-semibold underline underline-offset-4"
              style={{ color: "var(--navy)" }}
            >
              {h("bezorgLink")} &rarr;
            </Link>
          </div>

          <div
            className="p-6 md:p-7 self-start"
            style={{ backgroundColor: "#fff", border: "1px solid var(--linen)" }}
          >
            <h3 className="text-[1.3rem] mb-1">{b("checkKop")}</h3>
            <p className="text-sm mb-4" style={{ color: "var(--grijs)" }}>
              {b("checkTekst")}
            </p>
            <PostcodeCheck />
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {GEMEENTEN.map((gem) => (
                <li key={gem.slug}>
                  <Link
                    href={`/${locale}/bezorgen/${gem.slug}`}
                    className="underline underline-offset-4"
                    style={{ color: "var(--navy)" }}
                  >
                    {gem.naam}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sectie>

      {/* ── Visschalen ────────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
          <figure
            className="w-full flex flex-col justify-center py-10 px-6 order-2 lg:order-1"
            style={{ backgroundColor: "#fff", border: "1px solid var(--linen)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/producten/hollandse-garnalen.png"
              alt="Hollandse garnalen voor een visschaal van Schaap's Vishandel in Leiden"
              width={300}
              height={200}
              loading="lazy"
              className="w-full max-w-[20rem] mx-auto h-auto"
            />
            <figcaption
              className="mt-6 pt-3 text-center text-[0.95rem] mx-auto w-full max-w-[20rem]"
              style={{
                borderTop: "1px solid var(--linen)",
                color: "var(--ink)",
                fontFamily: "var(--font-display)",
              }}
            >
              {h("visschaalBijschrift")}
            </figcaption>
          </figure>
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
                {euro(goedkoopstePer100)}
              </span>
              <span className="ml-2 text-[0.95rem]" style={{ color: "var(--grijs)" }}>
                {v("per100")}
              </span>
            </p>
            <Link href={`/${locale}/visschalen`} className="knop knop-rood">
              {h("visschaalLink")}
            </Link>
          </div>
        </div>
      </Sectie>

      {/* ── Ons verhaal ───────────────────────────────────────────────────── */}
      {/* Zonder afbeelding: het citaat van Aldert is hier het sterkste wat we
          hebben, en dat verdient de ruimte. Zodra er een echte foto van de
          winkel is, kan die hier links naast. */}
      <Sectie grond="papier">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-20">
          <div>
            <Kop label={h("verhaalLabel")} titel={h("verhaalKop")} />
            <Link
              href={`/${locale}/ons-verhaal`}
              className="font-semibold underline underline-offset-4"
              style={{ color: "var(--navy)" }}
            >
              {h("verhaalLink")} &rarr;
            </Link>
          </div>
          <div>
            <p className="lees mb-8" style={{ color: "var(--charcoal)" }}>
              {h("verhaalTekst")}
            </p>
            <blockquote
              className="text-[1.6rem] md:text-[1.9rem] leading-[1.35] italic mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              &ldquo;{h("verhaalCitaat")}&rdquo;
            </blockquote>
            <p className="text-sm" style={{ color: "var(--grijs)" }}>
              &mdash; {h("verhaalBron")}
            </p>
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
                      src={`/images/producten/${slug}.png`}
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
            <li key={punt.id} className="pt-4" style={{ borderTop: "2px solid var(--navy)" }}>
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
          { label: nav("bestellen"), href: `/${locale}/bestellen`, soort: "lijn" },
          { label: nav("locaties"), href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
      />
    </>
  );
}
