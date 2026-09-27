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

// ─── Afbeelding op de kaart ───────────────────────────────────────────────────
// Voor producten waar we een echte foto van hebben tonen we die, volledig, op
// wit — het zijn uitsneden, dus bijsnijden levert alleen wit op. Voor de rest
// géén tekenfilm-vis: die illustraties vloekten met de rest en zien er
// bovendien uit als opvulling. In plaats daarvan een rustig vlak met de naam
// erin, zoals een kaartje bij de vis in de toonbank.
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

  return (
    <div
      className="w-full aspect-square flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: photo ? "#fff" : "var(--sand)",
        borderBottom: `2px solid ${kleur}`,
      }}
    >
      {photo ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={photo}
          alt={`${naam} — Schaap's Vishandel Leiden`}
          className="w-full h-full object-contain p-5"
          loading="lazy"
        />
      ) : (
        <span
          className="px-5 text-center"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--navy)",
            fontSize: "1.15rem",
            lineHeight: 1.25,
            opacity: 0.5,
          }}
        >
          {naam}
        </span>
      )}
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────
const BESCHIKBAAR_TEKST: Record<string, { tekst: string; kleur: string }> = {
  dagelijks: { tekst: "Dagelijks in de winkel", kleur: "var(--seafoam)" },
  seizoensgebonden: { tekst: "Seizoensgebonden", kleur: "var(--gold)" },
  "op bestelling": { tekst: "Op bestelling", kleur: "var(--grijs)" },
};

function ProductCard({ product }: { product: (typeof products)[number] }) {
  const locale = useLocale();
  const detail = `/${locale}/assortiment/${product.slug}`;
  const staat = product.beschikbaar ? BESCHIKBAAR_TEKST[product.beschikbaar] : undefined;
  // Het keurmerk en Ω-3 stonden als gekleurde blokjes op de kaart. Drie
  // vlakjes in drie kleuren boven elke naam maakt van een lijst met vis een
  // rommeltje; als kapitaaltjes achter de categorie lezen ze net zo goed.
  const merken = [product.badge, product.omega3 ? "Ω-3" : null].filter(Boolean);

  return (
    <article
      className="flex flex-col"
      style={{
        backgroundColor: "#fff",
        borderTop: product.highlight ? "2px solid var(--seafoam)" : "1px solid var(--linen)",
      }}
    >
      <Link href={detail} aria-label={`${product.naam} — meer info en voedingswaarde`}>
        <CardPhoto photo={product.photo} naam={product.naam} categorie={product.categorie} />
      </Link>

      <div className="px-4 pt-3.5 pb-4 flex flex-col flex-1">
        <p className="kapitaal mb-2" style={{ color: "var(--grijs)" }}>
          {CATEGORIE_LABELS[product.categorie]}
          {merken.length > 0 && (
            <span style={{ color: "var(--seafoam)" }}> · {merken.join(" · ")}</span>
          )}
        </p>

        <h3 className="text-[1.05rem] leading-snug mb-1.5">
          <Link href={detail} className="hover:underline underline-offset-4">
            {product.naam}
          </Link>
        </h3>

        <p
          className="text-[0.88rem] leading-relaxed flex-1"
          style={{ color: "var(--charcoal)" }}
        >
          {product.desc}
        </p>

        {staat && (
          <p className="mt-3 text-[0.8rem] font-semibold" style={{ color: staat.kleur }}>
            {staat.tekst}
          </p>
        )}
        <p className="text-[0.8rem]" style={{ color: "var(--grijs)" }}>
          {isBezorgbaar(product.categorie)
            ? "Bezorgen of afhalen"
            : "Alleen afhalen — gaat niet mee de weg op"}
        </p>

        <Link
          href={detail}
          className="mt-4 text-[0.82rem] font-semibold underline underline-offset-4"
          style={{ color: "var(--navy)" }}
        >
          Bekijk product &amp; beschikbaarheid &rarr;
        </Link>
      </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
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
