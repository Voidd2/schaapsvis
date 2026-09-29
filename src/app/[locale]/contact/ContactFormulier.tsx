"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BEDRIJF } from "@/lib/bedrijf";

export function ContactFormulier() {
  const t = useTranslations("contactPage");
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [bericht, setBericht] = useState("");
  const [status, setStatus] = useState<"invullen" | "versturen" | "gelukt" | "mislukt">(
    "invullen"
  );
  const [fout, setFout] = useState("");

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    if (!naam.trim() || !bericht.trim()) return;
    setStatus("versturen");
    try {
      const antwoord = await fetch("/api/bericht", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ naam, email, bericht }),
      });
      const data = (await antwoord.json()) as { ok?: boolean; fout?: string };
      if (!antwoord.ok || !data.ok) {
        setFout(""); // API diagnostics are not customer-facing or translated; use the localized failure message.
        setStatus("mislukt");
        return;
      }
      setStatus("gelukt");
    } catch {
      setFout("");
      setStatus("mislukt");
    }
  }

  if (status === "gelukt") {
    return (
      <p className="leading-relaxed" style={{ color: "var(--seafoam)", fontWeight: 600 }}>
        {t("gelukt")}
      </p>
    );
  }

  return (
    <form onSubmit={verstuur} className="space-y-4">
      <label className="block">
        <span className="veld-label">{t("nameLabel")}</span>
        <input
          type="text"
          autoComplete="name"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          className="veld"
          required
        />
      </label>

      <label className="block">
        <span className="veld-label">{t("emailLabel")}</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="veld"
        />
      </label>

      <label className="block">
        <span className="veld-label">{t("messageLabel")}</span>
        <textarea
          rows={6}
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          className="veld resize-none"
          required
        />
      </label>

      <button
        type="submit"
        disabled={status === "versturen" || !naam.trim() || !bericht.trim()}
        className="knop knop-navy w-full"
      >
        {status === "versturen" ? t("bezig") : t("send")}
      </button>

      {status === "mislukt" && (
        <div className="p-4" style={{ border: "1px solid var(--rood)" }}>
          <p className="font-semibold mb-1" style={{ color: "var(--rood)" }}>
            {t("mislukt")}
          </p>
          {fout && (
            <p className="text-sm mb-2" style={{ color: "var(--charcoal)" }}>
              {fout}
            </p>
          )}
          <a
            href={`tel:${BEDRIJF.telefoon.e164}`}
            className="font-semibold underline underline-offset-4"
            style={{ color: "var(--navy)" }}
          >
            {BEDRIJF.telefoon.weergave}
          </a>
        </div>
      )}
    </form>
  );
}
