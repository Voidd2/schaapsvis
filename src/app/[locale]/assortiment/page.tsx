import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

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
      },
    },
  };
}

type NutritionRow = { label: string; value: string };

interface Product {
  name: string;
  desc: string;
  photoUrl: string | null;
  photoAlt: string;
  highlight: boolean;
  badge?: string;
  omega3Badge?: string;
  nutrition: NutritionRow[];
  nutritionNote?: string;
  bestelId?: string;
  ingredienten: string;    // EU-formaat: allergenen in HOOFDLETTERS
  bevat: string[];         // lijst van allergeennamen voor badges
}

const products: Product[] = [
  {
    name: "Kibbeling",
    desc: "Knapperig gebakken stukjes kabeljauw in een luchtig, goudbruin beslag — de Hollandse klassieker op zijn best. Kabeljauw is van nature een magere, eiwitrijke vis; het beslag voegt een hartige krokante korst toe.",
    photoUrl: "https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=800&q=80",
    photoAlt: "Goudbruine kibbeling op bakpapier",
    highlight: false,
    bestelId: "kibbeling",
    nutrition: [
      { label: "Energie", value: "ca. 235 kcal" },
      { label: "Eiwit", value: "17 g" },
      { label: "Vet", value: "10 g" },
      { label: "Koolhydr.", value: "18 g" },
    ],
    nutritionNote:
      "Kabeljauw zelf is vetarm en eiwitrijk — het beslag verhoogt het koolhydraatgehalte.",
    ingredienten: "Kabeljauw (Gadus morhua) [VIS], TARWEBLOEM, water, zout, rijsmiddel (E450, E500), plantaardige olie (zonnebloem). Bereid in frituurvet. Saus: mayonaise (EIEREN, MOSTERD).",
    bevat: ["VIS", "GLUTEN (tarwe)", "EIEREN", "MOSTERD"],
  },
  {
    name: "Lekkerbek",
    desc: "Verse wijting gehuld in een luchtig, knapperig beslag. Wijting is een magere, fijne witte vis — vergelijkbaar met kabeljauw maar met een iets subtielere smaak. Een eerlijk en toegankelijk gerecht.",
    photoUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80",
    photoAlt: "Lekkerbek in beslag",
    highlight: false,
    bestelId: "lekkerbek",
    nutrition: [
      { label: "Energie", value: "ca. 220 kcal" },
      { label: "Eiwit", value: "16 g" },
      { label: "Vet", value: "9 g" },
      { label: "Koolhydr.", value: "17 g" },
    ],
    nutritionNote: "Wijting is een magere, lichte vis — vergelijkbaar met kabeljauw.",
    ingredienten: "Wijting (Merlangius merlangus) [VIS], TARWEBLOEM, water, zout, rijsmiddel, plantaardige olie. Bereid in frituurvet.",
    bevat: ["VIS", "GLUTEN (tarwe)"],
  },
  {
    name: "Broodje Haring",
    desc: "Rauwe Hollandse Nieuwe haring op een zacht broodje, gegarneerd met fijngehakte ui en knapperige augurk. Haring bevat bijzonder veel omega-3 vetzuren en is een van de voedzaamste producten in ons assortiment.",
    photoUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80",
    photoAlt: "Broodje haring met ui en augurk",
    highlight: false,
    bestelId: "haring",
    omega3Badge: "Omega-3 topbron",
    nutrition: [
      { label: "Energie", value: "ca. 195 kcal" },
      { label: "Eiwit", value: "18 g" },
      { label: "Vet", value: "12 g" },
      { label: "Koolhydr.", value: "0 g" },
      { label: "Omega-3", value: "ca. 2,7 g" },
    ],
    nutritionNote: "Haring is een van de beste omega-3 bronnen in ons assortiment.",
    ingredienten: "HARING (Clupea harengus) [VIS], broodrol (TARWEBLOEM, gist, water, zout, plantaardige olie) [GLUTEN], ui, augurk (komkommer, azijn, suiker, zout, kruiden, MOSTERD), zout.",
    bevat: ["VIS", "GLUTEN (tarwe)", "MOSTERD"],
  },
  {
    name: "Vissoep",
    desc: "Dagelijks vers bereid in onze eigen keuken. De samenstelling wisselt per dag op basis van het seizoensaanbod — altijd met verse vis als basis. Vol smaak, warm en voedzaam.",
    photoUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    photoAlt: "Kom huisgemaakte vissoep",
    highlight: false,
    bestelId: "vissoep",
    nutrition: [
      { label: "Energie", value: "150–200 kcal" },
      { label: "Eiwit", value: "12–15 g" },
      { label: "Vet", value: "6–9 g" },
      { label: "Koolhydr.", value: "wisselend" },
    ],
    nutritionNote: "Voedingswaarden per 250 ml kom; wisselen per dag op basis van receptuur.",
    ingredienten: "Verse vis (wisselend seizoensaanbod) [VIS], water, ui, wortel, SELDERIJ, prei, aardappel, kruiden, zout, peper. Samenstelling wisselt dagelijks. Kan MELK (room) bevatten.",
    bevat: ["VIS", "SELDERIJ", "kan MELK bevatten"],
  },
  {
    name: "Vispotje",
    desc: "Een romig stoofpotje met verse stukken vis in een rijke saus. Ideaal als uitgebreid tussendoortje of lichte maaltijd. De vissoort wisselt met het seizoen.",
    photoUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    photoAlt: "Vispotje in een schaaltje",
    highlight: false,
    nutrition: [
      { label: "Energie", value: "afhankelijk van vis" },
      { label: "Eiwit", value: "hoog" },
      { label: "Vet", value: "wisselend" },
      { label: "Omega-3", value: "aanwezig" },
    ],
    nutritionNote: "Voedingswaarden afhankelijk van vissoort en bereiding.",
    ingredienten: "Verse vis (wisselend) [VIS], kookroom [MELK], ui, wortel, SELDERIJ, kruiden, zout, peper. Samenstelling wisselt per dag.",
    bevat: ["VIS", "MELK", "SELDERIJ"],
  },
  {
    name: "Feestelijke Visschotel",
    desc: "Een indrukwekkende schaal met een selectie van onze beste producten — perfect voor bijzondere gelegenheden, borrels of een feestelijk diner. Inhoud en grootte in overleg.",
    photoUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    photoAlt: "Gevulde feestelijke visschotel",
    highlight: false,
    bestelId: "feestschotel",
    nutrition: [
      { label: "Energie", value: "afhankelijk" },
      { label: "Eiwit", value: "hoog" },
      { label: "Omega-3", value: "aanwezig" },
      { label: "Koolhydr.", value: "wisselend" },
    ],
    nutritionNote: "Voedingswaarden afhankelijk van vissoort en bereiding.",
    ingredienten: "Wisselende selectie verse en gerookte VIS, SCHAALDIEREN en/of WEEKDIEREN, diverse garneringen. Samenstelling in overleg. Kan EIEREN, GLUTEN en MELK bevatten.",
    bevat: ["VIS", "SCHAALDIEREN", "WEEKDIEREN", "kan EIEREN, GLUTEN, MELK bevatten"],
  },
  {
    name: "Varlaks Biologische Zalm",
    desc: "Premium biologische zalmfilet uit Noord-Noorwegen, boven de poolcirkel gekweekt door familieboeren. ASC gecertificeerd, volledig traceerbaar — zonder antibiotica, GMO of hormonen. Een van de rijkste omega-3 bronnen die u kunt kopen.",
    photoUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    photoAlt: "Verse Varlaks zalmfilet",
    highlight: true,
    bestelId: "varlaks",
    badge: "Biologisch · ASC",
    omega3Badge: "Omega-3 uitstekend",
    nutrition: [
      { label: "Energie", value: "ca. 208 kcal" },
      { label: "Eiwit", value: "20 g" },
      { label: "Vet", value: "13 g" },
      { label: "Koolhydr.", value: "0 g" },
      { label: "Omega-3", value: "ca. 3,5 g" },
    ],
    nutritionNote: "ASC gecertificeerd. Voedingswaarden voor rauwe filet per 100 g.",
    ingredienten: "Atlantische zalm (Salmo salar) [VIS]. Biologisch gecertificeerd. Geen toegevoegde stoffen.",
    bevat: ["VIS"],
  },
  {
    name: "Verse Vis (Seizoensaanbod)",
    desc: "Ons dagelijks wisselende aanbod van verse vis — rechtstreeks van de veiling of onze vaste leveranciers. Wat er ligt hangt af van het seizoen en de vangst. Vraag ons gerust naar het aanbod van de dag.",
    photoUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    photoAlt: "Verse vis op ijs, wisselend dagaanbod",
    highlight: false,
    nutrition: [
      { label: "Energie", value: "afhankelijk van vis" },
      { label: "Eiwit", value: "hoog" },
      { label: "Vet", value: "wisselend" },
      { label: "Omega-3", value: "aanwezig" },
    ],
    nutritionNote: "Voedingswaarden afhankelijk van vissoort en bereiding.",
    ingredienten: "Verse vis (soort wisselt dagelijks) [VIS]. Vraag het personeel naar de vis van vandaag.",
    bevat: ["VIS — soort wisselt dagelijks"],
  },
];

// ─── Sub-components (no client directives needed — no state/events) ──────────

function PhotoSlot({ photoUrl, photoAlt }: { photoUrl: string | null; photoAlt: string }) {
  if (photoUrl) {
    return (
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={photoUrl}
          alt={photoAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className="aspect-square flex flex-col items-center justify-center gap-2"
      style={{ backgroundColor: "#ddd8cc", border: "2px dashed #bbb5a8" }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span
        style={{
          color: "#888",
          fontSize: "0.7rem",
          textAlign: "center",
          padding: "0 1rem",
          lineHeight: "1.3",
          fontWeight: 500,
        }}
      >
        {photoAlt}
      </span>
    </div>
  );
}

function NutritionGrid({ rows, note }: { rows: NutritionRow[]; note?: string }) {
  return (
    <div
      className="mt-3 rounded overflow-hidden"
      style={{
        backgroundColor: "rgba(26,53,48,0.04)",
        border: "1px solid rgba(26,53,48,0.1)",
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-1 text-xs font-semibold uppercase tracking-wider"
        style={{
          color: "var(--navy)",
          borderBottom: "1px solid rgba(26,53,48,0.1)",
          opacity: 0.55,
          letterSpacing: "0.08em",
          fontSize: "0.6rem",
        }}
      >
        voedingswaarden (indicatie)
      </div>

      {/* Value grid — 2 columns */}
      <div className="grid grid-cols-2">
        {rows.map(({ label, value }, i) => (
          <div
            key={label}
            className="px-3 py-1.5 flex justify-between items-baseline gap-1"
            style={{
              borderBottom:
                i < rows.length - (rows.length % 2 === 0 ? 2 : 1)
                  ? "1px solid rgba(26,53,48,0.07)"
                  : "none",
              borderRight: i % 2 === 0 ? "1px solid rgba(26,53,48,0.07)" : "none",
            }}
          >
            <span
              className="text-xs"
              style={{ color: "var(--charcoal)", opacity: 0.5, whiteSpace: "nowrap" }}
            >
              {label}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--navy)", textAlign: "right" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Note */}
      {note && (
        <p
          className="px-3 py-2 text-xs leading-snug"
          style={{
            color: "var(--charcoal)",
            opacity: 0.45,
            borderTop: "1px solid rgba(26,53,48,0.07)",
            fontSize: "0.65rem",
          }}
        >
          {note}
        </p>
      )}
    </div>
  );
}

function AllergenTag({ label }: { label: string }) {
  return (
    <span
      className="inline-block text-xs px-2 py-0.5 font-semibold"
      style={{
        backgroundColor: "rgba(200,96,74,0.1)",
        color: "#c8604a",
        border: "1px solid rgba(200,96,74,0.25)",
        borderRadius: "2px",
      }}
    >
      {label}
    </span>
  );
}

function IngredientenSectie({ ingredienten, bevat }: { ingredienten: string; bevat: string[] }) {
  return (
    <details className="mt-3 group">
      <summary
        className="text-xs font-medium cursor-pointer select-none flex items-center gap-2 px-3 py-2"
        style={{
          backgroundColor: "rgba(26,53,48,0.04)",
          color: "var(--charcoal)",
          border: "1px solid rgba(26,53,48,0.08)",
          listStyle: "none",
        }}
      >
        <span style={{ color: "var(--navy)", opacity: 0.5, fontSize: "0.6rem" }}>▶</span>
        <span style={{ opacity: 0.65 }}>Ingrediënten & allergenen</span>
      </summary>
      <div
        className="px-3 py-3 text-xs leading-relaxed"
        style={{
          backgroundColor: "rgba(26,53,48,0.02)",
          border: "1px solid rgba(26,53,48,0.08)",
          borderTop: "none",
        }}
      >
        <p className="mb-3" style={{ color: "var(--charcoal)", opacity: 0.7, lineHeight: "1.6" }}>
          {ingredienten}
        </p>
        <div>
          <span
            className="text-xs font-bold uppercase tracking-wider mr-2"
            style={{ color: "var(--charcoal)", opacity: 0.4, fontSize: "0.6rem" }}
          >
            Bevat:
          </span>
          <span className="inline-flex flex-wrap gap-1 mt-1">
            {bevat.map((a) => (
              <AllergenTag key={a} label={a} />
            ))}
          </span>
        </div>
        <p className="mt-2.5 text-xs" style={{ color: "var(--charcoal)", opacity: 0.35, fontSize: "0.6rem" }}>
          Ondanks zorgvuldigheid kunnen sporen van andere allergenen aanwezig zijn. Bij twijfel: vraag ons.
        </p>
      </div>
    </details>
  );
}

// ─── Page content ─────────────────────────────────────────────────────────────

function AssortimentContent() {
  const t = useTranslations("assortimentPage");
  const locale = useLocale();

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
        <p className="text-lg max-w-xl mx-auto mb-5" style={{ color: "rgba(246,250,253,0.75)" }}>
          {t("sub")}
        </p>
        <div
          className="inline-block px-4 py-2 text-sm"
          style={{ backgroundColor: "rgba(246,250,253,0.1)", color: "rgba(246,250,253,0.6)" }}
        >
          {t("note")}
        </div>
      </section>

      {/* Product grid */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(
              ({ name, desc, photoUrl, photoAlt, highlight, badge, omega3Badge, nutrition, nutritionNote, bestelId, ingredienten, bevat }) => (
                <article
                  key={name}
                  className={`overflow-hidden flex flex-col${
                    highlight ? " outline outline-2 outline-[var(--seafoam)]" : ""
                  }`}
                >
                  {/* Photo area */}
                  <div className="relative">
                    <PhotoSlot photoUrl={photoUrl} photoAlt={photoAlt} />

                    {/* Top-left: Biologisch / ASC badge */}
                    {badge && (
                      <div
                        className="absolute top-3 left-3 text-xs font-semibold px-2 py-0.5"
                        style={{ backgroundColor: "var(--seafoam)", color: "var(--cream)" }}
                      >
                        {badge}
                      </div>
                    )}

                    {/* Bottom-right: Omega-3 badge */}
                    {omega3Badge && (
                      <div
                        className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-semibold px-2 py-0.5"
                        style={{ backgroundColor: "var(--salmon)", color: "white" }}
                      >
                        <span aria-hidden="true" style={{ fontFamily: "serif" }}>
                          Ω
                        </span>
                        {omega3Badge}
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div
                    className="p-4 flex flex-col flex-1"
                    style={{ backgroundColor: highlight ? "var(--sand)" : "white" }}
                  >
                    <h3
                      className="font-bold text-base mb-1"
                      style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                    >
                      {name}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
                      {desc}
                    </p>

                    {/* Nutritional info */}
                    <NutritionGrid rows={nutrition} note={nutritionNote} />

                    {/* Ingredients & allergens */}
                    <IngredientenSectie ingredienten={ingredienten} bevat={bevat} />

                    {/* Varlaks detail link */}
                    {highlight && (
                      <Link
                        href={`/${locale}/varlaks`}
                        className="inline-block mt-3 text-xs font-semibold underline underline-offset-2"
                        style={{ color: "var(--seafoam)" }}
                      >
                        Meer over Varlaks &rarr;
                      </Link>
                    )}

                    {/* Order CTA */}
                    {bestelId && (
                      <Link
                        href={`/${locale}/bestellen?product=${bestelId}`}
                        className="inline-block mt-auto pt-3 text-sm font-semibold text-center py-2 transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "var(--salmon)", color: "white", marginTop: "12px" }}
                      >
                        Bestel dit &rarr;
                      </Link>
                    )}
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-12 text-center px-4">
        <p
          className="font-bold text-2xl mb-2"
          style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
        >
          Verse vis afhalen of laten klaarzetten?
        </p>
        <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
          Bestel vooruit via onze bestelformulier — wij zetten het klaar voor u.
          Of bel ons gewoon.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={`/${locale}/bestellen`}
            className="inline-block font-medium px-7 py-3.5 text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--salmon)" }}
          >
            Bestel vooruit &rarr;
          </Link>
          <a
            href="tel:+31715149802"
            className="inline-block font-medium px-7 py-3.5 border transition-opacity hover:opacity-80"
            style={{ borderColor: "var(--navy)", color: "var(--navy)" }}
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
  await params;
  return (
    <>
      <JsonLd />
      <AssortimentContent />
    </>
  );
}
