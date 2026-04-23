import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("contactTitle"),
    description: t("contactDesc"),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { nl: "/nl/contact", en: "/en/contact", de: "/de/contact" },
    },
  };
}

function ContactContent() {
  const t = useTranslations("contactPage");

  return (
    <>
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 text-center px-4">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          {t("title")}
        </h1>
        <p className="text-lg" style={{ color: "rgba(247,240,227,0.75)" }}>
          {t("sub")}
        </p>
      </section>

      <section style={{ backgroundColor: "var(--cream)" }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2
              className="text-2xl font-bold mb-7"
              style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
            >
              {t("formTitle")}
            </h2>
            <form className="space-y-4" action="#" method="post">
              {[
                { id: "name", label: t("nameLabel"), type: "text" },
                { id: "email", label: t("emailLabel"), type: "email" },
              ].map(({ id, label, type }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--charcoal)", opacity: 0.8 }}
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    name={id}
                    required
                    className="w-full border px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-offset-0"
                    style={{ borderColor: "rgba(28,53,87,0.2)" }}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--charcoal)", opacity: 0.8 }}
                >
                  {t("messageLabel")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full border px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none"
                  style={{ borderColor: "rgba(28,53,87,0.2)" }}
                />
              </div>
              <button
                type="submit"
                className="w-full font-medium py-3 text-sm text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--navy)" }}
              >
                {t("send")}
              </button>
            </form>
          </div>

          {/* Info */}
          <div>
            <h2
              className="text-2xl font-bold mb-7"
              style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
            >
              {t("infoTitle")}
            </h2>
            <div className="space-y-5">
              <div style={{ backgroundColor: "var(--sand)" }} className="p-5">
                <p className="flex items-start gap-3 text-sm">
                  <MapPin size={15} className="mt-0.5 flex-shrink-0" style={{ color: "var(--navy)" }} />
                  <span style={{ color: "var(--charcoal)", opacity: 0.8 }}>
                    Herenstraat 48<br />2313 AL Leiden
                  </span>
                </p>
              </div>
              <div style={{ backgroundColor: "var(--sand)" }} className="p-5">
                <p className="flex items-center gap-3">
                  <Phone size={15} className="flex-shrink-0" style={{ color: "var(--navy)" }} />
                  <a
                    href="tel:+31715149802"
                    className="text-2xl font-bold transition-opacity hover:opacity-70"
                    style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                  >
                    071 514 9802
                  </a>
                </p>
              </div>
              <div style={{ backgroundColor: "var(--sand)" }} className="p-5">
                <p className="flex items-start gap-3 text-sm">
                  <Clock size={15} className="mt-0.5 flex-shrink-0" style={{ color: "var(--navy)" }} />
                  <span style={{ color: "var(--charcoal)", opacity: 0.8 }}>
                    <strong>Winkel:</strong> Ma t/m Za<br />
                    <strong>Markt Leiden:</strong> Wo + Za<br />
                    <strong>Voorschoten:</strong> Vrijdag
                  </span>
                </p>
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
