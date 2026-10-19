"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const copy = {
  nl: {
    title: "Regelmatig iets lekkers van Schaap’s",
    intro: "Ontvang af en toe aanbiedingen en nieuws speciaal voor klanten van Schaap’s. We mailen wanneer er iets leuks te delen is.",
    email: "Uw e-mailadres",
    region: "Waar woont u of haalt u meestal vis?",
    regions: { leiden: "Leiden", voorschoten: "Voorschoten", anders: "Een andere plaats" },
    consent: "Ja, ik wil e-maildeals ontvangen. Ik kan mij altijd weer afmelden.",
    submit: "Houd mij op de hoogte",
    sending: "Versturen…",
    sent: "Bijna klaar: bevestig uw aanmelding via de e-mail die we u sturen.",
    error: "Aanmelden lukt nu niet. Probeer het later opnieuw.",
    privacy: "Voorlopige privacyinformatie",
  },
  en: {
    title: "Something good from Schaap’s, now and then",
    intro: "Get occasional offers and news especially for Schaap’s customers. We’ll email when there’s something worth sharing.",
    email: "Your email address",
    region: "Where do you live or usually shop with us?",
    regions: { leiden: "Leiden", voorschoten: "Voorschoten", anders: "Another town" },
    consent: "Yes, I want to receive email offers. I can unsubscribe at any time.",
    submit: "Keep me updated",
    sending: "Sending…",
    sent: "Almost done: confirm your subscription using the email we sent you.",
    error: "We could not sign you up right now. Please try again later.",
    privacy: "Preliminary privacy information",
  },
  de: {
    title: "Ab und zu etwas Gutes von Schaap’s",
    intro: "Erhalten Sie gelegentlich Angebote und Neuigkeiten speziell für Schaap’s-Kunden. Wir schreiben, wenn es etwas Schönes zu teilen gibt.",
    email: "Ihre E-Mail-Adresse",
    region: "Wo wohnen Sie oder kaufen Sie meistens bei uns ein?",
    regions: { leiden: "Leiden", voorschoten: "Voorschoten", anders: "Ein anderer Ort" },
    consent: "Ja, ich möchte E-Mail-Angebote erhalten. Ich kann mich jederzeit abmelden.",
    submit: "Auf dem Laufenden bleiben",
    sending: "Wird gesendet…",
    sent: "Fast geschafft: Bitte bestätigen Sie die Anmeldung über die E-Mail, die wir Ihnen senden.",
    error: "Die Anmeldung ist gerade nicht möglich. Bitte versuchen Sie es später erneut.",
    privacy: "Vorläufige Datenschutzhinweise",
  },
} as const;

export function NewsletterSignup({ compact = false, locale = "nl" }: { compact?: boolean; locale?: string }) {
  const language = locale in copy ? locale as keyof typeof copy : "nl";
  const t = copy[language];
  const headingColor = compact ? "text-white" : "text-slate-900";
  const introColor = compact ? "text-slate-200" : "text-slate-600";
  const labelColor = compact ? "text-slate-100" : "text-slate-800";
  const consentColor = compact ? "text-slate-200" : "text-slate-700";
  const privacyColor = compact ? "text-slate-200" : "text-slate-600";
  const buttonStyle = compact ? "knop bg-white text-slate-900 hover:bg-sky-100" : "knop knop-navy";
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/members/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: form.get("email"), consent: form.get("consent") === "on", locale: language, regionTag: form.get("regionTag") }),
      });
      if (!response.ok) throw new Error("newsletter-unavailable");
      setSuccess(true);
      setMessage(t.sent);
      formElement.reset();
    } catch {
      setSuccess(false);
      setMessage(t.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className={compact ? "space-y-3" : "max-w-xl space-y-4"}>
      <div>
        <h2 className={`font-display text-xl font-bold ${headingColor}`}>{t.title}</h2>
        <p className={`mt-1 text-sm leading-relaxed ${introColor}`}>{t.intro}</p>
      </div>
      <label className={`block text-sm font-medium ${labelColor}`}>
        {t.email}
        <input name="email" type="email" required autoComplete="email" maxLength={254} disabled={busy || success} className="mt-1 block w-full rounded-lg border border-sky-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-sky-700 focus:ring-2 focus:ring-sky-100 disabled:opacity-70" />
      </label>
      <label className={`block text-sm font-medium ${labelColor}`}>
        {t.region}
        <select name="regionTag" required disabled={busy || success} defaultValue="" className="mt-1 block w-full rounded-lg border border-sky-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-sky-700 focus:ring-2 focus:ring-sky-100 disabled:opacity-70">
          <option value="" disabled>—</option>
          {Object.entries(t.regions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className={`flex items-start gap-2 text-sm leading-relaxed ${consentColor}`}>
        <input name="consent" type="checkbox" required disabled={busy || success} className="mt-1 size-4 shrink-0 accent-sky-700" />
        <span>{t.consent}</span>
      </label>
      <p className={`text-xs ${privacyColor}`}><a className="underline underline-offset-4" href={`/${language}/privacyverklaring`}>{t.privacy}</a></p>
      <button type="submit" disabled={busy || success} className={`${buttonStyle} disabled:cursor-not-allowed disabled:opacity-60`}>
        {busy ? t.sending : t.submit}
      </button>
      {message && <p role="status" aria-live="polite" className={`text-sm ${success ? (compact ? "text-emerald-200" : "text-emerald-800") : (compact ? "text-rose-200" : "text-red-800")}`}>{message}</p>}
    </form>
  );
}

