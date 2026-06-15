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
    title: t("bezoekTitle"),
    description: t("bezoekDesc"),
    alternates: {
      canonical: `/${locale}/bezoek-ons`,
      languages: {
        nl: "/nl/bezoek-ons",
        en: "/en/bezoek-ons",
        de: "/de/bezoek-ons",
        "x-default": "/nl/bezoek-ons",
      },
    },
  };
}

const locations = [
  {
    name: "Viswinkel Herenstraat",
    address: "Herenstraat 48, 2313 AL Leiden",
    phone: "071 514 9802",
    days: "Maandag t/m zaterdag",
    hours: "08:30 – 17:30",
    fotoUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80",
    fotoAlt: "Verse vis op de toonbank bij Schaap's Vishandel Herenstraat",
    mapsHref: "https://maps.google.com/?q=Herenstraat+48,+2313+AL+Leiden",
  },
  {
    name: "Markt Leiden",
    address: "Nieuwe Rijn / centrum, Leiden",
    phone: null,
    days: "Woensdag + Zaterdag",
    hours: "09:00 – 17:00",
    fotoUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    fotoAlt: "Marktstand Schaap's Vis op de Leidse markt",
    mapsHref: "https://maps.google.com/?q=Leiden+Markt+Nieuwe+Rijn",
  },
  {
    name: "Hoogvliet Voorschoten",
    address: "Bij de Hoogvliet, Voorschoten",
    phone: null,
    days: "Vrijdag",
    hours: "08:30 – 16:00",
    fotoUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    fotoAlt: "Visstand bij Hoogvliet Voorschoten",
    mapsHref: "https://maps.google.com/?q=Hoogvliet+Voorschoten",
  },
];

function BezoekContent() {
  const t = useTranslations("bezoekPage");

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 text-center px-4">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          {t("title")}
        </h1>
        <p className="text-lg" style={{ color: "rgba(246,250,253,0.75)" }}>
          {t("sub")}
        </p>
      </section>

      {/* Locations */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-20">
          {locations.map(
            ({ name, address, phone, days, hours, fotoUrl, fotoAlt, mapsHref }, idx) => (
              <div
                key={name}
                className={`grid md:grid-cols-2 gap-8 items-start ${
                  idx % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Info */}
                <div style={{ backgroundColor: "var(--sand)" }} className="p-8">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white mb-5"
                    style={{ backgroundColor: "var(--navy)" }}
                  >
                    {idx + 1}
                  </div>
                  <h2
                    className="text-2xl font-bold mb-5"
                    style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                  >
                    {name}
                  </h2>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-start gap-3">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0 opacity-50" style={{ color: "var(--navy)" }} />
                      <span style={{ color: "var(--charcoal)", opacity: 0.8 }}>{address}</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Clock size={14} className="flex-shrink-0 opacity-50" style={{ color: "var(--navy)" }} />
                      <span style={{ color: "var(--charcoal)", opacity: 0.8 }}>
                        <strong>{days}</strong> · {hours}
                      </span>
                    </p>
                    {phone && (
                      <p className="flex items-center gap-3">
                        <Phone size={14} className="flex-shrink-0 opacity-50" style={{ color: "var(--navy)" }} />
                        <a
                          href="tel:+31715149802"
                          className="font-semibold transition-opacity hover:opacity-70"
                          style={{ color: "var(--navy)" }}
                        >
                          {phone}
                        </a>
                      </p>
                    )}
                  </div>
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 text-sm font-semibold px-5 py-2.5 text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--navy)" }}
                  >
                    Route →
                  </a>
                </div>

                {/* Location photo */}
                <div className="h-[300px] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoUrl}
                    alt={fotoAlt}
                    className="w-full h-full object-cover"
                  />
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 text-xs font-semibold px-3 py-2 text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "rgba(29,36,114,0.9)" }}
                  >
                    Bekijk op kaart →
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Phone CTA */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-12 text-center px-4">
        <p className="text-sm mb-3" style={{ color: "rgba(246,250,253,0.6)" }}>
          Vragen? Bel ons gerust op:
        </p>
        <a
          href="tel:+31715149802"
          className="text-4xl font-bold transition-opacity hover:opacity-80"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          071 514 9802
        </a>
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
