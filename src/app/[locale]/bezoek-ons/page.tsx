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
  const t = await getTranslations({ locale, namespace: "bezoek" });

  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: {
      canonical: locale === "nl" ? "/bezoek-ons" : `/${locale}/bezoek-ons`,
      languages: {
        nl: "/bezoek-ons",
        en: "/en/bezoek-ons",
        de: "/de/bezoek-ons",
      },
    },
  };
}

function BezoekContent() {
  const t = useTranslations("bezoek");

  const locations = [
    {
      icon: "🏪",
      titleKey: "loc1title" as const,
      addrKey: "loc1addr" as const,
      hoursKey: "loc1hours" as const,
      tel: "071 514 9802",
      telKey: "loc1tel" as const,
      mapsUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2449!2d4.494!3d52.1595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5c688e89f5de3%3A0x0!2sHerenstraat+48%2C+2313+AL+Leiden!5e0!3m2!1snl!2snl!4v1",
      directionsUrl:
        "https://maps.google.com/?q=Herenstraat+48,+2313+AL+Leiden",
    },
    {
      icon: "🛒",
      titleKey: "loc2title" as const,
      addrKey: "loc2addr" as const,
      hoursKey: "loc2hours" as const,
      tel: null,
      telKey: null,
      mapsUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2449!2d4.4947!3d52.1587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5c68d1cffffff%3A0x0!2sMarktplaats+Leiden!5e0!3m2!1snl!2snl!4v1",
      directionsUrl: "https://maps.google.com/?q=Markt+Leiden+centrum",
    },
    {
      icon: "📍",
      titleKey: "loc3title" as const,
      addrKey: "loc3addr" as const,
      hoursKey: "loc3hours" as const,
      tel: null,
      telKey: null,
      mapsUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2454!2d4.4425!3d52.1245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5c2cfffffff%3A0x0!2sHoogvliet+Voorschoten!5e0!3m2!1snl!2snl!4v1",
      directionsUrl: "https://maps.google.com/?q=Hoogvliet+Voorschoten",
    },
  ] as const;

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

      {/* Locations */}
      <section className="bg-[#FAFAF8] py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-16">
          {locations.map(
            ({ icon, titleKey, addrKey, hoursKey, tel, mapsUrl, directionsUrl }, idx) => (
              <div
                key={titleKey}
                className={`grid md:grid-cols-2 gap-8 items-start ${
                  idx % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Info card */}
                <div
                  className={`bg-[#F5E6C8] rounded-2xl p-8 ${idx % 2 === 1 ? "md:order-2" : ""}`}
                >
                  <div className="text-4xl mb-4">{icon}</div>
                  <h2
                    className="text-2xl font-bold text-[#1B4F72] mb-3"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {t(titleKey)}
                  </h2>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start gap-2">
                      <span className="text-[#E8A87C] mt-0.5">📍</span>
                      <span className="text-[#1A1A1A]/80">{t(addrKey)}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#E8A87C] mt-0.5">🕒</span>
                      <span className="text-[#1A1A1A]/80">
                        <span className="font-medium">{t("hours")}</span>{" "}
                        {t(hoursKey)}
                      </span>
                    </p>
                    {tel && (
                      <p className="flex items-start gap-2">
                        <span className="text-[#E8A87C] mt-0.5">📞</span>
                        <span>
                          <span className="font-medium text-[#1A1A1A]/80">
                            {t("telephone")}
                          </span>{" "}
                          <a
                            href="tel:+31715149802"
                            className="text-[#1B4F72] font-semibold hover:text-[#E8A87C] transition-colors"
                          >
                            {tel}
                          </a>
                        </span>
                      </p>
                    )}
                  </div>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-5 bg-[#1B4F72] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#163f5a] transition-colors"
                  >
                    {t("directions")}
                  </a>
                </div>

                {/* Map */}
                <div
                  className={`rounded-2xl overflow-hidden shadow-md h-[280px] ${idx % 2 === 1 ? "md:order-1" : ""}`}
                >
                  <iframe
                    title={t(titleKey)}
                    src={mapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-[#1B4F72] text-white py-10">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-white/80 mb-3">Vragen? Bel ons gerust op:</p>
          <a
            href="tel:+31715149802"
            className="text-3xl font-bold text-[#E8A87C] hover:text-white transition-colors"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            071 514 9802
          </a>
        </div>
      </section>
    </>
  );
}

export default async function BezoekOnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <>
      <JsonLd />
      <BezoekContent />
    </>
  );
}
