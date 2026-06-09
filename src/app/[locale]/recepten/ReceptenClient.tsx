"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, ChefHat, ShoppingBag } from "lucide-react";
import { PhotoPlaceholder } from "@/components/shared/PhotoPlaceholder";
import { recepten, ALLE_TAGS, TAG_ICON, type Recept, type ReceptTag } from "@/lib/recepten";

function MoeilijkheidBadge({ m }: { m: Recept["moeilijkheid"] }) {
  const color =
    m === "Makkelijk"
      ? "var(--seafoam)"
      : m === "Gemiddeld"
      ? "var(--gold)"
      : "var(--salmon)";
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 text-white"
      style={{ backgroundColor: color }}
    >
      <ChefHat size={11} /> {m}
    </span>
  );
}

function ReceptCard({ recept, locale }: { recept: Recept; locale: string }) {
  return (
    <article
      className="group bg-white flex flex-col"
      style={{ border: "1px solid rgba(26,53,48,0.1)" }}
    >
      <div className="relative overflow-hidden">
        {recept.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recept.fotoUrl}
            alt={recept.title}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
        ) : (
          <PhotoPlaceholder label={recept.fotoLabel} aspectRatio="aspect-video" />
        )}
        {recept.highlight && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 text-white"
            style={{ backgroundColor: "var(--salmon)" }}
          >
            {recept.highlight}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 font-medium"
            style={{ backgroundColor: "var(--sand)", color: "var(--navy)" }}
          >
            <Clock size={11} /> {recept.tijd}
          </span>
          <MoeilijkheidBadge m={recept.moeilijkheid} />
        </div>
        <h2
          className="text-lg font-bold mb-1 leading-tight"
          style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
        >
          {recept.title}
        </h2>
        <p
          className="text-xs mb-3 opacity-60 leading-relaxed"
          style={{ color: "var(--charcoal)" }}
        >
          {recept.subtitle}
        </p>
        <div className="flex flex-wrap gap-1 mb-4">
          {recept.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5"
              style={{ backgroundColor: "var(--cream)", color: "var(--charcoal)", opacity: 0.8 }}
            >
              {TAG_ICON[tag]} {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <ShoppingBag size={12} style={{ color: "var(--navy)" }} />
          <span
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: "var(--navy)" }}
          >
            Van Schaap&apos;s Vis:
          </span>
        </div>
        <p
          className="text-xs opacity-60 mb-4 leading-relaxed flex-1"
          style={{ color: "var(--charcoal)" }}
        >
          {recept.vanSchaap[0]}
          {recept.vanSchaap.length > 1 && " + meer"}
        </p>
        <Link
          href={`/${locale}/recepten/${recept.slug}`}
          className="inline-block text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
          style={{ color: "var(--navy)" }}
        >
          Volledig recept →
        </Link>
      </div>
    </article>
  );
}

export function ReceptenClient({ locale }: { locale: string }) {
  const [actieveFilter, setActieveFilter] = useState<ReceptTag | null>(null);

  const gefilterdeRecepten = actieveFilter
    ? recepten.filter((r) => r.tags.includes(actieveFilter))
    : recepten;

  return (
    <>
      {/* Hero */}
      <section
        style={{ backgroundColor: "var(--navy)" }}
        className="py-20 px-6 text-center"
      >
        <p
          className="text-xs uppercase tracking-[0.25em] mb-5 opacity-60"
          style={{ color: "var(--sand)" }}
        >
          Schaap&apos;s Vis · Recepten
        </p>
        <h1
          className="text-5xl md:text-6xl font-bold mb-5 leading-tight"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          Kook met verse vis
        </h1>
        <p
          className="text-base max-w-xl mx-auto leading-relaxed"
          style={{ color: "rgba(247,240,227,0.75)" }}
        >
          Wat u bij ons haalt + wat u in de supermarkt koopt. Van 15 minuten
          tot een weekend project. Eerlijk over de moeilijkheid.
        </p>
      </section>

      {/* Filters */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-5 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActieveFilter(null)}
              className="px-4 py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor: actieveFilter === null ? "var(--navy)" : "white",
                color: actieveFilter === null ? "white" : "var(--navy)",
                border: "1px solid var(--navy)",
              }}
            >
              Alle recepten ({recepten.length})
            </button>
            {ALLE_TAGS.map((tag) => {
              const count = recepten.filter((r) => r.tags.includes(tag)).length;
              if (count === 0) return null;
              const isActief = actieveFilter === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActieveFilter(isActief ? null : tag)}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isActief ? "var(--navy)" : "white",
                    color: isActief ? "white" : "var(--charcoal)",
                    border: `1px solid ${isActief ? "var(--navy)" : "var(--sand)"}`,
                  }}
                >
                  {TAG_ICON[tag]} {tag} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section
        className="py-8 px-6"
        style={{ backgroundColor: "var(--cream)", borderBottom: "1px solid var(--sand)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--charcoal)", opacity: 0.7 }}
          >
            Bij elk recept staat precies{" "}
            <strong>wat u bij ons haalt</strong> en wat u nog even langs de
            supermarkt voor moet. Altijd met het eerlijke advies van Aldert
            erbij.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {gefilterdeRecepten.length === 0 ? (
            <p
              className="text-center opacity-50 py-12"
              style={{ color: "var(--charcoal)" }}
            >
              Geen recepten gevonden voor dit filter.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gefilterdeRecepten.map((r) => (
                <ReceptCard key={r.slug} recept={r} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Credits */}
      <section
        className="py-6 px-6"
        style={{ backgroundColor: "var(--cream)", borderTop: "1px solid var(--sand)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs" style={{ color: "var(--charcoal)", opacity: 0.5 }}>
            Een deel van de recepten op deze pagina is met toestemming overgenomen van{" "}
            <a
              href="https://visrecepten.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-100 transition-opacity"
            >
              visrecepten.nl
            </a>
            {" "}en aangepast voor Schaap&apos;s Vis Leiden.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "var(--navy)" }}
        className="py-14 px-6 text-center"
      >
        <h2
          className="text-3xl font-bold mb-4 text-white"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Verse vis halen?
        </h2>
        <p
          className="text-sm mb-8 max-w-md mx-auto"
          style={{ color: "rgba(247,240,227,0.7)" }}
        >
          Herenstraat 48, Leiden · Maandag t/m zaterdag · 071 514 9802
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/bestellen`}
            className="inline-block text-white px-8 py-4 font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--salmon)" }}
          >
            Vooruit bestellen →
          </Link>
          <Link
            href={`/${locale}/bezoek-ons`}
            className="inline-block px-8 py-4 font-medium border transition-opacity hover:opacity-70"
            style={{ color: "var(--cream)", borderColor: "rgba(247,240,227,0.4)" }}
          >
            Route &amp; openingstijden
          </Link>
        </div>
      </section>
    </>
  );
}
