import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { photos } from "@/lib/photos";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("varlaksTitle"),
    description: t("varlaksDesc"),
    alternates: {
      canonical: `/${locale}/varlaks`,
      languages: { nl: "/nl/varlaks", en: "/en/varlaks", de: "/de/varlaks" },
    },
  };
}

const features = [
  {
    icon: "🌊",
    titleKey: "f1title" as const,
    textKey: "f1text" as const,
  },
  {
    icon: "🏡",
    titleKey: "f2title" as const,
    textKey: "f2text" as const,
  },
  {
    icon: "🚫",
    titleKey: "f3title" as const,
    textKey: "f3text" as const,
  },
  {
    icon: "💚",
    titleKey: "f4title" as const,
    textKey: "f4text" as const,
  },
];

const comparison = [
  { our: "Geen antibiotica", them: "Vaak gebruikt" },
  { our: "Geen GMO", them: "Niet gegarandeerd" },
  { our: "Geen hormonen", them: "Niet gegarandeerd" },
  { our: "Traceerbaar", them: "Herkomst onduidelijk" },
  { our: "Familieboerderijen", them: "Industriekweek" },
  { our: "Ruim opgekweekt", them: "Dicht op elkaar" },
];

function VarlaksContent() {
  const t = useTranslations("varlaksPage");
  const locale = useLocale();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <Image
          src={photos.arctic}
          alt="Arctische wateren Noorwegen — Varlaks zalm"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(28,53,87,0.55)" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 pb-16 w-full">
          <span
            className="inline-block text-xs tracking-widest uppercase font-semibold px-3 py-1 mb-5"
            style={{ backgroundColor: "var(--seafoam)", color: "var(--cream)" }}
          >
            Biologisch gecertificeerd
          </span>
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-4"
            style={{
              color: "var(--cream)",
              fontFamily: "Playfair Display, serif",
            }}
          >
            {t("heroTitle")}
          </h1>
          <p
            className="text-lg max-w-xl"
            style={{ color: "rgba(247,240,227,0.8)" }}
          >
            {t("heroSub")}
          </p>
        </div>
      </section>

      {/* Story */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--charcoal)", opacity: 0.85 }}
          >
            {t("story")}
          </p>
        </div>
      </section>

      {/* Features 2x2 */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{
              color: "var(--navy)",
              fontFamily: "Playfair Display, serif",
            }}
          >
            {t("featuresTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map(({ icon, titleKey, textKey }) => (
              <div key={titleKey} className="bg-white p-7">
                <div className="text-3xl mb-4">{icon}</div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{
                    color: "var(--navy)",
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {t(titleKey)}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--charcoal)", opacity: 0.75 }}
                >
                  {t(textKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2
            className="text-3xl font-bold mb-10"
            style={{
              color: "var(--navy)",
              fontFamily: "Playfair Display, serif",
            }}
          >
            {t("compareTitle")}
          </h2>
          <div className="grid grid-cols-2 gap-0 border border-gray-200">
            <div
              className="px-5 py-3 text-sm font-semibold border-b border-gray-200"
              style={{ backgroundColor: "var(--seafoam)", color: "var(--cream)" }}
            >
              ✓ Varlaks
            </div>
            <div
              className="px-5 py-3 text-sm font-semibold border-b border-l border-gray-200 opacity-70"
              style={{ color: "var(--charcoal)" }}
            >
              ✗ Reguliere supermarktzalm
            </div>
            {comparison.map(({ our, them }, i) => (
              <>
                <div
                  key={`our-${i}`}
                  className="px-5 py-3 text-sm border-b border-gray-100"
                  style={{
                    backgroundColor: i % 2 === 0 ? "white" : "var(--cream)",
                    color: "var(--seafoam)",
                    fontWeight: 500,
                  }}
                >
                  ✓ {our}
                </div>
                <div
                  key={`them-${i}`}
                  className="px-5 py-3 text-sm border-b border-l border-gray-100 opacity-55"
                  style={{
                    backgroundColor: i % 2 === 0 ? "white" : "var(--cream)",
                    color: "var(--charcoal)",
                  }}
                >
                  ✗ {them}
                </div>
              </>
            ))}
          </div>
        </div>
      </section>

      {/* Photo + CTA */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={photos.salmon}
              alt="Verse Varlaks zalm"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2
              className="text-3xl font-bold mb-5 leading-tight"
              style={{
                color: "var(--cream)",
                fontFamily: "Playfair Display, serif",
              }}
            >
              {t("ctaTitle")}
            </h2>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: "rgba(247,240,227,0.75)" }}
            >
              {t("ctaText")}
            </p>
            <a
              href={`/${locale}/bezoek-ons`}
              className="inline-block font-medium tracking-wide px-7 py-3 text-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--salmon)" }}
            >
              {t("ctaButton")} →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function VarlaksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <>
      <JsonLd />
      <VarlaksContent />
    </>
  );
}
