"use client";

import { useState, useEffect, useCallback } from "react";
import type { KortingsCampagne } from "@/lib/kortingsbonnen";

type Status = "laden" | "idle" | "actief" | "verlopen" | "ongeldig";

export function Kortingsbon({ code, bon }: { code: string; bon: KortingsCampagne }) {
  const key = `svbon_${bon.id}_${code}`;
  const totaalMs = bon.geldigheidMinuten * 60 * 1000;
  const [status, setStatus] = useState<Status>("laden");
  const [resterend, setResterend] = useState(totaalMs);

  const leesResterend = useCallback(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (!raw) return null;
    return totaalMs - (Date.now() - parseInt(raw, 10));
  }, [key, totaalMs]);

  // Init
  useEffect(() => {
    if (!code || code.length < 3) return setStatus("ongeldig");
    if (!bon.actief) return setStatus("verlopen");
    const rem = leesResterend();
    if (rem === null) setStatus("idle");
    else if (rem > 0) { setResterend(rem); setStatus("actief"); }
    else setStatus("verlopen");
  }, [code, bon.actief, leesResterend]);

  // Aftellen
  useEffect(() => {
    if (status !== "actief") return;
    const iv = setInterval(() => {
      const rem = leesResterend();
      if (rem === null || rem <= 0) { setResterend(0); setStatus("verlopen"); }
      else setResterend(rem);
    }, 500);
    return () => clearInterval(iv);
  }, [status, leesResterend]);

  function activeren() {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, String(Date.now()));
    setResterend(totaalMs);
    setStatus("actief");
  }

  const mm = Math.floor(resterend / 60000);
  const ss = Math.floor((resterend % 60000) / 1000);
  const tijd = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}
    >
      <div className="w-full max-w-md text-center">
        <p className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: "var(--sand)", opacity: 0.8 }}>
          Schaap&apos;s Vishandel · Leiden
        </p>

        {status === "laden" && (
          <p className="opacity-60">Bon laden…</p>
        )}

        {status === "ongeldig" && (
          <div className="bg-white p-8" style={{ color: "var(--charcoal)" }}>
            <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
              Ongeldige bon
            </h1>
            <p className="text-sm opacity-70">Deze kortingslink is niet (meer) geldig. Volg onze nieuwsbrief voor nieuwe acties.</p>
          </div>
        )}

        {status === "verlopen" && (
          <div className="bg-white p-8" style={{ color: "var(--charcoal)" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(192,57,43,0.12)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
              Bon verlopen
            </h1>
            <p className="text-sm opacity-70">Deze kortingsbon is gebruikt of de 10 minuten zijn voorbij. Elke bon is eenmalig geldig.</p>
          </div>
        )}

        {status === "idle" && (
          <div className="bg-white p-8" style={{ color: "var(--charcoal)" }}>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4" style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}>
              Kortingsbon
            </div>
            <h1 className="text-3xl font-bold mb-3 leading-tight" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
              {bon.titel}
            </h1>
            <p className="text-sm leading-relaxed mb-6 opacity-80">{bon.tekst}</p>

            <div className="p-4 mb-6 text-left" style={{ backgroundColor: "rgba(184,131,46,0.1)", borderLeft: "4px solid var(--gold)" }}>
              <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)" }}>
                <strong>Let op:</strong> zodra u op <strong>Gebruiken</strong> klikt, is de bon nog{" "}
                <strong>{bon.geldigheidMinuten} minuten</strong> geldig en daarna verlopen. Klik dus pas
                als u <strong>aan de kassa</strong> staat.
              </p>
            </div>

            <button
              onClick={activeren}
              className="w-full py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--salmon)" }}
            >
              Gebruiken →
            </button>
            {bon.voorwaarde && (
              <p className="text-xs mt-4 opacity-45 leading-relaxed">{bon.voorwaarde}</p>
            )}
          </div>
        )}

        {status === "actief" && (
          <div className="bg-white p-8" style={{ color: "var(--charcoal)" }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-block w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--seafoam)" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--seafoam)" }}>Nu geldig</span>
            </div>
            <h1 className="text-2xl font-bold mb-1 leading-tight" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
              {bon.titel}
            </h1>
            <p className="text-sm mb-6 opacity-70">Toon dit scherm aan de medewerker</p>

            <div
              className="py-6 mb-4"
              style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}
            >
              <p className="text-xs uppercase tracking-widest mb-1 opacity-70">Nog geldig</p>
              <p className="text-6xl font-bold tabular-nums" style={{ fontFamily: "Playfair Display, serif" }}>
                {tijd}
              </p>
            </div>
            <p className="text-xs opacity-50 leading-relaxed">
              Deze bon verloopt automatisch en kan daarna niet opnieuw gebruikt worden.
              Een screenshot is niet geldig — de klok moet live lopen.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
