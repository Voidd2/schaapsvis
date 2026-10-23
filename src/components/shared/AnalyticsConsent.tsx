"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const CONSENT_KEY = "sv-analytics-consent-v1";
const PRIVATE_PATH = /^\/(nl|en|de)\/(account|beheer|studentenkorting|kortingsbon|bestellen)(\/|$)/;
const CONSENT_EVENT = "sv-analytics-consent-change";

function subscribeConsent(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_EVENT, onChange);
  };
}
function readConsent() { return window.localStorage.getItem(CONSENT_KEY) || ""; }

function send(event: "page_view" | "link_click", path: string, target?: string) {
  if (!path || PRIVATE_PATH.test(path)) return;
  const body = JSON.stringify({ consent: true, event, path, ...(target ? { target } : {}) });
  void fetch("/api/members/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body, credentials: "same-origin", keepalive: true }).catch(() => undefined);
}

export function AnalyticsConsent({ locale }: { locale: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const choice = useSyncExternalStore(subscribeConsent, readConsent, () => "unknown");

  useEffect(() => {
    if (choice !== "accepted" || PRIVATE_PATH.test(pathname)) return;
    send("page_view", pathname);
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      send("link_click", pathname, anchor.href);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [choice, pathname]);

  if (choice === "unknown") return null;
  const copy = locale === "de"
    ? { message: "Dürfen wir anonyme, aggregierte Seitenaufrufe und Linkklicks messen? Es werden keine Besucherprofile erstellt. Sie können diese Auswahl jederzeit über die Datenschutzeinstellungen ändern.", yes: "Einverstanden", no: "Nein danke", privacy: "Datenschutz", settings: "Datenschutzeinstellungen" }
    : locale === "en"
      ? { message: "May we measure anonymous, aggregated page views and link clicks? We do not build visitor profiles. You can change this choice at any time in Privacy settings.", yes: "Allow", no: "No thanks", privacy: "Privacy", settings: "Privacy settings" }
      : { message: "Mogen we anonieme, geaggregeerde paginaweergaven en linkklikken meten? We maken geen bezoekersprofielen. U kunt uw keuze altijd wijzigen via Privacy-instellingen.", yes: "Toestaan", no: "Nee bedankt", privacy: "Privacy", settings: "Privacy-instellingen" };

  function choose(value: "accepted" | "declined") {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  function reopenSettings() {
    window.localStorage.removeItem(CONSENT_KEY);
    if (PRIVATE_PATH.test(pathname)) {
      window.location.assign(`/${locale}`);
      return;
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  if (choice || PRIVATE_PATH.test(pathname)) {
    return <button type="button" onClick={reopenSettings} className="fixed bottom-3 left-3 z-[79] rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-900 shadow-lg hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:bottom-5 sm:left-5">
      {copy.settings}
    </button>;
  }

  return <aside aria-label="Privacykeuze" className="fixed inset-x-3 bottom-3 z-[80] mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-sky-200 bg-white p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm leading-relaxed">{copy.message} <Link className="underline" href={`/${locale}/privacyverklaring`}>{copy.privacy}</Link></p>
    <div className="flex shrink-0 gap-2"><button type="button" className="knop knop-lijn" onClick={() => choose("declined")}>{copy.no}</button><button type="button" className="knop knop-navy" onClick={() => choose("accepted")}>{copy.yes}</button></div>
  </aside>;
}

