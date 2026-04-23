import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assortiment" });

  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: {
      canonical: locale === "nl" ? "/assortiment" : `/${locale}/assortiment`,
      languages: {
        nl: "/assortiment",
        en: "/en/assortiment",
        de: "/de/assortiment",
      },
    },
  };
}

const products = [
  { key: "p1", emoji: "🍤", highlight: false },
  { key: "p2", emoji: "🐟", highlight: false },
  { key: "p3", emoji: "🥖", highlight: false },
  { key: "p4", emoji: "🍲", highlight: false },
  { key: "p5", emoji: "🫙", highlight: false },
  { key: "p6", emoji: "🦐", highlight: false },
  { key: "p7", emoji: "🐠", highlight: true },
  { key: "p8", emoji: "🐡", highlight: false },
] as const;

function AssortimentContent({ locale }: { locale: string }) {
  const t = useTranslations("assortiment");
  const prefix = (path: string) => (locale === "nl" ? path : `/${locale}${path}`);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1B4F72] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("title")}
          </h1>
          <p className="text-white/80 text-lg">{t("sub")}</p>
        </div>
      </section>

      {/* Note */}
      <div className="bg-[#F5E6C8] py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#1A1A1A]/70 text-sm">
            📍 {t("note")}
          </p>
        </div>
      </div>

      {/* Products grid */}
      <section className="bg-[#FAFAF8] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(({ key, emoji, highlight }) => (
              <div
                key={key}
                className={`rounded-2xl p-6 border transition-shadow hover:shadow-md ${
                  highlight
                    ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                    : "bg-white border-[#E8A87C]/20"
                }`}
              >
                <div className="text-5xl mb-4">{emoji}</div>
                <h3
                  className={`text-lg font-bold mb-2 ${highlight ? "text-white" : "text-[#1B4F72]"}`}
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {t(`${key}name` as Parameters<typeof t>[0])}
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-3 ${highlight ? "text-white/80" : "text-[#1A1A1A]/60"}`}
                >
                  {t(`${key}desc` as Parameters<typeof t>[0])}
                </p>
                {highlight && (
                  <Link
                    href={prefix("/varlaks-biologische-zalm")}
                    className="inline-block text-xs text-[#E8A87C] font-semibold hover:text-white transition-colors"
                  >
                    {t("varlaksLink")}
                  </Link>
                )}
                {key === "p8" && (
                  <span className="inline-block text-xs text-[#1B4F72] font-semibold bg-[#F5E6C8] px-2 py-1 rounded-full">
                    {t("dagsaanbod")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F5E6C8] py-12">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2
            className="text-2xl font-bold text-[#1B4F72] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Alles vers — dagelijks aangeleverd
          </h2>
          <p className="text-[#1A1A1A]/70 mb-6 text-sm">
            Prijzen en beschikbaarheid wisselen dagelijks. Kom langs of bel voor het dagsaanbod.
          </p>
          <a
            href="tel:+31715149802"
            className="inline-block bg-[#1B4F72] text-white font-semibold px-6 py-2.5 rounded-full hover:bg-[#163f5a] transition-colors"
          >
            071 514 9802
          </a>
        </div>
      </section>
    </>
  );
}

export default async function AssortimentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <JsonLd />
      <AssortimentContent locale={locale} />
    </>
  );
}
