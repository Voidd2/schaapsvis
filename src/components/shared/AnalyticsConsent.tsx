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
  // Re-check consent at the moment of transmission. A document-level click
  // listener can run before React removes it after the visitor revokes consent.
  if (window.localStorage.getItem(CONSENT_KEY) !== "accepted" || !path || PRIVATE_PATH.test(path)) return;
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
    ? { title: "Ihre Cookie-Auswahl", message: "Notwendige Cookies sorgen dafür, dass die Website richtig funktioniert. Mit Ihrer Zustimmung helfen uns einfache Statistiken, die Website zu verbessern.", yes: "Akzeptieren", no: "Ablehnen", privacy: "Mehr erfahren", settings: "Cookie-Einstellungen" }
    : locale === "en"
      ? { title: "Your cookie choice", message: "Necessary cookies keep the website working properly. With your permission, simple statistics help us improve the website.", yes: "Accept", no: "Reject", privacy: "Read more", settings: "Cookie settings" }
      : { title: "Uw cookiekeuze", message: "Noodzakelijke cookies zorgen dat de website goed werkt. Met uw toestemming helpen eenvoudige statistieken ons om de website te verbeteren.", yes: "Accepteren", no: "Weigeren", privacy: "Lees hier meer", settings: "Cookie-instellingen" };

  function choose(value: "accepted" | "declined") {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  function reopenSettings() {
    window.localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  if (choice) {
    return <button type="button" onClick={reopenSettings} className="cookie-settings-trigger fixed bottom-3 left-3 z-[79] rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-900 shadow-lg hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:bottom-5 sm:left-5">
      {copy.settings}
    </button>;
  }

  return <aside aria-label={copy.title} className="fixed inset-x-3 bottom-3 z-[80] mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-sky-200 bg-white p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
    <div>
      <h2 className="font-display text-xl font-bold text-slate-900">{copy.title}</h2>
      <p className="mt-1 text-base leading-7 text-slate-700">{copy.message} <Link className="font-semibold text-sky-900 underline underline-offset-4" href={`/${locale}/privacyverklaring`}>{copy.privacy}</Link>.</p>
    </div>
    <div className="flex shrink-0 flex-wrap gap-2"><button type="button" className="knop knop-lijn min-w-28" onClick={() => choose("declined")}>{copy.no}</button><button type="button" className="knop knop-navy min-w-28" onClick={() => choose("accepted")}>{copy.yes}</button></div>
  </aside>;
}

