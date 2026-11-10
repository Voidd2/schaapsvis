"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { SignupFacebookFollow } from "./SignupFacebookFollow";
import { signupVisitComplete, visitAtSignup } from "@/lib/signup-visit";
import { recordJourneyStep } from "@/lib/visitor-journey.mjs";

const copy = {
  nl: {
    title: "Nieuws en aanbiedingen in uw inbox",
    intro: "Schrijf u in voor nieuws, aanbiedingen en kortingsmails van Schaap’s Vis.",
    email: "Uw e-mailadres",
    region: "Waar woont u of haalt u meestal vis? (optioneel)",
    regions: { leiden: "Leiden", voorschoten: "Voorschoten", wassenaar: "Wassenaar", leidschendam: "Leidschendam", "regio-071": "Ergens anders in regio 071", elders: "Elders" },
    regionError: "Uw regio kon niet worden opgeslagen. Uw inschrijving is wel gelukt.",
    submit: "Schrijf mij in",
    sending: "Versturen…",
    sent: "U bent aangemeld. We sturen alleen iets als we echt een leuke aanbieding of nieuwtje hebben.",
    error: "Aanmelden lukt nu niet. Probeer het later opnieuw.",
    privacy: "Privacyverklaring",
  },
  en: {
    title: "News and offers in your inbox",
    intro: "Sign up for news, offers and discount emails from Schaap’s Vis.",
    email: "Your email address",
    region: "Where do you live or usually shop with us? (optional)",
    regions: { leiden: "Leiden", voorschoten: "Voorschoten", wassenaar: "Wassenaar", leidschendam: "Leidschendam", "regio-071": "Elsewhere in the 071 area", elders: "Elsewhere" },
    regionError: "Your area could not be saved. You are still subscribed.",
    submit: "Sign me up",
    sending: "Sending…",
    sent: "You are subscribed. We will only email when we have a worthwhile offer or update.",
    error: "We could not sign you up right now. Please try again later.",
    privacy: "Privacy notice",
  },
  de: {
    title: "Neuigkeiten und Angebote in Ihrem Postfach",
    intro: "Melden Sie sich für Neuigkeiten, Angebote und Rabatt-E-Mails von Schaap’s Vis an.",
    email: "Ihre E-Mail-Adresse",
    region: "Wo wohnen Sie oder kaufen Sie meistens bei uns ein? (optional)",
    regions: { leiden: "Leiden", voorschoten: "Voorschoten", wassenaar: "Wassenaar", leidschendam: "Leidschendam", "regio-071": "Anderswo in der Region 071", elders: "Anderswo" },
    regionError: "Ihre Region konnte nicht gespeichert werden. Sie bleiben angemeldet.",
    submit: "Jetzt anmelden",
    sending: "Wird gesendet…",
    sent: "Sie sind angemeldet. Wir schreiben nur, wenn es ein lohnendes Angebot oder Neuigkeiten gibt.",
    error: "Die Anmeldung ist gerade nicht möglich. Bitte versuchen Sie es später erneut.",
    privacy: "Datenschutzhinweise",
  },
} as const;

export function NewsletterSignup({ compact = false, locale = "nl" }: { compact?: boolean; locale?: string }) {
  const language = locale in copy ? locale as keyof typeof copy : "nl";
  const t = copy[language];
  const headingColor = compact ? "text-white" : "text-slate-900";
  const introColor = compact ? "text-slate-200" : "text-slate-600";
  const labelColor = compact ? "text-slate-100" : "text-slate-800";
  const privacyColor = compact ? "text-slate-200" : "text-slate-600";
  const buttonStyle = compact ? "knop bg-white text-slate-900 hover:bg-sky-100" : "knop knop-navy";
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [preferencesToken, setPreferencesToken] = useState("");
  const [savingRegion, setSavingRegion] = useState(false);

  async function saveRegion(regionTag: string) {
    setSavingRegion(true);
    setMessage("");
    try {
      const response = await fetch("/api/members/newsletter/preferences", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ preferencesToken, regionTag }),
      });
      if (!response.ok || (await response.json()).ok !== true) throw new Error("preferences-unavailable");
      recordJourneyStep("regionSelected");
    } catch { recordJourneyStep("signupError"); setMessage(t.regionError); }
    finally { setSavingRegion(false); }
  }

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    const email = String(new FormData(event.currentTarget).get("email") || "").trim().toLowerCase();
    try {
      const visit = visitAtSignup();
      const response = await fetch("/api/members/newsletter/subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ email, form: "footer", consent: true, consentVersion: "footer-email-signup-v2", locale: language, visit }),
      });
      if (!response.ok) throw new Error("newsletter-unavailable");
      const result = await response.json() as { ok?: boolean; preferencesToken?: string };
      if (result.ok !== true) throw new Error("newsletter-unavailable");
      signupVisitComplete(visit);
      recordJourneyStep("subscribed");
      try { localStorage.setItem("sv-discounts-subscribed", "1"); } catch { /* Storage is optional. */ }
      setPreferencesToken(result.preferencesToken ?? "");
      setSuccess(true);
    } catch {
      setMessage(t.error);
      recordJourneyStep("signupError");
    } finally { setBusy(false); }
  }

  if (success) return <div className={`space-y-4 ${compact ? "text-slate-100" : "text-slate-900"}`}>
    <p role="status" tabIndex={-1} ref={node => { node?.focus({preventScroll:true}); }}>{t.sent}</p>
    {preferencesToken && <label className={`block text-base font-medium ${labelColor}`}>
      {t.region}
      <select name="regionTag" disabled={savingRegion} defaultValue="" onChange={event => void saveRegion(event.target.value)} className="mt-1 block w-full rounded-lg border border-sky-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-sky-700 focus:ring-2 focus:ring-sky-100 disabled:opacity-70">
        <option value="" disabled>—</option>
        {Object.entries(t.regions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>}
    {message && <p role="status" className="text-sm">{message}</p>}
    <SignupFacebookFollow locale={language} compact={compact} />
  </div>;

  return <div className={compact ? "space-y-3" : "max-w-xl space-y-4"}>
    <div>
      <h2 className={`font-display text-2xl font-bold ${headingColor}`}>{t.title}</h2>
      <p className={`mt-2 text-base leading-7 ${introColor}`}>{t.intro}</p>
    </div>
    <form data-newsletter-form="footer" onSubmit={subscribe} className="space-y-3">
      <label className={`block text-base font-medium ${labelColor}`}>
        {t.email}
        <input name="email" type="email" required autoComplete="email" maxLength={254} disabled={busy} className="mt-1 block w-full rounded-lg border border-sky-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-sky-700 focus:ring-2 focus:ring-sky-100 disabled:opacity-70" />
      </label>
      <button type="submit" disabled={busy} className={`${buttonStyle} disabled:cursor-not-allowed disabled:opacity-60`}>{busy ? t.sending : t.submit}</button>
    </form>
    <p className={`text-sm ${privacyColor}`}><a className="underline underline-offset-4" href={`/${language}/privacyverklaring`}>{t.privacy}</a></p>
    {message && <p role="status" aria-live="polite" className={`text-sm ${compact ? "text-rose-200" : "text-red-800"}`}>{message}</p>}
  </div>;
}
