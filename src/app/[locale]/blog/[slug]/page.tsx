import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { recepten } from "@/lib/recepten";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { Schema } from "@/components/Schema";
import { Sectie } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { BEDRIJF } from "@/lib/bedrijf";

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Blog Schaap's Vis Leiden`,
    description: post.excerpt,
    keywords: post.seoKeywords,
    // Deze artikelen bestaan alleen in het Nederlands; alle taalversies
    // verwijzen daarom naar hetzelfde Nederlandse adres.
    alternates: { canonical: `/nl/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [{ url: post.fotoUrl }],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = getBlogPost(slug);
  if (!post) permanentRedirect(`/${locale}/blog`);

  const gerelateerdeRecepten = (post.gerelateerdeRecepten ?? [])
    .map((s) => recepten.find((r) => r.slug === s))
    .filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.fotoUrl],
    datePublished: post.datum,
    inLanguage: "nl-NL",
    author: { "@type": "Organization", name: BEDRIJF.naam, url: BEDRIJF.domein },
    publisher: { "@type": "Organization", name: BEDRIJF.naam },
  };

  const heeftVerderLezen =
    Boolean(post.gerelateerdeLinks?.length) || gerelateerdeRecepten.length > 0;

  return (
    <>
      <Schema data={articleSchema} />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: "Blog", href: `/${locale}/blog` },
          { naam: post.title },
        ]}
        label={`${post.categorie} · ${post.datumLabel} · ${post.leestijd}`}
        titel={post.title}
        intro={post.excerpt}
      />

      {/* ── Het stuk zelf ────────────────────────────────────────────────── */}
      <Sectie grond="papier" smal>
        <div className="lees">
          {post.secties.map((sectie, i) => (
            <div key={i} className={i > 0 ? "mt-9" : undefined}>
              {sectie.kop && <h2 className="text-[1.5rem] mb-3">{sectie.kop}</h2>}
              {sectie.alineas.map((alinea, j) => (
                <p key={j} style={{ color: "var(--charcoal)" }}>
                  {alinea}
                </p>
              ))}
            </div>
          ))}
        </div>

        {heeftVerderLezen && (
          <div className="mt-12 pt-6" style={{ borderTop: "2px solid var(--navy)" }}>
            <p className="kapitaal mb-4">Verder lezen en doen</p>
            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-2">
              {gerelateerdeRecepten.map((recept) => (
                <li key={recept!.slug}>
                  <Link
                    href={`/${locale}/recepten/${recept!.slug}`}
                    className="font-semibold underline underline-offset-4"
                    style={{ color: "var(--navy)" }}
                  >
                    Recept: {recept!.title} &rarr;
                  </Link>
                </li>
              ))}
              {post.gerelateerdeLinks?.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline underline-offset-4"
                      style={{ color: "var(--navy)" }}
                    >
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link
                      href={`/${locale}${link.href}`}
                      className="font-semibold underline underline-offset-4"
                      style={{ color: "var(--navy)" }}
                    >
                      {link.label} &rarr;
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href={`/${locale}/blog`}
          className="inline-block mt-10 font-semibold underline underline-offset-4"
          style={{ color: "var(--navy)" }}
        >
          &larr; Alle blogartikelen
        </Link>
      </Sectie>

      {/* ── Nieuwsbrief ──────────────────────────────────────────────────── */}
      <Sectie grond="zand" smal>
        <h2 className="text-[1.6rem] mb-2">Weten wanneer de Hollandse Nieuwe er is?</h2>
        <p className="mb-6 leading-relaxed" style={{ color: "var(--charcoal)" }}>
          Laat uw e-mailadres achter en hoor het als eerste — plus elke week wat er vers binnen is.
        </p>
        <div className="max-w-md">
          <NewsletterSignup compact />
        </div>
      </Sectie>

      <PaginaSlot
        titel="Vandaag nog verse vis in huis?"
        tekst="Bestel vooruit en haal het op in de winkel of aan de kraam. Verse vis en visschalen bezorgen we in Leiden en vier gemeenten eromheen."
        knoppen={[
          { label: "Verse vis bestellen", href: `/${locale}/bestellen` },
          { label: "Visschaal samenstellen", href: `/${locale}/visschalen`, soort: "lijn" },
          { label: "Openingstijden en route", href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
      />
    </>
  );
}
