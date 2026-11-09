"use client";

import { useId, useState, type FormEvent } from "react";
import { gourmetFish, gourmetLanguage, gourmetQuote, gourmetRequestCopy, gourmetRequestLink, type Packaging, type Portions } from "@/lib/gourmet-request";
import { feestdagenBedrag } from "@/lib/feestdagen-producten";
import { useInteractive } from "@/lib/use-interactive";

export function GourmetRequest({ locale }: { locale: string }) {
  const t = gourmetRequestCopy(locale), lang = gourmetLanguage(locale), id = useId();
  const money = (cents: number) => feestdagenBedrag(cents, locale);
  const ready = useInteractive();
  const [people, setPeople] = useState("");
  const [portions, setPortions] = useState<Portions>({});
  const [packaging, setPackaging] = useState<Packaging>("standard");
  const [date, setDate] = useState("");
  const [wishes, setWishes] = useState("");
  const [error, setError] = useState(false);
  const quote = gourmetQuote(portions, packaging);
  const hasSelection = Object.keys(portions).length > 0;
  function changePortion(key: keyof Portions, grams?: string) {
    setError(false);
    setPortions(current => {
      const next = { ...current };
      if (grams === undefined) delete next[key];
      else next[key] = grams;
      return next;
    });
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const href = gourmetRequestLink(locale, { people, portions, packaging, date, wishes });
    if (href) window.location.assign(href);
    else setError(true);
  }

  const field = "mt-2 min-h-12 w-full rounded-lg border border-[#bfd6df] bg-white p-3 text-base";
  return <section id="gourmet-samenstellen" aria-labelledby={`${id}-title`} className="mt-10 scroll-mt-48 rounded-2xl border border-[#bfd6df] bg-[#eef9fd] p-5 sm:p-8">
    <h2 id={`${id}-title`} className="text-[1.8rem] leading-tight">{t.title}</h2>
    <p className="mt-3 max-w-3xl">{t.intro}</p>
    <form onSubmit={submit} aria-label={t.title} className="mt-6 grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
      <div>
        <label htmlFor={`${id}-people`} className="block font-semibold">{t.people}</label>
        <input id={`${id}-people`} type="number" min={1} max={200} step={1} required inputMode="numeric" value={people} onChange={e => setPeople(e.target.value)} className={field} />
        <fieldset className="mt-5"><legend className="font-semibold">{t.fish}</legend>
          <div className="mt-2 grid items-start gap-2 sm:grid-cols-2">
            {gourmetFish.map(fish => {
              const weight = portions[fish.id], selected = weight !== undefined, name = fish[lang];
              return <div key={fish.id} className={`rounded-lg border bg-white ${selected ? "border-[#075b82]" : "border-[#bfd6df]"}`}>
                <label className="flex min-h-14 cursor-pointer items-center gap-3 p-3">
                  <input type="checkbox" className="h-5 w-5 shrink-0 accent-[#075b82]" aria-label={name} checked={selected} onChange={e => changePortion(fish.id, e.target.checked ? "100" : undefined)} />
                  <span><strong className="block">{name}</strong><span className="text-sm">{money(fish.rate)} {t.unit}</span></span>
                </label>
                {selected && <label className="block px-3 pb-3 text-sm">{t.grams}<span className="sr-only"> · {name}</span>
                  <input required type="number" min="1" step="1" inputMode="numeric" className={field} value={weight} onChange={e => changePortion(fish.id, e.target.value)} />
                </label>}
              </div>;
            })}
          </div>
        </fieldset>
        <fieldset className="mt-5"><legend className="font-semibold">{t.packaging}</legend>
          <div className="mt-2 grid gap-2">
            {(["standard", "premium"] as const).map(option => <label key={option} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-[#bfd6df] bg-white p-3">
              <input className="mt-1 h-5 w-5 shrink-0 accent-[#075b82]" type="radio" name={`${id}-pack`} checked={packaging === option} onChange={() => setPackaging(option)} />
              <span><strong>{t[option]}</strong>{option === "standard" ? ` · ${t.free}` : quote && ` · +${money(quote.premiumFee)}`}
                {option === "premium" && <small className="mt-1 block">{t.tiers}</small>}
              </span>
            </label>)}
          </div>
        </fieldset>
        <label htmlFor={`${id}-date`} className="mt-5 block font-semibold">{t.date}</label>
        <input id={`${id}-date`} type="date" value={date} onChange={e => setDate(e.target.value)} className={field} />
        <label htmlFor={`${id}-wishes`} className="mt-5 block font-semibold">{t.wishes}</label>
        <textarea id={`${id}-wishes`} value={wishes} onChange={e => setWishes(e.target.value)} maxLength={700} rows={2} placeholder={t.placeholder} className={field} />
      </div>
      <aside className="min-w-0 rounded-xl bg-white p-5 sm:p-6 lg:sticky lg:top-48">
        <h3 className="text-xl">{t.summary}</h3>
        <div aria-live="polite" className="mt-4">{quote ? <>
          <ul className="divide-y divide-[#d9e7ee]">{quote.lines.map(({ fish, weight, cents }) => <li key={fish.id} className="flex flex-wrap justify-between gap-1 py-2"><span>{fish[lang]} · {weight} g</span><strong>{money(cents)}</strong></li>)}</ul>
          <dl className="mt-3 border-t border-[#bfd6df] pt-3">{[[t.weight, `${quote.grams} g`], [t.subtotal, money(quote.subtotal)], [t[packaging], money(quote.fee)], [t.total, money(quote.total)]].map(([label, value]) => <div key={label} className="flex justify-between gap-2 py-1 last:mt-2 last:border-t last:pt-3 last:text-lg last:font-bold"><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </> : <p>{hasSelection ? t.invalid : t.empty}</p>}</div>
        {error && !quote && <p role="alert" className="mt-3 font-semibold text-[#a61f2b]">{hasSelection ? t.invalid : t.empty}</p>}
        <button type="submit" disabled={!ready} className="knop knop-navy mt-4 min-h-12 w-full whitespace-normal">{t.button} →</button>
        <p className="mt-3 text-sm leading-6">{t.note}</p>
      </aside>
    </form>
  </section>;
}
