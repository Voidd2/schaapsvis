"use client";

import { useState, useEffect } from "react";
import { PRODUCTEN, type Product } from "@/lib/products";

// Stel in via formspree.io — maak gratis account, nieuw formulier, kopieer het ID hier:
// ← AANPASSEN: vervang door jouw Formspree formulier-ID
const FORMSPREE_ENDPOINT = "https://formspree.io/f/JOUW_FORMSPREE_ID";

type FormState = "idle" | "sending" | "success" | "error";
type OrderItem = { productId: string; hoeveelheid: string };

const CATEGORIE_LABELS: Record<string, string> = {
  gebakken: "Gebakken vis",
  rauw: "Verse & gerookte vis",
  premium: "Varlaks Zalm (biologisch)",
  soepen: "Soepen & potjes",
  salades: "Vissalades",
  schotels: "Visschotels (op bestelling)",
};

const AFHAALDAGEN = [
  "Maandag — winkel Herenstraat",
  "Dinsdag — winkel Herenstraat",
  "Woensdag — winkel Herenstraat of markt Leiden",
  "Donderdag — winkel Herenstraat",
  "Vrijdag — winkel Herenstraat of Hoogvliet Voorschoten",
  "Zaterdag — winkel Herenstraat of markt Leiden",
] as const;

export function BestellenForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [producten, setProducten] = useState<Product[]>([]);
  const [bestelling, setBestelling] = useState<OrderItem[]>([]);
  const [klant, setKlant] = useState({ naam: "", telefoon: "", ophaaldag: "", opmerking: "" });

  useEffect(() => {
    const opgeslagen = localStorage.getItem("schaapsvis_producten");
    setProducten(opgeslagen ? JSON.parse(opgeslagen) : PRODUCTEN);
  }, []);

  const beschikbaar = producten.filter((p) => p.beschikbaar);
  const categorieen = [...new Set(beschikbaar.map((p) => p.categorie))];

  const updateBestelling = (productId: string, hoeveelheid: string) => {
    setBestelling((prev) => {
      if (!hoeveelheid.trim()) return prev.filter((i) => i.productId !== productId);
      const bestaand = prev.find((i) => i.productId === productId);
      if (bestaand) return prev.map((i) => i.productId === productId ? { ...i, hoeveelheid } : i);
      return [...prev, { productId, hoeveelheid }];
    });
  };

  const getHoeveelheid = (productId: string) =>
    bestelling.find((i) => i.productId === productId)?.hoeveelheid ?? "";

  const bestellingLeeg = bestelling.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bestellingLeeg) return;
    setStatus("sending");

    const bestellingTekst = bestelling
      .map((item) => {
        const p = producten.find((p) => p.id === item.productId);
        return `• ${p?.naam}: ${item.hoeveelheid} (${p?.eenheid})`;
      })
      .join("\n");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam: klant.naam,
          telefoon: klant.telefoon,
          ophaaldag: klant.ophaaldag,
          bestelling: bestellingTekst,
          opmerking: klant.opmerking,
          _subject: `Nieuwe bestelling van ${klant.naam} — afhalen ${klant.ophaaldag}`,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

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
            Bestelling ontvangen!
          </h1>
          <p className="leading-relaxed text-lg mb-8" style={{ color: "var(--charcoal)", opacity: 0.65 }}>
            We bellen u zo snel mogelijk terug op <strong>{klant.telefoon}</strong> om uw bestelling te bevestigen.
          </p>
          <div className="pt-6 border-t" style={{ borderColor: "var(--sand)" }}>
            <p className="text-sm mb-2" style={{ color: "var(--charcoal)", opacity: 0.5 }}>
              Vragen? Bel ons direct:
            </p>
            <a href="tel:0715149802" className="text-xl font-bold underline" style={{ color: "var(--salmon)" }}>
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
        <p className="max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: "rgba(247,240,227,0.75)" }}>
          Bestel uw vis vooraf &mdash; wij kopen het speciaal voor u in en het ligt klaar bij afhalen.
          Handig voor grote bestellingen of als u zeker wilt zijn van uw favoriete product.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-10">
        {/* Stappenplan */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            ["1", "Vul het formulier in", "Kies uw producten en gewenste ophaaldag"],
            ["2", "Wij bellen u terug", "Voor bevestiging en de exacte prijs"],
            ["3", "Ophalen & betalen", "In de winkel of op de markt — contant of pin"],
          ].map(([num, title, desc]) => (
            <div key={num} className="bg-white border p-6" style={{ borderColor: "var(--sand)" }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white mb-3"
                style={{ backgroundColor: "var(--navy)" }}
              >
                {num}
              </div>
              <p className="font-semibold text-lg mb-1" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
                {title}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.6 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Producten per categorie */}
          <div className="bg-white border p-6 md:p-8" style={{ borderColor: "var(--sand)" }}>
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
            >
              Wat wilt u bestellen?
            </h2>

            {categorieen.map((cat) => (
              <div key={cat} className="mb-8 last:mb-0">
                <h3
                  className="text-xs uppercase tracking-widest mb-3 pb-2 border-b"
                  style={{ color: "var(--charcoal)", opacity: 0.4, borderColor: "var(--sand)" }}
                >
                  {CATEGORIE_LABELS[cat] ?? cat}
                </h3>
                <div className="space-y-3">
                  {beschikbaar
                    .filter((p) => p.categorie === cat)
                    .map((product) => (
                      <div key={product.id} className="flex items-center justify-between gap-4 py-2">
                        <div className="flex-1">
                          <p className="font-medium text-base" style={{ color: "var(--navy)" }}>
                            {product.naam}
                          </p>
                          <p className="text-sm" style={{ color: "var(--charcoal)", opacity: 0.5 }}>
                            {product.beschrijving} &middot; {product.eenheid}
                          </p>
                          {product.opmerking && (
                            <p className="text-xs mt-0.5" style={{ color: "var(--salmon)" }}>
                              {product.opmerking}
                            </p>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Aantal"
                          value={getHoeveelheid(product.id)}
                          onChange={(e) => updateBestelling(product.id, e.target.value)}
                          className="w-28 border px-3 py-2 text-sm text-center focus:outline-none"
                          style={{ borderColor: "var(--sand)" }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}

            {bestellingLeeg && (
              <p className="text-center text-sm pt-4 border-t" style={{ color: "var(--charcoal)", opacity: 0.4, borderColor: "var(--sand)" }}>
                Vul hierboven een aantal in bij de producten die u wilt bestellen
              </p>
            )}
          </div>

          {/* Samenvatting */}
          {!bestellingLeeg && (
            <div
              className="border p-6"
              style={{ backgroundColor: "rgba(28,53,87,0.05)", borderColor: "rgba(28,53,87,0.2)" }}
            >
              <h3 className="font-semibold mb-3" style={{ color: "var(--navy)" }}>
                Uw bestelling:
              </h3>
              {bestelling.map((item) => {
                const product = producten.find((p) => p.id === item.productId);
                return (
                  <div key={item.productId} className="flex justify-between text-sm py-1">
                    <span style={{ color: "var(--charcoal)" }}>{product?.naam}</span>
                    <span style={{ color: "var(--charcoal)", opacity: 0.6 }}>
                      {item.hoeveelheid} {product?.eenheid}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Klantgegevens */}
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
                  onChange={(e) => setKlant((prev) => ({ ...prev, naam: e.target.value }))}
                  placeholder="Voor- en achternaam"
                  className="w-full border px-4 py-3 text-lg focus:outline-none"
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
                  onChange={(e) => setKlant((prev) => ({ ...prev, telefoon: e.target.value }))}
                  placeholder="06 12 34 56 78"
                  className="w-full border px-4 py-3 text-lg focus:outline-none"
                  style={{ borderColor: "var(--sand)" }}
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-2" style={{ color: "var(--charcoal)" }}>
                  Wanneer wilt u ophalen? <span style={{ color: "var(--salmon)" }}>*</span>
                </label>
                <select
                  required
                  value={klant.ophaaldag}
                  onChange={(e) => setKlant((prev) => ({ ...prev, ophaaldag: e.target.value }))}
                  className="w-full border px-4 py-3 text-lg bg-white focus:outline-none"
                  style={{ borderColor: "var(--sand)" }}
                >
                  <option value="">— Kies een dag —</option>
                  {AFHAALDAGEN.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-base font-medium mb-2" style={{ color: "var(--charcoal)" }}>
                  Bijzonderheden (optioneel)
                </label>
                <textarea
                  rows={3}
                  value={klant.opmerking}
                  onChange={(e) => setKlant((prev) => ({ ...prev, opmerking: e.target.value }))}
                  placeholder="Bijv. schoongemaakt aanleveren, vaste wekelijkse bestelling, specifiek tijdstip..."
                  className="w-full border px-4 py-3 text-base resize-none focus:outline-none"
                  style={{ borderColor: "var(--sand)" }}
                />
              </div>
            </div>

            <p className="text-sm mt-5 leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.4 }}>
              Wij bellen u terug voor bevestiging en prijs. Betaling bij afhalen &mdash; geen vooruitbetaling.
            </p>

            <button
              type="submit"
              disabled={status === "sending" || bestellingLeeg}
              className="w-full py-5 text-lg font-medium tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-40 mt-6"
              style={{ backgroundColor: "var(--navy)" }}
            >
              {status === "sending" ? "Bezig met versturen..." : "Bestelling doorsturen →"}
            </button>

            {status === "error" && (
              <div
                className="mt-4 p-4 text-center border"
                style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}
              >
                <p className="text-sm mb-2" style={{ color: "#b91c1c" }}>
                  Er ging iets mis. Bel ons direct:
                </p>
                <a href="tel:0715149802" className="font-bold text-lg underline" style={{ color: "#b91c1c" }}>
                  071 514 9802
                </a>
              </div>
            )}
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: "var(--charcoal)", opacity: 0.55 }}>
            Liever telefonisch bestellen?{" "}
            <a href="tel:0715149802" className="font-medium underline" style={{ color: "var(--navy)" }}>
              071 514 9802
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
