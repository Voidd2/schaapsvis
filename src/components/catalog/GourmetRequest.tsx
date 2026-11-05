"use client";

import { useId, useState, type FormEvent } from "react";
import { gourmetRequestCopy, gourmetRequestLink, gourmetRetailPrice } from "@/lib/gourmet-request";
import { useInteractive } from "@/lib/use-interactive";

export function GourmetRequest({ locale }: { locale: string }) {
  const t = gourmetRequestCopy(locale), id = useId();
  const ready = useInteractive();
  const [people, setPeople] = useState("");
  const [fish, setFish] = useState<number[]>([]);
  const [date, setDate] = useState("");
  const [wishes, setWishes] = useState("");
  const [error, setError] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const href = gourmetRequestLink(locale, { people, fish, date, wishes });
    if (!href) { setError(true); return; }
    setError(false);
    window.location.assign(href);
  }
  const field = "mt-2 min-h-12 w-full rounded-lg border border-[#bfd6df] bg-white p-3 text-base";
  return <section id="gourmet-samenstellen" aria-labelledby={`${id}-title`} className="mt-10 scroll-mt-48 rounded-2xl border border-[#bfd6df] bg-[#eef9fd] p-5 sm:p-8">
    <h2 id={`${id}-title`} className="text-[1.8rem] leading-tight">{t.title}</h2><p className="mt-3 max-w-3xl">{t.intro}</p>
    <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <form onSubmit={submit} aria-label={t.title}>
        <label htmlFor={`${id}-people`} className="block font-semibold">{t.people}</label>
        <input id={`${id}-people`} type="number" min={1} max={200} step={1} required inputMode="numeric" value={people} onChange={e => setPeople(e.target.value)} className={field} />
        <fieldset className="mt-5"><legend className="font-semibold">{t.fish}</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">
          {t.choices.map((label, index) => <label key={label} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-[#bfd6df] bg-white p-3">
            <input type="checkbox" className="h-5 w-5 accent-[#075b82]" checked={fish.includes(index)} onChange={() => { setFish(current => current.includes(index) ? current.filter(i => i !== index) : [...current, index]); setError(false); }} />{label}
          </label>)}
        </div></fieldset>
        <label htmlFor={`${id}-date`} className="mt-5 block font-semibold">{t.date}</label>
        <input id={`${id}-date`} type="date" value={date} onChange={e => setDate(e.target.value)} className={field} />
        <label htmlFor={`${id}-wishes`} className="mt-5 block font-semibold">{t.wishes}</label>
        <textarea id={`${id}-wishes`} value={wishes} onChange={e => setWishes(e.target.value)} maxLength={700} rows={3} placeholder={t.placeholder} className={field} />
        {error && <p role="alert" className="mt-3 font-semibold text-[#a61f2b]">{t.error}</p>}
        <button type="submit" disabled={!ready} className="knop knop-navy mt-4 min-h-12 w-full whitespace-normal">{t.button} →</button>
        <p className="mt-3 text-sm leading-6">{t.note}</p>
      </form>
      <aside className="self-start rounded-xl bg-white p-5 sm:p-6"><h3 className="text-xl">{t.priceTitle}</h3>
        <dl className="mt-4 divide-y divide-[#d9e7ee]">{t.choices.map((label, index) => <div key={label} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-3"><dt>{label}</dt><dd className="font-semibold">{gourmetRetailPrice(index, locale)} {t.unit}</dd></div>)}</dl>
        <p className="mt-4">{t.preparation}</p><p className="mt-4 text-sm leading-6">{t.priceNote}</p>
      </aside>
    </div>
  </section>;
}
