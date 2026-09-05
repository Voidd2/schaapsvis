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
import { Schema } from "@/components/Schema";
import { Sectie } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { BEDRIJF, whatsappLink } from "@/lib/bedrijf";

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
  return whatsappLink(
    `Hallo ${BEDRIJF.naam}, ik wil graag ${naam} bestellen of reserveren. Wanneer kan ik dit ophalen?`
  );
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
  // Visschaal/feestschotel gaan via de offerte-flow i.p.v. het bestelformulier.
  const isSchaal = slug === "visschaal" || slug === "feestschotel";
  const blogs = recepteBlogs(product.naam, product.categorie);
  const extern = externeRecepten(product.naam);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.naam,
    description: product.desc,
    category: CATEGORIE_LABELS[product.categorie],
    brand: { "@type": "Brand", name: "Schaap's Vishandel" },
    image: `https://www.schaapsvishandel.nl${product.photo ?? SCENE[product.categorie]}`,
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
      <Schema data={[productSchema, breadcrumbSchema]} />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: "Assortiment", href: `/${locale}/assortiment` },
          { naam: product.naam },
        ]}
        label={[CATEGORIE_LABELS[product.categorie], product.badge, product.omega3 ? "Omega-3" : null]
          .filter(Boolean)
          .join(" · ")}
        titel={product.naam}
        intro={product.desc}
        knoppen={[
          {
            label: isSchaal ? "Offerte aanvragen" : "Vooruit bestellen",
            href: isSchaal
              ? `/${locale}/visschalen#samenstellen`
              : `/${locale}/bestellen?product=${slug}`,
          },
          {
            label: "Bestel via WhatsApp",
            href: waUrl(product.naam),
            extern: true,
            soort: "lijn",
          },
        ]}
        feiten={[
          ...(beschikbaar ? [{ label: "Beschikbaar", waarde: beschikbaar }] : []),
          {
            label: "Prijs",
            waarde: prijs ? `${formatPrijs(prijs)} — richtprijs` : "Op aanvraag, dagprijs",
          },
          ...(seizoen ? [{ label: "Op zijn best", waarde: seizoen }] : []),
        ]}
      />

      {/* ── Foto, recepten en voedingswaarde ─────────────────────────────── */}
      <Sectie grond="papier">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16">
          <div>
            <div
              className="w-full aspect-square flex items-center justify-center"
              style={{
                backgroundColor: product.photo ? "#fff" : "var(--sand)",
                borderBottom: `3px solid ${kleur}`,
              }}
            >
              {product.photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={product.photo}
                  alt={`${product.naam} bij ${BEDRIJF.naam} in Leiden`}
                  className="w-full h-full object-contain p-6"
                />
              ) : (
                <span
                  className="px-8 text-center text-[1.6rem]"
                  style={{ fontFamily: "var(--font-display)", color: "var(--navy)", opacity: 0.45 }}
                >
                  {product.naam}
                </span>
              )}
            </div>

            {opAanvraag && (
              <p
                className="mt-6 pl-5"
                style={{ borderLeft: "2px solid var(--gold)", color: "var(--charcoal)" }}
              >
                Dit ligt niet elke dag in de vitrine. Vraag ons of het er is op uw ophaaldatum —
                bel {BEDRIJF.telefoon.weergave} of zet het in de opmerking bij uw bestelling.
              </p>
            )}

            {isZalm && (
              <Link
                href={`/${locale}/varlaks`}
                className="block mt-6 pl-5 group"
                style={{ borderLeft: "2px solid var(--seafoam)" }}
              >
                <p className="kapitaal mb-1" style={{ color: "var(--seafoam)" }}>
                  Biologisch alternatief
                </p>
                <p
                  className="font-semibold group-hover:underline underline-offset-4"
                  style={{ color: "var(--navy)" }}
                >
                  Liever biologische zalm? Bekijk Varlaks &rarr;
                </p>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--charcoal)" }}>
                  Antibioticavrij gekweekt bij familiekwekers boven de poolcirkel, puurder van
                  smaak en volledig te herleiden.
                </p>
              </Link>
            )}
          </div>

          {/* ── Wat maakt u ermee? ──────────────────────────────────────────
              Stond eerst onderaan, na de voedingswaardetabel en de
              allergenenlijst. Wie een vis aanklikt wil eerst weten wat hij
              ermee kan; de E-nummers komen daarna wel. */}
          <div>
            <p className="kapitaal mb-2">Inspiratie</p>
            <h2 className="text-[1.6rem] mb-3">Wat maakt u ermee?</h2>
            <p className="mb-6 leading-relaxed" style={{ color: "var(--charcoal)" }}>
              Ideeën voor {product.naam.toLowerCase()} — uit onze eigen blog en van een paar
              goede receptsites.
            </p>

            <p className="kapitaal mb-2">Uit onze blog</p>
            <ul className="mb-7" style={{ borderTop: "1px solid var(--linen)" }}>
              {blogs.map((b) => (
                <li key={b.slug} style={{ borderBottom: "1px solid var(--linen)" }}>
                  <Link
                    href={`/${locale}/blog/${b.slug}`}
                    className="block py-3 font-semibold underline underline-offset-4"
                    style={{ color: "var(--navy)" }}
                  >
                    {b.label} &rarr;
                  </Link>
                </li>
              ))}
            </ul>

            <p className="kapitaal mb-2">Receptinspiratie elders</p>
            <ul style={{ borderTop: "1px solid var(--linen)" }}>
              {extern.map((r) => (
                <li key={r.href} style={{ borderBottom: "1px solid var(--linen)" }}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-3 font-semibold underline underline-offset-4"
                    style={{ color: "var(--seafoam)" }}
                  >
                    {r.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sectie>

      {/* ── De kleine lettertjes ─────────────────────────────────────────── */}
      <Sectie grond="zand">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <h2 className="text-[1.4rem] mb-3">Ingrediënten en allergenen</h2>
            <p className="lees mb-4" style={{ color: "var(--charcoal)" }}>
              {product.ingredienten}
            </p>
            {product.bevat.length > 0 && (
              <p className="kapitaal mb-4" style={{ color: "var(--rood)" }}>
                Bevat: {product.bevat.join(" · ")}
              </p>
            )}
            <p className="text-sm leading-relaxed" style={{ color: "var(--grijs)" }}>
              Dit is de wettelijk verplichte EU-allergeneninformatie — alleen van belang als u
              ergens allergisch voor bent. Sulfiet (E223) is bijvoorbeeld een heel gangbaar
              bewaarmiddel op garnalen. Twijfelt u? Vraag het ons gerust.
            </p>

            {(seizoen || viswijzer) && (
              <div className="mt-8 pl-5" style={{ borderLeft: "2px solid var(--seafoam)" }}>
                {seizoen && (
                  <p className="mb-2" style={{ color: "var(--charcoal)" }}>
                    <strong>Wanneer het lekkerst is:</strong> {seizoen}
                  </p>
                )}
                {viswijzer && (
                  <p style={{ color: "var(--charcoal)" }}>
                    <strong>VISwijzer:</strong> {viswijzer}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-[1.4rem] mb-3">Voedingswaarde</h2>
            {voeding ? (
              <>
                <p className="kapitaal mb-4">Gemiddeld per 100 gram</p>
                <table className="w-full">
                  <tbody>
                    {voedingRijen.map(([label, waarde]) => (
                      <tr key={label} style={{ borderBottom: "1px solid var(--linen)" }}>
                        <th
                          scope="row"
                          className={`py-2.5 text-left font-normal ${label.startsWith("waarvan") ? "pl-6" : ""}`}
                          style={{ color: label.startsWith("waarvan") ? "var(--grijs)" : "var(--ink)" }}
                        >
                          {label}
                        </th>
                        <td className="py-2.5 text-right bedrag" style={{ color: "var(--navy)" }}>
                          {waarde}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--grijs)" }}>
                  Indicatieve gemiddelden uit standaard voedingswaardetabellen; de werkelijke
                  waarden verschillen per vangst, seizoen en bereiding.
                </p>
              </>
            ) : (
              <p style={{ color: "var(--charcoal)" }}>
                Voedingswaarde op aanvraag — vraag het gerust aan de toonbank.
              </p>
            )}

            {prijs && (
              <p className="text-sm mt-6 leading-relaxed" style={{ color: "var(--grijs)" }}>
                {formatPrijs(prijs)} is een richtprijs. Vis is dagvers en gaat op gewicht, dus de
                dagprijs kan afwijken. We bevestigen hem bij uw bestelling.
              </p>
            )}
          </div>
        </div>

        <Link
          href={`/${locale}/assortiment`}
          className="inline-block mt-10 font-semibold underline underline-offset-4"
          style={{ color: "var(--navy)" }}
        >
          &larr; Terug naar het assortiment
        </Link>
      </Sectie>

      <PaginaSlot
        titel={`${product.naam} vooruit bestellen?`}
        tekst="Dan ligt het klaar wanneer u langskomt. Verse vis en visschalen bezorgen we in Leiden, Leiderdorp, Voorschoten, Wassenaar en Leidschendam."
        knoppen={[
          {
            label: isSchaal ? "Visschaal samenstellen" : "Vooruit bestellen",
            href: isSchaal
              ? `/${locale}/visschalen`
              : `/${locale}/bestellen?product=${slug}`,
          },
          { label: "Openingstijden en route", href: `/${locale}/bezoek-ons`, soort: "lijn" },
          {
            label: BEDRIJF.telefoon.weergave,
            href: `tel:${BEDRIJF.telefoon.e164}`,
            extern: true,
            soort: "lijn",
          },
        ]}
      />
    </>
  );
}
