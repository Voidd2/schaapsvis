import Image from "next/image";
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
import { heeftBeeld } from "@/lib/beeld";

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

  return (
    <>
      <JsonLd locale={locale} />

      <section className="home-hero" style={{ backgroundColor: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1.02fr_0.98fr] gap-10 lg:gap-16 items-center py-8 md:py-12">
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
                {locale === "nl" ? "Bekijk onze visschalen" : nav("visschalen")}
              </Link>
            </div>
            <Link href={`/${locale}/bezoek-ons`} className="home-visit-link">{locale === "nl" ? "Winkel, marktdagen & openingstijden" : locale === "de" ? "Geschäft, Märkte & Öffnungszeiten" : "Shop, markets & opening hours"} →</Link>

          </div>

          {/* De winkel zelf, zodra die foto er is. Geen close-up van vis: die
              heeft elke vishandel, een gevel aan de Herenstraat niet. */}
          <div className="home-hero-image-wrap">
            <Image src="/images/recepten/zalm-citroen-dille.webp" alt={locale === "nl" ? "Zalm uit de oven met citroen en dille" : locale === "de" ? "Ofenlachs mit Zitrone und Dill" : "Oven-baked salmon with lemon and dill"} width={1400} height={933} sizes="(max-width: 800px) 100vw, 50vw" className="home-hero-image" fetchPriority="high" />
            <span className="home-hero-image-label">{locale === "nl" ? "Aan tafel · zalm met citroen en dille" : locale === "de" ? "Serviervorschlag · Lachs mit Zitrone und Dill" : "Serving idea · salmon with lemon and dill"}</span>
          </div>
        </div>
      </section>

      <Sectie grond="wit">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-7">
          <Kop label={h("assortimentLabel")} titel={locale === "nl" ? "Geliefd aan onze toonbank" : locale === "de" ? "Beliebt an unserer Fischtheke" : "Fish counter favourites"} />
          <Link href={`/${locale}/assortiment`} className="collection-text-link">{h("assortimentLink")} →</Link>
        </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8">
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
      </Sectie>
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
            <div className="mt-5 flex flex-wrap gap-5"><Link href={`/${locale}/feestdagen`} className="season-link">{locale === "nl" ? "Feestdagen" : locale === "de" ? "Festtage" : "Festive season"} →</Link><Link href={`/${locale}/barbecue-gourmet`} className="collection-text-link">Barbecue & gourmet →</Link></div>
          </div>
        </div>
      </Sectie>

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

      {/* ── Sinds 1938 ────────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className={`grid ${heeftBeeld("historie1938") ? "lg:grid-cols-[0.95fr_1.05fr]" : "max-w-3xl"} gap-10 lg:gap-16 items-center`}>
          <Beeld naam="historie1938" streep="var(--navy)" />
          <div>
            <span className="heritage-stamp">{locale === "nl" ? "Sinds" : locale === "de" ? "Seit" : "Since"}<br /><strong>1938</strong></span><Kop label={h("verhaalLabel")} titel={h("verhaalKop")} />
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
    </>
  );
}

