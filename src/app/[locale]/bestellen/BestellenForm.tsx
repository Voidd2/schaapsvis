"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CATALOG, type CatalogProduct, CATEGORIE_LABELS } from "@/lib/products";
import { Search, X, Plus, ShoppingBag, ChevronDown, Gift } from "lucide-react";

// TODO(eigenaar): vervang door uw echte Formspree-ID — gratis aan te maken op formspree.io
const FORMSPREE_ENDPOINT = "https://formspree.io/f/JOUW_FORMSPREE_ID";

type FormState = "idle" | "sending" | "success" | "error";

type OrderItem = {
  product: CatalogProduct;
  hoeveelheid: string;
  notitie?: string;
};

const AFHAALDAGEN = [
  "Maandag — winkel Herenstraat",
  "Dinsdag — winkel Herenstraat",
  "Woensdag — winkel Herenstraat of markt Leiden",
  "Donderdag — winkel Herenstraat",
  "Vrijdag — winkel Herenstraat of Hoogvliet Voorschoten",
  "Zaterdag — winkel Herenstraat of markt Leiden",
] as const;

function searchProducts(query: string): CatalogProduct[] {
  if (query.length < 1) return [];
  const q = query.toLowerCase();
  return CATALOG.filter((p) => {
    if (!p.beschikbaar) return false;
    if (p.naam.toLowerCase().includes(q)) return true;
    if (p.beschrijving.toLowerCase().includes(q)) return true;
    if (p.zoekwoorden?.some((w) => w.toLowerCase().includes(q))) return true;
    return false;
  }).slice(0, 7);
}

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        className="w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
        style={{ backgroundColor: "var(--navy)", color: "white" }}
        aria-label="Meer info"
      >
        ?
      </button>
      {open && (
        <span
          className="absolute z-20 bottom-6 left-0 w-56 p-3 text-xs leading-relaxed shadow-lg"
          style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

export function BestellenForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<FormState>("idle");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CatalogProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bestelling, setBestelling] = useState<OrderItem[]>([]);
  const [showBrowse, setShowBrowse] = useState(false);
  const [klant, setKlant] = useState({
    naam: "",
    telefoon: "",
    email: "",
    ophaaldag: "",
    opmerking: "",
    nieuwsbrief: false,
  });
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-fill product uit ?product= query (bijv. vanaf homepage of assortiment)
  useEffect(() => {
    const productId = searchParams.get("product");
    if (!productId) return;
    const product = CATALOG.find((p) => p.id === productId && p.beschikbaar);
    if (product) {
      setBestelling((prev) =>
        prev.find((i) => i.product.id === product.id)
          ? prev
          : [...prev, { product, hoeveelheid: product.id === "verrassingspakket" ? "1" : "" }]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const results = searchProducts(searchQuery);
    setSuggestions(results);
    setShowSuggestions(results.length > 0 && searchQuery.length > 0);
  }, [searchQuery]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function addToOrder(product: CatalogProduct) {
    setBestelling((prev) => {
      if (prev.find((i) => i.product.id === product.id)) return prev;
      return [...prev, { product, hoeveelheid: "" }];
    });
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function updateHoeveelheid(id: string, hoeveelheid: string) {
    setBestelling((prev) =>
      prev.map((i) => (i.product.id === id ? { ...i, hoeveelheid } : i))
    );
  }

  function removeItem(id: string) {
    setBestelling((prev) => prev.filter((i) => i.product.id !== id));
  }

  const bestellingLeeg = bestelling.length === 0;
  const bestellingIngevuld = bestelling.some((i) => i.hoeveelheid.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bestellingIngevuld && !klant.opmerking.trim()) return;
    setStatus("sending");

    const regels = bestelling
      .filter((i) => i.hoeveelheid.trim())
      .map(
        (i) =>
          `• ${i.product.naam}: ${i.hoeveelheid} (${i.product.eenheid})`
      )
      .join("\n");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam: klant.naam,
          telefoon: klant.telefoon,
          email: klant.email || "(niet opgegeven)",
          ophaaldag: klant.ophaaldag,
          bestelling: regels || "Zie opmerking",
          opmerking: klant.opmerking,
          nieuwsbrief: klant.nieuwsbrief ? "JA — wil aanbiedingen ontvangen" : "nee",
          _subject: `Bestelling van ${klant.naam} — ${klant.ophaaldag}`,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: "var(--cream)" }}
      >
        <div
          className="text-center max-w-md bg-white p-12 border"
          style={{ borderColor: "var(--sand)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "var(--seafoam)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            Aanvraag ontvangen!
          </h1>
          <p className="leading-relaxed text-base mb-8" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
            We bellen u zo snel mogelijk terug op{" "}
            <strong>{klant.telefoon}</strong> om uw bestelling te bevestigen en
            de prijs door te geven.
          </p>
          <div className="pt-6 border-t" style={{ borderColor: "var(--sand)" }}>
            <p className="text-sm mb-2" style={{ color: "var(--charcoal)", opacity: 0.5 }}>
              Liever direct bellen?
            </p>
            <a
              href="tel:+31715149802"
              className="text-xl font-bold underline"
              style={{ color: "var(--salmon)" }}
            >
              071 514 9802
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "var(--cream)" }}>
      {/* Hero */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 px-6 text-center">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          Vooruit Bestellen
        </h1>
        <p
          className="max-w-xl mx-auto leading-relaxed"
          style={{ color: "rgba(246,250,253,0.75)" }}
        >
          Typ wat u wilt — wij sturen zo snel mogelijk een prijs terug en houden uw vis voor u apart.
        </p>
      </section>

      {/* Stappenplan */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-8 px-6">
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            ["1", "Kies uw vis", "Zoek of blader door ons assortiment"],
            ["2", "Wij bellen terug", "U ontvangt de prijs en bevestiging"],
            ["3", "Ophalen & betalen", "Winkel, markt of Voorschoten — contant of pin"],
          ].map(([num, title, desc]) => (
            <div key={num} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "var(--navy)" }}
              >
                {num}
              </div>
              <div>
                <p className="font-semibold text-base" style={{ color: "var(--navy)" }}>
                  {title}
                </p>
                <p className="text-sm opacity-60" style={{ color: "var(--charcoal)" }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* === VERRASSINGSPAKKET === */}
          {(() => {
            const pakket = CATALOG.find((p) => p.id === "verrassingspakket");
            const inBestelling = bestelling.some((i) => i.product.id === "verrassingspakket");
            if (!pakket?.beschikbaar) return null;
            return (
              <div
                className="p-6 md:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
                style={{ backgroundColor: "var(--navy)", borderLeft: "4px solid var(--seafoam)" }}
              >
                <div className="flex items-start gap-4">
                  <Gift size={28} style={{ color: "var(--sand)" }} className="flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-lg" style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}>
                      Schaap&apos;s Verrassingspakket — €5,99
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(246,250,253,0.75)" }}>
                      Verse vis van de dag, ter waarde van minimaal het dubbele.
                      Tegen verspilling. <strong>Op = op — elke dag maar 2 beschikbaar.</strong>{" "}
                      Wij bevestigen telefonisch of er nog één voor u is.
                    </p>
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: "rgba(246,250,253,0.55)" }}>
                      Ook te vinden via Too Good To Go — maar rechtstreeks bij ons
                      reserveren is voordeliger én steunt de winkel direct, zonder
                      commissie aan derden.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={inBestelling}
                  onClick={() => addToOrder(pakket)}
                  className="flex-shrink-0 text-sm font-semibold px-5 py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: inBestelling ? "var(--seafoam)" : "var(--salmon)" }}
                >
                  {inBestelling ? "✓ Toegevoegd" : "Reserveer er één"}
                </button>
              </div>
            );
          })()}

          {/* === STAP 1: ZOEKEN === */}
          <div className="bg-white border p-6 md:p-8" style={{ borderColor: "var(--sand)" }}>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
            >
              Wat wilt u bestellen?
            </h2>
            <p className="text-sm mb-5 opacity-60" style={{ color: "var(--charcoal)" }}>
              Zoek op productnaam of blader door het assortiment
            </p>

            {/* Search input */}
            <div ref={searchRef} className="relative mb-4">
              <div
                className="flex items-center border px-4 py-3 gap-3"
                style={{ borderColor: showSuggestions ? "var(--navy)" : "var(--sand)" }}
              >
                <Search size={18} style={{ color: "var(--navy)", opacity: 0.5 }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Zoek bijv. kibbeling, garnalen, zalm..."
                  className="flex-1 text-base focus:outline-none bg-transparent"
                  style={{ color: "var(--charcoal)" }}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                  >
                    <X size={16} style={{ color: "var(--charcoal)", opacity: 0.4 }} />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div
                  className="absolute z-10 left-0 right-0 top-full border-t-0 shadow-lg"
                  style={{ backgroundColor: "white", border: "1px solid var(--navy)" }}
                >
                  {suggestions.map((product) => {
                    const alInBestelling = bestelling.some(
                      (i) => i.product.id === product.id
                    );
                    return (
                      <button
                        key={product.id}
                        type="button"
                        disabled={alInBestelling}
                        onClick={() => addToOrder(product)}
                        className="w-full text-left px-4 py-3 border-b last:border-b-0 flex items-center justify-between gap-4 transition-colors hover:bg-amber-50 disabled:opacity-40"
                        style={{ borderColor: "var(--sand)" }}
                      >
                        <div>
                          <p className="font-medium text-sm" style={{ color: "var(--navy)" }}>
                            {product.naam}
                          </p>
                          <p className="text-xs opacity-60" style={{ color: "var(--charcoal)" }}>
                            {product.beschrijving} · {CATEGORIE_LABELS[product.categorie]}
                          </p>
                        </div>
                        {alInBestelling ? (
                          <span className="text-xs opacity-40" style={{ color: "var(--charcoal)" }}>
                            toegevoegd
                          </span>
                        ) : (
                          <Plus size={16} style={{ color: "var(--seafoam)" }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Browse by category toggle */}
            <button
              type="button"
              onClick={() => setShowBrowse(!showBrowse)}
              className="flex items-center gap-2 text-sm font-medium mb-4 transition-opacity hover:opacity-70"
              style={{ color: "var(--navy)" }}
            >
              <ChevronDown
                size={16}
                style={{
                  transform: showBrowse ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
              Of blader door ons volledige assortiment
            </button>

            {showBrowse && (
              <div className="space-y-6 pt-4 border-t" style={{ borderColor: "var(--sand)" }}>
                {(Object.keys(CATEGORIE_LABELS) as (keyof typeof CATEGORIE_LABELS)[]).map(
                  (cat) => {
                    const items = CATALOG.filter(
                      (p) => p.categorie === cat && p.beschikbaar
                    );
                    if (items.length === 0) return null;
                    return (
                      <div key={cat}>
                        <h3
                          className="text-xs uppercase tracking-widest mb-2 opacity-40 font-semibold"
                          style={{ color: "var(--charcoal)" }}
                        >
                          {CATEGORIE_LABELS[cat]}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {items.map((product) => {
                            const alIn = bestelling.some(
                              (i) => i.product.id === product.id
                            );
                            return (
                              <button
                                key={product.id}
                                type="button"
                                disabled={alIn}
                                onClick={() => addToOrder(product)}
                                className="text-sm px-3 py-1.5 border transition-colors hover:opacity-80 disabled:opacity-40 disabled:cursor-default"
                                style={{
                                  borderColor: alIn ? "var(--seafoam)" : "var(--sand)",
                                  backgroundColor: alIn
                                    ? "rgba(58,128,96,0.08)"
                                    : "white",
                                  color: alIn ? "var(--seafoam)" : "var(--navy)",
                                }}
                              >
                                {alIn ? "✓ " : ""}{product.naam}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {/* Order list */}
            {!bestellingLeeg && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag size={16} style={{ color: "var(--navy)" }} />
                  <h3 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>
                    Uw bestelling ({bestelling.length} {bestelling.length === 1 ? "product" : "producten"})
                  </h3>
                </div>
                {bestelling.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 py-3 border-b"
                    style={{ borderColor: "var(--sand)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: "var(--navy)" }}>
                        {item.product.naam}
                        {item.product.info && <InfoTooltip text={item.product.info} />}
                      </p>
                      <p className="text-xs opacity-50" style={{ color: "var(--charcoal)" }}>
                        per {item.product.eenheid}
                        {item.product.tip && (
                          <> · <span style={{ color: "var(--salmon)" }}>{item.product.tip}</span></>
                        )}
                      </p>
                    </div>
                    <input
                      type="text"
                      value={item.hoeveelheid}
                      onChange={(e) =>
                        updateHoeveelheid(item.product.id, e.target.value)
                      }
                      placeholder="Hoeveel?"
                      className="w-28 border px-3 py-2 text-sm text-center focus:outline-none"
                      style={{ borderColor: "var(--sand)" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="p-1 opacity-30 hover:opacity-70 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* === STAP 2: GEGEVENS === */}
          <div className="bg-white border p-6 md:p-8" style={{ borderColor: "var(--sand)" }}>
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
            >
              Uw gegevens
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-base font-medium mb-2" style={{ color: "var(--charcoal)" }}>
                  Naam <span style={{ color: "var(--salmon)" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={klant.naam}
                  onChange={(e) =>
                    setKlant((p) => ({ ...p, naam: e.target.value }))
                  }
                  placeholder="Voor- en achternaam"
                  className="w-full border px-4 py-3 text-base focus:outline-none"
                  style={{ borderColor: "var(--sand)" }}
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-2" style={{ color: "var(--charcoal)" }}>
                  Telefoonnummer <span style={{ color: "var(--salmon)" }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={klant.telefoon}
                  onChange={(e) =>
                    setKlant((p) => ({ ...p, telefoon: e.target.value }))
                  }
                  placeholder="06 12 34 56 78"
                  className="w-full border px-4 py-3 text-base focus:outline-none"
                  style={{ borderColor: "var(--sand)" }}
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-2" style={{ color: "var(--charcoal)" }}>
                  E-mailadres <span className="opacity-50 text-sm font-normal">(optioneel)</span>
                </label>
                <input
                  type="email"
                  value={klant.email}
                  onChange={(e) =>
                    setKlant((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="uw@email.nl"
                  className="w-full border px-4 py-3 text-base focus:outline-none"
                  style={{ borderColor: "var(--sand)" }}
                />
                <label className="flex items-start gap-2.5 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={klant.nieuwsbrief}
                    onChange={(e) =>
                      setKlant((p) => ({ ...p, nieuwsbrief: e.target.checked }))
                    }
                    className="mt-1"
                  />
                  <span className="text-sm leading-snug" style={{ color: "var(--charcoal)", opacity: 0.75 }}>
                    Houd mij per e-mail op de hoogte van weekaanbiedingen en wat
                    er vers binnen is. Geen spam, wel vis — u kunt zich altijd
                    afmelden.
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-base font-medium mb-2" style={{ color: "var(--charcoal)" }}>
                  Wanneer wilt u ophalen?{" "}
                  <span style={{ color: "var(--salmon)" }}>*</span>
                </label>
                <select
                  required
                  value={klant.ophaaldag}
                  onChange={(e) =>
                    setKlant((p) => ({ ...p, ophaaldag: e.target.value }))
                  }
                  className="w-full border px-4 py-3 text-base bg-white focus:outline-none"
                  style={{ borderColor: "var(--sand)" }}
                >
                  <option value="">— Kies een dag —</option>
                  {AFHAALDAGEN.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-base font-medium mb-2" style={{ color: "var(--charcoal)" }}>
                  Bijzonderheden of eigen wensen
                </label>
                <textarea
                  rows={4}
                  value={klant.opmerking}
                  onChange={(e) =>
                    setKlant((p) => ({ ...p, opmerking: e.target.value }))
                  }
                  placeholder="Staat uw vis er niet bij? Typ het hier gewoon in. Bijv: 500g verse forel, schoongemaakt, zonder kop. Of: vaste wekelijkse bestelling kibbeling elke zaterdag."
                  className="w-full border px-4 py-3 text-base resize-none focus:outline-none"
                  style={{ borderColor: "var(--sand)" }}
                />
              </div>
            </div>

            <p
              className="text-sm mt-4 mb-6 leading-relaxed"
              style={{ color: "var(--charcoal)", opacity: 0.45 }}
            >
              Wij bellen u terug voor prijs en bevestiging &mdash; geen aanbetaling vereist.
              Betaling bij afhalen, contant of pin.
            </p>

            <button
              type="submit"
              disabled={
                status === "sending" ||
                (!bestellingIngevuld && !klant.opmerking.trim())
              }
              className="w-full py-5 text-base font-medium tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: "var(--navy)" }}
            >
              {status === "sending"
                ? "Bezig met versturen..."
                : "Bestelling aanvragen →"}
            </button>

            {status === "error" && (
              <div
                className="mt-4 p-4 text-center border"
                style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}
              >
                <p className="text-sm mb-2" style={{ color: "#b91c1c" }}>
                  Er ging iets mis. Bel ons direct:
                </p>
                <a
                  href="tel:+31715149802"
                  className="font-bold text-lg underline"
                  style={{ color: "#b91c1c" }}
                >
                  071 514 9802
                </a>
              </div>
            )}
          </div>

          <div className="text-center pb-4">
            <p className="text-sm" style={{ color: "var(--charcoal)", opacity: 0.5 }}>
              Liever bellen?{" "}
              <a
                href="tel:+31715149802"
                className="font-medium underline"
                style={{ color: "var(--navy)" }}
              >
                071 514 9802
              </a>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
