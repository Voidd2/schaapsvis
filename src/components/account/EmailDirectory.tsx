"use client";
import { useEffect, useState } from "react";

const copy = {
  nl: {
    title: "E-mailadressen",
    intro: "Persoonlijke accountadressen en adressen uit het kortingsformulier. De status geeft aan wie kortingsmails mag ontvangen.",
    address: "E-mailadres",
    offers: "Kortingsmails",
    campaign: "VÅRLAKS-pop-up",
    subscribed: "Toestemming gegeven",
    pending: "Wacht op bevestiging",
    unsubscribed: "Afgemeld",
    noConsent: "Geen toestemming",
    more: "Meer adressen laden",
    loading: "Laden…",
    empty: "Geen adressen gevonden.",
    denied: "Log in met uw beheeraccount op het toegestane netwerk.",
    error: "Laden mislukt. Probeer het opnieuw.",
    retry: "Opnieuw proberen"
  },
  en: {
    title: "Email addresses",
    intro: "Personal account and discount signup addresses. The status shows who can receive marketing emails.",
    address: "Email address",
    offers: "Marketing emails",
    campaign: "VÅRLAKS pop-up",
    subscribed: "Opted in",
    pending: "Awaiting confirmation",
    unsubscribed: "Unsubscribed",
    noConsent: "No consent",
    more: "Load more addresses",
    loading: "Loading…",
    empty: "No addresses found.",
    denied: "Sign in with your admin account on the authorised network.",
    error: "Could not load the list. Please try again.",
    retry: "Try again"
  },
  de: {
    title: "E-Mail-Adressen",
    intro: "Private Kontoadressen und Anmeldungen für Rabatte. Der Status zeigt, wer Angebotsmails erhalten darf.",
    address: "E-Mail-Adresse",
    offers: "Angebotsmails",
    campaign: "VÅRLAKS-Pop-up",
    subscribed: "Eingewilligt",
    pending: "Bestätigung ausstehend",
    unsubscribed: "Abgemeldet",
    noConsent: "Keine Einwilligung",
    more: "Weitere Adressen laden",
    loading: "Lädt…",
    empty: "Keine Adressen gefunden.",
    denied: "Melden Sie sich im zugelassenen Netzwerk als Administrator an.",
    error: "Laden fehlgeschlagen. Bitte erneut versuchen.",
    retry: "Erneut versuchen"
  },
};
type Entry = {
  email: string;
  marketing: "subscribed" | "pending" | "unsubscribed" | "not-subscribed";
  source: string | null;
  marketing_at: string | null;
};
const statusLabel = {
  subscribed: "subscribed",
  pending: "pending",
  unsubscribed: "unsubscribed",
  "not-subscribed": "noConsent",
} as const;

export function EmailDirectory({ locale }: { locale: string }) {
  const t = copy[locale === "de" || locale === "en" ? locale : "nl"];
  const [entries, setEntries] = useState<Entry[]>([]);
  const [after, setAfter] = useState("");
  const [next, setNext] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "denied" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    async function read() {
      try {
        const response = await fetch("/api/members/admin/email-addresses", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ after }),
          signal: controller.signal,
        });
        if (response.status === 401 || response.status === 403) {
          setEntries([]);
          setNext(null);
          setStatus("denied");
          return;
        }
        if (!response.ok) throw new Error("Cannot load addresses");
        const page = await response.json() as { emails: Entry[]; next: string | null };
        if (controller.signal.aborted) return;
        setEntries(previous => after ? [...previous, ...page.emails] : page.emails);
        setNext(page.next);
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }
    void read();
    return () => controller.abort();
  }, [after, attempt]);

  return (
    <section className="section-wrap py-10">
      <h1 className="text-3xl">{t.title}</h1>
      <p className="my-4">{t.intro}</p>
      {entries.length > 0 && (
        <table className="w-full text-left">
          <thead><tr><th scope="col">{t.address}</th><th scope="col">{t.offers}</th></tr></thead>
          <tbody>
            {entries.map(row => (
              <tr key={row.email} className="border-t">
                <td className="break-all py-3 pr-3">{row.email}</td>
                <td className="py-3">{t[statusLabel[row.marketing]]}
                  {row.source === "varlaks-popup" && <small className="block">{t.campaign}</small>}
                  {row.marketing_at && <time className="block text-sm" dateTime={row.marketing_at}>{new Intl.DateTimeFormat(locale, {dateStyle:"medium", timeStyle:"short", timeZone:"Europe/Amsterdam"}).format(new Date(row.marketing_at))}</time>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p role="status">
        {status === "ready" ? (entries.length ? "" : t.empty) : t[status]}
      </p>
      {status === "error" && (
        <button className="knop knop-lijn" onClick={() => { setStatus("loading"); setAttempt(n => n + 1); }}>{t.retry}</button>
      )}
      {status === "ready" && next && (
        <button className="knop knop-lijn mt-4" onClick={() => { setStatus("loading"); setAfter(next); }}>{t.more}</button>
      )}
    </section>
  );
}
