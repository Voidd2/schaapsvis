"use client";

import { useState, type FormEvent } from "react";
import { gourmetDefaults, gourmetFish, gourmetLanguage, gourmetQuote, gourmetRequestCopy, type Portions } from "@/lib/gourmet-request";
import { gourmetRates, MARINADE_CENTS_PER_100G } from "@/lib/gourmet-pricing";
import { feestdagenBedrag } from "@/lib/feestdagen-producten";
import { addCartSelection, useCatalogRequest } from "@/lib/catalog-request-store";
import { cartText } from "@/lib/cart-copy";

function readSelection(form: HTMLFormElement) {
  const values = new FormData(form);
  const selected = new Set(values.getAll("fish"));
  const portions: Portions = {};
  const marinated: string[] = [];
  for (const fish of gourmetFish) {
    if (!selected.has(fish.id)) continue;
    const weight = form.elements.namedItem("weight-" + fish.id) as HTMLInputElement;
    portions[fish.id] = weight.value;
    const toggle = form.querySelector<HTMLInputElement>(`input[name="marinade"][value="${fish.id}"]`);
    if (toggle?.checked) marinated.push(fish.id);
  }
  return {portions, marinated};
}

export function GourmetRequest({locale, preset}: {locale:string; preset:string}) {
  const t = gourmetRequestCopy(locale), lang = gourmetLanguage(locale);
  const money = (cents: number) => feestdagenBedrag(cents, locale);
  const initial = gourmetDefaults(preset);
  const [selection,setSelection] = useState({portions:initial.portions, marinated:[] as string[]});
  const [error,setError] = useState(false);
  const { ready } = useCatalogRequest();
  const quote = gourmetQuote(selection.portions,selection.marinated);

  function submit(event: FormEvent<HTMLFormElement>) {
    if (!ready) return;
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const { portions, marinated } = readSelection(form);
    const data = new URLSearchParams({kind:"gourmet", packaging:"standard", people:String(values.get("people") ?? "")});
    for (const [id,weight] of Object.entries(portions)) {
      data.append("fish",id);
      data.set("weight-" + id,weight);
    }
    for (const id of marinated) data.append("marinade",id);
    setError(!addCartSelection(data,locale,String(values.get("wishes") ?? "")));
  }

  return <form className="gourmet-builder" aria-label={t.title} action="/api/samenstellen" method="post" target="_blank"
    onSubmit={submit} onChange={event=>{setSelection(readSelection(event.currentTarget));setError(false);}}>
    <input type="hidden" name="kind" value="gourmet"/><input type="hidden" name="locale" value={locale}/>
    <input type="hidden" name="packaging" value="standard"/>
    <div className="gourmet-selections">
      <label className="gourmet-people">{t.people}<input name="people" type="number" inputMode="numeric" required min="1" max="200" defaultValue={initial.people}/></label>
      <fieldset><legend>{t.fish}</legend>
        <div className="gourmet-fish-list">{gourmetFish.map(fish=>{
          const name = fish[lang];
          const disabled = ready && selection.portions[fish.id] === undefined;
          return <div className="gourmet-fish" key={fish.id}>
            <label className="gourmet-toggle">
              <input type="checkbox" name="fish" value={fish.id} defaultChecked={initial.portions[fish.id] !== undefined} aria-label={name}/>
              <span><strong>{name}</strong><small>{money(gourmetRates[fish.id])} {t.unit}</small></span>
            </label>
            <div className="gourmet-fish-options">
              <label>{t.grams}<span className="sr-only"> · {name}</span>
                <input type="number" inputMode="numeric" min="1" max="100000" step="1" disabled={disabled} name={"weight-"+fish.id} defaultValue={initial.portions[fish.id] ?? "100"}/>
              </label>
              <label className="gourmet-marinade"><input type="checkbox" name="marinade" value={fish.id} disabled={disabled}/>
                <span>{t.marinated}<span className="sr-only"> · {name}</span><small>+{money(MARINADE_CENTS_PER_100G)} {t.unit}</small></span>
              </label>
            </div>
          </div>;
        })}</div>
      </fieldset>
      <label className="gourmet-wishes">{t.wishes}<textarea name="wishes" rows={2} maxLength={700} /></label>
    </div>
    <aside className="gourmet-summary">
      <h2>{t.summary}</h2>
      <div className="gourmet-live" aria-live="polite">{quote ? <>
        <ul>{quote.lines.map(({fish,weight,cents,seasoned})=><li key={fish.id}><span>{fish[lang]} · {weight} g<small>{seasoned ? t.marinated : t.plain}</small></span><strong>{money(cents)}</strong></li>)}</ul>
        <dl><div><dt>{t.weight}</dt><dd>{quote.grams} g</dd></div>
          <div><dt>{t.subtotal}</dt><dd>{money(quote.fishCents)}</dd></div>
          <div><dt>{t.marinade}</dt><dd>{money(quote.marinadeCents)}</dd></div>
          <div><dt>{t.standard}</dt><dd>{t.free}</dd></div>
          <div className="gourmet-total"><dt>{t.total}</dt><dd>{money(quote.total)}</dd></div>
        </dl>
      </> : <p>{Object.keys(selection.portions).length ? t.invalid : t.empty}</p>}</div>
      {error && <p role="alert">{cartText(locale).invalidChoice}</p>}
      <button className="knop knop-navy gourmet-add" type="submit">{cartText(locale).add}</button>
      <noscript><style>{".gourmet-live,.gourmet-add{display:none}"}</style><button type="submit" className="knop knop-navy">{["Aanvraag zonder winkelwagen bekijken","Review request without the basket","Anfrage ohne Warenkorb prüfen"][locale === "en" ? 1 : locale === "de" ? 2 : 0]}</button></noscript>
      <p className="mt-3 text-sm">{t.note}</p>
    </aside>
  </form>;
}
