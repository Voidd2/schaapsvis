"use client";

import { useState } from "react";

// TODO(eigenaar): vervang door uw echte Formspree-ID — zelfde als het bestelformulier mag ook
const NEWSLETTER_ENDPOINT = "https://formspree.io/f/JOUW_FORMSPREE_ID";

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "nieuwsbrief-aanmelding",
          _subject: `Nieuwsbrief-aanmelding: ${email}`,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm" style={{ color: "var(--seafoam)" }}>
        ✓ Aangemeld! U hoort van ons zodra er iets lekkers binnen is.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "" : "max-w-md"}>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="uw@email.nl"
          className="flex-1 min-w-0 px-3 py-2.5 text-sm focus:outline-none"
          style={{
            backgroundColor: "rgba(250,246,239,0.1)",
            border: "1px solid rgba(250,246,239,0.25)",
            color: "var(--cream)",
          }}
          aria-label="E-mailadres voor nieuwsbrief"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="text-sm font-semibold px-4 py-2.5 text-white flex-shrink-0 transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--salmon)" }}
        >
          {status === "sending" ? "..." : "Aanmelden"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs mt-2" style={{ color: "var(--salmon)" }}>
          Er ging iets mis — probeer het later nog eens.
        </p>
      )}
    </form>
  );
}
