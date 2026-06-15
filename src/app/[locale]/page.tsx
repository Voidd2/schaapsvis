import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
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
    <section
      className="relative min-h-[70vh] flex items-center"
      style={{ backgroundColor: "var(--navy)" }}
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&q=60')",
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

function AanbiedingSection() {
  const locale = useLocale();

  return (
    <section style={{ backgroundColor: "var(--gold)" }} className="py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex-shrink-0 text-xs font-bold px-3 py-2 text-white uppercase tracking-widest"
            style={{ backgroundColor: "var(--navy)" }}
          >
            Aanbieding
            <br />
            van de week
          </div>
          <div>
            <p
              className="font-bold text-xl leading-tight"
              style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
            >
              Hollandse garnalen — nu 200g voor €4,95
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--navy)", opacity: 0.7 }}>
              Dagvers gepeld · MSC gecertificeerd · Zoutkamp — zolang de voorraad strekt
            </p>
          </div>
        </div>
        <Link
          href={`/${locale}/bestellen?product=garnalen-hollands`}
          className="text-sm font-semibold px-6 py-3 text-white flex-shrink-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--navy)" }}
        >
          Bestel nu &rarr;
        </Link>
      </div>
    </section>
  );
}

function VerrassingspakketBanner() {
  const locale = useLocale();

  return (
    <section style={{ backgroundColor: "var(--sand)" }} className="py-5 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            className="text-xs font-bold px-3 py-1.5 text-white flex-shrink-0"
            style={{ backgroundColor: "var(--seafoam)" }}
          >
            NIEUW
          </span>
          <p className="text-sm md:text-base" style={{ color: "var(--navy)" }}>
            <strong>Schaap&apos;s Verrassingspakket</strong> — verse vis van de dag voor{" "}
            <strong>€5,99</strong>. Tegen verspilling, vóór uw portemonnee.
            Op = op — elke dag maar 2.
          </p>
        </div>
        <Link
          href={`/${locale}/bestellen?product=verrassingspakket`}
          className="text-sm font-semibold px-5 py-2.5 text-white flex-shrink-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--navy)" }}
        >
          Reserveer er één &rarr;
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80"
          alt="Viswinkel toonbank met verse vis op ijs"
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
          src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80"
          alt="Verse Varlaks zalmfilet"
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
  { name: "Kibbeling",    desc: "Knapperig gebakken, de Hollandse klassieker",  foto: "https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=600&q=80", alt: "Goudbruine kibbeling op bakpapier" },
  { name: "Haring",       desc: "Vers, rauw, recht van de markt",               foto: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80", alt: "Hollandse haring" },
  { name: "Lekkerbek",    desc: "Verse wijting in luchtig beslag",               foto: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80", alt: "Gebakken vis in beslag" },
  { name: "Vissoep",      desc: "Huisgemaakte soep, elke dag anders",            foto: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", alt: "Kom verse vissoep" },
  { name: "Varlaks Zalm", desc: "Biologisch, Noors, antibioticavrij",            foto: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80", alt: "Varlaks biologische zalmfilet" },
  { name: "Feestschotel", desc: "Voor bijzondere gelegenheden",                  foto: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80", alt: "Feestelijke visschotel" },
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

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--gold)" }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ReviewsSection() {
  const t = useTranslations("reviewsSection");

  return (
    <section style={{ backgroundColor: "var(--sand)" }} className="py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2
          className="text-3xl font-bold mb-10"
          style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
        >
          {t("title")}
        </h2>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <span className="font-bold text-lg" style={{ color: "var(--navy)" }}>4.8</span>
          <span className="text-sm" style={{ color: "var(--charcoal)", opacity: 0.6 }}>op Google Reviews</span>
        </div>
        <div className="bg-white p-8 md:p-10 mb-8">
          <div className="flex justify-center gap-0.5 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <p
            className="text-lg leading-relaxed italic mb-5"
            style={{ color: "var(--charcoal)", opacity: 0.85 }}
          >
            &ldquo;Bij het ophalen zei hij altijd: &lsquo;een doos kibbeling voor
            het weeshuis!&rsquo; Ik moest er elke keer om lachen.&rdquo;
          </p>
          <p
            className="text-xs font-semibold tracking-wide uppercase"
            style={{ color: "var(--navy)" }}
          >
            Ria Verburg — uit ons 80-jarig jubileumboek
          </p>
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Schaap%27s+Vishandel+Herenstraat+48+Leiden"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-semibold px-6 py-3 transition-opacity hover:opacity-85 text-white"
          style={{ backgroundColor: "var(--navy)" }}
        >
          Lees onze reviews op Google →
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
          Eerlijke vis — van eitje tot uw bord
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
          href={`/${locale}/eerlijke-vis`}
          className="inline-block text-sm font-semibold px-6 py-3 transition-opacity hover:opacity-85"
          style={{ backgroundColor: "var(--seafoam)", color: "var(--cream)" }}
        >
          Meer over onze eerlijke vis →
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
  await params;
  return (
    <>
      <JsonLd />
      <HeroSection />
      <AanbiedingSection />
      <VerrassingspakketBanner />
      <AboutSection />
      <VarlaksHighlight />
      <AssortimentGrid />
      <ReviewsSection />
      <DuurzaamheidStrip />
      <LocationsSection />
    </>
  );
}
