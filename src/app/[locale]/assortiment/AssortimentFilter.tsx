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
import { matchesQuery, searchScore } from "@/lib/search";
import { isBezorgbaar } from "@/lib/bezorging";

// ─── Category tabs ────────────────────────────────────────────────────────────
const TABS: { id: "alle" | Categorie; label: string }[] = [
  { id: "alle",          label: "Alles" },
  { id: "verse-vis",     label: "Verse Vis" },
  { id: "gerookte-vis",  label: "Gerookte Vis" },
  { id: "schaal-schelp", label: "Schaal- & Schelpdieren" },
  { id: "vissalades",    label: "Vissalades" },
  { id: "bereid",        label: "Bereid & Snacks" },
];

// ─── Allergen accordion ───────────────────────────────────────────────────────
function Allergenen({ ingredienten, bevat }: { ingredienten: string; bevat: string[] }) {
  return (
    <details className="group border-t" style={{ borderColor: "var(--linen)" }}>
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
                color: "var(--rood)",
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
      className="flex flex-col overflow-hidden"
      style={{
        backgroundColor: "#fff",
        border: product.highlight ? "1px solid var(--seafoam)" : "1px solid var(--linen)",
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
          style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}
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
            {product.beschikbaar === "dagelijks" && "Dagelijks in de winkel"}
            {product.beschikbaar === "seizoensgebonden" && "Seizoensgebonden"}
            {product.beschikbaar === "op bestelling" && "Op bestelling"}
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

        {/* Bestellen — en eerlijk erbij of het de weg op gaat */}
        <p className="mt-3 text-[11px]" style={{ color: "var(--grijs)" }}>
          {isBezorgbaar(product.categorie)
            ? "Wordt bezorgd of afgehaald"
            : "Alleen afhalen — gaat niet mee de weg op"}
        </p>
        <Link
          href={`/${locale}/bestellen?product=${product.slug}`}
          className="knop knop-navy mt-2 !py-2.5 !text-[0.85rem]"
        >
          Aan bestelling toevoegen
        </Link>
      </div>

      {/* Allergen accordion */}
      <Allergenen ingredienten={product.ingredienten} bevat={product.bevat} />
    </article>
  );
}

// ─── Dieet-/allergenenfilter + sortering ──────────────────────────────────────
const DIEET_FILTERS: { key: string; label: string }[] = [
  { key: "GLUTEN",       label: "Zonder gluten" },
  { key: "SCHAALDIEREN", label: "Zonder schaaldieren" },
  { key: "WEEKDIEREN",   label: "Zonder weekdieren" },
  { key: "MELK",         label: "Zonder melk" },
  { key: "EIEREN",       label: "Zonder ei" },
  { key: "MOSTERD",      label: "Zonder mosterd" },
  { key: "SOJA",         label: "Zonder soja" },
];

const AVAIL_RANK: Record<string, number> = {
  dagelijks: 0,
  seizoensgebonden: 1,
  "op bestelling": 2,
};

// ─── Main export ──────────────────────────────────────────────────────────────
export function AssortimentFilter() {
  const [activeTab, setActiveTab] = useState<"alle" | Categorie>("alle");
  const [query, setQuery] = useState("");
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [sortMode, setSortMode] = useState<"aanbevolen" | "naam">("aanbevolen");

  function toggleExcl(key: string) {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  function wisFilters() {
    setExcluded(new Set());
    setQuery("");
  }

  const q = query.trim();
  const velden = (p: (typeof products)[number]) => ({
    naam: p.naam,
    desc: p.desc,
    categorie: CATEGORIE_LABELS[p.categorie],
  });
  let list = activeTab === "alle" ? products : products.filter((p) => p.categorie === activeTab);
  if (q) list = list.filter((p) => matchesQuery(velden(p), q));
  if (excluded.size) {
    list = list.filter(
      (p) => !p.bevat.some((b) => {
        const up = b.toUpperCase();
        return Array.from(excluded).some((k) => up.includes(k));
      })
    );
  }
  const rank = (p: (typeof products)[number]) => AVAIL_RANK[p.beschikbaar ?? "dagelijks"] ?? 1;
  const sorted = [...list].sort((a, b) => {
    // Bij een zoekopdracht sorteren we op relevantie (tenzij naam A–Z is gekozen).
    if (q && sortMode === "aanbevolen") {
      const diff = searchScore(velden(b), q) - searchScore(velden(a), q);
      if (diff !== 0) return diff;
    }
    return sortMode === "naam"
      ? a.naam.localeCompare(b.naam)
      : rank(a) - rank(b) || a.naam.localeCompare(b.naam);
  });

  return (
    <>
      {/* Sticky category tabs */}
      <div
        className="sticky z-30 border-b overflow-x-auto scrollbar-hide"
        style={{
          // De vaste kop is 2rem informatiebalk + 4.4rem naam en navigatie hoog.
          top: "6.4rem",
          backgroundColor: "var(--cream)",
          borderColor: "var(--linen)",
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
                    color: active ? "var(--navy)" : "var(--grijs)",
                  }}
                >
                  {label}
                  <span
                    className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-sm"
                    style={{
                      backgroundColor: active ? "var(--navy)" : "var(--sand)",
                      color: active ? "var(--cream)" : "var(--grijs)",
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

      {/* Zoeken, sorteren & dieetfilter */}
      <div className="border-b" style={{ backgroundColor: "var(--cream)", borderColor: "var(--linen)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoek in het assortiment…"
              className="flex-1 min-w-[180px] border px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: "var(--linen)", color: "var(--charcoal)" }}
            />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as "aanbevolen" | "naam")}
              className="border px-3 py-2 text-sm bg-white focus:outline-none"
              style={{ borderColor: "var(--linen)", color: "var(--navy)" }}
              aria-label="Sorteren"
            >
              <option value="aanbevolen">Aanbevolen (dagelijks eerst)</option>
              <option value="naam">Naam A–Z</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs opacity-50" style={{ color: "var(--charcoal)" }}>Dieet:</span>
            {DIEET_FILTERS.map(({ key, label }) => {
              const on = excluded.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleExcl(key)}
                  aria-pressed={on}
                  className="text-xs px-2.5 py-1 border transition-colors"
                  style={{
                    borderColor: on ? "var(--seafoam)" : "var(--linen)",
                    backgroundColor: on ? "var(--seafoam)" : "white",
                    color: on ? "white" : "var(--charcoal)",
                  }}
                >
                  {label}
                </button>
              );
            })}
            {(excluded.size > 0 || q) && (
              <button type="button" onClick={wisFilters} className="text-xs px-2.5 py-1 underline" style={{ color: "var(--salmon)" }}>
                Wis filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="py-10" style={{ backgroundColor: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs mb-4 opacity-55" style={{ color: "var(--charcoal)" }}>
            {sorted.length} {sorted.length === 1 ? "product" : "producten"}
          </p>
          {sorted.length === 0 ? (
            <p className="text-sm py-12 text-center opacity-70" style={{ color: "var(--charcoal)" }}>
              Geen producten gevonden met deze filters.{" "}
              <button type="button" onClick={wisFilters} className="underline" style={{ color: "var(--navy)" }}>
                Wis filters
              </button>
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sorted.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
