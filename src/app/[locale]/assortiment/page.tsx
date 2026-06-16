import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { AssortimentFilter } from "./AssortimentFilter";
import { products, CATEGORIE_LABELS, type Categorie } from "@/lib/assortiment-data";

const SCENE: Record<Categorie, string> = {
  "verse-vis": "/images/scene-vis.svg",
  "gerookte-vis": "/images/scene-gerookt.svg",
  "schaal-schelp": "/images/scene-schaaldier.svg",
  "vissalades": "/images/scene-vis.svg",
  "bereid": "/images/scene-vis.svg",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("assortimentTitle"),
    description: t("assortimentDesc"),
    alternates: {
      canonical: `/${locale}/assortiment`,
      languages: {
        nl: "/nl/assortiment",
        en: "/en/assortiment",
        de: "/de/assortiment",
        "x-default": "/nl/assortiment",
      },
    },
  };
}

// ─── Too Good To Go banner ────────────────────────────────────────────────────
function TGTGBanner({ locale }: { locale: string }) {
  return (
    <section
      className="py-5 px-4 border-b"
      style={{ backgroundColor: "#1a9e53", borderColor: "rgba(0,0,0,0.12)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* TGTG logo mark */}
          <div
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-black text-sm leading-tight text-center"
            style={{ backgroundColor: "white", color: "#1a9e53", borderRadius: "10px" }}
          >
            TOO<br />GOOD
          </div>
          <div>
            <p className="font-bold text-white text-sm md:text-base leading-tight">
              Dagelijks vers restanten via Too Good To Go
            </p>
            <p className="text-xs md:text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.82)" }}>
              Vis die over is aan het einde van de dag — tegen een fractie van de prijs. Verrassing wat er in zit!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="https://toogoodtogo.com/nl/consumer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white border-2 border-white transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ borderRadius: "6px" }}
          >
            Download de app →
          </a>
          <span className="hidden sm:block text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
            Zoek op &ldquo;Schaap&apos;s Vis Leiden&rdquo;
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function AssortimentHero({
  t,
  locale,
}: {
  t: ReturnType<typeof useTranslations>;
  locale: string;
}) {
  return (
    <section style={{ backgroundColor: "var(--navy)" }} className="py-14 text-center px-4">
      <p
        className="text-xs tracking-[0.2em] uppercase mb-3 opacity-50"
        style={{ color: "var(--sand)" }}
      >
        Vers · Duurzaam · Leiden
      </p>
      <h1
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
      >
        {t("title")}
      </h1>
      <p className="text-lg max-w-xl mx-auto mb-5" style={{ color: "rgba(246,250,253,0.75)" }}>
        {t("sub")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 text-sm"
          style={{ backgroundColor: "rgba(246,250,253,0.1)", color: "rgba(246,250,253,0.65)" }}
        >
          <span>📍</span> {t("note")}
        </div>
        <a
          href="https://wa.me/31715149802?text=Hallo%20Schaap%27s%20Vis%2C%20ik%20wil%20graag%20iets%20bestellen!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#25D366" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.132.558 4.13 1.532 5.864L.057 23.885l6.186-1.443A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.955 0-3.78-.554-5.33-1.511l-.383-.226-3.676.858.87-3.582-.249-.396A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Bestel via WhatsApp
        </a>
      </div>
    </section>
  );
}

// ─── CTA footer ───────────────────────────────────────────────────────────────
function AssortimentCta({ locale }: { locale: string }) {
  return (
    <section style={{ backgroundColor: "var(--sand)" }} className="py-12 text-center px-4">
      <p
        className="font-bold text-2xl mb-2"
        style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
      >
        Verse vis afhalen of laten klaarzetten?
      </p>
      <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
        Bestel vooruit via WhatsApp — wij zetten het klaar voor u. Of bel ons gewoon.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="https://wa.me/31715149802?text=Hallo%20Schaap%27s%20Vis%2C%20ik%20wil%20graag%20iets%20bestellen!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#25D366" }}
        >
          Bestel via WhatsApp
        </a>
        <a
          href="tel:+31715149802"
          className="inline-block font-medium px-7 py-3.5 border transition-opacity hover:opacity-80"
          style={{ borderColor: "var(--navy)", color: "var(--navy)" }}
        >
          071 514 9802
        </a>
        <Link
          href={`/${locale}/bezoek-ons`}
          className="inline-block font-medium px-7 py-3.5 border transition-opacity hover:opacity-80"
          style={{ borderColor: "var(--navy)", color: "var(--navy)" }}
        >
          Locaties & tijden →
        </Link>
      </div>
    </section>
  );
}

// ─── Page wrapper (server) ────────────────────────────────────────────────────
function AssortimentContent() {
  const t = useTranslations("assortimentPage");
  const locale = useLocale();

  return (
    <>
      <TGTGBanner locale={locale} />
      <AssortimentHero t={t} locale={locale} />
      <AssortimentFilter />
      <AssortimentCta locale={locale} />
    </>
  );
}

export default async function AssortimentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Assortiment Schaap's Vishandel Leiden",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.naam,
        description: `${p.desc} Ingrediënten/allergenen: ${p.ingredienten}`,
        category: CATEGORIE_LABELS[p.categorie],
        brand: { "@type": "Brand", name: "Schaap's Vishandel" },
        image: `https://www.schaapsvishandel.nl${SCENE[p.categorie]}`,
        ...(p.badge ? { award: p.badge } : {}),
      },
    })),
  };

  return (
    <>
      <JsonLd />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <AssortimentContent />
    </>
  );
}
