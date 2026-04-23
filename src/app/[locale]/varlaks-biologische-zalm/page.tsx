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
  const t = await getTranslations({ locale, namespace: "varlaks" });

  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: {
      canonical:
        locale === "nl"
          ? "/varlaks-biologische-zalm"
          : `/${locale}/varlaks-biologische-zalm`,
      languages: {
        nl: "/varlaks-biologische-zalm",
        en: "/en/varlaks-biologische-zalm",
        de: "/de/varlaks-biologische-zalm",
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDesc"),
    },
  };
}

const features = [
  { icon: "🌊", titleKey: "f1title", textKey: "f1text" },
  { icon: "🏡", titleKey: "f2title", textKey: "f2text" },
  { icon: "🚫", titleKey: "f3title", textKey: "f3text" },
  { icon: "💪", titleKey: "f4title", textKey: "f4text" },
  { icon: "🍽️", titleKey: "f5title", textKey: "f5text" },
] as const;

const tableRows = [
  { labelKey: "row1", vKey: "v1", sKey: "s1", vGood: true },
  { labelKey: "row2", vKey: "v2", sKey: "s2", vGood: true },
  { labelKey: "row3", vKey: "v3", sKey: "s3", vGood: true },
  { labelKey: "row4", vKey: "v4", sKey: "s4", vGood: true },
  { labelKey: "row5", vKey: "v5", sKey: "s5", vGood: true },
  { labelKey: "row6", vKey: "v6", sKey: "s6", vGood: true },
] as const;

function VarlaksContent() {
  const t = useTranslations("varlaks");
  const b = useTranslations("bezoek");

  return (
    <>
      {/* Hero */}
      <section className="bg-[#2D6A4F] text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block bg-white/10 border border-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
            Biologisch · Premium · Noors
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("heroTitle")}
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">{t("heroSub")}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-[#F5E6C8] py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-lg text-[#1A1A1A]/80 leading-relaxed">{t("intro")}</p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#FAFAF8] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2
            className="text-2xl font-bold text-[#1B4F72] text-center mb-10"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("featuresTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map(({ icon, titleKey, textKey }) => (
              <div
                key={titleKey}
                className="bg-white rounded-xl p-6 border border-[#E8A87C]/20 shadow-sm"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-[#1B4F72] mb-2">{t(titleKey)}</h3>
                <p className="text-[#1A1A1A]/70 text-sm leading-relaxed">
                  {t(textKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-[#F5E6C8] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2
            className="text-2xl font-bold text-[#1B4F72] text-center mb-8"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("tableTitle")}
          </h2>
          <div className="overflow-x-auto rounded-2xl shadow-sm">
            <table className="w-full bg-white text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-[#1A1A1A]/60 font-medium border-b border-gray-100" />
                  <th className="px-4 py-3 text-center font-bold text-[#2D6A4F] border-b border-gray-100 bg-[#2D6A4F]/5">
                    {t("tableOur")}
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[#1A1A1A]/60 border-b border-gray-100">
                    {t("tableSuper")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map(({ labelKey, vKey, sKey }) => (
                  <tr key={labelKey} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]/80">
                      {t(labelKey)}
                    </td>
                    <td className="px-4 py-3 text-center bg-[#2D6A4F]/5">
                      <span className="inline-flex items-center gap-1 text-[#2D6A4F] font-semibold">
                        <span>✅</span> {t(vKey)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[#1A1A1A]/50">
                        <span>⚠️</span> {t(sKey)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Where to buy */}
      <section className="bg-[#1B4F72] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2
            className="text-2xl font-bold mb-8"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("availableTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              { icon: "🏪", title: b("loc1title"), sub: b("loc1addr"), hours: b("loc1hours") },
              { icon: "🛒", title: b("loc2title"), sub: b("loc2addr"), hours: b("loc2hours") },
              { icon: "📍", title: b("loc3title"), sub: b("loc3addr"), hours: b("loc3hours") },
            ].map(({ icon, title, sub, hours }) => (
              <div key={title} className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">{icon}</div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-white/60 text-xs">{sub}</p>
                <p className="text-[#E8A87C] text-xs mt-1">{hours}</p>
              </div>
            ))}
          </div>
          <p className="text-white/90 text-lg font-medium">{t("cta")}</p>
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
