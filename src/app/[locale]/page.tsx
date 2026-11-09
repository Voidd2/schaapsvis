import { productHref } from "@/lib/product-href";
import { ShopHours } from "@/components/shared/ShopHours";
import { PlatterPhotoNote } from "@/components/PlatterPhotoNote";
import { StaticResponsiveImage as Image } from "@/components/StaticResponsiveImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localLocations } from "@/lib/local-pages-copy";
import { localizeProduct } from "@/lib/product-localization";
import { productPhoto } from "@/lib/product-beeld";
import { bestelContact } from "@/lib/bestel-contact";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { Beeld } from "@/components/ui/Beeld";
import { heeftBeeld, homepageHeroBeeld } from "@/lib/beeld";

import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF, type VerkooppuntId } from "@/lib/bedrijf";
import type { BeeldNaam } from "@/lib/beeld";
import { products } from "@/lib/assortiment-data";
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

  const heroBeeld = homepageHeroBeeld(locale);

  return (
    <div className="home-page">
      <JsonLd locale={locale} />

      <section className="home-hero" style={{ backgroundColor: "var(--cream)" }}>
        <div className="site-container grid md:grid-cols-[1.02fr_0.98fr] gap-10 lg:gap-16 items-center py-8 md:py-12">
          <div>
            <div className="home-hero-kicker mb-5">
              <span className="home-hero-dot" aria-hidden />
              <p className="kapitaal">{h("eyebrow")}</p>
            </div>
            <h1 className="text-[2.3rem] md:text-[3.4rem] leading-[1.08] mb-6">{locale === "nl" ? "Schaap’s Vishandel in Leiden" : locale === "de" ? "Schaap’s Fischgeschäft in Leiden" : "Schaap’s fish shop in Leiden"}</h1>
            <p
              className="text-[1.1rem] leading-relaxed max-w-xl mb-8"
              style={{ color: "var(--charcoal)" }}
            >
              {h("inleiding")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/bezoek-ons`} className="knop knop-navy">{locale === "nl" ? "Route en openingstijden" : locale === "de" ? "Anfahrt und Öffnungszeiten" : "Directions and opening hours"} →</Link>
              <Link href={`/${locale}/assortiment`} className="knop knop-lijn">{h("knopVandaag")}</Link>
            </div>

          </div>

          {/* De winkel zelf, zodra die foto er is. Geen close-up van vis: die
              heeft elke vishandel, een gevel aan de Herenstraat niet. */}
          <div className="home-hero-image-wrap">
            <Image src={heroBeeld.src} alt={heroBeeld.alt} width={1400} height={933} sizes="(max-width: 800px) 100vw, 50vw" className="home-hero-image" loading="eager" fetchPriority="high" />
            <span className="home-hero-image-label">{heroBeeld.caption}</span>
          </div>
        </div>
      </section>

      <Sectie grond="wit">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-7">
          <Kop label={h("assortimentLabel")} titel={locale === "nl" ? "Geliefd aan onze toonbank" : locale === "de" ? "Beliebt an unserer Fischtheke" : "Fish counter favourites"} />
          <Link href={`/${locale}/assortiment`} className="collection-text-link">{h("assortimentLink")} →</Link>
        </div>
          <ul className="home-products grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
            {UITGELICHT.map((slug) => {
              const bron = products.find((x) => x.slug === slug);
              if (!bron) return null;
              const p = localizeProduct(bron,locale), photo = productPhoto(p,locale);
              if(!photo) return null;
              return (
                <li key={slug}>
                  <Link href={productHref(locale, p.slug)} className="home-product-card block group">
                    {/* Geen kader en geen eigen achtergrond: de uitsnede staat
                        al op wit, dus zo lijkt de vis op de pagina te liggen. */}
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={1400}
                      height={933}
                      sizes="(max-width: 639px) 50vw, (max-width: 1536px) 33vw, 480px"
                      loading="lazy"
                      className="w-full aspect-[3/2] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
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
      </Sectie>
      {/* ── Visschalen ────────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <Beeld naam="schaalBorrel" verhouding="liggend" streep="var(--navy)" />
            <p className="mt-3"><PlatterPhotoNote locale={locale} /></p>
          </div>
          <div className="order-1 lg:order-2">
            <Kop label={h("visschaalLabel")} titel={h("visschaalKop")} />
            <p className="lees mb-7" style={{ color: "var(--charcoal)" }}>
              {h("visschaalTekst")}
            </p>
            <Link href={`/${locale}/visschalen`} className="knop knop-navy">
              {h("visschaalLink")}
            </Link>
            <div className="mt-5 flex flex-wrap gap-5"><Link href={`/${locale}/feestdagen`} className="season-link">{locale === "nl" ? "Feestdagen" : locale === "de" ? "Festtage" : "Festive season"} →</Link><Link href={`/${locale}/barbecue-gourmet`} className="collection-text-link">Barbecue & gourmet →</Link></div>
          </div>
        </div>
      </Sectie>

      <Sectie grond="wit">
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
              {punt.id === "winkel" ? <ShopHours locale={locale} /> : <p className="text-sm mt-1">{punt.dagen}</p>}
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

      {/* ── Sinds 1938 ────────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className={`home-story ${heeftBeeld("historie1938") ? "home-story-with-photo" : ""}`}>
          {heeftBeeld("historie1938") && <Beeld naam="historie1938" streep="var(--navy)" />}
          <div className="home-story-narrative">
            <Kop label={h("verhaalLabel")} titel={h("verhaalKop")} />
            <p className="lees mb-6">{h("verhaalTekst")}</p>
            <Link href={`/${locale}/ons-verhaal`} className="font-semibold underline underline-offset-4">{h("verhaalLink")} →</Link>
          </div>
          <figure className="home-story-quote">
            <blockquote>&ldquo;{h("verhaalCitaat")}&rdquo;</blockquote>
            <figcaption>&mdash; {h("verhaalBron")}</figcaption>
          </figure>
        </div>
      </Sectie>

      <section className="home-student"><div className="section-wrap">
        <strong className="home-student-discount">10<span>%</span></strong>
        <div><p className="kapitaal">{nav("studentenkorting")}</p><h2>{locale === "nl" ? "Student? Eet lekker mee." : locale === "de" ? "Du studierst? Iss gut bei uns." : "Student? Eat well with us."}</h2><p>{locale === "nl" ? "Na goedkeuring korting op het hele assortiment. Bekijk de voorwaarden en vraag je studentenpas aan." : locale === "de" ? "Nach Freigabe Rabatt auf das gesamte Sortiment. Bedingungen ansehen und Studentenpass beantragen." : "After approval, enjoy a discount on the entire range. See the conditions and apply for your student pass."}</p></div>
        <Link href={`/${locale}/studentenkorting`} className="knop knop-navy">{nav("studentenkorting")} →</Link>
      </div></section>
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
    </div>
  );
}

