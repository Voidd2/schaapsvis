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
    title: t("verhaalTitle"),
    description: t("verhaalDesc"),
    alternates: {
      canonical: `/${locale}/ons-verhaal`,
      languages: {
        nl: "/nl/ons-verhaal",
        en: "/en/ons-verhaal",
        de: "/de/ons-verhaal",
      },
    },
  };
}

const timelineItems = [
  {
    year: "1938",
    titleKey: "t1title" as const,
    textKey: "t1text" as const,
    quote: null,
    fotoLabel: "FOTO TOEVOEGEN: Leiden Herenstraat 1938 of historische winkelgevel",
  },
  {
    year: "1957",
    titleKey: "t2title" as const,
    textKey: "t2text" as const,
    quote: null,
    fotoLabel: "FOTO TOEVOEGEN: Cor Haasnoot bij de viswinkel (jaren 50/60)",
  },
  {
    year: "2009",
    titleKey: "t3title" as const,
    textKey: "t3text" as const,
    quote: "t3quote" as const,
    fotoLabel: "FOTO TOEVOEGEN: Aldert Haasnoot achter de toonbank",
  },
  {
    year: "2018",
    titleKey: "t4title" as const,
    textKey: "t4text" as const,
    quote: "t4quote" as const,
    fotoLabel: "FOTO TOEVOEGEN: 80-jarig jubileum Schaaps Vis",
  },
  {
    year: "Nu",
    titleKey: "t5title" as const,
    textKey: "t5text" as const,
    quote: null,
    fotoLabel: "FOTO TOEVOEGEN: Huidige marktstand of winkel vandaag",
  },
];

function VerhaalContent() {
  const t = useTranslations("verhaalPage");
  const locale = useLocale();
  const sindsLabel = locale === "nl" ? "Sinds 1938" : locale === "de" ? "Seit 1938" : "Since 1938";

  return (
    <>
      {/* Hero */}
      <section
        style={{ backgroundColor: "var(--navy)" }}
        className="py-20 text-center px-4"
      >
        <p
          className="text-xs tracking-[0.25em] uppercase mb-4 opacity-50"
          style={{ color: "var(--sand)" }}
        >
          {sindsLabel}
        </p>
        <h1
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          {t("heroTitle")}
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(246,250,253,0.7)" }}>
          {t("heroSub")}
        </p>
      </section>

      {/* Intro */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p
            className="text-lg leading-relaxed italic"
            style={{ color: "var(--charcoal)", opacity: 0.85 }}
          >
            {t("intro")}
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-20">
            {timelineItems.map(({ year, titleKey, textKey, quote, fotoLabel }, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={year}
                  className={`grid md:grid-cols-2 gap-12 items-center ${
                    !isEven ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <span
                      className="text-7xl font-bold leading-none block mb-3 opacity-15"
                      style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                    >
                      {year}
                    </span>
                    <h2
                      className="text-2xl font-bold mb-4 -mt-10"
                      style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                    >
                      {t(titleKey)}
                    </h2>
                    <p
                      className="leading-relaxed mb-4"
                      style={{ color: "var(--charcoal)", opacity: 0.8 }}
                    >
                      {t(textKey)}
                    </p>
                    {quote && (
                      <blockquote
                        className="border-l-4 pl-5 py-1 mt-5 italic text-sm leading-relaxed"
                        style={{ borderColor: "var(--salmon)", color: "var(--charcoal)", opacity: 0.75 }}
                      >
                        &ldquo;{t(quote)}&rdquo;
                      </blockquote>
                    )}
                  </div>

                  <PhotoPlaceholder
                    label={fotoLabel}
                    aspectRatio="aspect-[4/3]"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Outro quote */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <blockquote
            className="text-2xl md:text-3xl font-bold italic leading-relaxed mb-6"
            style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
          >
            &ldquo;{t("outroQuote")}&rdquo;
          </blockquote>
          <cite className="text-sm not-italic" style={{ color: "rgba(246,250,253,0.6)" }}>
            {t("outroAuthor")}
          </cite>
        </div>
      </section>
    </>
  );
}

export default async function OnsVerhaalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <>
      <JsonLd />
      <VerhaalContent />
    </>
  );
}
