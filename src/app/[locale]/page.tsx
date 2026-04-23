import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { photos, galleryPhotos } from "@/lib/photos";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("homeTitle"),
    description: t("homeDesc"),
    alternates: {
      canonical: `/${locale}`,
      languages: { nl: "/nl", en: "/en", de: "/de" },
    },
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDesc"),
      locale,
      type: "website",
    },
  };
}

function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      <Image
        src={photos.hero}
        alt="Verse vis bij Schaaps Vis Leiden"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(28,53,87,0.62)" }}
      />
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p
          className="text-xs tracking-[0.25em] uppercase mb-5 opacity-75"
          style={{ color: "var(--sand)" }}
        >
          {t("tagline")}
        </p>
        <h1
          className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          {t("heading").split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>
        <p
          className="text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: "rgba(247,240,227,0.85)" }}
        >
          {t("sub")}
        </p>
        <Link
          href={`/${locale}/bezoek-ons`}
          className="inline-block font-medium tracking-wide px-8 py-4 transition-colors text-white"
          style={{ backgroundColor: "var(--salmon)" }}
        >
          {t("cta")} →
        </Link>
      </div>
    </section>
  );
}

function AboutSection() {
  const t = useTranslations("about");
  const locale = useLocale();

  return (
    <section style={{ backgroundColor: "var(--cream)" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p
            className="text-xs tracking-[0.2em] uppercase mb-4 opacity-50"
            style={{ color: "var(--navy)" }}
          >
            Since 1938
          </p>
          <h2
            className="text-4xl font-bold mb-6 leading-tight"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            {t("title")}
          </h2>
          <p
            className="leading-relaxed mb-6 text-base"
            style={{ color: "var(--charcoal)", opacity: 0.8 }}
          >
            {t("text")}
          </p>
          <Link
            href={`/${locale}/ons-verhaal`}
            className="text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
            style={{ color: "var(--navy)" }}
          >
            {t("link")}
          </Link>
        </div>
        <div className="relative aspect-[4/3] rounded overflow-hidden">
          <Image
            src={photos.shopInterior}
            alt="Schaaps Vis winkel"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}

function VarlaksHighlight() {
  const t = useTranslations("varlaksHighlight");
  const locale = useLocale();

  return (
    <section style={{ backgroundColor: "var(--navy)" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-14 items-center">
        <div className="relative aspect-[4/3] rounded overflow-hidden">
          <Image
            src={photos.norway}
            alt="Noorse fjorden — Varlaks zalm"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <span
            className="inline-block text-xs tracking-widest uppercase font-semibold px-3 py-1 mb-5"
            style={{ backgroundColor: "var(--seafoam)", color: "var(--cream)" }}
          >
            Biologisch gecertificeerd
          </span>
          <h2
            className="text-4xl font-bold mb-5 leading-tight"
            style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
          >
            {t("title")}
          </h2>
          <ul className="space-y-3 mb-8">
            {[t("bullet1"), t("bullet2"), t("bullet3")].map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-sm"
                style={{ color: "rgba(247,240,227,0.8)" }}
              >
                <span style={{ color: "var(--gold)" }}>✓</span>
                {b}
              </li>
            ))}
          </ul>
          <Link
            href={`/${locale}/varlaks`}
            className="text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
            style={{ color: "var(--sand)" }}
          >
            {t("link")}
          </Link>
        </div>
      </div>
    </section>
  );
}

const productItems = [
  {
    name: "Kibbeling",
    desc: "Knapperig gebakken, de Hollandse klassieker",
    img: photos.kibbeling,
  },
  {
    name: "Haring",
    desc: "Vers, rauw, recht van de markt",
    img: photos.gallery1,
  },
  {
    name: "Lekkerbek",
    desc: "Verse wijting in luchtig beslag",
    img: photos.gallery2,
  },
  {
    name: "Vissoep",
    desc: "Huisgemaakte soep, elke dag anders",
    img: photos.gallery3,
  },
  {
    name: "Varlaks Zalm",
    desc: "Biologisch, Noors, antibioticavrij",
    img: photos.salmon,
  },
  {
    name: "Feestschotel",
    desc: "Voor bijzondere gelegenheden",
    img: photos.gallery4,
  },
];

function AssortimentGrid() {
  const t = useTranslations("assortimentSection");

  return (
    <section style={{ backgroundColor: "var(--cream)" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <p
          className="text-xs tracking-[0.2em] uppercase text-center mb-3 opacity-50"
          style={{ color: "var(--navy)" }}
        >
          Dagelijks vers
        </p>
        <h2
          className="text-4xl font-bold text-center mb-12"
          style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
        >
          {t("title")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {productItems.map(({ name, desc, img }) => (
            <article key={name} className="group">
              <div className="relative aspect-square overflow-hidden mb-3">
                <Image
                  src={img}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
              <h3
                className="font-bold text-base mb-1"
                style={{
                  color: "var(--navy)",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {name}
              </h3>
              <p className="text-sm opacity-60" style={{ color: "var(--charcoal)" }}>
                {desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotoGallery() {
  return (
    <section className="py-0 overflow-hidden">
      <div className="flex gap-1" style={{ display: "flex" }}>
        {galleryPhotos.map((src, i) => (
          <div
            key={i}
            className="relative flex-shrink-0"
            style={{ width: 260, height: 260 }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="260px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

const reviews = [
  {
    name: "Marja van den Berg",
    text: "Al meer dan twintig jaar haal ik hier mijn vis. De kibbeling is nergens beter dan bij Schaap. En Aldert staat altijd klaar met een goed verhaal.",
    stars: 5,
  },
  {
    name: "Pieter S.",
    text: "De enige plek in Leiden waar je écht verse haring krijgt. Geen gedoe, gewoon lekker.",
    stars: 5,
  },
  {
    name: "Familie Hoekstra",
    text: "Elke zaterdag op de markt — dat is onze vaste stop. Al jaren. De Varlaks zalm is een aanrader voor iedereen die iets bijzonders wil.",
    stars: 5,
  },
];

function ReviewsSection() {
  const t = useTranslations("reviewsSection");

  return (
    <section style={{ backgroundColor: "var(--sand)" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-center mb-12"
          style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
        >
          {t("title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="bg-white p-7">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <span key={i} style={{ color: "var(--gold)" }}>
                    ★
                  </span>
                ))}
              </div>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--charcoal)", opacity: 0.8 }}
              >
                &ldquo;{r.text}&rdquo;
              </p>
              <p
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "var(--navy)" }}
              >
                {r.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const locationItems = [
  {
    icon: "🏪",
    name: "Viswinkel Herenstraat",
    address: "Herenstraat 48, 2313 AL Leiden",
    tel: "071 514 9802",
    schedule: "Maandag t/m zaterdag",
    mapsHref: "https://maps.google.com/?q=Herenstraat+48,+2313+AL+Leiden",
  },
  {
    icon: "🛒",
    name: "Markt Leiden",
    address: "Centrum Leiden",
    tel: null,
    schedule: "Woensdag + Zaterdag",
    mapsHref: "https://maps.google.com/?q=Markt+Leiden",
  },
  {
    icon: "📍",
    name: "Hoogvliet Voorschoten",
    address: "Bij Hoogvliet, Voorschoten",
    tel: null,
    schedule: "Vrijdag",
    mapsHref: "https://maps.google.com/?q=Hoogvliet+Voorschoten",
  },
];

function LocationsSection() {
  const t = useTranslations("locatiesSection");

  return (
    <section style={{ backgroundColor: "var(--navy)" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-center mb-12"
          style={{
            color: "var(--cream)",
            fontFamily: "Playfair Display, serif",
          }}
        >
          {t("title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {locationItems.map(({ icon, name, address, tel, schedule, mapsHref }) => (
            <div
              key={name}
              className="p-6"
              style={{ backgroundColor: "rgba(247,240,227,0.07)" }}
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h3
                className="font-bold text-base mb-2"
                style={{
                  color: "var(--cream)",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {name}
              </h3>
              <p
                className="text-sm mb-1"
                style={{ color: "rgba(247,240,227,0.65)" }}
              >
                {address}
              </p>
              <p
                className="text-sm mb-1"
                style={{ color: "rgba(247,240,227,0.65)" }}
              >
                {schedule}
              </p>
              {tel && (
                <a
                  href="tel:+31715149802"
                  className="text-sm block mb-3 transition-opacity hover:opacity-100"
                  style={{ color: "var(--sand)" }}
                >
                  {tel}
                </a>
              )}
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "var(--salmon)" }}
              >
                Route →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <>
      <JsonLd />
      <HeroSection />
      <AboutSection />
      <VarlaksHighlight />
      <AssortimentGrid />
      <PhotoGallery />
      <ReviewsSection />
      <LocationsSection />
    </>
  );
}
