import Image from "next/image";
import { kruimelSchema, vraagSchema } from "@/lib/seo";
import Link from "next/link";
import { bestelContact } from "@/lib/bestel-contact";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { recepten } from "@/lib/recepten";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { Schema } from "@/components/Schema";
import { Sectie, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { BEDRIJF, VERKOOPPUNTEN } from "@/lib/bedrijf";

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
    title: post.regio || post.title.length > 55 ? post.title : `${post.title} | Schaap's`,
    description: post.excerpt.slice(0, 160),
    keywords: post.seoKeywords,
    // Deze artikelen bestaan alleen in het Nederlands; alle taalversies
    // verwijzen daarom naar hetzelfde Nederlandse adres.
    alternates: { canonical: `/nl/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${BEDRIJF.domein}/nl/blog/${slug}`,
      images: [{ url: post.fotoUrl }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.fotoUrl] },
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
  const kraam = post.regio === "Voorschoten" ? VERKOOPPUNTEN.find(p => p.id === "voorschoten") : undefined;
  const markten = (post.verkooppunten ?? []).flatMap(id => {
    const punt = VERKOOPPUNTEN.find(p => p.id === id);
    return punt ? [punt] : [];
  });

  const gerelateerdeRecepten = (post.gerelateerdeRecepten ?? [])
    .map((s) => recepten.find((r) => r.slug === s))
    .filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [`${BEDRIJF.domein}${post.fotoUrl}`],
    datePublished: post.datum,
    dateModified: post.bijgewerkt ?? post.datum,
    mainEntityOfPage: `${BEDRIJF.domein}/nl/blog/${slug}`,
    inLanguage: "nl-NL",
    author: { "@type": "Organization", name: BEDRIJF.naam, url: BEDRIJF.domein },
    publisher: { "@type": "Organization", name: BEDRIJF.naam },
  };

  const heeftVerderLezen =
    Boolean(post.gerelateerdeLinks?.length) || gerelateerdeRecepten.length > 0;

  return (
    <>
      <Schema data={articleSchema} />
      {post.vragen?.length ? <Schema data={vraagSchema(post.vragen)} /> : null}
      <Schema data={kruimelSchema("nl", [{ naam: BEDRIJF.naamKort, pad: "/" }, { naam: "Blog", pad: "/blog" }, { naam: post.title, pad: `/blog/${slug}` }])} />

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
        <p className="mb-5 text-sm" style={{ color: "var(--charcoal)" }}>Van <Link className="underline" href="/nl/ons-verhaal">Schaap’s Vishandel</Link> · viswinkel sinds 1938</p>
        {kraam && <aside className="rounded-xl p-5 mb-8 border border-sky-100" style={{ background: "var(--lichtblauw)" }}><p className="font-semibold mb-2">Vrijdag bij Hoogvliet in Voorschoten · 08:00–17:30</p><p>Dit artikel helpt u kiezen. <Link className="underline font-semibold" href="/nl/viswinkel-voorschoten">Bekijk de locatie en route van onze visboer in Voorschoten →</Link></p></aside>}
        <Image src={post.fotoUrl} alt={post.fotoAlt} width={1400} height={933} sizes="(max-width: 800px) 100vw, 800px" className="article-photo mb-10" />
        {markten.length > 0 && (
          <section aria-labelledby="marktlocaties" className="mb-10">
            <p className="kapitaal mb-3">Zo vindt u onze kraam</p>
            <h2 id="marktlocaties" className="text-2xl mb-3 scroll-mt-32">Onze marktkraam in Leiden op Google Maps</h2>
            <p className="mb-6 leading-relaxed">Op woensdag en zaterdag staan we op verschillende plekken. Open de juiste locatie in Google Maps en plan uw route naar het herkenningspunt bij onze kraam.</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {markten.map(punt => (
                <article key={punt.id} className="overflow-hidden rounded-2xl border border-sky-100" style={{ background: "var(--lichtblauw)" }}>
                  <div className="p-5">
                    <h3 className="text-xl mb-2">{punt.naam}</h3>
                    <p className="mb-2">{punt.adres}, {punt.plaats}</p>
                    <p className="font-semibold mb-4">{punt.dagen}</p>
                    <a href={punt.mapsUrl} target="_blank" rel="noopener noreferrer" className="knop knop-navy">Open Google Maps ↗</a>
                  </div>
                </article>
              ))}
            </div>
            <Link href={`/${locale}/marktkraam-leiden`} className="inline-block mt-5 underline underline-offset-4">Meer over onze marktkraam en openingstijden →</Link>
          </section>
        )}
        <nav aria-label="In dit artikel" className="recipe-checklist mb-10"><p className="kapitaal mb-3">In dit artikel</p><ul className="space-y-2">{post.secties.map((s,i) => s.kop && <li key={i}><a className="underline underline-offset-4" href={`#onderdeel-${i}`}>{s.kop}</a></li>)}</ul></nav>
        <div className="lees">
          {post.secties.map((sectie, i) => (
            <div key={i} className={i > 0 ? "mt-9" : undefined}>
              {sectie.kop && <h2 id={`onderdeel-${i}`} className="text-[1.5rem] mb-3 scroll-mt-32">{sectie.kop}</h2>}
              {sectie.alineas.map((alinea, j) => (
                <p key={j} style={{ color: "var(--charcoal)" }}>
                  {alinea}
                </p>
              ))}
            </div>
          ))}
        </div>

        {post.vragen?.length ? <section className="mt-12"><h2 className="text-2xl mb-5">Veelgestelde vragen</h2><Vragen vragen={post.vragen} /></section> : null}

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
        titel={kraam ? "Vrijdag vis halen in Voorschoten?" : "Vandaag nog verse vis in huis?"}
        tekst="Alleen visschalen bestelt u online. Voor andere producten kunt u ons via WhatsApp vragen naar beschikbaarheid en mogelijkheden."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          ...(kraam ? [{ label: "Route naar Hoogvliet Voorschoten", href: kraam.mapsUrl, extern: true, soort: "lijn" as const }] : []),
          { label: "Visschaal samenstellen", href: `/${locale}/visschalen`, soort: "lijn" },
          { label: "Openingstijden en route", href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
      />
    </>
  );
}
