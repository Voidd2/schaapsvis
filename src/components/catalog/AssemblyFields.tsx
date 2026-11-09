import { assemblyQuote, boxLabel, byAgreement, deluxeSalads, fishCounter, language, saladCounter, unit, type Assembly, type CounterItem } from "@/lib/counter-selection";
import { feestdagenBedrag } from "@/lib/feestdagen-producten";
import { GIFT_BOX, packagePriceCents, STANDARD_FISH_TRIO } from "@/lib/gift-pricing";
import { giftRequestCopy } from "@/lib/gift-request";

export function CounterFields({locale,items,label,step=1,group=""}:{locale:string;items:CounterItem[];label:string;step?:number;group?:string}) {
  const i = language(locale);
  return <fieldset className={`inquiry-wide counter-picker ${group}`}><legend>{label}</legend>
    <div className="composer-fish">{items.map(item => <div key={item.id} className="composer-fish-row">
      <label><input type="checkbox" name="fish" value={item.id} aria-label={item.names[i]} />{item.names[i]}
        <small>{item.rate === null ? byAgreement(locale) : feestdagenBedrag(item.rate,locale) + " " + unit(locale)}</small>
      </label>
      <label className="composer-weight">{["Gewicht in gram","Weight in grams","Gewicht in Gramm"][i]}
        <input type="number" inputMode="numeric" name={"weight-"+item.id} aria-label={item.names[i]+" (g)"} step={step} min={step} max="100000" defaultValue="100" />
      </label>
    </div>)}</div></fieldset>;
}

export function AssemblyFields({mode,locale}:{mode:Assembly;locale:string}) {
  const i = language(locale), t = giftRequestCopy(locale), money = (v:number) => feestdagenBedrag(v,locale);
  const gift = ["gift-trio","package","custom"].includes(mode);
  const fishTrio = mode === "fish-trio" || mode === "gift-trio";
  const salad = mode === "salad-trio" || mode === "deluxe-salad";
  const items = salad ? saladCounter : fishCounter;
  const choices = mode === "deluxe-salad" ? deluxeSalads : items;
  return <>
    {mode === "package" && <label>{t.format}<select name="size" defaultValue="own"><option value="own">{["Zelf vullen","Choose all contents","Selbst befüllen"][i]}</option>
      {t.sizes.map((size,n) => <option key={size} value={n}>{size} · {money(packagePriceCents(n)!)}</option>)}</select></label>}
    {(fishTrio || salad) && <fieldset><legend>{fishTrio ? t.fish : ["Kies uw salade","Choose your salad","Salat wählen"][i]}</legend>
      <p>{fishTrio ? "3 × 40 g · " + money(STANDARD_FISH_TRIO) : money(mode === "salad-trio" ? 1199 : 1599)}</p>
      {Array.from({length:mode === "deluxe-salad" ? 1 : 3},(_,n) => <label key={n} className="block my-2">{["Keuze","Choice","Auswahl"][i]} {n+1}
        <select name={"choice"+n} defaultValue={choices[n].id}>{choices.map(item => <option key={item.id} value={item.id}>{item.names[i]}</option>)}</select>
      </label>)}</fieldset>}
    <CounterFields locale={locale} items={items} step={fishTrio || salad ? 100 : 1} label={fishTrio || salad ? ["Extra toevoegen per 100 g","Add extra in 100 g portions","Extras je 100 g"][i] : ["Kies vis en gewicht","Choose fish and weight","Fisch und Gewicht wählen"][i]} />
    {gift && <>
      <label><input type="checkbox" name="box" value="yes" /> {boxLabel(locale)} + {money(GIFT_BOX)}</label>
      <label>{t.voucherAmount} <small>({["optioneel","optional","optional"][i]})</small><input name="voucher" type="number" min=".01" step=".01" /></label>
    </>}
    <label>{t.wishes}<textarea name="wishes" rows={2} maxLength={700} /></label>
  </>;
}

export function assemblyDefaults(mode:Assembly) {
  const items = mode === "deluxe-salad" ? deluxeSalads : mode === "salad-trio" ? saladCounter : fishCounter;
  return new URLSearchParams(items.slice(0,3).map((item,i) => ["choice"+i,item.id]));
}
export function AssemblySummary({mode,locale,data}:{mode:Assembly;locale:string;data:URLSearchParams}) {
  const quote = assemblyQuote(mode,locale,data);
  const i = language(locale);
  return <div className="gift-price-summary" aria-live="polite">{quote
    ? <><strong>{["Totaal","Total","Gesamt"][i]} · {feestdagenBedrag(quote.total,locale)}</strong><ul>{quote.lines.map(line => <li key={line}>{line}</li>)}</ul></>
    : <p>{["Vul uw keuze in om de prijs te zien.","Complete your selection to see the price.","Treffen Sie Ihre Auswahl, um den Preis zu sehen."][i]}</p>}</div>;
}

export function AssemblyForm({mode,locale,product,slug,live,onEdit}:{mode:Assembly;locale:string;product:string;slug?:string;live?:URLSearchParams;onEdit?:(form:HTMLFormElement)=>void}) {
  const i = language(locale);
  return <details className="native-composer"><summary>{mode === "deluxe-salad" || mode === "salad-trio" ? ["Kies uw salades","Choose your salads","Salate auswählen"][i]
    : mode === "fish-trio" || mode === "gift-trio" ? ["Stel uw vistrio samen","Create your fish trio","Fischtrio zusammenstellen"][i]
    : ["Stel uw cadeaupakket samen","Create your gift package","Geschenkpaket zusammenstellen"][i]}</summary>
    <form aria-label={product} className="native-composer-form" action="/api/samenstellen" method="post" target="_blank" rel="noopener noreferrer" onChange={onEdit && (e=>onEdit(e.currentTarget))}>
      <input type="hidden" name="kind" value="assembly"/><input type="hidden" name="mode" value={mode}/><input type="hidden" name="locale" value={locale}/>
      {slug && <input type="hidden" name="slug" value={slug}/>}
      <AssemblyFields mode={mode} locale={locale}/>
      {live && <AssemblySummary mode={mode} locale={locale} data={live}/>}
      <button type="submit" className="knop knop-navy">{["Bekijk mijn WhatsApp-concept","Review my WhatsApp draft","WhatsApp-Entwurf ansehen"][i]} →</button>
    </form></details>;
}
