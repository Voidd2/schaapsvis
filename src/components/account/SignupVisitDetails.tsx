"use client";

import { useEffect, useState } from "react";
import { signupRegionLabel, signupSourceLabel, trafficSourceLabel } from "@/lib/signup-source";

const copy = {
  nl: {
    title: "Herkomst van de inschrijving", form: "Inschrijfformulier", traffic: "Verkeersbron",
    entry: "Eerste gemeten openbare pagina", signupPage: "Pagina van inschrijving", region: "Zelf opgegeven regio",
    city: "Geschatte plaats op basis van IP", ip: "IP-adres bij inschrijving", pages: "Bezochte openbare pagina’s",
    at: "Ingeschreven", missing: "Niet vastgelegd", empty: "Bij deze inschrijving zijn geen gekoppelde bezoekgegevens bewaard.",
    note: "De plaats is een schatting van het gebruikte netwerk.", loading: "Herkomstgegevens laden…",
    error: "Laden mislukt. Probeer het opnieuw.", retry: "Opnieuw proberen", erase: "Bezoekgegevens wissen",
    confirm: "De persoonlijke bezoekgegevens voor dit adres wissen?",
  },
  en: {
    title: "Where this signup came from", form: "Signup form", traffic: "Traffic source", entry: "First recorded public page",
    signupPage: "Signup page", region: "Self-reported area", city: "Estimated city based on IP", ip: "IP address at signup",
    pages: "Public pages visited", at: "Signed up", missing: "Not recorded",
    empty: "No visit data is on file for this signup.",
    note: "The city is an estimate for the network used.", loading: "Loading signup details…",
    error: "Could not load. Please try again.", retry: "Try again", erase: "Erase visit data", confirm: "Erase the personal visit data for this address?",
  },
  de: {
    title: "Herkunft der Anmeldung", form: "Anmeldeformular", traffic: "Zugriffsquelle", entry: "Erste erfasste öffentliche Seite",
    signupPage: "Seite der Anmeldung", region: "Selbst angegebene Region", city: "Anhand der IP geschätzter Ort", ip: "IP-Adresse bei der Anmeldung",
    pages: "Besuchte öffentliche Seiten", at: "Angemeldet", missing: "Nicht erfasst",
    empty: "Zu dieser Anmeldung sind keine Besuchsdaten gespeichert.",
    note: "Der Ort wird anhand des verwendeten Netzes geschätzt.", loading: "Anmeldeinformationen werden geladen…",
    error: "Laden fehlgeschlagen. Bitte erneut versuchen.", retry: "Erneut versuchen", erase: "Besuchsdaten löschen", confirm: "Persönliche Besuchsdaten für diese Adresse löschen?",
  },
};

type Details = {
  source: string | null;
  region: string | null;
  visit: null | {
    ip: string; city: string | null; signup_at: string; pages: string[];
    traffic_source?: string | null; entry_path?: string | null; signup_path?: string | null;
  };
};

async function load(email: string, signal?: AbortSignal, action?: "erase"): Promise<Details> {
  const response = await fetch("/api/members/admin/signup-visit", {
    method: "POST", headers: {"Content-Type":"application/json"}, credentials: "same-origin",
    cache: "no-store", body: JSON.stringify({email,action}), signal,
  });
  if (!response.ok) throw new Error("visit_details_unavailable");
  return response.json();
}

type Props = {email: string; locale: string; accountOnly?: boolean; onErase?: () => void};

export function SignupVisitDetails({email,locale,accountOnly,onErase}: Props) {
  const t = copy[locale === "de" || locale === "en" ? locale : "nl"];
  const [data,setData] = useState<Details | null>(null);
  const [error,setError] = useState(false);
  const [attempt,retry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setError(false);
    load(email,controller.signal).then(result => {if (!controller.signal.aborted) setData(result);})
      .catch(() => {if (!controller.signal.aborted) setError(true);});
    return () => controller.abort();
  }, [email,attempt]);

  async function erase() {
    if (!window.confirm(t.confirm)) return;
    try {
      setData(await load(email,undefined,"erase"));
      onErase?.();
    } catch {setError(true);}
  }

  const visit = data?.visit;
  const region = signupRegionLabel(data?.region,locale);
  const footerPath = data?.source?.startsWith("footer:/") ? data.source.slice(7) : null;
  const signupPath = visit?.signup_path || footerPath;
  return <section className="my-2 rounded-lg bg-sky-50 p-4">
    <h2 className="text-lg">{t.title}</h2>
    {error ? <p role="alert">{t.error} <button type="button" className="underline" onClick={()=>retry(n=>n+1)}>{t.retry}</button></p> :
      !data ? <p role="status">{t.loading}</p> : <>
        <dl className="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-[max-content_1fr]">
          <dt className="font-semibold">{t.form}</dt><dd>{signupSourceLabel(footerPath ? "footer" : data.source,locale,accountOnly)}</dd>
          {signupPath && <><dt className="font-semibold">{t.signupPage}</dt><dd className="break-all">{signupPath}</dd></>}
          {region && <><dt className="font-semibold">{t.region}</dt><dd>{region}</dd></>}
          {visit && <>
            <dt className="font-semibold">{t.traffic}</dt><dd>{trafficSourceLabel(visit.traffic_source,locale)}</dd>
            <dt className="font-semibold">{t.city}</dt><dd>{visit.city || t.missing}{visit.city && <small className="block">{t.note}</small>}</dd>
            <dt className="font-semibold">{t.entry}</dt><dd className="break-all">{visit.entry_path || t.missing}</dd>
            <dt className="font-semibold">{t.at}</dt><dd><time dateTime={visit.signup_at}>{new Intl.DateTimeFormat(locale,{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Amsterdam"}).format(new Date(visit.signup_at))}</time></dd>
            <dt className="font-semibold">{t.ip}</dt><dd className="break-all">{visit.ip}</dd>
          </>}
        </dl>
        {visit ? <>
          {visit.pages.length > 0 && <><h3 className="mt-3 font-semibold">{t.pages}</h3><ol className="list-decimal pl-6">{visit.pages.map((page,index)=><li className="break-all" key={index}>{page}</li>)}</ol></>}
          <button type="button" className="mt-3 underline" onClick={erase}>{t.erase}</button>
        </> : <p className="mt-3 max-w-3xl text-sm">{t.empty}</p>}
      </>}
  </section>;
}
