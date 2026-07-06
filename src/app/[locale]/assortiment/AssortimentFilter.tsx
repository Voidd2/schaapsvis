"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  products,
  CATEGORIE_LABELS,
  CATEGORIE_KLEUR,
  type Categorie,
} from "@/lib/assortiment-data";

// ─── Category tabs ────────────────────────────────────────────────────────────
const TABS: { id: "alle" | Categorie; label: string }[] = [
  { id: "alle",          label: "Alles" },
  { id: "verse-vis",     label: "Verse Vis" },
  { id: "gerookte-vis",  label: "Gerookte Vis" },
  { id: "schaal-schelp", label: "Schaal- & Schelpdieren" },
  { id: "vissalades",    label: "Vissalades" },
  { id: "bereid",        label: "Bereid & Snacks" },
];

// ─── WhatsApp deep link ───────────────────────────────────────────────────────
function waUrl(naam: string) {
  const msg = `Hallo Schaap's Vishandel, ik wil graag ${naam} bestellen of reserveren. Wanneer kan ik dit ophalen?`;
  return `https://wa.me/31715149802?text=${encodeURIComponent(msg)}`;
}

// ─── Allergen accordion ───────────────────────────────────────────────────────
function Allergenen({ ingredienten, bevat }: { ingredienten: string; bevat: string[] }) {
  return (
    <details className="group border-t" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
      <summary
        className="flex items-center justify-between gap-2 cursor-pointer select-none px-4 py-3 text-xs font-medium"
        style={{ listStyle: "none", color: "var(--charcoal)", opacity: 0.6 }}
      >
        Ingrediënten & allergenen
        <svg
          className="w-3.5 h-3.5 flex-shrink-0 transition-transform group-open:rotate-180"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="px-4 pb-4">
        <p
          className="text-xs leading-relaxed mb-2.5"
          style={{ color: "var(--charcoal)", opacity: 0.6, fontSize: "0.7rem" }}
        >
          {ingredienten}
        </p>
        <div className="flex flex-wrap gap-1 mb-2">
          {bevat.map((a) => (
            <span
              key={a}
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm"
              style={{
                backgroundColor: "rgba(192,57,43,0.1)",
                color: "#c0392b",
                border: "1px solid rgba(192,57,43,0.2)",
              }}
            >
              {a}
            </span>
          ))}
        </div>
        <p style={{ color: "var(--charcoal)", opacity: 0.35, fontSize: "0.62rem" }}>
          Ondanks zorgvuldigheid kunnen sporen van andere allergenen aanwezig zijn. Bij twijfel: vraag ons.
        </p>
      </div>
    </details>
  );
}

// ─── Card photo (eigen merkillustratie per categorie; lokale foto indien aanwezig) ──
const CATEGORIE_SCENE: Record<Categorie, string> = {
  "verse-vis":     "/images/scene-vis.svg",
  "gerookte-vis":  "/images/scene-gerookt.svg",
  "schaal-schelp": "/images/scene-schaaldier.svg",
  "vissalades":    "/images/scene-vis.svg",
  "bereid":        "/images/scene-vis.svg",
};

function CardPhoto({
  photo,
  naam,
  categorie,
}: {
  photo?: string;
  naam: string;
  categorie: Categorie;
}) {
  const kleur = CATEGORIE_KLEUR[categorie];
  const src = photo || CATEGORIE_SCENE[categorie];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 150, borderBottom: `3px solid ${kleur}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${naam} — Schaap's Vishandel Leiden`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: (typeof products)[number] }) {
  const locale = useLocale();
  const kleur = CATEGORIE_KLEUR[product.categorie];

  return (
    <article
      className="flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      style={{
        outline: product.highlight ? `2px solid var(--seafoam)` : "none",
        outlineOffset: product.highlight ? "-1px" : undefined,
      }}
    >
      {/* Photo — klikbaar naar detailpagina met voedingswaarde */}
      <Link
        href={`/${locale}/assortiment/${product.slug}`}
        aria-label={`${product.naam} — meer info en voedingswaarde`}
      >
        <CardPhoto photo={product.photo} naam={product.naam} categorie={product.categorie} />
      </Link>

      {/* Card body */}
      <div className="px-4 pt-3 pb-3 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span
            className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5"
            style={{ backgroundColor: kleur + "28", color: "var(--charcoal)" }}
          >
            {CATEGORIE_LABELS[product.categorie]}
          </span>
          {product.badge && (
            <span
              className="text-[9px] font-bold px-2 py-0.5"
              style={{ backgroundColor: "var(--seafoam)", color: "white" }}
            >
              {product.badge}
            </span>
          )}
          {product.omega3 && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5"
              style={{ backgroundColor: "var(--salmon)", color: "white" }}
            >
              Ω-3
            </span>
          )}
        </div>

        {/* Name */}
        <h3
          className="font-bold text-[0.95rem] leading-snug mb-1.5"
          style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
        >
          <Link href={`/${locale}/assortiment/${product.slug}`} className="hover:underline">
            {product.naam}
          </Link>
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: "var(--charcoal)", opacity: 0.68, fontSize: "0.82rem" }}
        >
          {product.desc}
        </p>

        <Link
          href={`/${locale}/assortiment/${product.slug}`}
          className="mt-2 text-xs font-semibold underline underline-offset-2"
          style={{ color: "var(--navy)" }}
        >
          Voedingswaarde &amp; info →
        </Link>

        {/* Availability */}
        {product.beschikbaar && (
          <p
            className="mt-2 text-[11px] font-semibold"
            style={{
              color:
                product.beschikbaar === "dagelijks"
                  ? "var(--seafoam)"
                  : product.beschikbaar === "seizoensgebonden"
                  ? "var(--gold)"
                  : "var(--charcoal)",
              opacity: product.beschikbaar === "op bestelling" ? 0.55 : 1,
            }}
          >
            {product.beschikbaar === "dagelijks" && "✓ Dagelijks beschikbaar"}
            {product.beschikbaar === "seizoensgebonden" && "⊙ Seizoensgebonden"}
            {product.beschikbaar === "op bestelling" && "◎ Op bestelling"}
          </p>
        )}

        {/* Varlaks link */}
        {product.highlight && (
          <Link
            href={`/${locale}/varlaks`}
            className="mt-1.5 text-xs font-semibold underline underline-offset-2"
            style={{ color: "var(--seafoam)" }}
          >
            Meer over Varlaks →
          </Link>
        )}

        {/* WhatsApp order */}
        {product.bestelId && (
          <a
            href={waUrl(product.naam)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#25D366" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.132.558 4.13 1.532 5.864L.057 23.885l6.186-1.443A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.955 0-3.78-.554-5.33-1.511l-.383-.226-3.676.858.87-3.582-.249-.396A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Bestel via WhatsApp
          </a>
        )}
      </div>

      {/* Allergen accordion */}
      <Allergenen ingredienten={product.ingredienten} bevat={product.bevat} />
    </article>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function AssortimentFilter() {
  const [activeTab, setActiveTab] = useState<"alle" | Categorie>("alle");

  const filtered =
    activeTab === "alle"
      ? products
      : products.filter((p) => p.categorie === activeTab);

  return (
    <>
      {/* Sticky category tabs */}
      <div
        className="sticky z-30 border-b overflow-x-auto scrollbar-hide"
        style={{
          top: 0,
          backgroundColor: "white",
          borderColor: "rgba(0,0,0,0.09)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex min-w-max">
            {TABS.map(({ id, label }) => {
              const active = id === activeTab;
              const count =
                id === "alle"
                  ? products.length
                  : products.filter((p) => p.categorie === id).length;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
                  style={{
                    borderColor: active ? "var(--navy)" : "transparent",
                    color: active ? "var(--navy)" : "rgba(37,42,58,0.5)",
                  }}
                >
                  {label}
                  <span
                    className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-sm"
                    style={{
                      backgroundColor: active ? "var(--navy)" : "rgba(0,0,0,0.07)",
                      color: active ? "white" : "rgba(37,42,58,0.5)",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div
        className="py-10"
        style={{ backgroundColor: "var(--cream)" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
