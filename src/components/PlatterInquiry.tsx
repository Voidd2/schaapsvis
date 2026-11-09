"use client";
import { useState, type FormEvent } from "react";
import { addCartSelection, useCatalogRequest } from "@/lib/catalog-request-store";
import { inquiryText, type PlatterInquiry as InquiryValues } from "@/lib/platter-inquiry";
import { CounterFields } from "./catalog/AssemblyFields";
import { platterFish, saladCounter, language } from "@/lib/counter-selection";
import { platterWeightLines, readPlatterWeights } from "@/lib/platter-inquiry";
import { cartText } from "@/lib/cart-copy";
export function PlatterInquiry({ locale }: { locale: string }) {
  const t = inquiryText(locale), c = cartText(locale);
  const { ready } = useCatalogRequest();
  const [error, setError] = useState(false);
  const [values, setValues] = useState<InquiryValues>({ kind: "platter", fish: [], weights: {}, excluded: "", presentation: "advice", people: "", amount: "", date: "", dateUnknown: true, budget: "", remarks: "", allergies: "" });
  const salads = values.kind === "salads";
  const weightLines = platterWeightLines(locale,values.kind,values.weights ?? {});
  function update<K extends keyof InquiryValues>(key: K, value: InquiryValues[K]) { setValues(current => ({ ...current, [key]: value })); }
  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new URLSearchParams({kind:"platter", selection:values.kind, presentation:values.presentation, people:salads ? "" : values.people, budget:values.budget});
    for (const [id, grams] of Object.entries(values.weights ?? {})) {
      data.append("fish", id);
      data.set("weight-" + id, grams);
    }
    const notes = [[t.amount, salads && values.amount], [t.excludedMessage, !salads && values.excluded],
      [t.remarksMessage, values.remarks], [t.allergiesMessage, values.allergies]];
    const note = notes.filter(([, value]) => value).map(([label, value]) => label + ": " + value).join("\n");
    setError(!addCartSelection(data, locale, note));
  }
  return <form className="platter-inquiry" onSubmit={add} onChange={event => { setError(false); const data = new URLSearchParams(); new FormData(event.currentTarget).forEach((value,key) => data.append(key,String(value))); update("weights",readPlatterWeights(data)); }}>
    <p className="mb-5 request-muted">{c.customNote}</p>
    <div className="platter-inquiry-fields">
      <label className="inquiry-wide">{t.kind}<select name="kind" value={values.kind} onChange={e => update("kind", e.target.value as InquiryValues["kind"])}>{Object.entries(t.kinds).map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
      {!salads && <CounterFields locale={locale} items={platterFish} label={t.fish}/>}
      <CounterFields locale={locale} items={saladCounter} label={["Vissalades naar keuze","Choose seafood salads","Fischsalate wählen"][language(locale)]}/>
      {weightLines && weightLines.length > 0 && <div className="inquiry-wide gift-price-summary" aria-live="polite"><ul>{weightLines.map(line => <li key={line}>{line}</li>)}</ul></div>}
      {!salads && <label className="inquiry-wide">{t.excluded}<input name="excluded" maxLength={300} value={values.excluded} placeholder={t.excludedPlaceholder} onChange={e => update("excluded",e.target.value)} /></label>}
      <label>{t.presentation}<select name="presentation" value={values.presentation} onChange={e => update("presentation",e.target.value as InquiryValues["presentation"])}>{Object.entries(t.presentations).map(([value,text]) => <option key={value} value={value}>{text}</option>)}</select></label>
      {salads ? <label>{t.amount}<input name="amount" required={!weightLines?.length} maxLength={120} value={values.amount} onChange={e => update("amount",e.target.value)} /><small className="request-muted">{t.amountHint}</small></label> : <label>{t.people}<input name="people" type="number" min="1" step="1" required value={values.people} onChange={e => update("people",e.target.value)} /></label>}
      <label>{t.budget}<input name="budget" type="number" min="0" step="0.01" value={values.budget} onChange={e => update("budget",e.target.value)} /></label>
      <label>{t.remarks}<textarea name="remarks" rows={3} maxLength={1000} value={values.remarks} onChange={e => update("remarks",e.target.value)} /></label>
      <label>{t.allergies}<textarea name="allergies" rows={3} maxLength={500} value={values.allergies} onChange={e => update("allergies",e.target.value)} /><small className="request-muted">{t.allergyNote}</small></label>
    </div>
    {error && <p role="alert">{c.invalidChoice}</p>}
    <button type="submit" className="knop knop-navy mt-6" disabled={!ready || !weightLines}>{c.add}</button>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed">{t.note}</p>
  </form>;
}
