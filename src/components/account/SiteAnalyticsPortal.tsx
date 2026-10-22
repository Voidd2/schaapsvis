"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Row = { day: string; event: "page_view" | "link_click"; path: string; target: string; count: number };

export function SiteAnalyticsPortal({ locale }: { locale: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const labels = locale === "en"
    ? { title: "Website overview", intro: "Consent-based aggregate page views and link clicks. No individual visitor journeys are stored.", pages: "Most viewed pages", clicks: "Most clicked destinations", engagement: "Page engagement (approximate)", page: "Page", views: "Page views", link: "Link clicks", rate: "Clicks per view", date: "Period", loading: "Loading statistics…", denied: "Statistics are unavailable. Sign in with an approved administrator account from an allowed IP address.", none: "No statistics yet. Analytics are off until explicitly enabled in Cloudflare and a visitor consents.", students: "Review student applications", campaigns: "Manage email offers", range: "Last" }
    : locale === "de"
      ? { title: "Website-Übersicht", intro: "Aggregierte Seitenaufrufe und Linkklicks nach Einwilligung. Individuelle Besucherpfade werden nicht gespeichert.", pages: "Meistbesuchte Seiten", clicks: "Meistgeklickte Ziele", engagement: "Seiteninteraktion (ungefähr)", page: "Seite", views: "Seitenaufrufe", link: "Linkklicks", rate: "Klicks je Aufruf", date: "Zeitraum", loading: "Statistiken werden geladen…", denied: "Statistiken sind nicht verfügbar. Melden Sie sich mit einem freigegebenen Administratorkonto und einer erlaubten IP-Adresse an.", none: "Noch keine Statistiken. Analytics bleiben deaktiviert, bis sie in Cloudflare freigeschaltet wurden und Besucher einwilligen.", students: "Studentenanträge prüfen", campaigns: "E-Mail-Angebote verwalten", range: "Letzte" }
      : { title: "Website-overzicht", intro: "Geaggregeerde paginaweergaven en linkklikken na toestemming. Individuele bezoekersroutes worden niet opgeslagen.", pages: "Meest bekeken pagina’s", clicks: "Meest aangeklikte doelen", engagement: "Betrokkenheid per pagina (indicatie)", page: "Pagina", views: "Weergaven", link: "Klikken", rate: "Kliks per weergave", date: "Periode", loading: "Statistieken laden…", denied: "Statistieken zijn niet beschikbaar. Log in met een goedgekeurd beheerdersaccount vanaf een toegestaan IP-adres.", none: "Nog geen statistieken. Analytics blijft uit totdat dit bewust in Cloudflare is aangezet en bezoekers toestemming geven.", students: "Studentaanvragen beoordelen", campaigns: "E-maildeals beheren", range: "Afgelopen" };

  useEffect(() => {
    let active = true;
    fetch(`/api/members/admin/analytics?days=${days}`, { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("forbidden");
        return response.json() as Promise<{ rows: Row[] }>;
      })
      .then((data) => { if (active) { setRows(data.rows); setError(""); } })
      .catch(() => { if (active) setError(labels.denied); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [days, labels.denied]);

  const pageRows = useMemo(() => {
    const totals = new Map<string, number>();
    rows.filter((row) => row.event === "page_view").forEach((row) => totals.set(row.path, (totals.get(row.path) || 0) + row.count));
    return [...totals].sort((a, b) => b[1] - a[1]).slice(0, 20);
  }, [rows]);
  const clickRows = useMemo(() => {
    const totals = new Map<string, number>();
    rows.filter((row) => row.event === "link_click").forEach((row) => {
      const key = `${row.path} → ${row.target}`;
      totals.set(key, (totals.get(key) || 0) + row.count);
    });
    return [...totals].sort((a, b) => b[1] - a[1]).slice(0, 30);
  }, [rows]);
  const engagementRows = useMemo(() => {
    const views = new Map<string, number>();
    const clicks = new Map<string, number>();
    rows.forEach((row) => {
      const totals = row.event === "page_view" ? views : clicks;
      totals.set(row.path, (totals.get(row.path) || 0) + row.count);
    });
    return [...views].map(([path, viewCount]) => ({ path, viewCount, clickCount: clicks.get(path) || 0, rate: viewCount ? ((clicks.get(path) || 0) / viewCount).toFixed(2) : "0.00" }))
      .sort((a, b) => b.viewCount - a.viewCount).slice(0, 20);
  }, [rows]);

  return <main className="section-wrap max-w-5xl py-12 md:py-16">
    <p className="kapitaal">Schaap’s Vishandel · intern</p><h1 className="text-4xl">{labels.title}</h1><p className="mt-3 max-w-3xl">{labels.intro}</p>
    <nav className="my-6 flex flex-wrap gap-4 text-sm font-semibold"><Link className="underline" href={`/${locale}/beheer/studenten`}>{labels.students} →</Link><Link className="underline" href={`/${locale}/beheer/emaildeals`}>{labels.campaigns} →</Link></nav>
    <label className="my-5 flex items-center gap-3">{labels.date}<select className="rounded-lg border border-sky-200 bg-white p-2" value={days} onChange={(event) => { setLoading(true); setDays(Number(event.target.value)); }}><option value={7}>{labels.range} 7 dagen</option><option value={30}>{labels.range} 30 dagen</option><option value={90}>{labels.range} 90 dagen</option></select></label>
    {loading ? <p role="status">{labels.loading}</p> : error ? <p role="alert" className="rounded-xl bg-amber-50 p-5">{error}</p> : rows.length === 0 ? <p className="rounded-xl bg-sky-50 p-5">{labels.none}</p> : <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-sky-100 bg-white p-5"><h2 className="text-2xl">{labels.pages}</h2><ul className="mt-4 divide-y divide-sky-100">{pageRows.map(([path, count]) => <li className="flex justify-between gap-4 py-3" key={path}><code className="break-all">{path}</code><strong>{count}</strong></li>)}</ul></section>
      <section className="rounded-2xl border border-sky-100 bg-white p-5"><h2 className="text-2xl">{labels.clicks}</h2><ul className="mt-4 divide-y divide-sky-100">{clickRows.map(([target, count]) => <li className="flex justify-between gap-4 py-3" key={target}><code className="break-all">{target}</code><strong>{count}</strong></li>)}</ul></section>
      <section className="rounded-2xl border border-sky-100 bg-white p-5 lg:col-span-2"><h2 className="text-2xl">{labels.engagement}</h2><div className="mt-4 overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-sky-200"><th className="py-2">{labels.page}</th><th className="py-2">{labels.views}</th><th className="py-2">{labels.link}</th><th className="py-2">{labels.rate}</th></tr></thead><tbody>{engagementRows.map((row) => <tr className="border-b border-sky-100" key={row.path}><th className="py-3 pr-3 font-mono text-sm">{row.path}</th><td className="py-3">{row.viewCount}</td><td className="py-3">{row.clickCount}</td><td className="py-3">{row.rate}</td></tr>)}</tbody></table></div></section>
    </div>}
    <p className="mt-8 text-sm leading-relaxed text-slate-600">{locale === "nl" ? "Uitstapgedrag is alleen globaal af te leiden door weergaven met klikken te vergelijken. Zonder bezoekers-ID of toestemming voor een profiel meten we geen exacte individuele funnel of afhaakmomenten." : locale === "de" ? "Ausstiege lassen sich nur grob durch den Vergleich von Aufrufen und Klicks ableiten. Ohne Besucher-ID messen wir keine individuellen Funnels oder Abbruchpunkte." : "Drop-off can only be estimated by comparing views and clicks. Without visitor IDs, we do not measure individual funnels or exact exit points."}</p>
  </main>;
}
