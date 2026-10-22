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

  if (choice === "unknown" || choice || PRIVATE_PATH.test(pathname)) return null;
  const copy = locale === "de"
    ? { message: "Dürfen wir anonyme, aggregierte Seitenaufrufe und Linkklicks messen? Es werden keine Besucherprofile erstellt.", yes: "Einverstanden", no: "Nein danke", privacy: "Datenschutz" }
    : locale === "en"
      ? { message: "May we measure anonymous, aggregated page views and link clicks? We do not build visitor profiles.", yes: "Allow", no: "No thanks", privacy: "Privacy" }
      : { message: "Mogen we anonieme, geaggregeerde paginaweergaven en linkklikken meten? We maken geen bezoekersprofielen.", yes: "Toestaan", no: "Nee bedankt", privacy: "Privacy" };

  function choose(value: "accepted" | "declined") {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  return <aside aria-label="Privacykeuze" className="fixed inset-x-3 bottom-3 z-[80] mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-sky-200 bg-white p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm leading-relaxed">{copy.message} <Link className="underline" href={`/${locale}/privacyverklaring`}>{copy.privacy}</Link></p>
    <div className="flex shrink-0 gap-2"><button type="button" className="knop knop-lijn" onClick={() => choose("declined")}>{copy.no}</button><button type="button" className="knop knop-navy" onClick={() => choose("accepted")}>{copy.yes}</button></div>
  </aside>;
}
