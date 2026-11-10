"use client";
import { useEffect, useState } from "react";
import { BarChart3, MousePointer2, MessageCircle, Phone, Search, Cloud, ExternalLink, RefreshCw } from "lucide-react";
import { PopupExperimentReport, type PopupRow } from "./PopupExperimentReport";
import { analyticsCopy } from "./analytics-copy";

type Day = { day: string; views: number; clicks: number };
type Report = {
 popup?: PopupRow[];
 locationsPopup?: PopupRow[];
 enabled: boolean; since: string; until: string; generatedAt: string;
 summary: { views: number; clicks: number; whatsapp: number; phone: number; lastEventAt: string | null };
 daily: Day[]; pages: { path: string; views: number; clicks: number }[];
 destinations: { path: string; target: string; count: number }[];
};
const gsc = "https://search.google.com/search-console/";
const property = "?resource_id=sc-domain%3Aschaapsvishandel.nl";
const cf = "https://dash.cloudflare.com/2ceb07af817e76c45267acd46e402705";
const panel = "rounded-2xl border border-sky-100 bg-white p-5 sm:p-7";
function ReportLink({ href, children }: { href: string; children: React.ReactNode }) {
 return <a href={href} target="_blank" rel="noopener noreferrer" className="knop knop-lijn min-h-12 text-base"><span>{children}</span><ExternalLink size={16} aria-hidden /></a>;
}
export function SiteAnalyticsPortal({ locale }: { locale: string }) {
 const language = locale === "en" || locale === "de" ? locale : "nl";
 const c = analyticsCopy[language];
 const [report, setReport] = useState<Report | null>(null);
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(true);
 const [days, setDays] = useState(30);
 const [refresh, setRefresh] = useState(0);
 const number = new Intl.NumberFormat(language);
 const date = (value: string, withTime = false) => new Intl.DateTimeFormat(language, { dateStyle: "medium", ...(withTime ? { timeStyle: "short" as const } : {}), timeZone: "UTC" }).format(new Date(value));
 useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/members/admin/analytics?days=${days}`, { credentials: "same-origin", cache: "no-store", signal: controller.signal })
   .then(async response => {
    if (!response.ok) throw new Error([401, 403].includes(response.status) ? "denied" : "failed");
    const data = await response.json() as Report;
    if (!data.summary || !Array.isArray(data.daily)) throw new Error("failed");
    return data;
   })
   .then(data => { if (!controller.signal.aborted) { setReport(data); setError(""); } })
   .catch(reason => { if (!controller.signal.aborted) { setReport(null); setError(reason.message === "denied" ? c.denied : c.failed); } })
   .finally(() => { if (!controller.signal.aborted) setLoading(false); });
  return () => controller.abort();
 }, [days, refresh, c.denied, c.failed]);
 function reload() { setLoading(true); setReport(null); setError(""); setRefresh(value => value + 1); }
 const targetLabel = (target: string) => target === "contact:phone" ? c.phone : target === "contact:email" ? c.email : ["contact:whatsapp", "external:wa.me", "external:api.whatsapp.com", "external:web.whatsapp.com"].includes(target) ? c.whatsapp : target.replace(/^external:/, "");
 const peak = Math.max(1, ...(report?.daily.map(day => Math.max(day.views, day.clicks)) || []));
 return <main className="section-wrap py-10 md:py-14">
  <p className="kapitaal">Schaap’s Vishandel</p><h1 className="mt-2 text-3xl md:text-4xl">{c.title}</h1><p className="mt-4 max-w-3xl text-lg">{c.intro}</p>
  <div className="my-7 flex flex-wrap items-end justify-between gap-4">
   <label className="flex flex-wrap items-center gap-3 font-semibold">{c.period}<select className="min-h-12 rounded-lg border border-sky-200 bg-white px-4" value={days} onChange={event => { setLoading(true); setReport(null); setError(""); setDays(Number(event.target.value)); }}>{[7,30,90].map(value => <option key={value} value={value}>{c.last} {value} {c.days}</option>)}</select></label>
   <button type="button" onClick={reload} disabled={loading} className="knop knop-lijn min-h-12 disabled:opacity-50"><RefreshCw size={18} aria-hidden />{c.refresh}</button>
  </div>
  {loading ? <p role="status" className={panel}>{c.loading}</p> : error ? <div role="alert" className={`${panel} bg-amber-50`}><p>{error}</p><button onClick={reload} type="button" className="knop knop-lijn mt-4">{c.refresh}</button></div> : report && <>
   <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm"><strong className={`rounded-full px-4 py-2 ${report.enabled ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>{report.enabled ? c.active : c.inactive}</strong><span>{date(report.since)} – {date(report.until)} · UTC</span></div>
   <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[
    { key:"views", title:c.views, icon:BarChart3 }, { key:"clicks", title:c.clicks, icon:MousePointer2 }, { key:"whatsapp", title:c.whatsapp, icon:MessageCircle }, { key:"phone", title:c.phone, icon:Phone },
   ].map(({key,title,icon:Icon}) => <section key={key} className={`${panel} min-w-0`}><Icon className="text-sky-800" size={23} aria-hidden /><h2 className="mt-4 font-body text-base font-semibold">{title}</h2><p className="mt-2 text-3xl font-bold tabular-nums text-sky-950">{number.format(report.summary[key as "views"|"clicks"|"whatsapp"|"phone"])}</p></section>)}</div>
   {report.locationsPopup && <PopupExperimentReport experiment="locations" rows={report.locationsPopup} locale={language} />}
   {report.popup && <PopupExperimentReport experiment="varlaks" rows={report.popup} locale={language} />}
   {!report.summary.views && !report.summary.clicks ? <p className="mt-5 rounded-xl bg-sky-50 p-5">{c.none}</p> : <>
    <section className={`${panel} mt-6`}><h2 className="text-2xl">{c.trend}</h2><p className="mt-2 text-sm">{language === "nl" ? "Sinds 9 november 2026 tellen nieuwe bezoeken en klikken vanaf het uitgesloten IP-adres niet mee." : language === "en" ? "Since 9 November 2026, new views and clicks from the excluded shop IP are omitted." : "Seit dem 9. November 2026 werden neue Aufrufe und Klicks von der ausgeschlossenen IP nicht gezählt."}</p><div className="mt-3 flex flex-wrap gap-5 text-sm"><span><span className="mr-2 inline-block h-3 w-3 bg-sky-800" />{c.views}</span><span><span className="mr-2 inline-block h-3 w-3 bg-amber-500" />{c.clicks}</span></div>
     <div className="mt-6 flex h-44 items-end gap-0.5 border-b border-sky-200" aria-hidden="true">{report.daily.map(day => <div key={day.day} className="flex h-full min-w-0 flex-1 items-end gap-px" title={`${day.day}: ${day.views} / ${day.clicks}`}><span className="flex-1 rounded-t bg-sky-800" style={{height:`${day.views/peak*100}%`}} /><span className="flex-1 rounded-t bg-amber-500" style={{height:`${day.clicks/peak*100}%`}} /></div>)}</div>
     <div className="mt-2 flex justify-between text-sm"><span>{date(report.since)}</span><span>{date(report.until)}</span></div><p className="mt-3 text-sm text-slate-600">{c.utc}</p>
     <details className="mt-4"><summary className="min-h-12 cursor-pointer py-3 font-semibold text-sky-900">{c.daily}</summary><div className="max-h-80 overflow-auto"><table className="w-full text-left tabular-nums"><thead><tr><th className="py-3">{c.date}</th><th>{c.views}</th><th>{c.clicks}</th></tr></thead><tbody>{report.daily.map(day => <tr key={day.day} className="border-t border-sky-100"><th className="py-3 font-normal">{date(day.day)}</th><td>{number.format(day.views)}</td><td>{number.format(day.clicks)}</td></tr>)}</tbody></table></div></details>
    </section>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className={`${panel} min-w-0`}><h2 className="text-2xl">{c.pages}</h2><p className="mt-2 text-sm">Top 30 · {c.views} / {c.clicks}</p><ul className="mt-4 divide-y divide-sky-100">{report.pages.map(row => <li key={row.path} className="flex justify-between gap-4 py-4"><span className="min-w-0 break-words">{row.path}</span><strong className="shrink-0 tabular-nums">{number.format(row.views)} / {number.format(row.clicks)}</strong></li>)}</ul></section>
     <section className={`${panel} min-w-0`}><h2 className="text-2xl">{c.destinations}</h2><p className="mt-2 text-sm">Top 30 · {c.clicks}</p>{report.destinations.length ? <ul className="mt-4 divide-y divide-sky-100">{report.destinations.map(row => <li key={`${row.path}:${row.target}`} className="flex justify-between gap-4 py-4"><div className="min-w-0 break-words"><strong>{targetLabel(row.target)}</strong><p className="mt-1 text-sm text-slate-600">{row.path}</p></div><strong className="tabular-nums">{number.format(row.count)}</strong></li>)}</ul> : <p className="mt-4">{c.empty}</p>}</section>
    </div>
   </>}
   <p className="mt-4 text-sm text-slate-600">{c.updated}: {date(report.generatedAt,true)} UTC</p>
  </>}
  <p className="mt-6 max-w-5xl text-sm leading-7 text-slate-600">{c.note}</p>
  <section className="mt-12 border-t border-sky-100 pt-9"><h2 className="text-3xl">{c.sources}</h2><p className="mt-3 max-w-4xl">{c.external}</p><div className="mt-6 grid gap-6 lg:grid-cols-2">
   <article className={panel}><Search size={26} className="text-sky-800" aria-hidden /><p className="kapitaal mt-4">Google Search Console</p><h3 className="mt-2 text-2xl">{c.google}</h3><p className="mt-3">{c.googleText}</p><div className="mt-6 flex flex-wrap gap-3"><ReportLink href={`${gsc}performance/search-analytics${property}`}>{c.performance}</ReportLink><ReportLink href={`${gsc}index${property}`}>{c.indexing}</ReportLink><ReportLink href={`${gsc}sitemaps${property}`}>{c.sitemap}</ReportLink><ReportLink href={`${gsc}core-web-vitals${property}`}>{c.vitals}</ReportLink></div></article>
   <article className={panel}><Cloud size={26} className="text-sky-800" aria-hidden /><p className="kapitaal mt-4">Cloudflare · Schaapsvis</p><h3 className="mt-2 text-2xl">{c.cloudflare}</h3><p className="mt-3">{c.cloudflareText}</p><div className="mt-6 flex flex-wrap gap-3"><ReportLink href={`${cf}/analytics`}>{c.traffic}</ReportLink><ReportLink href={`${cf}/web-analytics/overview?siteTag~in=06bc467289ce4113b40e3c68e8db099e&excludeBots=Yes`}>{c.web}</ReportLink></div><p className="mt-4 text-sm leading-6 text-slate-600">{c.rum}</p></article>
  </div><p className="mt-6 rounded-xl bg-sky-50 p-5">{c.preview}</p></section>
 </main>;
}
