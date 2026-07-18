import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { SeizoensBanner } from "@/components/shared/SeizoensBanner";
import { Reveal } from "@/components/shared/Reveal";
import { googleReviews, googleRating, googleReviewCount, googleMapsUrl } from "@/lib/reviews";

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
      languages: { nl: "/nl", en: "/en", de: "/de", "x-default": "/nl" },
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
      {/* Background image overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/scene-vis.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
        }}
      />
      <div className="max-w-4xl mx-auto px-6 py-24 relative z-10">
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
          style={{ color: "rgba(246,250,253,0.85)" }}
        >
          {t("sub")}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/${locale}/bestellen`}
            className="inline-block font-medium tracking-wide px-8 py-4 transition-opacity hover:opacity-90 text-white text-base"
            style={{ backgroundColor: "var(--salmon)" }}
          >
            Bestel vooruit &rarr;
          </Link>
          <Link
            href={`/${locale}/bezoek-ons`}
            className="inline-block font-medium tracking-wide px-8 py-4 transition-colors text-base border"
            style={{ borderColor: "rgba(246,250,253,0.4)", color: "var(--cream)" }}
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section style={{ backgroundColor: "var(--navy-dark)" }} className="py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-4 font-semibold"
          style={{ color: "var(--gold)" }}
        >
          Gratis · Geen spam
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold mb-5 leading-tight"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          Altijd als eerste weten wat er lekkers binnen is
        </h2>
        <p className="text-base mb-8" style={{ color: "rgba(246,250,253,0.65)" }}>
          Schrijf u in op onze nieuwsbrief en ontvang:
        </p>
        <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-10 mb-10 text-left max-w-lg mx-auto">
          {[
            "Speciale kortingen — exclusief voor abonnees, niet online zichtbaar",
            "Voorrang op feestschotels en seizoensvis rond de feestdagen",
            "Seizoensinformatie — wanneer de Hollandse Nieuwe er is, welke vis op zijn best zijn",
            "Recepten en tips van onze visvakman, gebaseerd op het aanbod van de week",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm"
              style={{ color: "rgba(246,250,253,0.82)" }}
            >
              <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }}>
                <CheckIcon />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <NewsletterSignup />
        </div>
        <p className="text-xs mt-5" style={{ color: "rgba(246,250,253,0.35)" }}>
          Uitschrijven via één klik. Wij sturen nooit reclame van derden.
        </p>
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/scene-vis.svg"
          alt="Verse vis op ijs bij Schaap's Vishandel aan de Herenstraat in Leiden"
          className="w-full aspect-[3/4] object-cover"
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/scene-zalm.svg"
          alt="Verse biologische Varlaks zalmfilet bij Schaap's Vishandel Leiden"
          className="w-full aspect-square object-cover"
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
                <span style={{ color: "rgba(246,250,253,0.8)" }}>{b}</span>
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
  { name: "Kibbeling",    desc: "Knapperig gebakken, de Hollandse klassieker",  foto: "/images/scene-vis.svg",        alt: "Kibbeling van Schaap's Vishandel Leiden" },
  { name: "Haring",       desc: "Vers, rauw, recht van de markt",               foto: "/images/scene-haring.svg",     alt: "Hollandse Nieuwe haring bij Schaap's Vishandel Leiden" },
  { name: "Lekkerbek",    desc: "Verse wijting in luchtig beslag",               foto: "/images/scene-vis.svg",        alt: "Lekkerbek van verse wijting — Schaap's Vishandel Leiden" },
  { name: "Vissoep",      desc: "Huisgemaakte soep, elke dag anders",            foto: "/images/scene-vis.svg",        alt: "Huisgemaakte vissoep van Schaap's Vishandel Leiden" },
  { name: "Varlaks Zalm", desc: "Biologisch, Noors, antibioticavrij",            foto: "/images/scene-zalm.svg",       alt: "Biologische Varlaks zalm bij Schaap's Vishandel Leiden" },
  { name: "Feestschotel", desc: "Voor bijzondere gelegenheden",                  foto: "/images/scene-schaaldier.svg", alt: "Feestelijke visschotel van Schaap's Vishandel Leiden" },
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
          {productItems.map(({ name, desc, foto, alt }) => (
            <article key={name} className="group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto} alt={alt} className="w-full aspect-square object-cover" />
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

function StarIcon({ filled = true }: { filled?: boolean }) {
  return filled ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--gold)" }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--gold)", opacity: 0.3 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ReviewsSection() {
  return (
    <section style={{ backgroundColor: "var(--sand)" }} className="py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
          Wat klanten zeggen
        </h2>
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={true} />)}
          </div>
          <span className="font-bold text-lg" style={{ color: "var(--navy)" }}>{googleRating}</span>
          <span className="text-sm" style={{ color: "var(--charcoal)", opacity: 0.6 }}>op Google Reviews ({googleReviewCount} beoordelingen)</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {googleReviews.map((review) => (
            <div key={review.name} className="bg-white p-6 text-left flex flex-col">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={i < review.stars} />)}
              </div>
              <p className="text-sm leading-relaxed italic mb-4 flex-1" style={{ color: "var(--charcoal)", opacity: 0.85 }}>
                &ldquo;{review.text}&rdquo;
              </p>
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase mb-0.5" style={{ color: "var(--navy)" }}>{review.name}</p>
                <p className="text-xs" style={{ color: "var(--charcoal)", opacity: 0.5 }}>{review.date}</p>
              </div>
            </div>
          ))}
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-semibold px-6 py-3 transition-opacity hover:opacity-85 text-white"
          style={{ backgroundColor: "var(--navy)" }}
        >
          Lees alle {googleReviewCount} reviews op Google &rarr;
        </a>
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
    schedule: "Dinsdag t/m zaterdag",
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

function DuurzaamheidStrip() {
  const locale = useLocale();

  const badges = [
    { label: "MSC", sub: "Duurzaam gevangen" },
    { label: "ASC", sub: "Verantwoord gekweekt" },
    { label: "BIO", sub: "Biologisch gecertificeerd" },
    { label: "100%", sub: "Traceerbaar" },
  ];

  return (
    <section style={{ backgroundColor: "var(--navy)" }} className="py-14 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-3 font-semibold opacity-50"
          style={{ color: "var(--sand)" }}
        >
          Vis met een geweten
        </p>
        <h2
          className="text-3xl font-bold mb-6"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          Biologische &amp; eerlijke vis — van eitje tot uw bord
        </h2>
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {badges.map(({ label, sub }) => (
            <div key={label} className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg"
                style={{ backgroundColor: "var(--seafoam)", color: "var(--cream)" }}
              >
                {label}
              </div>
              <p className="text-xs" style={{ color: "rgba(246,250,253,0.6)" }}>{sub}</p>
            </div>
          ))}
        </div>
        <p className="text-sm mb-6 max-w-lg mx-auto leading-relaxed" style={{ color: "rgba(246,250,253,0.7)" }}>
          Wij kiezen bewust voor vis met certificering. MSC voor duurzaam gevangen vis,
          ASC voor verantwoorde kweek — en Varlaks biologische zalm zonder antibiotica of GMO.
        </p>
        <a
          href={`/${locale}/biologische-vis`}
          className="inline-block text-sm font-semibold px-6 py-3 transition-opacity hover:opacity-85"
          style={{ backgroundColor: "var(--seafoam)", color: "var(--cream)" }}
        >
          Meer over onze biologische vis →
        </a>
      </div>
    </section>
  );
}

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
              style={{ backgroundColor: "rgba(246,250,253,0.07)" }}
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
              <p className="text-sm mb-1" style={{ color: "rgba(246,250,253,0.65)" }}>
                {address}
              </p>
              <p className="text-sm mb-3" style={{ color: "rgba(246,250,253,0.65)" }}>
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
  const { locale } = await params;
  return (
    <>
      <JsonLd />
      <HeroSection />
      <SeizoensBanner locale={locale} />
      <Reveal><NewsletterSection /></Reveal>
      <Reveal><AboutSection /></Reveal>
      <Reveal><VarlaksHighlight /></Reveal>
      <Reveal><AssortimentGrid /></Reveal>
      <Reveal><ReviewsSection /></Reveal>
      <Reveal><DuurzaamheidStrip /></Reveal>
      <Reveal><LocationsSection /></Reveal>
    </>
  );
}
