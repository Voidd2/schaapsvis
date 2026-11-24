"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { flushVisitErasures, recordVisitPage, setVisitChoice, sharedVisitVersion, visitChanged } from "@/lib/signup-visit";
import { visitConsentVersion } from "@/lib/signup-visit-path.mjs";
import { signupVisitNotice } from "@/lib/signup-visit-notice";
import { analyticsConsentKey, analyticsConsentEvent } from "@/lib/journey-shared.mjs";
import { observeJourney, revokeJourney, flushJourneyErasures } from "@/lib/visitor-journey.mjs";

const CONSENT_KEY = analyticsConsentKey;
const PRIVATE_PATH = /^\/(nl|en|de)\/(account|beheer|studentenkorting|kortingsbon|bestellen)(\/|$)/;
const CONSENT_EVENT = analyticsConsentEvent;

const cookieCopy = {
  nl: {
    title: "Uw cookiekeuze", settings: "Cookie-instellingen", privacy: "Privacyverklaring",
    yes: "Alles accepteren", no: "Weigeren", choices: "Keuze aanpassen", save: "Keuze opslaan",
    general: "Bezoekstatistieken en nieuwsbriefstappen",
    message: "Mogen we de herkomst, bezochte openbare pagina’s, zichtbare bezoektijd en nieuwsbriefstappen meten?",
    personal: "Mijn bezoek delen als ik me inschrijf",
    error: "Uw keuze kon niet worden bevestigd. Controleer uw verbinding en probeer het opnieuw.",
  },
  en: {
    title: "Your cookie choice", settings: "Cookie settings", privacy: "Privacy policy",
    yes: "Accept all", no: "Reject", choices: "Choose settings", save: "Save choices",
    general: "Visit statistics and newsletter steps",
    message: "May we measure traffic source, public pages visited, visible visit time and newsletter steps?",
    personal: "Share my visit when I sign up",
    error: "Your choice could not be confirmed. Check your connection and try again.",
  },
  de: {
    title: "Ihre Cookie-Auswahl", settings: "Cookie-Einstellungen", privacy: "Datenschutzerklärung",
    yes: "Alle akzeptieren", no: "Ablehnen", choices: "Auswahl anpassen", save: "Auswahl speichern",
    general: "Besuchsstatistiken und Newsletter-Schritte",
    message: "Dürfen wir Herkunft, besuchte öffentliche Seiten, sichtbare Besuchsdauer und Newsletter-Schritte messen?",
    personal: "Meinen Besuch bei der Anmeldung teilen",
    error: "Ihre Auswahl konnte nicht bestätigt werden. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
  },
} as const;

function subscribeConsent(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_EVENT, onChange);
  };
}
function readConsent() {
  try { return window.localStorage.getItem(CONSENT_KEY) || (window.localStorage.getItem("sv-analytics-consent-v1") === "declined" ? "declined" : ""); } catch { return ""; }
}

function send(event: "page_view" | "link_click", path: string, target?: string) {
  // Re-check consent at the moment of transmission. A document-level click
  // listener can run before React removes it after the visitor revokes consent.
  try { if (localStorage.getItem(CONSENT_KEY) !== "accepted") return; } catch { return; }
  if (!path || PRIVATE_PATH.test(path)) return;
  const body = JSON.stringify({ consent: true, event, path, ...(target ? { target } : {}) });
  void fetch("/api/members/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body, credentials: "same-origin", keepalive: true }).catch(() => undefined);
}

export function AnalyticsConsent({ locale }: { locale: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const choice = useSyncExternalStore(subscribeConsent, readConsent, () => "unknown");
  const [editing,setEditing] = useState(false);
  const [custom,setCustom] = useState(false);
  const [general,setGeneral] = useState(false);
  const [personal,setPersonal] = useState(false);
  const [busy,setBusy] = useState(false);
  const [failed,setFailed] = useState(false);

  useEffect(() => {
    if (choice === "declined") revokeJourney();
    const stop = observeJourney(pathname);
    window.addEventListener("online", flushJourneyErasures);
    return () => { stop(); window.removeEventListener("online", flushJourneyErasures); };
  }, [choice, pathname]);

  useEffect(() => {
    const record = () => recordVisitPage(pathname);
    const retry = () => { void flushVisitErasures().catch(()=>{}); };
    record();
    retry();
    window.addEventListener(visitChanged,record);
    window.addEventListener("storage",record);
    window.addEventListener("online",retry);
    return () => {
      window.removeEventListener(visitChanged,record);
      window.removeEventListener("storage",record);
      window.removeEventListener("online",retry);
    };
  },[pathname]);

  useEffect(() => {
    if (choice !== "accepted" || PRIVATE_PATH.test(pathname)) return;
    send("page_view", pathname);
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const target = new URL(anchor.href);
      // Drafts may contain wishes/allergies: record only the destination path.
      target.search = ""; target.hash = "";
      send("link_click", pathname, target.href);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [choice, pathname]);

  if (choice === "unknown") return null;
  const language = locale === "en" || locale === "de" ? locale : "nl";
  const copy = cookieCopy[language];
  const notice = signupVisitNotice[language];

  async function choose(value: "accepted" | "declined", share: boolean) {
    setBusy(true);
    setFailed(false);
    setGeneral(value === "accepted");
    setPersonal(share);
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
      window.localStorage.setItem("sv-analytics-consent-v1", value);
      if (value === "declined") revokeJourney();
      window.dispatchEvent(new Event(CONSENT_EVENT));
      await setVisitChoice(share, visitConsentVersion);
      setEditing(false);
      setCustom(false);
    } catch { setEditing(true); setFailed(true); }
    finally { setBusy(false); }
  }

  function reopenSettings() {
    setPersonal(sharedVisitVersion() === visitConsentVersion);
    setGeneral(choice === "accepted");
    setFailed(false);
    setCustom(true);
    setEditing(true);
  }

  if (choice && !editing && !busy) {
    return <button type="button" onClick={reopenSettings} className="cookie-settings-trigger fixed bottom-3 left-3 z-[79] rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-900 shadow-lg hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:bottom-5 sm:left-5">
      {copy.settings}
    </button>;
  }

  return <aside aria-label={copy.title} aria-busy={busy} data-customizing={custom || undefined} className="cookie-choice-banner fixed inset-x-3 bottom-3 z-[80] mx-auto flex max-h-[85dvh] max-w-3xl flex-col gap-3 rounded-2xl border border-sky-200 bg-white p-5 text-slate-900 shadow-xl">
    <div className="min-h-0 overflow-y-auto">
      <h2 className="font-display text-xl font-bold text-slate-900">{copy.title}</h2>
      {custom ? (
        <div className="mt-1">
          <label className="flex min-h-11 items-center gap-2 font-semibold">
            <input type="checkbox" checked={general} onChange={e => setGeneral(e.target.checked)} />
            {copy.general}
          </label>
          <label className="flex min-h-11 items-center gap-2 font-semibold">
            <input type="checkbox" checked={personal} aria-describedby="visit-choice-description"
              onChange={e => setPersonal(e.target.checked)} />
            {copy.personal}
          </label>
          <p id="visit-choice-description" className="text-sm">{notice.linking}</p>
        </div>
      ) : (
        <div className="mt-1 space-y-1 text-sm">
          <p>{copy.message}</p>
          <p>{notice.signup} {notice.linking}</p>
        </div>
      )}
      {failed && <p role="alert">{copy.error}</p>}
    </div>
    <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1">
      <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
        <button type="button" disabled={busy} className="knop knop-lijn" onClick={() => choose("declined", false)}>{copy.no}</button>
        <button type="button" disabled={busy} className="knop knop-lijn" onClick={() => custom ? choose(general ? "accepted" : "declined", personal) : choose("accepted", true)}>{custom ? copy.save : copy.yes}</button>
      </div>
      {!custom && <button type="button" disabled={busy} className="min-h-8 text-sm underline" onClick={reopenSettings}>{copy.choices}</button>}
      <Link className="inline-flex min-h-8 items-center text-sm underline" href={`/${locale}/privacyverklaring#inschrijfbezoek`}>{copy.privacy}</Link>
    </div>
  </aside>;
}

