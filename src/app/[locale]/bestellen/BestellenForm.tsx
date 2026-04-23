"use client";

import { useState } from "react";

// Stel in via formspree.io — maak gratis account, nieuw formulier, kopieer het ID hier:
// ← AANPASSEN: vervang door jouw Formspree formulier-ID
const FORMSPREE_ENDPOINT = "https://formspree.io/f/JOUW_FORMSPREE_ID";

type FormState = "idle" | "sending" | "success" | "error";

const PRODUCTEN = [
  "Varlaks biologische zalm",
  "Verse haring",
  "Kibbeling",
  "Lekkerbek",
  "Vissoep",
  "Feestelijke visschotel",
  "Broodje vis",
  "Andere vis (omschrijf hieronder)",
] as const;

const AFHAALDAGEN = [
  "Maandag (winkel Herenstraat)",
  "Dinsdag (winkel Herenstraat)",
  "Woensdag (winkel of markt Leiden)",
  "Donderdag (winkel Herenstraat)",
  "Vrijdag (winkel of Hoogvliet Voorschoten)",
  "Zaterdag (winkel of markt Leiden)",
] as const;

export function BestellenForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    naam: "",
    telefoon: "",
    product: "",
    hoeveelheid: "",
    ophaaldag: "",
    opmerking: "",
  });

  const set = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          _subject: `Nieuwe bestelling: ${formData.product} — ${formData.naam}`,
        }),
      });

      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: "var(--cream)" }}
      >
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🐟</div>
          <h1
            className="text-3xl font-bold mb-4"
            style={{
              color: "var(--navy)",
              fontFamily: "Playfair Display, serif",
            }}
          >
            Bestelling ontvangen!
          </h1>
          <p
            className="leading-relaxed"
            style={{ color: "var(--charcoal)", opacity: 0.75 }}
          >
            We nemen zo snel mogelijk telefonisch contact met u op om de
            bestelling te bevestigen en een afhaaltijd af te spreken.
          </p>
          <p className="mt-4 text-sm" style={{ color: "var(--charcoal)", opacity: 0.6 }}>
            Vragen? Bel ons op{" "}
            <a
              href="tel:+31715149802"
              className="underline"
              style={{ color: "var(--salmon)" }}
            >
              071 514 9802
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section
        style={{ backgroundColor: "var(--navy)" }}
        className="py-20 px-6 text-center"
      >
        <p
          className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4"
          style={{ color: "var(--sand)" }}
        >
          Schaap&apos;s Vis · Leiden
        </p>
        <h1
          className="text-5xl md:text-6xl font-bold mb-6"
          style={{
            color: "var(--cream)",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Online Bestellen
        </h1>
        <p
          className="max-w-2xl mx-auto text-lg leading-relaxed"
          style={{ color: "rgba(247,240,227,0.75)" }}
        >
          Bestel vooruit en haal af in de winkel of op de markt. Wij kopen uw
          vis speciaal in — handig voor grote bestellingen of als u zeker wilt
          zijn van uw favoriete vis.
        </p>
      </section>

      <section style={{ backgroundColor: "var(--cream)" }} className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Stappenplan */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              [
                "📋",
                "Bestel online",
                "Vul het formulier in met wat u wilt en wanneer u het wilt ophalen.",
              ],
              [
                "📞",
                "Wij bevestigen",
                "We bellen of appen u terug om de bestelling en prijs te bevestigen.",
              ],
              [
                "🐟",
                "Ophalen",
                "Uw vis ligt klaar in de winkel, op de markt of in Voorschoten.",
              ],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                className="bg-white p-6 border"
                style={{ borderColor: "var(--sand)" }}
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{
                    color: "var(--navy)",
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--charcoal)", opacity: 0.65 }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Formulier */}
          <div
            className="bg-white border p-8 md:p-12"
            style={{ borderColor: "var(--sand)" }}
          >
            <h2
              className="text-3xl font-bold mb-8"
              style={{
                color: "var(--navy)",
                fontFamily: "Playfair Display, serif",
              }}
            >
              Uw bestelling
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Naam + Telefoon */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="naam"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--charcoal)" }}
                  >
                    Naam <span style={{ color: "var(--salmon)" }}>*</span>
                  </label>
                  <input
                    id="naam"
                    type="text"
                    required
                    value={formData.naam}
                    onChange={set("naam")}
                    placeholder="Voor- en achternaam"
                    className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: "var(--sand)" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="telefoon"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--charcoal)" }}
                  >
                    Telefoonnummer{" "}
                    <span style={{ color: "var(--salmon)" }}>*</span>
                  </label>
                  <input
                    id="telefoon"
                    type="tel"
                    required
                    value={formData.telefoon}
                    onChange={set("telefoon")}
                    placeholder="06 — — — —"
                    className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: "var(--sand)" }}
                  />
                </div>
              </div>

              {/* Product */}
              <div>
                <label
                  htmlFor="product"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--charcoal)" }}
                >
                  Wat wilt u bestellen?{" "}
                  <span style={{ color: "var(--salmon)" }}>*</span>
                </label>
                <select
                  id="product"
                  required
                  value={formData.product}
                  onChange={set("product")}
                  className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors bg-white appearance-none"
                  style={{ borderColor: "var(--sand)" }}
                >
                  <option value="">— Kies een product —</option>
                  {PRODUCTEN.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hoeveelheid */}
              <div>
                <label
                  htmlFor="hoeveelheid"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--charcoal)" }}
                >
                  Hoeveel personen / gram / stuks?
                </label>
                <input
                  id="hoeveelheid"
                  type="text"
                  value={formData.hoeveelheid}
                  onChange={set("hoeveelheid")}
                  placeholder="Bijv. 500 gram, 4 personen, 2 stuks..."
                  className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors"
                  style={{ borderColor: "var(--sand)" }}
                />
              </div>

              {/* Ophaaldag */}
              <div>
                <label
                  htmlFor="ophaaldag"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--charcoal)" }}
                >
                  Wanneer wilt u ophalen?{" "}
                  <span style={{ color: "var(--salmon)" }}>*</span>
                </label>
                <select
                  id="ophaaldag"
                  required
                  value={formData.ophaaldag}
                  onChange={set("ophaaldag")}
                  className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors bg-white appearance-none"
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

              {/* Opmerking */}
              <div>
                <label
                  htmlFor="opmerking"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--charcoal)" }}
                >
                  Bijzonderheden of wensen
                </label>
                <textarea
                  id="opmerking"
                  rows={4}
                  value={formData.opmerking}
                  onChange={set("opmerking")}
                  placeholder="Bijv. schoongemaakt, zonder graat, specifiek tijdstip ophalen, vaste wekelijkse bestelling..."
                  className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
                  style={{ borderColor: "var(--sand)" }}
                />
              </div>

              {/* Disclaimer */}
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--charcoal)", opacity: 0.5 }}
              >
                Na uw bestelling nemen wij telefonisch contact op voor
                bevestiging en prijs. Betaling vindt plaats bij afhalen. Er
                zijn geen verzendkosten — uitsluitend afhalen.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-4 font-medium tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--navy)" }}
              >
                {status === "sending"
                  ? "Versturen..."
                  : "Bestelling versturen →"}
              </button>

              {status === "error" && (
                <p className="text-red-600 text-sm text-center">
                  Er ging iets mis. Bel ons op{" "}
                  <a href="tel:+31715149802" className="underline">
                    071 514 9802
                  </a>
                  .
                </p>
              )}
            </form>
          </div>

          {/* Alternatief: telefonisch */}
          <div className="mt-8 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--charcoal)", opacity: 0.55 }}
            >
              Liever telefonisch bestellen?{" "}
              <a
                href="tel:+31715149802"
                className="font-medium underline"
                style={{ color: "var(--navy)" }}
              >
                071 514 9802
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
