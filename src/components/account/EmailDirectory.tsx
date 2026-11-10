"use client";
import { Fragment, useEffect, useState } from "react";
import { SignupVisitDetails } from "./SignupVisitDetails";

const copy = {
  nl: {
    title: "E-mailadressen",
    intro: "Persoonlijke accountadressen en adressen uit het kortingsformulier. De status geeft aan wie kortingsmails mag ontvangen.",
    address: "E-mailadres",
    remove: "Verwijder uit e-maillijst", removing: "Verwijderen…", removed: "Verwijderd uit de e-maillijst.",
    confirmRemoval: "Verwijder dit adres uit de e-maillijst, inclusief de kortingsinschrijving en eventuele bezoekgegevens?",
    accountKept: "Het gekoppelde account en een eventuele studentenpas blijven bestaan.",
    changed: "Deze inschrijving is intussen gewijzigd. Bekijk de actuele gegevens en probeer het opnieuw.",
    removeError: "Verwijderen is niet gelukt. Probeer het opnieuw.",
    offers: "Kortingsmails",
    source: "Inschrijfbron", unknown: "Bron niet vastgelegd", accountOnly: "Account zonder kortingsinschrijving",
    sources: {
      "varlaks-popup": "Pop-up op de VÅRLAKS-pagina", "locations-popup": "Pop-up op de locatiepagina",
      "discount-form": "Kortingspagina · Aanmelden voor kortingen", "newsletter-form": "Nieuwsbriefformulier",
      "account-registration": "Bij het aanmaken van een account", account: "Formulier tijdens ingelogd bezoek",
      footer: "Nieuwsbrief onderaan de pagina",
    },
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
    remove: "Remove from email list", removing: "Removing…", removed: "Removed from the email list.",
    confirmRemoval: "Remove this address from the email list, including the discount subscription and any visit data?",
    accountKept: "The linked account and any student pass will stay active according to their current status.",
    changed: "This entry has changed. Review the latest details and try again.",
    removeError: "Could not remove this entry. Please try again.",
    offers: "Marketing emails",
    source: "Signup source", unknown: "Source not recorded", accountOnly: "Account without a discount signup",
    sources: {
      "varlaks-popup": "VÅRLAKS page pop-up", "locations-popup": "Locations page pop-up",
      "discount-form": "Discount signup page", "newsletter-form": "Newsletter form",
      "account-registration": "During account registration", account: "Form during a signed-in visit",
      footer: "Newsletter in the page footer",
    },
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
    remove: "Aus E-Mail-Liste entfernen", removing: "Wird entfernt…", removed: "Aus der E-Mail-Liste entfernt.",
    confirmRemoval: "Diese Adresse mit der Rabattanmeldung und etwaigen Besuchsdaten aus der E-Mail-Liste entfernen?",
    accountKept: "Das zugehörige Konto und ein etwaiger Studierendenausweis bleiben bestehen.",
    changed: "Dieser Eintrag wurde inzwischen geändert. Prüfen Sie die aktuellen Angaben und versuchen Sie es erneut.",
    removeError: "Der Eintrag konnte nicht entfernt werden. Bitte versuchen Sie es erneut.",
    offers: "Angebotsmails",
    source: "Anmeldequelle", unknown: "Quelle nicht erfasst", accountOnly: "Konto ohne Rabatt-Anmeldung",
    sources: {
      "varlaks-popup": "Pop-up auf der VÅRLAKS-Seite", "locations-popup": "Pop-up auf der Standortseite",
      "discount-form": "Anmeldeseite für Rabatte", "newsletter-form": "Newsletterformular",
      "account-registration": "Bei der Kontoerstellung", account: "Formular während eines angemeldeten Besuchs",
      footer: "Newsletter am Seitenende",
    },
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
  has_account: number;
  marketing: "subscribed" | "pending" | "unsubscribed" | "not-subscribed";
  source: string | null;
  revision: string;
  marketing_at: string | null;
};
const statusLabel = {
  subscribed: "subscribed",
  pending: "pending",
  unsubscribed: "unsubscribed",
  "not-subscribed": "noConsent",
} as const;

function signupSource(row: Entry, t: typeof copy.nl) {
  if (!row.source && row.has_account && row.marketing === "not-subscribed") return t.accountOnly;
  if (row.source?.startsWith("footer:/")) return `${t.sources.footer} · ${row.source.slice(7)}`;
  if (row.source && Object.hasOwn(t.sources, row.source)) return t.sources[row.source as keyof typeof t.sources];
  return t.unknown;
}

export function EmailDirectory({ locale }: { locale: string }) {
  const t = copy[locale === "de" || locale === "en" ? locale : "nl"];
  const [entries, setEntries] = useState<Entry[]>([]);
  const [opened,setOpened] = useState<string|null>(null);
  const [removing,setRemoving] = useState<string|null>(null);
  const [notice,setNotice] = useState("");
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

  async function removeEntry(row: Entry) {
    const confirmation = [row.email, t.confirmRemoval, row.has_account ? t.accountKept : ""].filter(Boolean).join("\n\n");
    if (removing || !window.confirm(confirmation)) return;
    setRemoving(row.email);
    setNotice("");
    try {
      const response = await fetch("/api/members/admin/email-addresses", {
        method:"DELETE", credentials:"same-origin", cache:"no-store", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:row.email,revision:row.revision}),
      });
      if (response.status === 409) {
        setNotice(t.changed);
        setOpened(null);
        setStatus("loading");
        setAfter("");
        setAttempt(n=>n+1);
        return;
      }
      if (!response.ok || (await response.json()).ok !== true) throw new Error("remove_failed");
      setEntries(previous=>previous.filter(entry=>entry.email !== row.email));
      setOpened(null);
      setNotice(t.removed);
    } catch { setNotice(t.removeError); }
    finally { setRemoving(null); }
  }

  return (
    <section className="section-wrap py-10">
      <h1 className="text-3xl">{t.title}</h1>
      <p className="my-4">{t.intro}</p>
      <p role="status">{notice}</p>
      {entries.length > 0 && (
        <table className="w-full text-left">
          <thead><tr><th scope="col">{t.address}</th><th scope="col">{t.source}</th><th scope="col">{t.offers}</th></tr></thead>
          <tbody>
            {entries.map(row => (
              <Fragment key={row.email}><tr className="border-t">
                <td className="break-all py-3 pr-3"><button type="button" className="min-h-11 text-left text-sky-800 underline underline-offset-4" aria-expanded={opened===row.email} onClick={()=>setOpened(opened===row.email ? null : row.email)}>{row.email}</button></td>
                <td className="break-words py-3 pr-3">{signupSource(row, t)}</td>
                <td className="py-3">{t[statusLabel[row.marketing]]}
                  {row.marketing_at && <time className="block text-sm" dateTime={row.marketing_at}>{new Intl.DateTimeFormat(locale, {dateStyle:"medium", timeStyle:"short", timeZone:"Europe/Amsterdam"}).format(new Date(row.marketing_at))}</time>}
                </td>
              </tr>{opened===row.email && <tr><td colSpan={3}>
                <SignupVisitDetails email={row.email} locale={locale}/>
                <button type="button" className="knop knop-lijn mb-4" disabled={!row.revision || Boolean(removing) || status!=="ready"} onClick={()=>removeEntry(row)}>
                  {removing===row.email ? t.removing : t.remove}
                </button>
              </td></tr>}</Fragment>
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
        <button className="knop knop-lijn mt-4" disabled={Boolean(removing)} onClick={() => { setStatus("loading"); setAfter(next); }}>{t.more}</button>
      )}
    </section>
  );
}
