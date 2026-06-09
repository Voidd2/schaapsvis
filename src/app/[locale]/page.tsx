import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PhotoPlaceholder } from "@/components/shared/PhotoPlaceholder";

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
    <section
      className="relative min-h-[70vh] flex items-center"
      style={{ backgroundColor: "var(--navy)" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-24">
        <p
          className="text-xs tracking-[0.25em] uppercase mb-5 opacity-60"
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
          className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
          style={{ color: "rgba(247,240,227,0.85)" }}
        >
          {t("sub")}
        </p>
        <Link
          href={`/${locale}/bezoek-ons`}
          className="inline-block font-medium tracking-wide px-8 py-4 transition-colors text-white text-base"
          style={{ backgroundColor: "var(--salmon)" }}
        >
          {t("cta")} &rarr;
        </Link>
      </div>
    </section>
  );
}

function AboutSection() {
  const t = useTranslations("about");
  const locale = useLocale();
  const sindsLabel =
    locale === "nl" ? "Sinds 1938" : locale === "de" ? "Seit 1938" : "Since 1938";

  return (
    <section style={{ backgroundColor: "var(--cream)" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p
            className="text-xs tracking-[0.2em] uppercase mb-4 opacity-50"
            style={{ color: "var(--navy)" }}
          >
            {sindsLabel}
          </p>
          <h2
            className="text-4xl font-bold mb-6 leading-tight"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            {t("title")}
          </h2>
          <p
            className="leading-relaxed mb-6"
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
        <PhotoPlaceholder
          label="FOTO TOEVOEGEN: Winkelgevel Herenstraat 48 of Aldert achter de toonbank"
          aspectRatio="aspect-[3/4]"
        />
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      style={{ flexShrink: 0 }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function VarlaksHighlight() {
  const t = useTranslations("varlaksHighlight");
  const locale = useLocale();

  return (
    <section style={{ backgroundColor: "var(--navy)" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-14 items-center">
        <PhotoPlaceholder
          label="FOTO TOEVOEGEN: Varlaks zalmfilet of Noorse zee"
          aspectRatio="aspect-square"
        />
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
                style={{ color: "var(--gold)" }}
              >
                <CheckIcon />
                <span style={{ color: "rgba(247,240,227,0.8)" }}>{b}</span>
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
  { name: "Kibbeling",    desc: "Knapperig gebakken, de Hollandse klassieker",  fotoLabel: "FOTO TOEVOEGEN: Kibbeling op bakpapier" },
  { name: "Haring",       desc: "Vers, rauw, recht van de markt",               fotoLabel: "FOTO TOEVOEGEN: Broodje haring met ui" },
  { name: "Lekkerbek",    desc: "Verse wijting in luchtig beslag",               fotoLabel: "FOTO TOEVOEGEN: Lekkerbek in beslag" },
  { name: "Vissoep",      desc: "Huisgemaakte soep, elke dag anders",            fotoLabel: "FOTO TOEVOEGEN: Kom vissoep" },
  { name: "Varlaks Zalm", desc: "Biologisch, Noors, antibioticavrij",            fotoLabel: "FOTO TOEVOEGEN: Varlaks zalmfilet" },
  { name: "Feestschotel", desc: "Voor bijzondere gelegenheden",                  fotoLabel: "FOTO TOEVOEGEN: Gevulde visschotel" },
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
          {productItems.map(({ name, desc, fotoLabel }) => (
            <article key={name} className="group">
              <PhotoPlaceholder label={fotoLabel} aspectRatio="aspect-square" />
              <div className="pt-3">
                <h3
                  className="font-bold text-base mb-1"
                  style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                >
                  {name}
                </h3>
                <p className="text-sm opacity-60" style={{ color: "var(--charcoal)" }}>
                  {desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--gold)" }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
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
    text: "De enige plek in Leiden waar je echt verse haring krijgt. Geen gedoe, gewoon lekker.",
    stars: 5,
  },
  {
    name: "Familie Hoekstra",
    text: "Elke zaterdag op de markt - dat is onze vaste stop. Al jaren. De Varlaks zalm is een aanrader voor iedereen die iets bijzonders wil.",
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
                  <StarIcon key={i} />
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

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

const locationItems = [
  {
    name: "Viswinkel Herenstraat",
    address: "Herenstraat 48, 2313 AL Leiden",
    tel: "071 514 9802",
    schedule: "Maandag t/m zaterdag",
    mapsHref: "https://maps.google.com/?q=Herenstraat+48,+2313+AL+Leiden",
  },
  {
    name: "Markt Leiden",
    address: "Centrum Leiden",
    tel: null,
    schedule: "Woensdag + Zaterdag",
    mapsHref: "https://maps.google.com/?q=Markt+Leiden",
  },
  {
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
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          {t("title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {locationItems.map(({ name, address, tel, schedule, mapsHref }) => (
            <div
              key={name}
              className="p-6"
              style={{ backgroundColor: "rgba(247,240,227,0.07)" }}
            >
              <div className="mb-4" style={{ color: "var(--sand)" }}>
                <PinIcon />
              </div>
              <h3
                className="font-bold text-base mb-2"
                style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
              >
                {name}
              </h3>
              <p className="text-sm mb-1" style={{ color: "rgba(247,240,227,0.65)" }}>
                {address}
              </p>
              <p className="text-sm mb-3" style={{ color: "rgba(247,240,227,0.65)" }}>
                {schedule}
              </p>
              {tel && (
                <a
                  href="tel:+31715149802"
                  className="text-sm block mb-3 transition-opacity hover:opacity-100 font-medium"
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
                Route &rarr;
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
      <ReviewsSection />
      <LocationsSection />
    </>
  );
}
