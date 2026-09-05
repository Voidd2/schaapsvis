import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { recepten, receptBeeld, type Recept } from "@/lib/recepten";
import { ReceptFoto } from "@/components/recepten/ReceptFoto";
import { Schema } from "@/components/Schema";
import { Sectie } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { BEDRIJF } from "@/lib/bedrijf";

/**
 * Sommige vis ligt niet standaard in de vitrine. Staat die in een recept, dan
 * zeggen we dat erbij in plaats van een bestelknop te tonen die tot een
 * teleurstelling leidt.
 */
const OP_AANVRAAG_VIS = ["garnalen", "gamba", "scampi", "tarbot", "kreeft", "langoustine"];

function opAanvraag(recept: Recept): string | null {
  const tekst = [...recept.vanSchaap, recept.title].join(" ").toLowerCase();
  return OP_AANVRAAG_VIS.find((vis) => tekst.includes(vis)) ?? null;
}

const MOEILIJKHEID_UITLEG: Record<Recept["moeilijkheid"], string> = {
  Makkelijk: "Prima voor doordeweeks — geen gedoe.",
  Gemiddeld: "Met aandacht en een beetje geduld goed te doen.",
  Uitdagend: "Voor de liefhebber, en de moeite waard.",
};

export async function generateStaticParams() {
  return recepten.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recept = recepten.find((r) => r.slug === slug);
  if (!recept) return {};

  return {
    title: `${recept.title} | Recepten Schaap's Vis Leiden`,
    description: `${recept.verhaal.slice(0, 155)}...`,
    keywords: recept.seoKeywords,
    // Recepten staan alleen in het Nederlands, dus wijzen alle taalversies naar
    // het Nederlandse adres in plaats van drie keer dezelfde tekst aan te bieden.
    alternates: { canonical: `/nl/recepten/${slug}` },
    openGraph: {
      title: `${recept.title} | Schaap's Vis Leiden`,
      description: recept.subtitle,
      type: "article",
      images: recept.fotoUrl ? [{ url: recept.fotoUrl }] : [],
    },
  };
}

export default async function ReceptDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const recept = recepten.find((r) => r.slug === slug);
  // Oude recept-URL's (van de vorige receptendatabase) permanent doorsturen.
  if (!recept) permanentRedirect(`/${locale}/recepten`);

  const aanvraag = opAanvraag(recept);
  const beeld = receptBeeld(recept);

  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recept.title,
    description: recept.subtitle,
    image: beeld.src ? [`${BEDRIJF.domein}${beeld.src}`] : undefined,
    recipeYield: recept.porties ? `${recept.porties} personen` : undefined,
    totalTime: `PT${parseInt(recept.tijd) || 30}M`,
    recipeCategory: "Visgerecht",
    recipeCuisine: "Nederlands",
    keywords: recept.seoKeywords,
    recipeIngredient: [...recept.vanSchaap, ...recept.vanSupermarkt],
    recipeInstructions: recept.bereidingswijze.map((stap, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: stap,
    })),
    author: { "@type": "Organization", name: BEDRIJF.naam, url: BEDRIJF.domein },
  };

  return (
    <>
      <Schema data={recipeSchema} />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: "Recepten", href: `/${locale}/recepten` },
          { naam: recept.title },
        ]}
        label={recept.tags.join(" · ")}
        titel={recept.title}
        intro={recept.subtitle}
        feiten={[
          { label: "Tijd", waarde: recept.tijd },
          { label: "Moeilijkheid", waarde: recept.moeilijkheid },
          {
            label: recept.porties ? "Voor" : "Seizoen",
            waarde: recept.porties
              ? `${recept.porties} ${recept.porties === 1 ? "portie" : "personen"}`
              : (recept.seizoen ?? "Het hele jaar"),
          },
        ]}
      />

      <Sectie grond="papier">
        <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-10 lg:gap-16">
          {/* ── Verhaal en bereiding ─────────────────────────────────────── */}
          <div>
            <blockquote className="citaat mb-10">{recept.verhaal}</blockquote>

            <h2 className="text-[1.6rem] mb-6">Bereiding</h2>
            <ol style={{ borderTop: "1px solid var(--linen)" }}>
              {recept.bereidingswijze.map((stap, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-4"
                  style={{ borderBottom: "1px solid var(--linen)" }}
                >
                  <span
                    className="text-[1.2rem] leading-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
                  >
                    {i + 1}
                  </span>
                  <p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>
                    {stap}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-sm" style={{ color: "var(--grijs)" }}>
              <span className="kapitaal">{recept.moeilijkheid}</span>{" "}
              {MOEILIJKHEID_UITLEG[recept.moeilijkheid]}
            </p>
          </div>

          {/* ── Boodschappen ─────────────────────────────────────────────── */}
          <div>
            <ReceptFoto beeld={beeld} titel={recept.title} />
            {beeld.bijschrift && (
              <p className="mt-2 mb-8 text-sm" style={{ color: "var(--grijs)" }}>
                {beeld.productSlug ? (
                  <Link
                    href={`/${locale}/assortiment/${beeld.productSlug}`}
                    className="underline underline-offset-4"
                    style={{ color: "var(--navy)" }}
                  >
                    {beeld.bijschrift}
                  </Link>
                ) : (
                  beeld.bijschrift
                )}
              </p>
            )}
            {!beeld.bijschrift && <div className="mb-8" />}

            <div className="pt-4" style={{ borderTop: "2px solid var(--navy)" }}>
              <p className="kapitaal mb-3">Bij Schaap&apos;s Vis</p>
              <ul className="mb-5">
                {recept.vanSchaap.map((item) => (
                  <li
                    key={item}
                    className="py-2"
                    style={{ borderBottom: "1px solid var(--linen)", color: "var(--ink)" }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              {aanvraag ? (
                <p
                  className="pl-4 text-sm leading-relaxed"
                  style={{ borderLeft: "2px solid var(--rood)", color: "var(--charcoal)" }}
                >
                  Verse {aanvraag} is bij ons <strong>op aanvraag</strong>. Bel even van tevoren
                  op {BEDRIJF.telefoon.weergave}, dan zorgen we dat het er is.
                </p>
              ) : (
                <Link href={`/${locale}/bestellen`} className="knop knop-rood">
                  Vooruit bestellen
                </Link>
              )}
            </div>

            <div className="mt-10 pt-4" style={{ borderTop: "2px solid var(--linen)" }}>
              <p className="kapitaal mb-3" style={{ color: "var(--grijs)" }}>
                Uit de supermarkt
              </p>
              <ul>
                {recept.vanSupermarkt.map((item) => (
                  <li
                    key={item}
                    className="py-2"
                    style={{ borderBottom: "1px solid var(--linen)", color: "var(--charcoal)" }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Link
          href={`/${locale}/recepten`}
          className="inline-block mt-12 font-semibold underline underline-offset-4"
          style={{ color: "var(--navy)" }}
        >
          &larr; Alle recepten
        </Link>
      </Sectie>

      <PaginaSlot
        titel="De vis haalt u bij ons"
        tekst="Herenstraat 48 in Leiden, dinsdag tot en met zaterdag. Bestel vooruit, dan ligt het klaar wanneer u langskomt."
        knoppen={[
          { label: "Verse vis bestellen", href: `/${locale}/bestellen` },
          { label: "Visschaal samenstellen", href: `/${locale}/visschalen`, soort: "lijn" },
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
