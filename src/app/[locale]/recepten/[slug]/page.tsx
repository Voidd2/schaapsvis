import { ReceptTools } from "@/components/recepten/ReceptTools";
import { receptDuur } from "@/lib/recept-hulp";
import { kruimelSchema } from "@/lib/seo";
import Link from "next/link";
import { bestelContact } from "@/lib/bestel-contact";
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
      images: [{ url: recept.fotoUrl || "/og-image.png", alt: recept.title }],
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
    image: recept.fotoUrl ? [`${BEDRIJF.domein}${recept.fotoUrl}`] : undefined,
    recipeYield: recept.porties ? `${recept.porties} personen` : undefined,
    totalTime: receptDuur(recept.tijd),
    inLanguage: "nl-NL",
    url: `${BEDRIJF.domein}/nl/recepten/${slug}`,
    recipeCategory: "Visgerecht",
    recipeCuisine: recept.keuken ?? "Nederlands",
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
      <Schema data={kruimelSchema("nl", [{ naam: BEDRIJF.naamKort, pad: "/" }, { naam: "Recepten", pad: "/recepten" }, { naam: recept.title, pad: `/recepten/${slug}` }])} />

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
          { label: "Keuken", waarde: recept.keuken ?? "Nederlands" },
          {
            label: recept.porties ? "Voor" : "Seizoen",
            waarde: recept.porties
              ? `${recept.porties} ${recept.porties === 1 ? "portie" : "personen"}`
              : (recept.seizoen ?? "Het hele jaar"),
          },
        ]}
      />

      <Sectie grond="papier">
        <ReceptTools items={[...recept.vanSchaap, ...recept.vanSupermarkt]} />
        <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-10 lg:gap-16">
          {/* ── Verhaal en bereiding ─────────────────────────────────────── */}
          <div>
            {/* Geen anoniem receptenblog-inleidinkje maar iets wat uit de winkel
                komt. Het label maakt zichtbaar dat dit van achter de toonbank
                komt; de tekst zelf stond er al. */}
            <div className="mb-10">
              <p className="kapitaal mb-2">Van achter de toonbank</p>
              <blockquote className="citaat">{recept.verhaal}</blockquote>
            </div>

            <h2 id="bereiding" className="text-[1.6rem] mb-6 scroll-mt-32">Bereiding</h2>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--grijs)" }}>
              {recept.porties ? `Hoeveelheden voor ${recept.porties} personen. ` : ""}
              De totale tijd omvat voorbereiding en eventuele wachttijd. Bereidingstijden zijn richtlijnen: dikte van de vis en uw oven of pan maken verschil.
            </p>
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

            <aside className="mt-8 rounded-xl p-5" style={{ background: "var(--linen)" }}>
              <h3 className="mb-2 text-lg">Veilig bereiden</h3>
              <p className="text-sm leading-relaxed">
                {recept.veiligheid ?? "Houd vis gekoeld bij 4°C, werk met schoon keukengerei en voorkom contact tussen rauwe vis en klaar eten. Gaar rauwe vis door en door. Zwangeren, jonge kinderen, ouderen en mensen met verminderde weerstand vermijden rauwe en niet door en door verhitte gerookte vis. Volg het bewaar- en bereidingsadvies dat u bij aankoop krijgt."}
              </p>
              <a className="inline-block mt-3 text-sm underline underline-offset-4" href="https://www.voedingscentrum.nl/nl/thema/5xveilig/vis.aspx" target="_blank" rel="noopener noreferrer">Veilig omgaan met vis — Voedingscentrum</a>
            </aside>

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

            {recept.hoofdproduct && <Link className="inline-block mb-5 underline font-semibold" href={`/nl/assortiment/${recept.hoofdproduct}`}>Meer over de vis in dit recept →</Link>}
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
                  op {BEDRIJF.telefoon.weergave}, dan kijken we naar de beschikbaarheid.
                </p>
              ) : (
                <a href={bestelContact(locale).href} className="knop knop-rood">{bestelContact(locale).label}</a>
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
        tekst="Op zoek naar vis voor dit recept? Vraag ons via WhatsApp naar beschikbaarheid en mogelijkheden. Alleen visschalen kunt u online bestellen."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
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
