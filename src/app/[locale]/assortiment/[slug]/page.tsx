import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  products,
  getProduct,
  getVoeding,
  getSeizoen,
  getViswijzer,
  CATEGORIE_LABELS,
  CATEGORIE_KLEUR,
  type Categorie,
} from "@/lib/assortiment-data";
import { getPrijs, formatPrijs } from "@/lib/prijzen";

const SCENE: Record<Categorie, string> = {
  "verse-vis": "/images/scene-vis.svg",
  "gerookte-vis": "/images/scene-gerookt.svg",
  "schaal-schelp": "/images/scene-schaaldier.svg",
  "vissalades": "/images/scene-vis.svg",
  "bereid": "/images/scene-vis.svg",
};

const BESCHIKBAAR_LABEL: Record<string, string> = {
  dagelijks: "Dagelijks vers",
  seizoensgebonden: "Seizoensgebonden",
  "op bestelling": "Op aanvraag",
};

// Relevante eigen blogs per product (voor "wat maak je ermee?").
const ALGEMENE_BLOGS: { slug: string; label: string }[] = [
  { slug: "verse-vis-bewaren-en-bereiden-tips", label: "Verse vis bewaren en bereiden" },
  { slug: "viskalender-welke-vis-in-welk-seizoen", label: "Welke vis is wanneer het lekkerst?" },
];
function recepteBlogs(naam: string, categorie: Categorie): { slug: string; label: string }[] {
  const n = naam.toLowerCase();
  const out: { slug: string; label: string }[] = [];
  if (n.includes("zalm")) {
    out.push({ slug: "wilde-zalm-vs-kweekzalm-waarom-wij-varlaks-kiezen", label: "Wilde zalm vs. kweekzalm" });
    out.push({ slug: "is-biologische-zalm-gezonder-omega-3", label: "Is biologische zalm gezonder?" });
  }
  if (n.includes("garnaal") || n.includes("garnalen")) {
    out.push({ slug: "de-echte-hollandse-garnaal", label: "De echte Hollandse garnaal" });
  }
  if (n.includes("haring")) {
    out.push({ slug: "hollandse-nieuwe-waarom-juni-haring-anders-smaakt", label: "Hollandse Nieuwe: het haringseizoen" });
  }
  if (categorie === "bereid" && (n.includes("kibbeling") || n.includes("lekkerbek"))) {
    out.push({ slug: "kibbeling-vs-lekkerbek-het-verschil", label: "Kibbeling vs. lekkerbek" });
  }
  out.push(...ALGEMENE_BLOGS);
  const seen = new Set<string>();
  return out.filter((b) => (seen.has(b.slug) ? false : (seen.add(b.slug), true))).slice(0, 3);
}
// Externe receptsites — beste bovenaan (search op de productnaam).
function externeRecepten(naam: string): { label: string; href: string }[] {
  const q = encodeURIComponent(naam);
  return [
    { label: "Allerhande (Albert Heijn)", href: `https://www.ah.nl/allerhande/zoeken?query=${q}` },
    { label: "Leuke Recepten", href: `https://www.leukerecepten.nl/?s=${q}` },
    { label: "Meer recepten via Google", href: `https://www.google.com/search?q=${q}+recept` },
  ];
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const title = `${product.naam} — voedingswaarde & info | Schaap's Vis Leiden`;
  const description = `${product.naam}: ${product.desc} Voedingswaarde, allergenen en herkomst bij Schaap's Vishandel Leiden.`.slice(0, 300);
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/assortiment/${slug}`,
      languages: {
        nl: `/nl/assortiment/${slug}`,
        en: `/en/assortiment/${slug}`,
        de: `/de/assortiment/${slug}`,
        "x-default": `/nl/assortiment/${slug}`,
      },
    },
    openGraph: { title, description, locale, type: "website" },
  };
}

function waUrl(naam: string) {
  const msg = `Hallo Schaap's Vishandel, ik wil graag ${naam} bestellen of reserveren. Wanneer kan ik dit ophalen?`;
  return `https://wa.me/31715149802?text=${encodeURIComponent(msg)}`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const kleur = CATEGORIE_KLEUR[product.categorie];
  const voeding = getVoeding(slug);
  const seizoen = getSeizoen(slug);
  const viswijzer = getViswijzer(slug);
  const beschikbaar = product.beschikbaar ? BESCHIKBAAR_LABEL[product.beschikbaar] : undefined;
  const opAanvraag = product.beschikbaar !== "dagelijks";
  const prijs = getPrijs(slug);
  // Upsell naar biologische Varlaks-zalm op elke zalmpagina behalve Varlaks zelf.
  const isZalm = !product.highlight && /zalm|lax/.test(slug);
  const blogs = recepteBlogs(product.naam, product.categorie);
  const extern = externeRecepten(product.naam);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.naam,
    description: product.desc,
    category: CATEGORIE_LABELS[product.categorie],
    brand: { "@type": "Brand", name: "Schaap's Vishandel" },
    image: `https://www.schaapsvishandel.nl${SCENE[product.categorie]}`,
    ...(product.badge ? { award: product.badge } : {}),
    ...(prijs
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: prijs.euro.toFixed(2),
            availability: opAanvraag
              ? "https://schema.org/PreOrder"
              : "https://schema.org/InStock",
            url: `https://www.schaapsvishandel.nl/${locale}/bestellen?product=${slug}`,
            seller: { "@type": "Organization", name: "Schaap's Vishandel" },
          },
        }
      : {}),
    ...(voeding
      ? {
          nutrition: {
            "@type": "NutritionInformation",
            servingSize: "100 g",
            calories: `${voeding.kcal} kcal`,
            fatContent: `${voeding.vet} g`,
            saturatedFatContent: `${voeding.verzadigd} g`,
            carbohydrateContent: `${voeding.koolhydraten} g`,
            sugarContent: `${voeding.suikers} g`,
            proteinContent: `${voeding.eiwit} g`,
            sodiumContent: `${voeding.zout} g`,
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `https://www.schaapsvishandel.nl/${locale}` },
      { "@type": "ListItem", position: 2, name: "Assortiment", item: `https://www.schaapsvishandel.nl/${locale}/assortiment` },
      { "@type": "ListItem", position: 3, name: product.naam, item: `https://www.schaapsvishandel.nl/${locale}/assortiment/${slug}` },
    ],
  };

  const voedingRijen: [string, string][] = voeding
    ? [
        ["Energie", `${voeding.kcal} kcal / ${voeding.kj} kJ`],
        ["Vetten", `${voeding.vet} g`],
        ["waarvan verzadigd", `${voeding.verzadigd} g`],
        ["Koolhydraten", `${voeding.koolhydraten} g`],
        ["waarvan suikers", `${voeding.suikers} g`],
        ["Eiwitten", `${voeding.eiwit} g`],
        ["Zout", `${voeding.zout} g`],
      ]
    : [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto px-6 pt-6 text-xs" style={{ color: "var(--charcoal)" }} aria-label="Kruimelpad">
        <Link href={`/${locale}/assortiment`} className="underline opacity-60 hover:opacity-100">
          Assortiment
        </Link>
        <span className="opacity-40"> / {product.naam}</span>
      </nav>

      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-4 pb-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="relative overflow-hidden" style={{ borderBottom: `4px solid ${kleur}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.photo || SCENE[product.categorie]}
              alt={`${product.naam} — Schaap's Vishandel Leiden`}
              className="w-full object-cover"
              style={{ height: 260 }}
            />
          </div>
          <div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5" style={{ backgroundColor: kleur + "28", color: "var(--charcoal)" }}>
                {CATEGORIE_LABELS[product.categorie]}
              </span>
              {product.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 text-white" style={{ backgroundColor: "var(--seafoam)" }}>
                  {product.badge}
                </span>
              )}
              {product.omega3 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 text-white" style={{ backgroundColor: "var(--salmon)" }}>
                  Ω-3
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
              {product.naam}
            </h1>
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--charcoal)", opacity: 0.8 }}>
              {product.desc}
            </p>
            {beschikbaar && (
              <p className="text-sm font-semibold mb-4" style={{ color: opAanvraag ? "var(--gold)" : "var(--seafoam)" }}>
                {opAanvraag ? "◎ " : "✓ "}{beschikbaar}
                {opAanvraag && (
                  <span className="font-normal opacity-70" style={{ color: "var(--charcoal)" }}>
                    {" "}— vraag ons of we het voor uw ophaaldatum kunnen regelen.
                  </span>
                )}
              </p>
            )}
            {prijs ? (
              <div className="mb-5">
                <span className="text-2xl font-bold" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
                  {formatPrijs(prijs)}
                </span>
                <span className="block text-xs mt-1 opacity-55" style={{ color: "var(--charcoal)" }}>
                  Richtprijs — vis is dagvers, de dagprijs kan afwijken. Wij bevestigen bij uw bestelling.
                </span>
              </div>
            ) : (
              <p className="text-sm mb-5 opacity-60" style={{ color: "var(--charcoal)" }}>
                Prijs op aanvraag — wij bellen u terug met de dagprijs.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <a
                href={waUrl(product.naam)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                Bestel via WhatsApp
              </a>
              <Link
                href={`/${locale}/bestellen?product=${slug}`}
                className="inline-flex items-center px-5 py-3 text-sm font-semibold border transition-opacity hover:opacity-80"
                style={{ borderColor: "var(--navy)", color: "var(--navy)" }}
              >
                Vooruit bestellen →
              </Link>
            </div>
            {isZalm && (
              <Link
                href={`/${locale}/varlaks`}
                className="block mt-6 p-4 group"
                style={{ backgroundColor: "rgba(46,139,110,0.08)", borderLeft: "4px solid var(--seafoam)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--seafoam)" }}>
                  Biologisch alternatief
                </p>
                <p className="text-sm font-semibold group-hover:underline" style={{ color: "var(--navy)" }}>
                  Liever biologische zalm? Ontdek Varlaks →
                </p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.72 }}>
                  Onze Varlaks-zalm groeit antibioticavrij bij familiekwekers boven de poolcirkel —
                  puurder van smaak en volledig te herleiden.
                </p>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Voedingswaarde + allergenen + seizoen/viswijzer */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-10">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          {/* Voedingswaarde */}
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
              Voedingswaarde
            </h2>
            {voeding ? (
              <>
                <p className="text-xs mb-3 opacity-55" style={{ color: "var(--charcoal)" }}>
                  Gemiddelde waarden per 100 g
                </p>
                <table className="w-full text-sm bg-white" style={{ border: "1px solid var(--sand)" }}>
                  <tbody>
                    {voedingRijen.map(([label, waarde], i) => (
                      <tr key={label} style={{ borderTop: i === 0 ? "none" : "1px solid var(--sand)" }}>
                        <td className={`px-4 py-2.5 ${label.startsWith("waarvan") ? "pl-8 opacity-60" : "font-medium"}`} style={{ color: "var(--charcoal)" }}>
                          {label}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold" style={{ color: "var(--navy)" }}>
                          {waarde}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[11px] mt-2 opacity-45 leading-relaxed" style={{ color: "var(--charcoal)" }}>
                  Indicatieve gemiddelden op basis van standaard voedingswaardetabellen; werkelijke waarden variëren per vangst, seizoen en bereiding.
                </p>
              </>
            ) : (
              <p className="text-sm opacity-60" style={{ color: "var(--charcoal)" }}>
                Voedingswaarde op aanvraag — vraag het gerust aan de toonbank.
              </p>
            )}
          </div>

          {/* Allergenen + seizoen + viswijzer */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
                Ingrediënten &amp; allergenen
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--charcoal)", opacity: 0.75 }}>
                {product.ingredienten}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.bevat.map((a) => (
                  <span
                    key={a}
                    className="text-[10px] font-semibold px-1.5 py-0.5"
                    style={{ backgroundColor: "rgba(192,57,43,0.1)", color: "#c0392b", border: "1px solid rgba(192,57,43,0.2)" }}
                  >
                    {a}
                  </span>
                ))}
              </div>
              <p className="text-xs leading-relaxed mt-3 opacity-60" style={{ color: "var(--charcoal)" }}>
                Dit is de wettelijk verplichte EU-allergeneninformatie — alleen van belang als u ergens
                allergisch voor bent. Zo is bijvoorbeeld sulfiet (E223) een heel gangbaar bewaarmiddel op
                garnalen; voor de meeste mensen is alles gewoon te eten. Twijfelt u? Vraag het ons gerust.
              </p>
            </div>

            {(seizoen || viswijzer) && (
              <div className="p-4" style={{ backgroundColor: "var(--sand)", borderLeft: "4px solid var(--seafoam)" }}>
                {seizoen && (
                  <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--charcoal)" }}>
                    <strong>Wanneer het lekkerst is:</strong> {seizoen}
                  </p>
                )}
                {viswijzer && (
                  <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)" }}>
                    <strong>VISwijzer:</strong> {viswijzer}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cross-sell: wat maak je ermee? — eigen blogs + beste externe receptsites */}
        <div className="max-w-4xl mx-auto px-6 mt-10 pt-8" style={{ borderTop: "1px solid var(--sand)" }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Wat maak je ermee?
          </h2>
          <p className="text-sm mb-5 opacity-70" style={{ color: "var(--charcoal)" }}>
            Inspiratie voor {product.naam.toLowerCase()} — uit onze eigen blog en van de beste receptsites.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-3 opacity-50" style={{ color: "var(--charcoal)" }}>
                Uit onze blog
              </p>
              <ul className="space-y-2">
                {blogs.map((b) => (
                  <li key={b.slug}>
                    <Link href={`/${locale}/blog/${b.slug}`} className="text-sm underline underline-offset-2" style={{ color: "var(--navy)" }}>
                      {b.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-3 opacity-50" style={{ color: "var(--charcoal)" }}>
                Receptinspiratie elders
              </p>
              <ul className="space-y-2">
                {extern.map((r) => (
                  <li key={r.href}>
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-2" style={{ color: "var(--seafoam)" }}>
                      {r.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 mt-8">
          <Link href={`/${locale}/assortiment`} className="text-sm font-semibold underline" style={{ color: "var(--navy)" }}>
            ← Terug naar het assortiment
          </Link>
        </div>
      </section>
    </>
  );
}
