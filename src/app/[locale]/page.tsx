import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localLocations } from "@/lib/local-pages-copy";
import { CATEGORY_NAMES, localizeProduct } from "@/lib/product-localization";
import { productPhoto } from "@/lib/product-beeld";
import { bestelContact } from "@/lib/bestel-contact";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { Beeld } from "@/components/ui/Beeld";
import { heeftBeeld } from "@/lib/beeld";

import { SeizoensBanner } from "@/components/shared/SeizoensBanner";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF, type VerkooppuntId } from "@/lib/bedrijf";
import type { BeeldNaam } from "@/lib/beeld";
import { bezorgdagenTekst } from "@/lib/bezorging";
import { products, CATEGORIE_LABELS, type Categorie } from "@/lib/assortiment-data";
import { googleReviews, googleRating, googleReviewCount, googleMapsUrl, localizeReview } from "@/lib/reviews";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
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
  "varlaks-zalm",
  "kibbeling",
  "hollandse-garnalen",
  "scholfilet",
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

const LOCATIE_PAGINA: Record<VerkooppuntId, string> = {
  winkel: "/viswinkel-leiden",
  markt: "/marktkraam-leiden",
  "markt-woensdag": "/marktkraam-leiden",
  voorschoten: "/viswinkel-voorschoten",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const h = await getTranslations({ locale, namespace: "home" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });

  const dagen = bezorgdagenTekst(locale);
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
      <section className="home-hero" style={{ backgroundColor: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1.02fr_0.98fr] gap-10 lg:gap-16 items-center py-12 md:py-20">
          <div>
            <div className="home-hero-kicker mb-5">
              <span className="home-hero-dot" aria-hidden />
              <p className="kapitaal">{h("eyebrow")}</p>
            </div>
            <h1 className="text-[2.3rem] md:text-[3.4rem] leading-[1.08] mb-6">{h("kop")}</h1>
            <p
              className="text-[1.1rem] leading-relaxed max-w-xl mb-8"
              style={{ color: "var(--charcoal)" }}
            >
              {h("inleiding")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/assortiment`} className="knop knop-navy">
                {h("knopVandaag")}
              </Link>
              <Link href={`/${locale}/visschalen`} className="knop knop-lijn">
                {nav("visschalen")}
              </Link>
            </div>
            <dl className="home-hero-facts mt-9">
              <div><dt>{locale === "nl" ? "Sinds" : locale === "de" ? "Seit" : "Since"}</dt><dd>1938</dd></div>
              <div><dt>{locale === "nl" ? "Vers" : locale === "de" ? "Frisch" : "Fresh"}</dt><dd>{locale === "nl" ? "elke dag" : locale === "de" ? "jeden Tag" : "every day"}</dd></div>
              <div><dt>{locale === "nl" ? "Kom langs" : locale === "de" ? "Besuchen Sie uns" : "Visit us"}</dt><dd>Leiden</dd></div>
            </dl>
          </div>

          {/* De winkel zelf, zodra die foto er is. Geen close-up van vis: die
              heeft elke vishandel, een gevel aan de Herenstraat niet. */}
          <div className="home-hero-image-wrap">
            <Image src="/images/recepten/zalm-citroen-dille.webp" alt={locale === "nl" ? "Zalm uit de oven met citroen en dille" : locale === "de" ? "Ofenlachs mit Zitrone und Dill" : "Oven-baked salmon with lemon and dill"} width={1400} height={933} sizes="(max-width: 800px) 100vw, 50vw" className="home-hero-image" fetchPriority="high" />
            <span className="home-hero-image-label">{locale === "nl" ? "Herenstraat 48 · Leiden" : locale === "de" ? "Herenstraat 48 · Leiden" : "Herenstraat 48 · Leiden"}</span>
          </div>
        </div>
      </section>

      <SeizoensBanner locale={locale} />

      <section className="home-quicklinks" aria-labelledby="home-quicklinks-title">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-5 mb-7">
            <div>
              <p className="kapitaal mb-2">{locale === "nl" ? "Kies waar u zin in heeft" : locale === "de" ? "Wählen Sie Ihren Geschmack" : "Choose what you are craving"}</p>
              <h2 id="home-quicklinks-title" className="text-[1.8rem] md:text-[2.35rem] leading-tight">{locale === "nl" ? "Van toonbank tot tafel." : locale === "de" ? "Von der Fischtheke auf den Tisch." : "From our counter to your table."}</h2>
            </div>
            <Link href={`/${locale}/assortiment`} className="font-semibold underline underline-offset-4" style={{ color: "var(--navy)" }}>{h("assortimentLink")} →</Link>
          </div>
          <ul className="home-quicklinks-grid">
            {[
              [locale === "nl" ? "Verse vis" : locale === "de" ? "Frischer Fisch" : "Fresh fish", locale === "nl" ? "Voor vanavond" : locale === "de" ? "Für heute Abend" : "For tonight", `/${locale}/assortiment`, "toonbank"],
              [locale === "nl" ? "Visschalen" : locale === "de" ? "Fischplatten" : "Seafood platters", locale === "nl" ? "Voor samen delen" : locale === "de" ? "Zum Teilen" : "For sharing", `/${locale}/visschalen`, "schaalBorrel"],
              [locale === "nl" ? "Barbecue & gourmet" : "Barbecue & gourmet", locale === "nl" ? "Voor een lange avond" : locale === "de" ? "Für einen langen Abend" : "For a long evening", `/${locale}/barbecue-gourmet`, "gebakkenVis"],
              [locale === "nl" ? "Feestdagen" : locale === "de" ? "Festtage" : "Festive season", locale === "nl" ? "Voor december" : locale === "de" ? "Für Dezember" : "For December", `/${locale}/feestdagen`, "schaalFeest"],
            ].map(([label, sub, href, beeld]) => (
              <li key={href}>
                <Link href={href} className="home-quicklink-card group">
                  <Beeld naam={beeld as BeeldNaam} verhouding="liggend" streep="var(--navy)" />
                  <span className="home-quicklink-body"><strong>{label}</strong><small>{sub}</small><span aria-hidden>→</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* De seizoensroute staat vroeg op de homepage: bezoekers die in oktober
          en december binnenkomen hoeven niet eerst door het hele assortiment.
          Het patroon is geïnspireerd op sterke webshops, maar inhoud, beelden
          en bestelwijze zijn bewust van Schaap's zelf. */}
      <Sectie grond="navy">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-16 items-center">
          <div>
            <Kop
              label={locale === "nl" ? "December bij Schaap’s" : locale === "de" ? "Dezember bei Schaap’s" : "December at Schaap’s"}
              titel={locale === "nl" ? "Feestdagen 2026: goed voorbereid aan tafel" : locale === "de" ? "Festtage 2026: gut vorbereitet genießen" : "Festive season 2026: plan a table worth sharing"}
              intro={locale === "nl" ? "Bekijk visschalen, gourmet, gerookte zalm, oesters en relatiegeschenken. Geen onzekere voorraadknoppen: we stemmen inhoud, hoeveelheid en prijs persoonlijk met u af." : locale === "de" ? "Entdecken Sie Fischplatten, Gourmet, Räucherlachs, Austern und Firmengeschenke. Inhalt, Menge und Preis stimmen wir persönlich ab." : "Explore seafood platters, gourmet, smoked salmon, oysters and business gifts. We agree contents, quantity and price personally."}
              donker
            />
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/feestdagen`} className="knop knop-rood">
                {locale === "nl" ? "Bekijk Feestdagen 2026" : locale === "de" ? "Festtage 2026 ansehen" : "Explore festive season 2026"}
              </Link>
              <Link href={`/${locale}/relatiegeschenken`} className="knop knop-lijn-licht">
                {locale === "nl" ? "Relatiegeschenken" : locale === "de" ? "Firmengeschenke" : "Business gifts"}
              </Link>
            </div>
            <ul className="grid sm:grid-cols-3 gap-4 mt-9 pt-7" style={{ borderTop: "1px solid rgba(250,246,239,0.2)" }}>
              {[
                [locale === "nl" ? "Visschalen" : locale === "de" ? "Fischplatten" : "Seafood platters", `/${locale}/visschalen`],
                [locale === "nl" ? "Gourmet" : "Gourmet", `/${locale}/barbecue-gourmet`],
                [locale === "nl" ? "Cadeaus" : locale === "de" ? "Geschenke" : "Gifts", `/${locale}/relatiegeschenken`],
              ].map(([label, href]) => <li key={href}><Link href={href} className="font-semibold underline underline-offset-4" style={{ color: "var(--cream)" }}>{label} →</Link></li>)}
            </ul>
          </div>
          <Link href={`/${locale}/feestdagen`} className="group block overflow-hidden rounded-2xl border border-white/20 shadow-xl">
            <Image src="/images/editorial/feestschaal-voorbeeld.webp" alt={locale === "nl" ? "Voorbeeld van een feestelijke visschaal" : locale === "de" ? "Beispiel einer festlichen Fischplatte" : "Example festive seafood platter"} width={1200} height={800} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
          </Link>
        </div>
      </Sectie>

      {/* Locatie-informatie direct boven de hoofdkeuzes: bezoekers zien meteen
          waar en wanneer ze ons kunnen bezoeken, met een route én lokale uitleg. */}
      <Sectie grond="zand">
        <Kop label={h("locatiesLabel")} titel={h("locatiesKop")} />
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {localLocations(locale).map((punt) => (
            <li key={punt.id}>
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
              <Link
                href={`/${locale}${LOCATIE_PAGINA[punt.id]}`}
                className="block mt-3 font-semibold underline underline-offset-4"
              >
                {punt.id === "voorschoten"
                  ? locale === "nl"
                    ? "Visboer Voorschoten: vrijdag bij Hoogvliet"
                    : locale === "de"
                      ? "Fischstand in Voorschoten: freitags bei Hoogvliet"
                      : "Fish stall in Voorschoten: Fridays at Hoogvliet"
                  : locale === "nl"
                    ? "Bekijk deze locatie"
                    : locale === "de"
                      ? "Standort ansehen"
                      : "Explore this location"} →
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 pt-6" style={{ borderTop: "1px solid var(--linen)", color: "var(--charcoal)" }}>
          <a href={`tel:${BEDRIJF.telefoon.e164}`} className="font-semibold underline underline-offset-4" style={{ color: "var(--navy)" }}>
            {g("bellen", { nummer: BEDRIJF.telefoon.weergave })}
          </a>{" "}&middot;{" "}
          <Link href={`/${locale}/bezoek-ons`} className="underline underline-offset-4">{nav("locaties")}</Link>
        </p>
      </Sectie>

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
            <Link href={`/${locale}/visschalen`} className="knop knop-navy">
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
                    {CATEGORY_NAMES[locale as "nl"|"en"|"de"][cat]}
                  </span>
                  <span className="text-sm bedrag" style={{ color: "var(--grijs)" }}>
                    {h(aantal === 1 ? "assortimentAantalEen" : "assortimentAantal", { aantal })}
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
              const bron = products.find((x) => x.slug === slug);
              if (!bron) return null;
              const p = localizeProduct(bron,locale), photo = productPhoto(p,locale);
              if(!photo) return null;
              return (
                <li key={slug}>
                  <Link href={`/${locale}/assortiment/${p.slug}`} className="block group">
                    {/* Geen kader en geen eigen achtergrond: de uitsnede staat
                        al op wit, dus zo lijkt de vis op de pagina te liggen. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      width={1400}
                      height={933}
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

      <Sectie grond="zand"><Kop label={locale === "nl" ? "Van de toonbank naar uw keuken" : locale === "de" ? "Von der Fischtheke in Ihre Küche" : "From our fish counter to your kitchen"} titel={locale === "nl" ? "Wat eten we vanavond?" : locale === "de" ? "Was kochen wir heute Abend?" : "What shall we cook tonight?"} intro={locale === "nl" ? "Zalm uit de oven, romige pasta of kabeljauw met citroen: vind een gerecht op vissoort, bereidingstijd en moeilijkheid." : locale === "de" ? "Lachs aus dem Ofen, cremige Pasta oder Kabeljau mit Zitrone: Finden Sie ein Gericht nach Fischart, Zubereitungszeit und Schwierigkeit." : "Oven-baked salmon, creamy pasta or cod with lemon: find a dish by fish type, cooking time and difficulty."} /><div className="flex flex-wrap gap-3"><Link href={`/${locale}/recepten`} className="knop knop-navy">{nav("recepten")}</Link><Link href={`/${locale}/blog`} className="knop knop-lijn">{nav("blog")}</Link></div></Sectie>

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
          {googleReviews.slice(0, 3).map((review) => localizeReview(review, locale)).map((review) => (
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
              {locale !== "nl" && <p className="text-xs mt-1" style={{color:"var(--grijs)"}}>{locale === "de" ? "Aus dem Niederländischen übersetzt." : "Translated from Dutch."}</p>}
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

