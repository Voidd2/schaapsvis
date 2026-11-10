import { popupHeadline, type PopupVariant } from "@/lib/varlaks-popup";

export type PopupRow = { variant: PopupVariant; shown: number; filled: number; acquired: number };
const copy = {
  nl: { title: "Welke VÅRLAKS-popup levert aanmeldingen op?", shown: "Popup gezien", filled: "E-mailadres ingevuld", acquired: "Nieuwe inschrijvingen", rate: "Conversie", note: "Conversie is het aandeel getoonde popups dat een nieuw ingeschreven adres oplevert. Alleen bezoekers die met statistieken instemmen tellen mee. Het winkel-IP is uitgesloten." },
  en: { title: "Which VÅRLAKS popup brings in subscribers?", shown: "Popup seen", filled: "Email entered", acquired: "New subscribers", rate: "Conversion", note: "Conversion is the share of popup views that produce a new subscriber. Only visitors who agree to analytics are counted. The shop IP is excluded." },
  de: { title: "Welches VÅRLAKS-Popup gewinnt Abonnenten?", shown: "Popup gesehen", filled: "E-Mail eingetragen", acquired: "Neue Anmeldungen", rate: "Anmelderate", note: "Die Rate ist der Anteil angezeigter Popups, die zu einer neuen Anmeldung führen. Gezählt werden nur Besucher mit Einwilligung zur Statistik. Die Laden-IP ist ausgeschlossen." },
};

export function PopupExperimentReport({ rows, locale }: { rows: PopupRow[]; locale: keyof typeof copy }) {
  const c = copy[locale];
  const percent = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 });
  return <section className="mt-6 rounded-2xl border border-sky-100 bg-white p-5 sm:p-7">
    <h2 className="text-2xl">{c.title}</h2>
    <p className="mt-2 max-w-4xl text-sm">{c.note}</p>
    <div className="mt-5 grid gap-4 md:grid-cols-2">{rows.map(row => <article key={row.variant} className="rounded-lg bg-sky-50 p-4">
      <h3 className="text-lg">{row.variant.toUpperCase()} · {popupHeadline(locale,row.variant)}</h3>
      <dl className="mt-3 space-y-1">{[[c.shown,row.shown],[c.filled,row.filled],[c.acquired,row.acquired],[c.rate,row.shown ? percent.format(row.acquired / row.shown) : "—"]].map(([label,value]) =>
        <div key={label} className="flex items-baseline justify-between gap-3"><dt>{label}</dt><dd className="font-semibold tabular-nums">{value}</dd></div>)}</dl>
    </article>)}</div>
  </section>;
}
