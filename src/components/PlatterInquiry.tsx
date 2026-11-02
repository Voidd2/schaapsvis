"use client";

import { useState, type FormEvent } from "react";
import { whatsappLink } from "@/lib/bedrijf";
import { inquiryText, platterInquiryMessage, type PlatterInquiry as InquiryValues } from "@/lib/platter-inquiry";
import { useInteractive } from "@/lib/use-interactive";

export function PlatterInquiry({ locale }: { locale: string }) {
  const t = inquiryText(locale);
  const interactive = useInteractive();
  const [values, setValues] = useState<InquiryValues>({ preference: "advies", people: "", use: "advies", date: "", dateUnknown: true, budget: "", wishes: "" });
  const message = platterInquiryMessage(locale, values);
  function update<K extends keyof InquiryValues>(key: K, value: InquiryValues[K]) {
    setValues(current => ({ ...current, [key]: value }));
  }
  function discuss(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Only this deliberate, validated action opens WhatsApp; nothing is sent.
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }
  return <form className="platter-inquiry" onSubmit={discuss}>
    <div className="platter-inquiry-fields">
      <label>{t.preference}<select value={values.preference} onChange={e => update("preference", e.target.value as InquiryValues["preference"])}>{Object.entries(t.preferences).map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
      <label>{t.people}<input type="number" min="1" step="1" required value={values.people} onChange={e => update("people", e.target.value)} /></label>
      <label>{t.use}<select value={values.use} onChange={e => update("use", e.target.value as InquiryValues["use"])}>{Object.entries(t.uses).map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
      <div>
        <label htmlFor="platter-collection-date">{t.date}</label>
        <input id="platter-collection-date" type="date" disabled={values.dateUnknown} required={!values.dateUnknown} value={values.date} onChange={e => update("date", e.target.value)} />
        <label className="platter-date-unknown"><input type="checkbox" checked={values.dateUnknown} onChange={e => update("dateUnknown", e.target.checked)} />{t.unknown}</label>
      </div>
      <label>{t.budget}<input type="number" min="0" step="0.01" value={values.budget} onChange={e => update("budget", e.target.value)} /></label>
      <label>{t.wishes}<textarea rows={3} maxLength={1000} value={values.wishes} onChange={e => update("wishes", e.target.value)} /></label>
    </div>
    <button type="submit" className="knop knop-navy mt-6" disabled={!interactive}>{t.button}</button>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed">{t.note}</p>
    <details className="mt-5"><summary className="cursor-pointer underline underline-offset-4">{t.preview}</summary><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed" data-platter-draft>{message}</p></details>
  </form>;
}
