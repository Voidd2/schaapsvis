import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Clock, Calendar, ExternalLink } from "lucide-react";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { recepten } from "@/lib/recepten";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Blog Schaap's Vis Leiden`,
    description: post.excerpt,
    keywords: post.seoKeywords,
    alternates: { canonical: `/${locale}/blog/${slug}` },
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
    author: {
      "@type": "Organization",
      name: "Schaap's Vishandel Leiden",
      url: "https://www.schaapsvishandel.nl",
    },
    publisher: {
      "@type": "Organization",
      name: "Schaap's Vishandel Leiden",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Back */}
      <div
        className="py-4 px-6"
        style={{ backgroundColor: "var(--cream)", borderBottom: "1px solid var(--sand)" }}
      >
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "var(--navy)" }}
          >
            <ArrowLeft size={15} />
            Alle blogartikelen
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-5 text-sm" style={{ color: "var(--sand)" }}>
            <span className="font-bold uppercase tracking-wide text-xs">
              {post.categorie}
            </span>
            <span className="inline-flex items-center gap-1.5 opacity-70 text-xs">
              <Calendar size={13} /> {post.datumLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 opacity-70 text-xs">
              <Clock size={13} /> {post.leestijd} leestijd
            </span>
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold leading-tight mb-4"
            style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
          >
            {post.title}
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "rgba(250,246,239,0.75)" }}>
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* Body */}
      <article style={{ backgroundColor: "var(--cream)" }} className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.fotoUrl}
            alt={post.fotoAlt}
            className="w-full aspect-[16/9] object-cover mb-10"
          />

          {post.secties.map((sectie, i) => (
            <div key={i} className="mb-8">
              {sectie.kop && (
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}
                >
                  {sectie.kop}
                </h2>
              )}
              {sectie.alineas.map((alinea, j) => (
                <p
                  key={j}
                  className="leading-relaxed mb-4"
                  style={{ color: "var(--charcoal)", opacity: 0.85 }}
                >
                  {alinea}
                </p>
              ))}
            </div>
          ))}

          {/* Gerelateerde links */}
          {(post.gerelateerdeLinks?.length || gerelateerdeRecepten.length > 0) && (
            <div
              className="p-6 mt-10"
              style={{ backgroundColor: "var(--sand)", borderLeft: "4px solid var(--navy)" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4 opacity-60"
                style={{ color: "var(--navy)" }}
              >
                Verder lezen & doen
              </p>
              <ul className="space-y-2.5">
                {gerelateerdeRecepten.map((r) => (
                  <li key={r!.slug}>
                    <Link
                      href={`/${locale}/recepten/${r!.slug}`}
                      className="text-sm font-medium underline underline-offset-4"
                      style={{ color: "var(--navy)" }}
                    >
                      Recept: {r!.title} →
                    </Link>
                  </li>
                ))}
                {post.gerelateerdeLinks?.map((link) =>
                  link.href.startsWith("http") ? (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4"
                        style={{ color: "var(--navy)" }}
                      >
                        {link.label} <ExternalLink size={13} />
                      </a>
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link
                        href={`/${locale}${link.href}`}
                        className="text-sm font-medium underline underline-offset-4"
                        style={{ color: "var(--navy)" }}
                      >
                        {link.label} →
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </article>

      {/* Nieuwsbrief */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-14 px-6">
        <div className="max-w-xl mx-auto text-center" style={{ color: "var(--cream)" }}>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Weten wanneer de Hollandse Nieuwe er is?
          </h2>
          <p className="text-sm opacity-60 mb-6 leading-relaxed">
            Laat uw e-mailadres achter en hoor het als eerste — plus elke week
            de aanbieding en wat er vers binnen is.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterSignup compact />
          </div>
        </div>
      </section>
    </>
  );
}
