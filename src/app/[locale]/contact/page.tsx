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
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: {
      canonical: locale === "nl" ? "/contact" : `/${locale}/contact`,
      languages: {
        nl: "/contact",
        en: "/en/contact",
        de: "/de/contact",
      },
    },
  };
}

function ContactContent() {
  const t = useTranslations("contact");

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

      <section className="bg-[#FAFAF8] py-16">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Contact form */}
          <div>
            <h2
              className="text-2xl font-bold text-[#1B4F72] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Stuur een bericht
            </h2>
            <form className="space-y-4" action="#" method="post">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#1A1A1A]/80 mb-1"
                >
                  {t("nameLabel")}
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  className="w-full border border-[#E8A87C]/40 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#1A1A1A]/80 mb-1"
                >
                  {t("emailLabel")}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="w-full border border-[#E8A87C]/40 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[#1A1A1A]/80 mb-1"
                >
                  {t("messageLabel")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full border border-[#E8A87C]/40 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1B4F72] text-white font-semibold py-3 rounded-full hover:bg-[#163f5a] transition-colors"
              >
                {t("send")}
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div>
            <h2
              className="text-2xl font-bold text-[#1B4F72] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Contactgegevens
            </h2>

            <div className="space-y-6">
              <div className="bg-[#F5E6C8] rounded-xl p-5">
                <p className="font-bold text-[#1B4F72] mb-1">📍 {t("address")}</p>
                <p className="text-sm text-[#1A1A1A]/70">
                  Herenstraat 48
                  <br />
                  2313 AL Leiden
                </p>
              </div>

              <div className="bg-[#F5E6C8] rounded-xl p-5">
                <p className="font-bold text-[#1B4F72] mb-2">📞 {t("orCall")}</p>
                <a
                  href="tel:+31715149802"
                  className="text-2xl font-bold text-[#1B4F72] hover:text-[#E8A87C] transition-colors"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  071 514 9802
                </a>
              </div>

              <div className="bg-[#F5E6C8] rounded-xl p-5">
                <p className="font-bold text-[#1B4F72] mb-2">🕒 Openingstijden</p>
                <div className="text-sm text-[#1A1A1A]/70 space-y-1">
                  <p>
                    <span className="font-medium">Winkel:</span> Ma t/m Za
                  </p>
                  <p>
                    <span className="font-medium">Markt Leiden:</span> Wo + Za
                  </p>
                  <p>
                    <span className="font-medium">Hoogvliet Voorschoten:</span>{" "}
                    Vrijdag
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <>
      <JsonLd />
      <ContactContent />
    </>
  );
}
