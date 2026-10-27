"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const copy = {
  nl: {
    eyebrow: "BESLOTEN BEHEER",
    title: "Beheeraccount activeren",
    intro: "Voor de eigenaar van Schaap’s Vishandel. Gebruik het toegestane zakelijke e-mailadres vanaf het vertrouwde netwerk. Een schoolmail is hiervoor niet nodig.",
    name: "Uw naam",
    email: "Zakelijk e-mailadres",
    password: "Kies een wachtwoord (minimaal 12 tekens)",
    submit: "Verificatiemail sturen",
    sent: "Controleer uw zakelijke mailbox, zo nodig ook Ongewenste e-mail, en bevestig het adres via de link. Log daarna in met het wachtwoord dat u zojuist koos. Bestaat het account al? Gebruik dan de inlogpagina of de wachtwoordreset.",
    resend: "Verificatielink opnieuw sturen",
    resent: "Als dit account nog onbevestigd is, ontvangt u een nieuwe verificatielink.",
    forbidden: "Dit kan alleen met het toegestane beheeradres vanaf het vertrouwde netwerk.",
    failed: "Dit is niet gelukt. Controleer de gegevens en probeer het later opnieuw. Als het account al is aangemaakt, gebruik dan de knop voor een nieuwe verificatielink.",
    login: "Naar inloggen",
  },
  en: {
    eyebrow: "PRIVATE ADMIN",
    title: "Activate an admin account",
    intro: "For the owner of Schaap’s Vishandel. Use the approved business email address from the trusted network. A school email is not required.",
    name: "Your name",
    email: "Business email address",
    password: "Choose a password (at least 12 characters)",
    submit: "Send verification email",
    sent: "Check your business mailbox, including spam if needed, and verify the address using the link. Then sign in with the password you chose. If the account already exists, sign in or reset your password.",
    resend: "Resend verification link",
    resent: "If this account is not verified yet, a new verification link will be sent.",
    forbidden: "Only the approved admin address on the trusted network can do this.",
    failed: "This did not work. Check the details and try again later. If the account was already created, request a new verification link.",
    login: "Go to sign in",
  },
  de: {
    eyebrow: "GESCHÜTZTE VERWALTUNG",
    title: "Verwaltungskonto aktivieren",
    intro: "Für den Inhaber von Schaap’s Vishandel. Verwenden Sie die freigegebene geschäftliche E-Mail-Adresse im vertrauenswürdigen Netzwerk. Eine Schul-E-Mail ist nicht erforderlich.",
    name: "Ihr Name",
    email: "Geschäftliche E-Mail-Adresse",
    password: "Passwort wählen (mindestens 12 Zeichen)",
    submit: "Bestätigungs-E-Mail senden",
    sent: "Prüfen Sie Ihr geschäftliches Postfach, bei Bedarf auch den Spamordner, und bestätigen Sie die Adresse über den Link. Melden Sie sich danach mit dem gewählten Passwort an. Falls das Konto bereits besteht, nutzen Sie die Anmeldung oder die Passwort-Zurücksetzung.",
    resend: "Bestätigungslink erneut senden",
    resent: "Falls dieses Konto noch nicht bestätigt wurde, erhalten Sie einen neuen Bestätigungslink.",
    forbidden: "Dies ist nur mit der freigegebenen Verwaltungsadresse im vertrauenswürdigen Netzwerk möglich.",
    failed: "Das hat nicht funktioniert. Prüfen Sie die Angaben und versuchen Sie es später erneut. Falls das Konto bereits erstellt wurde, fordern Sie einen neuen Bestätigungslink an.",
    login: "Zur Anmeldung",
  },
} as const;

export function AdminBootstrapPortal({ locale }: { locale: string }) {
  const language = locale in copy ? locale as keyof typeof copy : "nl";
  const t = copy[language];
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const address = String(fields.get("email") || "");
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/members/admin/register", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fields.get("name"), email: address, password: fields.get("password"), locale: language }),
      });
      if (!response.ok) throw new Error(response.status === 403 ? "forbidden" : "failed");
      setEmail(address);
      setSuccess(true);
      setMessage(t.sent);
      form.reset();
    } catch (error) {
      setSuccess(false);
      setMessage(error instanceof Error && error.message === "forbidden" ? t.forbidden : t.failed);
    } finally { setBusy(false); }
  }

  async function resend() {
    setBusy(true);
    try {
      const response = await fetch("/api/members/verify/resend", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale: language }),
      });
      if (!response.ok) throw new Error("failed");
      setSuccess(true);
      setMessage(t.resent);
    } catch { setSuccess(false); setMessage(t.failed); }
    finally { setBusy(false); }
  }

  return <main className="section-wrap max-w-3xl py-14 md:py-20">
    <p className="kapitaal">{t.eyebrow}</p>
    <h1 className="mt-3 font-display text-4xl font-bold text-slate-900 md:text-5xl">{t.title}</h1>
    <p className="mt-5 text-lg leading-relaxed text-slate-700">{t.intro}</p>
    <form onSubmit={submit} className="mt-9 space-y-5 rounded-2xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8">
      <label className="block text-sm font-medium">{t.name}<input name="name" required minLength={2} maxLength={120} autoComplete="name" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
      <label className="block text-sm font-medium">{t.email}<input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
      <label className="block text-sm font-medium">{t.password}<input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
      <button type="submit" disabled={busy} className="knop knop-navy disabled:opacity-60">{busy ? "…" : t.submit}</button>
    </form>
    {message && <p role="status" aria-live="polite" className={`mt-5 rounded-xl border p-4 text-sm leading-relaxed ${success ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-rose-200 bg-rose-50 text-rose-950"}`}>{message}</p>}
    <div className="mt-6 flex flex-wrap items-center gap-5">
      {email && <button type="button" onClick={resend} disabled={busy} className="font-semibold text-sky-800 underline underline-offset-4 disabled:opacity-60">{t.resend}</button>}
      <Link href={`/${language}/account`} className="font-semibold text-sky-800 underline underline-offset-4">{t.login} →</Link>
    </div>
  </main>;
}
