"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { flushVisitErasures, recordVisitPage, setVisitChoice, sharesVisit, visitChanged } from "@/lib/signup-visit";
import { analyticsConsentKey, analyticsConsentEvent } from "@/lib/journey-shared.mjs";
import { observeJourney, revokeJourney, flushJourneyErasures } from "@/lib/visitor-journey.mjs";

const CONSENT_KEY = analyticsConsentKey;
const PRIVATE_PATH = /^\/(nl|en|de)\/(account|beheer|studentenkorting|kortingsbon|bestellen)(\/|$)/;
const CONSENT_EVENT = analyticsConsentEvent;

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
  const copy = locale === "de"
    ? { title: "Ihre Cookie-Auswahl", message: "Dürfen wir Herkunft, besuchte öffentliche Seiten, sichtbare Besuchsdauer und Newsletter-Schritte messen? Das Besuchsprotokoll enthält keine Namen oder E-Mail-Adressen und bleibt höchstens 30 Tage gespeichert. Notwendige Kontocookies funktionieren auch ohne diese Einwilligung.", yes: "Akzeptieren", no: "Ablehnen", privacy: "Mehr erfahren", settings: "Cookie-Einstellungen" }
    : locale === "en"
      ? { title: "Your cookie choice", message: "May we measure traffic source, public pages visited, visible visit time and newsletter steps? Visit records contain no names or email addresses and are kept for up to 30 days. Necessary account cookies work without this permission.", yes: "Accept", no: "Reject", privacy: "Read more", settings: "Cookie settings" }
      : { title: "Uw cookiekeuze", message: "Mogen we de herkomst, bezochte openbare pagina’s, zichtbare bezoektijd en nieuwsbriefstappen meten? Dit bezoekoverzicht bevat geen namen of e-mailadressen en wordt maximaal 30 dagen bewaard. Noodzakelijke accountcookies werken ook zonder deze toestemming.", yes: "Accepteren", no: "Weigeren", privacy: "Lees hier meer", settings: "Cookie-instellingen" };

  const options = locale === "en" ? {
    choices:"Choose settings", general:"Visit statistics and newsletter steps", personal:"Share my visit when I sign up",
    detail:"If I sign up for offers, Schaap’s may link my public page visits in this tab, IP address and approximate city to the email I enter to understand which products and areas attract subscribers. Stored for up to 30 days. Withdraw and erase via cookie settings.",
    save:"Save choices",error:"Your choice could not be confirmed. Check your connection and try again."
  } : locale === "de" ? {
    choices:"Auswahl anpassen", general:"Besuchsstatistiken und Newsletter-Schritte", personal:"Meinen Besuch bei der Anmeldung teilen",
    detail:"Bei der Anmeldung für Angebote darf Schaap’s besuchte öffentliche Seiten in diesem Tab, IP-Adresse und ungefähren Ort meiner angegebenen E-Mail-Adresse zuordnen, um das Interesse an Produkten und die Herkunft der Anmeldungen zu verstehen. Höchstens 30 Tage. Widerruf und Löschung über die Cookie-Einstellungen.",
    save:"Auswahl speichern",error:"Ihre Auswahl konnte nicht bestätigt werden. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut."
  } : {
    choices:"Keuze aanpassen", general:"Bezoekstatistieken en nieuwsbriefstappen", personal:"Mijn bezoek delen als ik me inschrijf",
    detail:"Als ik me aanmeld voor aanbiedingen, mag Schaap’s mijn bezochte openbare pagina’s in dit tabblad, IP-adres en geschatte plaats koppelen aan het ingevulde e-mailadres. Zo ziet de winkel welke producten interesse wekken en uit welke plaatsen inschrijvingen komen. Maximaal 30 dagen. Intrekken en wissen kan via Cookie-instellingen.",
    save:"Keuze opslaan",error:"Uw keuze kon niet worden bevestigd. Controleer uw verbinding en probeer het opnieuw."
  };

  async function choose(value: "accepted" | "declined", share = false) {
    setBusy(true);
    setFailed(false);
    setGeneral(value === "accepted");
    setPersonal(share);
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
      window.localStorage.setItem("sv-analytics-consent-v1", value);
      if (value === "declined") revokeJourney();
      window.dispatchEvent(new Event(CONSENT_EVENT));
      await setVisitChoice(share);
      setEditing(false);
      setCustom(false);
    } catch { setEditing(true); setFailed(true); }
    finally { setBusy(false); }
  }

  function reopenSettings() {
    setPersonal(sharesVisit());
    setGeneral(choice === "accepted");
    setCustom(true);
    setEditing(true);
  }

  if (choice && !editing && !busy) {
    return <button type="button" onClick={reopenSettings} className="cookie-settings-trigger fixed bottom-3 left-3 z-[79] rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-900 shadow-lg hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:bottom-5 sm:left-5">
      {copy.settings}
    </button>;
  }

  return <aside aria-label={copy.title} className="cookie-choice-banner fixed inset-x-3 bottom-3 z-[80] mx-auto flex max-h-[85dvh] max-w-4xl flex-col gap-4 overflow-y-auto rounded-2xl border border-sky-200 bg-white p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
    <div>
      <h2 className="font-display text-xl font-bold text-slate-900">{copy.title}</h2>
      <p className="mt-1 text-base leading-7 text-slate-700">{copy.message} <Link className="font-semibold text-sky-900 underline underline-offset-4" href={`/${locale}/privacyverklaring`}>{copy.privacy}</Link>.</p>
      {custom ? <div className="mt-3 grid gap-2">
        <label><input type="checkbox" checked={general} onChange={e=>setGeneral(e.target.checked)} /> {options.general}</label>
        <label><input type="checkbox" checked={personal} aria-describedby="visit-choice-description" onChange={e=>setPersonal(e.target.checked)} /> {options.personal}</label>
        <p id="visit-choice-description" className="text-sm">{options.detail}</p>
      </div> : <button type="button" className="underline" onClick={reopenSettings}>{options.choices}</button>}
      {failed && <p role="alert">{options.error}</p>}
    </div>
    <div className="flex shrink-0 flex-wrap gap-2"><button type="button" disabled={busy} className="knop knop-lijn min-w-28" onClick={() => choose("declined")}>{copy.no}</button>
      <button type="button" disabled={busy} className="knop knop-navy min-w-28" onClick={() => custom ? choose(general ? "accepted" : "declined",personal) : choose("accepted",sharesVisit())}>{custom ? options.save : copy.yes}</button></div>
  </aside>;
}

