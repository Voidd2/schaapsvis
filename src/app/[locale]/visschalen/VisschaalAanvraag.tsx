"use client";

import { useState } from "react";
import { PhotoPlaceholder } from "@/components/shared/PhotoPlaceholder";

const WA_NUMMER = "31715149802";

// WhatsApp is het snelste kanaal voor een visschaal: elke schaal is maatwerk,
// dus de klant appt wat hij wil en wij laten een prijs op maat weten.
function waLink(schaal?: string) {
  const lines = ["Hallo Schaap's Vishandel! Ik wil graag een visschaal aanvragen."];
  if (schaal) lines.push(`Voorbeeld dat me aanspreekt: ${schaal}`);
  lines.push(
    "",
    "• Gelegenheid:",
    "• Aantal personen:",
    "• Gewenste datum:",
    "• Wensen (bijv. extra Hollandse garnalen):",
    "",
    "Kunnen jullie mij een prijs op maat laten weten?"
  );
  return `https://wa.me/${WA_NUMMER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// TODO(eigenaar): zelfde Formspree-ID als het bestelformulier mag ook.
const OFFERTE_ENDPOINT = "https://formspree.io/f/JOUW_FORMSPREE_ID";

type FormState = "idle" | "sending" | "success" | "error";

// Voorbeeldschalen ter inspiratie. Geen vaste prijs — alles is maatwerk.
// EIGENAAR: vul `foto` (pad in /public/images/...) aan zodra je foto's hebt.
type Schaal = {
  id: string;
  naam: string;
  serves: string;
  desc: string;
  gelegenheden: string[];
  foto?: string;
};

const SCHALEN: Schaal[] = [
  {
    id: "borrelplank",
    naam: "Borrelplank",
    serves: "4–8 personen",
    desc: "Gerookte zalm, makreel, garnalen, haring en Hollandse hapjes. De klassieker voor een gezellige borrel.",
    gelegenheden: ["Borrel", "Verjaardag"],
    foto: "/images/scene-gerookt.svg", // EIGENAAR: vervang door echte foto
  },
  {
    id: "feestschotel",
    naam: "Feestelijke visschotel",
    serves: "6–12 personen",
    desc: "Een royale selectie verse én gerookte vis, schaal- en schelpdieren, salades en garnering.",
    gelegenheden: ["Verjaardag", "Bruiloft", "Zakelijk"],
    foto: "/images/scene-schaaldier.svg", // EIGENAAR: vervang door echte foto
  },
  {
    id: "zeevruchten",
    naam: "Luxe zeevruchtenschaal",
    serves: "op maat",
    desc: "Oesters, coquilles, gamba's, langoustines, krab en kreeft — een plateau fruits de mer op zijn Hollands.",
    gelegenheden: ["Bruiloft", "Zakelijk", "Kerst"],
    foto: "/images/scene-schaaldier.svg", // EIGENAAR: vervang door echte foto
  },
  {
    id: "kerstschaal",
    naam: "Kerstschaal",
    serves: "op maat",
    desc: "Feestelijke schaal voor de kerstdagen — gerookte zalm, garnalen, zeevruchten en meer, mooi opgemaakt.",
    gelegenheden: ["Kerst", "Oud & Nieuw"],
    foto: "/images/scene-zalm.svg", // EIGENAAR: vervang door echte foto
  },
  {
    id: "haringschaal",
    naam: "Hollandse haring- & hapjesschaal",
    serves: "4–10 personen",
    desc: "Hollandse Nieuwe, haringhapjes, kibbeling en garnituur — echt Hollands genieten.",
    gelegenheden: ["Borrel", "Zakelijk"],
    foto: "/images/scene-haring.svg", // EIGENAAR: vervang door echte foto
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

  return (
    <>
      {/* Voorbeeldschalen + filter */}
      <section id="voorbeelden" className="py-16 px-6" style={{ backgroundColor: "var(--cream)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Onze schalen — ter inspiratie
          </h2>
          <p className="text-center text-sm mb-8 max-w-xl mx-auto opacity-70" style={{ color: "var(--charcoal)" }}>
            Voorbeelden van schalen die we maken. We werken niet met vaste prijzen: elke schaal is
            maatwerk. De prijs hangt af van de grootte, het aantal schalen en uw wensen — wilt u
            bijvoorbeeld extra Hollandse garnalen, dan verwerken we dat in de prijs. Stuur ons een
            appje met wat u zoekt en we laten u snel een prijs op maat weten.
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
                  <a
                    href={waLink(s.naam)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <WaIcon /> Aanvragen via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aanvragen — WhatsApp voorop, formulier als alternatief */}
      <section id="offerte" className="py-16 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: "Playfair Display, serif" }}>
            Vraag uw visschaal aan
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(246,250,253,0.8)" }}>
            Een appje werkt het snelst. Vertel ons de gelegenheid, het aantal personen en uw wensen —
            wij laten u een prijs op maat weten. Vrijblijvend, zonder verplichtingen.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <WaIcon /> Aanvragen via WhatsApp
            </a>
            <a
              href="tel:+31715149802"
              className="inline-block px-8 py-4 text-base font-medium border transition-opacity hover:opacity-80"
              style={{ borderColor: "rgba(246,250,253,0.4)", color: "var(--cream)" }}
            >
              Of bel 071 514 9802
            </a>
          </div>

          {/* Alternatief: formulier voor wie liever niet appt */}
          {status === "success" ? (
            <div className="mt-8 bg-white p-8" style={{ borderRadius: "4px" }}>
              <p className="text-lg font-bold mb-2" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
                Bedankt, {form.naam.split(" ")[0]}!
              </p>
              <p className="text-sm" style={{ color: "var(--charcoal)", opacity: 0.75 }}>
                We hebben uw aanvraag ontvangen en nemen zo snel mogelijk contact met u op met een
                prijs op maat.
              </p>
            </div>
          ) : (
            <details className="mt-10 text-left group">
              <summary
                className="cursor-pointer select-none text-sm font-semibold text-center"
                style={{ listStyle: "none", color: "rgba(246,250,253,0.85)" }}
              >
                <span className="underline underline-offset-4">Liever niet via WhatsApp? Laat uw gegevens achter &darr;</span>
              </summary>

              <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 md:p-8 space-y-5 text-left" style={{ borderRadius: "4px" }}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Veld label="Naam" verplicht>
                    <input type="text" required value={form.naam} onChange={(e) => set("naam", e.target.value)} placeholder="Voor- en achternaam" className="sv-input" />
                  </Veld>
                  <Veld label="Telefoonnummer" verplicht>
                    <input type="tel" required value={form.telefoon} onChange={(e) => set("telefoon", e.target.value)} placeholder="06 12 34 56 78" className="sv-input" />
                  </Veld>
                </div>

                <Veld label="E-mailadres" hint="(optioneel)">
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
                  <Veld label="Als basis (optioneel)">
                    <select value={form.basis} onChange={(e) => set("basis", e.target.value)} className="sv-input bg-white">
                      <option value="">Helemaal op maat</option>
                      {SCHALEN.map((s) => (
                        <option key={s.id} value={s.naam}>{s.naam}</option>
                      ))}
                    </select>
                  </Veld>
                </div>

                <Veld label="Wat wilt u op de schaal?" verplicht>
                  <textarea
                    required
                    rows={4}
                    value={form.wensen}
                    onChange={(e) => set("wensen", e.target.value)}
                    placeholder="Beschrijf in uw eigen woorden wat u zoekt. Bijv: veel gerookte zalm en extra Hollandse garnalen, weinig rauwe vis, voor een verjaardag van 12 personen."
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
                  {status === "sending" ? "Bezig met versturen…" : "Aanvraag versturen →"}
                </button>

                {status === "error" && (
                  <div className="p-4 text-center border" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}>
                    <p className="text-sm mb-2" style={{ color: "#b91c1c" }}>Er ging iets mis. App of bel ons gerust direct:</p>
                    <a href="tel:+31715149802" className="font-bold text-lg underline" style={{ color: "#b91c1c" }}>071 514 9802</a>
                  </div>
                )}

                <p className="text-xs text-center opacity-50" style={{ color: "var(--charcoal)" }}>
                  U ontvangt een prijs op maat. Geen online betaling — afrekenen bij het ophalen.
                </p>
              </form>
            </details>
          )}
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

function WaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.132.558 4.13 1.532 5.864L.057 23.885l6.186-1.443A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.955 0-3.78-.554-5.33-1.511l-.383-.226-3.676.858.87-3.582-.249-.396A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
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
