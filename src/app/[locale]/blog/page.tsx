import Link from "next/link";
import type { Metadata } from "next";
import { Clock, Calendar } from "lucide-react";
import { blogPostsGesorteerd } from "@/lib/blog";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Blog | Schaap's Vis Leiden — Verhalen, seizoenen & visweetjes",
    description:
      "Verhalen van achter de toonbank: welke vis wanneer het lekkerst is, de geschiedenis van onze winkel sinds 1938, en eerlijke visweetjes. Vers uit Leiden.",
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { nl: "/nl/blog", en: "/en/blog", de: "/de/blog", "x-default": "/nl/blog" },
    },
  };
}

const categorieKleur: Record<string, string> = {
  Seizoen: "var(--seafoam)",
  "Ons verhaal": "var(--navy)",
  Visweetjes: "var(--gold)",
  Duurzaam: "var(--seafoam)",
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd />
      {/* Hero */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-4 opacity-60"
            style={{ color: "var(--sand)" }}
          >
            Vers van achter de toonbank
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
          >
            Blog
          </h1>
          <p className="max-w-2xl leading-relaxed" style={{ color: "rgba(250,246,239,0.75)" }}>
            Welke vis is wanneer het lekkerst? Hoe werd een viswinkeltje uit 1938
            een Leids begrip? En wat is nou eigenlijk het verschil tussen
            kibbeling en lekkerbek? Hier delen we wat we achter de toonbank elke
            dag vertellen.
          </p>
        </div>
      </section>

      {/* Viskalender promo */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            href={`/${locale}/viskalender`}
            className="flex flex-col md:flex-row items-start md:items-center gap-5 group"
          >
            <div
              className="flex-shrink-0 w-14 h-14 flex items-center justify-center"
              style={{ backgroundColor: "var(--gold)" }}
            >
              <svg viewBox="0 0 40 40" width="28" height="28" fill="var(--navy-dark)" aria-hidden="true">
                {/* Clock/wheel icon */}
                <circle cx="20" cy="20" r="18" stroke="var(--navy-dark)" strokeWidth="2" fill="none" />
                <circle cx="20" cy="20" r="2.5" fill="var(--navy-dark)" />
                <line x1="20" y1="20" x2="20" y2="6" stroke="var(--navy-dark)" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="20" x2="30" y2="26" stroke="var(--navy-dark)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs uppercase tracking-widest mb-1 font-semibold"
                style={{ color: "var(--gold)" }}
              >
                Interactief
              </p>
              <h2
                className="text-xl font-bold mb-1 group-hover:underline underline-offset-4"
                style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
              >
                Het Visjaar — de interactieve viskalender
              </h2>
              <p className="text-sm" style={{ color: "rgba(250,246,239,0.65)" }}>
                Maand voor maand: welke vis is nú op zijn best? De kalender springt automatisch naar de
                huidige maand en laat zien wat het hele jaar te bieden heeft.
              </p>
            </div>
            <span
              className="text-sm font-semibold px-4 py-2.5 flex-shrink-0 transition-opacity group-hover:opacity-80"
              style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}
            >
              Bekijk kalender →
            </span>
          </Link>
        </div>
      </section>

      {/* Posts grid */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-14 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {blogPostsGesorteerd.map((post) => (
            <article key={post.slug} className="bg-white flex flex-col group">
              <Link href={`/${locale}/blog/${post.slug}`} className="block overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.fotoUrl}
                  alt={post.fotoAlt}
                  className="w-full aspect-[16/9] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 text-white"
                    style={{ backgroundColor: categorieKleur[post.categorie] ?? "var(--navy)" }}
                  >
                    {post.categorie}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-xs opacity-50"
                    style={{ color: "var(--charcoal)" }}
                  >
                    <Clock size={12} /> {post.leestijd}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-xs opacity-50"
                    style={{ color: "var(--charcoal)" }}
                  >
                    <Calendar size={12} /> {post.datumLabel}
                  </span>
                </div>
                <h2
                  className="text-2xl font-bold mb-3 leading-snug"
                  style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}
                >
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="hover:underline underline-offset-4"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p
                  className="text-sm leading-relaxed mb-5 flex-1"
                  style={{ color: "var(--charcoal)", opacity: 0.75 }}
                >
                  {post.excerpt}
                </p>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="text-sm font-semibold underline underline-offset-4"
                  style={{ color: "var(--navy)" }}
                >
                  Lees verder →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-14 px-6 text-center">
        <h2
          className="text-3xl font-bold mb-3"
          style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}
        >
          Liever proeven dan lezen?
        </h2>
        <p className="mb-7 opacity-70 max-w-xl mx-auto" style={{ color: "var(--charcoal)" }}>
          Alles waar we hier over schrijven, ligt gewoon in de vitrine.
          Herenstraat 48, Leiden — of bestel vooruit.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={`/${locale}/bestellen`}
            className="inline-block font-medium px-7 py-3.5 text-white"
            style={{ backgroundColor: "var(--salmon)" }}
          >
            Bestel vooruit →
          </Link>
          <Link
            href={`/${locale}/assortiment`}
            className="inline-block font-medium px-7 py-3.5 border"
            style={{ borderColor: "var(--navy)", color: "var(--navy)" }}
          >
            Bekijk het assortiment
          </Link>
        </div>
      </section>
    </>
  );
}
