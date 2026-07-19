"use client";

import { useState } from "react";
import { PhotoPlaceholder } from "@/components/shared/PhotoPlaceholder";

// TODO(eigenaar): zelfde Formspree-ID als het bestelformulier mag, of maak een
// apart formulier aan voor offerte-aanvragen zodat ze in een aparte map komen.
const OFFERTE_ENDPOINT = "https://formspree.io/f/JOUW_FORMSPREE_ID";

type FormState = "idle" | "sending" | "success" | "error";

// Voorbeeldschalen. EIGENAAR: vul `foto` (pad in /public/images/...) en `prijs`
// aan zodra je foto's/prijzen hebt. Leeg = toont nette placeholder + "op aanvraag".
type Schaal = {
  id: string;
  naam: string;
  serves: string;
  desc: string;
  gelegenheden: string[];
  foto?: string;
  prijs?: string; // bv. "vanaf € 39,95" — leeg = "prijs op aanvraag"
};

const SCHALEN: Schaal[] = [
  {
    id: "borrelplank",
    naam: "Borrelplank",
    serves: "4–8 personen",
    desc: "Gerookte zalm, makreel, garnalen, haring en Hollandse hapjes. De klassieker voor een gezellige borrel.",
    gelegenheden: ["Borrel", "Verjaardag"],
  },
  {
    id: "feestschotel",
    naam: "Feestelijke visschotel",
    serves: "6–12 personen",
    desc: "Een royale selectie verse én gerookte vis, schaal- en schelpdieren, salades en garnering.",
    gelegenheden: ["Verjaardag", "Bruiloft", "Zakelijk"],
  },
  {
    id: "zeevruchten",
    naam: "Luxe zeevruchtenschaal",
    serves: "op maat",
    desc: "Oesters, coquilles, gamba's, langoustines, krab en kreeft — een plateau fruits de mer op zijn Hollands.",
    gelegenheden: ["Bruiloft", "Zakelijk", "Kerst"],
  },
  {
    id: "kerstschaal",
    naam: "Kerstschaal",
    serves: "op maat",
    desc: "Feestelijke schaal voor de kerstdagen — gerookte zalm, garnalen, zeevruchten en meer, mooi opgemaakt.",
    gelegenheden: ["Kerst", "Oud & Nieuw"],
  },
  {
    id: "haringschaal",
    naam: "Hollandse haring- & hapjesschaal",
    serves: "4–10 personen",
    desc: "Hollandse Nieuwe, haringhapjes, kibbeling en garnituur — echt Hollands genieten.",
    gelegenheden: ["Borrel", "Zakelijk"],
  },
];

const FILTERS = ["Alle", "Borrel", "Verjaardag", "Kerst", "Oud & Nieuw", "Bruiloft", "Zakelijk"];
const GELEGENHEDEN = ["Borrel", "Verjaardag", "Kerst", "Oud & Nieuw", "Bruiloft / receptie", "Zakelijk / kantoor", "Anders"];

const leeg = {
  naam: "",
  telefoon: "",
  email: "",
  gelegenheid: "",
  datum: "",
  personen: "",
  budget: "",
  basis: "",
  wensen: "",
  allergie: "",
};

export function VisschaalAanvraag() {
  const [filter, setFilter] = useState("Alle");
  const [form, setForm] = useState(leeg);
  const [status, setStatus] = useState<FormState>("idle");

  const zichtbaar =
    filter === "Alle" ? SCHALEN : SCHALEN.filter((s) => s.gelegenheden.includes(filter));

  function kiesSchaal(s: Schaal) {
    setForm((f) => ({
      ...f,
      basis: s.naam,
      gelegenheid: f.gelegenheid || s.gelegenheden[0] || "",
    }));
    document.getElementById("offerte")?.scrollIntoView({ behavior: "smooth" });
  }

  function set<K extends keyof typeof leeg>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.naam.trim() || !form.telefoon.trim() || !form.wensen.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch(OFFERTE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "OFFERTE-AANVRAAG VISSCHAAL",
          naam: form.naam,
          telefoon: form.telefoon,
          email: form.email || "(niet opgegeven)",
          gelegenheid: form.gelegenheid || "(niet opgegeven)",
          gewenste_datum: form.datum || "(niet opgegeven)",
          aantal_personen: form.personen || "(niet opgegeven)",
          budget_indicatie: form.budget || "(niet opgegeven)",
          basis_schaal: form.basis || "op maat",
          wensen: form.wensen,
          allergieen: form.allergie || "(geen doorgegeven)",
          _subject: `Offerte-aanvraag visschaal — ${form.naam}`,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="offerte" className="py-16 px-6" style={{ backgroundColor: "var(--cream)" }}>
        <div className="max-w-md mx-auto text-center bg-white p-10 border" style={{ borderColor: "var(--sand)" }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "var(--seafoam)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Aanvraag ontvangen!
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--charcoal)", opacity: 0.75 }}>
            Bedankt, {form.naam.split(" ")[0]}. We stellen een voorstel samen en nemen zo snel mogelijk
            contact met u op — met een offerte op maat, zonder verplichtingen.
          </p>
          <a href="tel:+31715149802" className="text-lg font-bold underline" style={{ color: "var(--salmon)" }}>
            071 514 9802
          </a>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Voorbeeldschalen + filter */}
      <section id="voorbeelden" className="py-16 px-6" style={{ backgroundColor: "var(--cream)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Onze schalen — ter inspiratie
          </h2>
          <p className="text-center text-sm mb-8 max-w-xl mx-auto opacity-70" style={{ color: "var(--charcoal)" }}>
            Dit zijn voorbeelden van schalen die we maken. Elke schaal stellen we op maat samen —
            vertel ons uw wensen en u ontvangt een offerte. Wilt u een specifiek aantal van iets?
            Dan kan de prijs afwijken; daarom werken we met een offerte.
          </p>

          {/* Filter op gelegenheid */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {FILTERS.map((f) => {
              const actief = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className="text-xs px-3 py-1.5 border transition-colors"
                  style={{
                    borderColor: actief ? "var(--navy)" : "var(--sand)",
                    backgroundColor: actief ? "var(--navy)" : "white",
                    color: actief ? "white" : "var(--charcoal)",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {zichtbaar.map((s) => (
              <div key={s.id} className="bg-white flex flex-col overflow-hidden shadow-sm">
                {s.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.foto} alt={`${s.naam} — Schaap's Vishandel Leiden`} className="w-full aspect-[4/3] object-cover" />
                ) : (
                  <PhotoPlaceholder label={s.naam} />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>
                    {s.serves}
                  </p>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
                    {s.naam}
                  </h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--charcoal)", opacity: 0.75 }}>
                    {s.desc}
                  </p>
                  <p className="text-sm font-semibold mt-3" style={{ color: "var(--navy)" }}>
                    {s.prijs ? s.prijs : "Prijs op aanvraag"}
                  </p>
                  <button
                    type="button"
                    onClick={() => kiesSchaal(s)}
                    className="mt-3 text-sm font-semibold underline underline-offset-2 text-left"
                    style={{ color: "var(--salmon)" }}
                  >
                    Deze als basis aanvragen &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offerte-aanvraagformulier — bewust anders dan 'bestellen' */}
      <section id="offerte" className="py-16 px-6" style={{ backgroundColor: "var(--sand)" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Vraag een offerte aan
          </h2>
          <p className="text-center text-sm mb-8 opacity-75" style={{ color: "var(--charcoal)" }}>
            Vertel ons in uw eigen woorden wat u zoekt. Wij stellen een voorstel samen en sturen u
            een offerte op maat — vrijblijvend, geen aanbetaling.
          </p>

          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 border space-y-5" style={{ borderColor: "var(--sand)" }}>
            <div className="grid sm:grid-cols-2 gap-5">
              <Veld label="Naam" verplicht>
                <input type="text" required value={form.naam} onChange={(e) => set("naam", e.target.value)} placeholder="Voor- en achternaam" className="sv-input" />
              </Veld>
              <Veld label="Telefoonnummer" verplicht>
                <input type="tel" required value={form.telefoon} onChange={(e) => set("telefoon", e.target.value)} placeholder="06 12 34 56 78" className="sv-input" />
              </Veld>
            </div>

            <Veld label="E-mailadres" hint="(voor de offerte)">
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="uw@email.nl" className="sv-input" />
            </Veld>

            <div className="grid sm:grid-cols-2 gap-5">
              <Veld label="Gelegenheid">
                <select value={form.gelegenheid} onChange={(e) => set("gelegenheid", e.target.value)} className="sv-input bg-white">
                  <option value="">— Kies —</option>
                  {GELEGENHEDEN.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </Veld>
              <Veld label="Gewenste datum">
                <input type="date" value={form.datum} onChange={(e) => set("datum", e.target.value)} className="sv-input" />
              </Veld>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Veld label="Aantal personen">
                <input type="text" inputMode="numeric" value={form.personen} onChange={(e) => set("personen", e.target.value)} placeholder="bijv. 10" className="sv-input" />
              </Veld>
              <Veld label="Budget (indicatie)" hint="(optioneel)">
                <input type="text" value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="bijv. € 15 p.p." className="sv-input" />
              </Veld>
            </div>

            <Veld label="Als basis (optioneel)">
              <select value={form.basis} onChange={(e) => set("basis", e.target.value)} className="sv-input bg-white">
                <option value="">Geen voorkeur / helemaal op maat</option>
                {SCHALEN.map((s) => (
                  <option key={s.id} value={s.naam}>{s.naam}</option>
                ))}
              </select>
            </Veld>

            <Veld label="Wat wilt u op de schaal?" verplicht>
              <textarea
                required
                rows={4}
                value={form.wensen}
                onChange={(e) => set("wensen", e.target.value)}
                placeholder="Beschrijf in uw eigen woorden wat u zoekt. Bijv: veel gerookte zalm en garnalen, weinig rauwe vis, mooi opgemaakt voor een verjaardag van 12 personen."
                className="sv-input resize-none"
              />
            </Veld>

            <Veld label="Allergieën of dieetwensen" hint="(belangrijk voor ons)">
              <textarea
                rows={2}
                value={form.allergie}
                onChange={(e) => set("allergie", e.target.value)}
                placeholder="Bijv: iemand is allergisch voor schaaldieren, of graag een deel zonder rauwe vis."
                className="sv-input resize-none"
              />
            </Veld>

            <button
              type="submit"
              disabled={status === "sending" || !form.naam.trim() || !form.telefoon.trim() || !form.wensen.trim()}
              className="w-full py-4 text-base font-medium tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: "var(--salmon)" }}
            >
              {status === "sending" ? "Bezig met versturen…" : "Offerte aanvragen →"}
            </button>

            {status === "error" && (
              <div className="p-4 text-center border" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}>
                <p className="text-sm mb-2" style={{ color: "#b91c1c" }}>Er ging iets mis. Bel of app ons gerust direct:</p>
                <a href="tel:+31715149802" className="font-bold text-lg underline" style={{ color: "#b91c1c" }}>071 514 9802</a>
              </div>
            )}

            <p className="text-xs text-center opacity-50" style={{ color: "var(--charcoal)" }}>
              U ontvangt een vrijblijvende offerte. Geen online betaling — afrekenen bij het ophalen.
            </p>
          </form>
        </div>
      </section>

      <style>{`
        .sv-input {
          width: 100%;
          border: 1px solid var(--sand);
          padding: 0.7rem 0.9rem;
          font-size: 0.95rem;
          color: var(--charcoal);
          outline: none;
        }
        .sv-input:focus { border-color: var(--navy); }
      `}</style>
    </>
  );
}

function Veld({
  label,
  hint,
  verplicht,
  children,
}: {
  label: string;
  hint?: string;
  verplicht?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5" style={{ color: "var(--charcoal)" }}>
        {label}
        {verplicht && <span style={{ color: "var(--salmon)" }}> *</span>}
        {hint && <span className="font-normal opacity-50"> {hint}</span>}
      </span>
      {children}
    </label>
  );
}
