import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "verhaal" });

  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: {
      canonical: locale === "nl" ? "/ons-verhaal" : `/${locale}/ons-verhaal`,
      languages: {
        nl: "/ons-verhaal",
        en: "/en/ons-verhaal",
        de: "/de/ons-verhaal",
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDesc"),
    },
  };
}

const timelineItems = [
  { yearKey: "t1year", textKey: "t1text", quoteKey: null, quoteAuthorKey: null },
  { yearKey: "t2year", textKey: "t2text", quoteKey: null, quoteAuthorKey: null },
  {
    yearKey: "t3year",
    textKey: "t3text",
    quoteKey: "t3quote",
    quoteAuthorKey: "t3quoteAuthor",
  },
  {
    yearKey: "t4year",
    textKey: "t4text",
    quoteKey: "t4quote",
    quoteAuthorKey: "t4quoteAuthor",
  },
  { yearKey: "t5year", textKey: "t5text", quoteKey: null, quoteAuthorKey: null },
] as const;

function VerhaalContent() {
  const t = useTranslations("verhaal");

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1B4F72] text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
            Since 1938
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("heroTitle")}
          </h1>
          <p className="text-white/70 text-lg">{t("heroSub")}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-[#F5E6C8] py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-lg text-[#1A1A1A]/80 leading-relaxed italic">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#FAFAF8] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-[#E8A87C]/40" />

            <div className="space-y-12">
              {timelineItems.map(
                ({ yearKey, textKey, quoteKey, quoteAuthorKey }) => (
                  <div key={yearKey} className="relative flex gap-6 md:gap-10">
                    {/* Dot */}
                    <div className="flex-shrink-0 w-12 md:w-16 flex justify-center">
                      <div className="w-4 h-4 mt-1.5 rounded-full bg-[#E8A87C] border-2 border-[#1B4F72] z-10" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <h3
                        className="text-xl font-bold text-[#1B4F72] mb-2"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        🐟 {t(yearKey)}
                      </h3>
                      <p className="text-[#1A1A1A]/70 leading-relaxed">
                        {t(textKey)}
                      </p>
                      {quoteKey && (
                        <blockquote className="mt-4 bg-[#F5E6C8] border-l-4 border-[#E8A87C] rounded-r-xl px-5 py-3">
                          <p className="text-[#1A1A1A]/80 italic text-sm leading-relaxed">
                            &ldquo;{t(quoteKey)}&rdquo;
                          </p>
                          {quoteAuthorKey && (
                            <cite className="block mt-2 text-xs text-[#1B4F72] font-semibold not-italic">
                              {t(quoteAuthorKey)}
                            </cite>
                          )}
                        </blockquote>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Outro */}
      <section className="bg-[#1B4F72] text-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-white/80 leading-relaxed mb-6">{t("outro")}</p>
          <blockquote className="bg-white/10 rounded-xl px-6 py-5 mb-8">
            <p className="text-lg italic text-white mb-2">
              &ldquo;{t("outroQuote")}&rdquo;
            </p>
            <cite className="text-[#E8A87C] text-sm font-semibold not-italic">
              {t("outroQuoteAuthor")}
            </cite>
          </blockquote>
          <p className="text-white/90 font-medium">{t("cta")}</p>
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
