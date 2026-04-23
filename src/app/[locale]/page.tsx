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
  const t = await getTranslations({ locale, namespace: "home" });

  const descriptions: Record<string, string> = {
    nl: "Schaaps Vis in Leiden verkoopt verse vis, kibbeling, haring en biologische Vårlaks zalm. Al 86 jaar op de Herenstraat. Ook op de markt en bij Hoogvliet Voorschoten.",
    en: "Schaaps Vis in Leiden sells fresh fish, kibbeling, herring and organic Vårlaks salmon. 86 years on Herenstraat. Also at the market and Hoogvliet Voorschoten.",
    de: "Schaaps Vis in Leiden verkauft frischen Fisch, Kibbeling, Hering und Bio-Vårlaks-Lachs. Seit 86 Jahren in der Herenstraat. Auch auf dem Markt und bei Hoogvliet Voorschoten.",
  };

  return {
    title: "Kibbeling & Verse Vis in Leiden | Schaaps Vis — Herenstraat",
    description: descriptions[locale] ?? descriptions.nl,
    alternates: {
      canonical: locale === "nl" ? "/" : `/${locale}`,
      languages: { nl: "/", en: "/en", de: "/de" },
    },
    openGraph: {
      title: t("heroTitle") + " " + t("heroTitle2"),
      description: descriptions[locale] ?? descriptions.nl,
      locale,
      type: "website",
    },
  };
}

function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations("home");
  const prefix = (path: string) => (locale === "nl" ? path : `/${locale}${path}`);

  return (
    <section className="relative bg-[#1B4F72] text-white overflow-hidden min-h-[520px] flex items-center">
      {/* Decorative wave */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d2d42] to-transparent" />
      </div>

      {/* Placeholder image overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B4F72] via-[#1B4F72]/90 to-[#1B4F72]/60" />

      <div className="relative max-w-6xl mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <span className="inline-block bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            Opgericht 1938 · 86 jaar vakmanschap
          </span>
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("heroTitle")}
            <br />
            <span className="text-[#E8A87C]">{t("heroTitle2")}</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            {t("heroSub")}
          </p>
          <Link
            href={prefix("/bezoek-ons")}
            className="inline-block bg-[#E8A87C] hover:bg-[#d4956a] text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-lg"
          >
            {t("heroCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function OpeningstijdenStrip() {
  const t = useTranslations("home");

  return (
    <section className="bg-[#F5E6C8] border-y border-[#E8A87C]/30">
      <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {[
          {
            icon: "🏪",
            title: t("shop"),
            hours: t("shopHours"),
          },
          {
            icon: "🛒",
            title: t("markt"),
            hours: t("marktHours"),
          },
          {
            icon: "📍",
            title: t("voorschoten"),
            hours: t("voorschotenHours"),
          },
        ].map(({ icon, title, hours }) => (
          <div key={title} className="flex items-center justify-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="text-left">
              <p className="font-semibold text-[#1B4F72] text-sm">{title}</p>
              <p className="text-[#1A1A1A]/70 text-xs">{hours}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection({ locale }: { locale: string }) {
  const t = useTranslations("home");
  const prefix = (path: string) => (locale === "nl" ? path : `/${locale}${path}`);

  return (
    <section className="bg-[#FAFAF8] py-16">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Placeholder image */}
        <div className="bg-[#F5E6C8] rounded-2xl aspect-[4/3] flex items-center justify-center shadow-inner">
          <div className="text-center text-[#1B4F72]/40">
            <div className="text-6xl mb-2">🐟</div>
            <p className="text-sm">Foto winkel</p>
          </div>
        </div>
        <div>
          <h2
            className="text-3xl font-bold text-[#1B4F72] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("aboutTitle")}
          </h2>
          <p className="text-[#1A1A1A]/70 leading-relaxed mb-6">
            {t("aboutText")}
          </p>
          <Link
            href={prefix("/ons-verhaal")}
            className="text-[#1B4F72] font-semibold hover:text-[#E8A87C] transition-colors"
          >
            {t("aboutLink")}
          </Link>
          <div className="flex flex-wrap gap-3 mt-8">
            {[t("badge1"), t("badge2"), t("badge3")].map((badge) => (
              <span
                key={badge}
                className="bg-[#F5E6C8] border border-[#E8A87C]/40 text-[#1B4F72] text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VarlaksSection({ locale }: { locale: string }) {
  const t = useTranslations("home");
  const prefix = (path: string) => (locale === "nl" ? path : `/${locale}${path}`);

  return (
    <section className="bg-[#1B4F72] text-white py-16">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-[#2D6A4F] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Biologisch · Premium · Noors
          </span>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("varlaksTitle")}
          </h2>
          <p className="text-white/80 mb-6 leading-relaxed">{t("varlaksSub")}</p>
          <ul className="space-y-2 mb-8 text-white/70 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-[#E8A87C]">✓</span> Geen antibiotica of GMO
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#E8A87C]">✓</span> Familieboerderijen boven
              de Poolcirkel
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#E8A87C]">✓</span> Volledig traceerbaar
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#E8A87C]">✓</span> Rijk aan omega-3
            </li>
          </ul>
          <Link
            href={prefix("/varlaks-biologische-zalm")}
            className="inline-block bg-[#E8A87C] hover:bg-[#d4956a] text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
          >
            {t("varlaksLink")}
          </Link>
        </div>
        {/* Placeholder image */}
        <div className="bg-white/10 rounded-2xl aspect-[4/3] flex items-center justify-center">
          <div className="text-center text-white/40">
            <div className="text-6xl mb-2">🐠</div>
            <p className="text-sm">Foto Vårlaks zalm</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const products = [
  { key: "p1", emoji: "🍤" },
  { key: "p2", emoji: "🐟" },
  { key: "p3", emoji: "🥖" },
  { key: "p4", emoji: "🍲" },
  { key: "p5", emoji: "🫙" },
  { key: "p6", emoji: "🦐" },
];

function AssortimentSection({ locale }: { locale: string }) {
  const t = useTranslations("home");
  const a = useTranslations("assortiment");

  return (
    <section className="bg-[#FAFAF8] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2
            className="text-3xl font-bold text-[#1B4F72] mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("assortimentTitle")}
          </h2>
          <p className="text-[#1A1A1A]/60">{t("assortimentSub")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(({ key, emoji }) => (
            <div
              key={key}
              className="bg-[#F5E6C8] rounded-xl p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{emoji}</div>
              <h3 className="font-semibold text-[#1B4F72] mb-1">
                {a(`${key}name` as Parameters<typeof a>[0])}
              </h3>
              <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">
                {a(`${key}desc` as Parameters<typeof a>[0])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocatiesSection() {
  const t = useTranslations("home");

  return (
    <section className="bg-[#F5E6C8] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-[#1B4F72] mb-10 text-center"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {t("locatieTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            {
              emoji: "🏪",
              title: "Viswinkel Herenstraat",
              addr: "Herenstraat 48, 2313 AL Leiden",
              hours: "Maandag t/m Zaterdag",
              tel: "071 514 9802",
              maps: "https://maps.google.com/?q=Herenstraat+48,+Leiden",
            },
            {
              emoji: "🛒",
              title: "Markt Leiden",
              addr: "Centrum Leiden",
              hours: "Woensdag + Zaterdag",
              maps: "https://maps.google.com/?q=Markt+Leiden",
            },
            {
              emoji: "📍",
              title: "Hoogvliet Voorschoten",
              addr: "Hoogvliet, Voorschoten",
              hours: "Vrijdag",
              maps: "https://maps.google.com/?q=Hoogvliet+Voorschoten",
            },
          ].map(({ emoji, title, addr, hours, tel, maps }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#E8A87C]/20"
            >
              <div className="text-3xl mb-3">{emoji}</div>
              <h3 className="font-bold text-[#1B4F72] mb-1">{title}</h3>
              <p className="text-sm text-[#1A1A1A]/70 mb-1">{addr}</p>
              <p className="text-sm text-[#1A1A1A]/70 mb-1">{hours}</p>
              {tel && (
                <a
                  href={`tel:+31715149802`}
                  className="text-sm text-[#E8A87C] hover:underline block mb-3"
                >
                  {tel}
                </a>
              )}
              <a
                href={maps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1B4F72] font-semibold hover:text-[#E8A87C] transition-colors"
              >
                Route →
              </a>
            </div>
          ))}
        </div>

        {/* Google Maps embed — Herenstraat */}
        <div className="rounded-2xl overflow-hidden shadow-md">
          <iframe
            title="Schaaps Vis Leiden"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2448.5!2d4.494!3d52.1595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5c688e89f5de3%3A0x0!2sHerenstraat+48%2C+2313+AL+Leiden!5e0!3m2!1snl!2snl!4v1"
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const t = useTranslations("home");

  const reviews = [
    {
      name: "Marieke V.",
      stars: 5,
      text: "De lekkerste kibbeling van heel Leiden! Al jaren vaste klant en het wordt alleen maar beter. Aldert maakt altijd even tijd voor een praatje.",
    },
    {
      name: "Peter de B.",
      stars: 5,
      text: "Geweldige viswinkel met een fantastisch verhaal. De Vårlaks zalm is echt een klasse apart — je proeft meteen het verschil.",
    },
    {
      name: "Annemiek R.",
      stars: 5,
      text: "Een echte familiebusiness zoals ze vroeger waren. Altijd vers, altijd vriendelijk, altijd eerlijk. Zou je zomaar kunnen vergeten in deze tijd!",
    },
  ];

  return (
    <section className="bg-[#1B4F72] text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-center mb-10"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {t("reviewsTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white/10 backdrop-blur rounded-xl p-6"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <span key={i} className="text-[#E8A87C]">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-4 italic">
                &ldquo;{r.text}&rdquo;
              </p>
              <p className="text-[#E8A87C] text-sm font-semibold">— {r.name}</p>
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
  const { locale } = await params;

  return (
    <>
      <JsonLd />
      <HeroSection locale={locale} />
      <OpeningstijdenStrip />
      <AboutSection locale={locale} />
      <VarlaksSection locale={locale} />
      <AssortimentSection locale={locale} />
      <LocatiesSection />
      <ReviewsSection />
    </>
  );
}
