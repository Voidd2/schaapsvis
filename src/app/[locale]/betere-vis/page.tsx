import Link from "next/link";
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
    title: t("betereVisTitle"),
    description: t("betereVisDesc"),
    alternates: {
      canonical: `/${locale}/betere-vis`,
      languages: {
        nl: "/nl/betere-vis",
        en: "/en/betere-vis",
        de: "/de/betere-vis",
      },
    },
    openGraph: {
      title: t("betereVisTitle"),
      description: t("betereVisDesc"),
      locale,
      type: "website",
    },
  };
}

const certifications = [
  {
    key: "cert1" as const,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    color: "#2e8b57",
  },
  {
    key: "cert2" as const,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: "#1a6b8a",
  },
  {
    key: "cert3" as const,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
        <path d="M8 12s.5-4 4-6" />
        <path d="M12 6c0 0 4 2 4 6s-4 6-4 6" />
        <path d="M8 18s4-2 4-6" />
      </svg>
    ),
    color: "#2e6b5e",
  },
  {
    key: "cert4" as const,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    color: "#8b6914",
  },
];

const placeholderFish = [
  { name: "Kabeljauw", badge: "MSC", fotoLabel: "FOTO TOEVOEGEN: Verse kabeljauw filet" },
  { name: "Schol", badge: "MSC", fotoLabel: "FOTO TOEVOEGEN: Scholfilet of hele schol" },
  { name: "Varlaks Zalm", badge: "BIO", fotoLabel: "FOTO TOEVOEGEN: Varlaks zalmfilet roze kleur" },
  { name: "Forel", badge: "BIO", fotoLabel: "FOTO TOEVOEGEN: Regenboogforel" },
  { name: "Mosselen", badge: "MSC", fotoLabel: "FOTO TOEVOEGEN: Verse mosselen in pan" },
  { name: "Meer volgt...", badge: null, fotoLabel: "Meer duurzame vis volgt binnenkort" },
];

function BetereVisContent() {
  const t = useTranslations("betereVisPage");
  const locale = useLocale();

  return (
    <>
      {/* Hero */}
      <section
        className="relative py-28 px-6 text-center overflow-hidden"
        style={{ backgroundColor: "#0a2318" }}
      >
        {/* Decorative background element */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, #2e8b57 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #1a6b8a 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p
            className="text-xs uppercase tracking-[0.35em] mb-6 font-medium"
            style={{ color: "#6ec89a" }}
          >
            Schaap&apos;s Vis · Leiden · Est. 1938
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white"
            style={{ fontFamily: "Playfair Display, serif", letterSpacing: "-0.02em" }}
          >
            {t("heroTitle")}
          </h1>
          <p
            className="text-lg md:text-xl font-light max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {t("heroSub")}
          </p>
        </div>
      </section>

      {/* Why better fish */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase mb-4 opacity-50 font-semibold"
              style={{ color: "var(--navy)" }}
            >
              Onze filosofie
            </p>
            <h2
              className="text-4xl font-bold mb-6 leading-tight"
              style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
            >
              {t("whyTitle")}
            </h2>
            <p
              className="leading-relaxed mb-4"
              style={{ color: "var(--charcoal)", opacity: 0.8 }}
            >
              {t("whyText1")}
            </p>
            <p
              className="leading-relaxed font-medium"
              style={{ color: "var(--charcoal)", opacity: 0.9 }}
            >
              {t("whyText2")}
            </p>
          </div>
          <PhotoPlaceholder
            label="FOTO TOEVOEGEN: Aldert aan de toonbank met verse vis of de winkel van buitenaf"
            aspectRatio="aspect-[4/3]"
          />
        </div>
      </section>

      {/* Certifications grid */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-3"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            {t("certTitle")}
          </h2>
          <p className="text-center text-sm mb-12 opacity-60" style={{ color: "var(--charcoal)" }}>
            Keurmerken die u kunt vertrouwen
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map(({ key, icon, color }) => (
              <div
                key={key}
                className="p-6 bg-white"
                style={{ borderTop: `3px solid ${color}` }}
              >
                <div className="mb-4" style={{ color }}>
                  {icon}
                </div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                >
                  {t(key)}
                </h3>
                <p className="text-xs leading-relaxed opacity-70" style={{ color: "var(--charcoal)" }}>
                  {t(`${key}desc` as Parameters<typeof t>[0])}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Varlaks spotlight */}
      <section style={{ backgroundColor: "#0a1628" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <PhotoPlaceholder
            label="FOTO TOEVOEGEN: Varlaks zalmfilet — roze kleur, close-up textuur"
            aspectRatio="aspect-square"
            className="opacity-90"
          />
          <div>
            <span
              className="inline-block text-xs tracking-widest uppercase font-semibold px-3 py-1 mb-5"
              style={{ backgroundColor: "#2e6b5e", color: "white" }}
            >
              Biologisch gecertificeerd
            </span>
            <h2
              className="text-4xl font-bold mb-5 leading-tight text-white"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t("varlaksTitle")}
            </h2>
            <p
              className="leading-relaxed mb-8 text-sm"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {t("varlaksText")}
            </p>
            <Link
              href={`/${locale}/varlaks`}
              className="text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: "#7ec8d4" }}
            >
              {t("varlaksLink")}
            </Link>
          </div>
        </div>
      </section>

      {/* Fish grid — ready for the list */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-3"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            {t("listTitle")}
          </h2>
          <p
            className="text-center text-sm mb-12 max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--charcoal)", opacity: 0.7 }}
          >
            {t("listSub")}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {placeholderFish.map(({ name, badge, fotoLabel }) => (
              <article key={name} className="group relative">
                <div className="relative">
                  <PhotoPlaceholder label={fotoLabel} aspectRatio="aspect-square" />
                  {badge && (
                    <span
                      className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 text-white"
                      style={{
                        backgroundColor: badge === "BIO" ? "#2e6b5e" : "#1a6b8a",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                  {!badge && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                    >
                      <span
                        className="text-xs font-semibold px-3 py-1.5 text-white"
                        style={{ backgroundColor: "rgba(28,53,87,0.85)" }}
                      >
                        {t("comingSoonBadge")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="pt-3">
                  <h3
                    className="font-bold text-base"
                    style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                  >
                    {name}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          {/* Coming soon notice */}
          <div
            className="mt-12 p-8 text-center"
            style={{ backgroundColor: "var(--sand)", borderLeft: "4px solid var(--seafoam)" }}
          >
            <p
              className="text-sm leading-relaxed max-w-xl mx-auto"
              style={{ color: "var(--charcoal)", opacity: 0.8 }}
            >
              {t("comingSoonText")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 px-6 text-center">
        <h2
          className="text-3xl font-bold mb-4 text-white"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {t("ctaTitle")}
        </h2>
        <p
          className="text-sm mb-8 max-w-md mx-auto leading-relaxed"
          style={{ color: "rgba(247,240,227,0.7)" }}
        >
          {t("ctaText")}
        </p>
        <Link
          href={`/${locale}/bezoek-ons`}
          className="inline-block text-white px-8 py-4 tracking-wide font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--salmon)" }}
        >
          {t("ctaButton")} &rarr;
        </Link>
      </section>
    </>
  );
}

export default async function BetereVisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <>
      <JsonLd />
      <BetereVisContent />
    </>
  );
}
