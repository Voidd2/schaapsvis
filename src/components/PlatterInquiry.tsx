"use client";
import { useState, type FormEvent } from "react";
import { whatsappLink } from "@/lib/bedrijf";
import { inquiryText, platterInquiryMessage, type PlatterInquiry as InquiryValues } from "@/lib/platter-inquiry";
import { useInteractive } from "@/lib/use-interactive";
import { usePickupToday } from "@/lib/use-pickup-date";
import { validPickupDate } from "@/lib/pickup-date";
import { CounterFields } from "./catalog/AssemblyFields";
import { platterFish, saladCounter, language } from "@/lib/counter-selection";
import { platterWeightLines, readPlatterWeights } from "@/lib/platter-inquiry";
import { cartText } from "@/lib/cart-copy";
export function PlatterInquiry({ locale }: { locale: string }) {
  const t = inquiryText(locale), c = cartText(locale), interactive = useInteractive(), today = usePickupToday();
  const [values, setValues] = useState<InquiryValues>({ kind: "platter", fish: [], weights: {}, excluded: "", presentation: "advice", people: "", amount: "", date: "", dateUnknown: true, budget: "", remarks: "", allergies: "" });
  const message = platterInquiryMessage(locale, values), salads = values.kind === "salads";
  const weightLines = platterWeightLines(locale,values.kind,values.weights ?? {});
  const dateOK = values.dateUnknown || (!!today && !!values.date && validPickupDate(values.date));
  function update<K extends keyof InquiryValues>(key: K, value: InquiryValues[K]) { setValues(current => ({ ...current, [key]: value })); }
  function discuss(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!weightLines) return;
    if (!values.dateUnknown && (!values.date || !validPickupDate(values.date))) return;
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }
  return <form className="platter-inquiry" onSubmit={discuss} onChange={event => { const data = new URLSearchParams(); new FormData(event.currentTarget).forEach((value,key) => data.append(key,String(value))); update("weights",readPlatterWeights(data)); }}>
    <p className="mb-5 request-muted">{c.customNote}</p>
    <div className="platter-inquiry-fields">
      <label className="inquiry-wide">{t.kind}<select name="kind" value={values.kind} onChange={e => update("kind", e.target.value as InquiryValues["kind"])}>{Object.entries(t.kinds).map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
      {!salads && <CounterFields locale={locale} items={platterFish} label={t.fish}/>}
      <CounterFields locale={locale} items={saladCounter} label={["Vissalades naar keuze","Choose seafood salads","Fischsalate wählen"][language(locale)]}/>
      {weightLines && weightLines.length > 0 && <div className="inquiry-wide gift-price-summary" aria-live="polite"><ul>{weightLines.map(line => <li key={line}>{line}</li>)}</ul></div>}
      {!salads && <label className="inquiry-wide">{t.excluded}<input name="excluded" maxLength={300} value={values.excluded} placeholder={t.excludedPlaceholder} onChange={e => update("excluded",e.target.value)} /></label>}
      <label>{t.presentation}<select name="presentation" value={values.presentation} onChange={e => update("presentation",e.target.value as InquiryValues["presentation"])}>{Object.entries(t.presentations).map(([value,text]) => <option key={value} value={value}>{text}</option>)}</select></label>
      {salads ? <label>{t.amount}<input name="amount" required={!weightLines?.length} maxLength={120} value={values.amount} onChange={e => update("amount",e.target.value)} /><small className="request-muted">{t.amountHint}</small></label> : <label>{t.people}<input name="people" type="number" min="1" step="1" required value={values.people} onChange={e => update("people",e.target.value)} /></label>}
      <div><label htmlFor="platter-collection-date">{t.date}</label><input id="platter-collection-date" type="date" min={today || undefined} disabled={values.dateUnknown} required={!values.dateUnknown} aria-invalid={!dateOK} aria-describedby={!dateOK ? "inquiry-date-error" : undefined} value={values.date} onChange={e => update("date",e.target.value)} /><label className="platter-date-unknown"><input type="checkbox" checked={values.dateUnknown} onChange={e => update("dateUnknown",e.target.checked)} />{t.unknown}</label>{!dateOK && <p id="inquiry-date-error" role="alert" className="text-red-800 mt-2">{c.dateError}</p>}</div>
      <label>{t.budget}<input name="budget" type="number" min="0" step="0.01" value={values.budget} onChange={e => update("budget",e.target.value)} /></label>
      <label>{t.remarks}<textarea name="remarks" rows={3} maxLength={1000} value={values.remarks} onChange={e => update("remarks",e.target.value)} /></label>
      <label>{t.allergies}<textarea name="allergies" rows={3} maxLength={500} value={values.allergies} onChange={e => update("allergies",e.target.value)} /><small className="request-muted">{t.allergyNote}</small></label>
    </div>
    <button type="submit" className="knop knop-navy mt-6" disabled={!interactive || !dateOK || !weightLines}>{t.button}</button>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed">{t.note}</p>
    <details className="mt-5"><summary className="cursor-pointer underline underline-offset-4">{t.preview}</summary><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed" data-platter-draft>{message}</p></details>
  </form>;
}
