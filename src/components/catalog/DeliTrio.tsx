"use client";

import { useState, type FormEvent } from "react";
import { deliDraft, deliGroups, deliLanguage, deliQuote, initialSlots, type Slot } from "@/lib/deli-trio";
import { feestdagenBedrag } from "@/lib/feestdagen-producten";
import { giftRequestCopy } from "@/lib/gift-request";
import { useInteractive } from "@/lib/use-interactive";
import { ProductQuantity } from "./RequestControls";

const copy = [
  { title: "Stel uw eigen trio samen", intro: "Kies voor elk vakje vis of salade en vul het gewicht in.", slot: "Vakje", grams: "Gram", option: "Kies een soort", groups: ["Vis", "Salades"], incomplete: "Vul alle drie de vakjes in voor uw totaalprijs.", other: "Andere wensen of allergieën?" },
  { title: "Create your own trio", intro: "Choose seafood or salad and enter a weight for each compartment.", slot: "Compartment", grams: "Grams", option: "Choose a variety", groups: ["Seafood", "Salads"], incomplete: "Complete all three compartments to see your price.", other: "Other preferences or allergies?" },
  { title: "Eigenes Trio zusammenstellen", intro: "Wählen Sie für jedes Fach Fisch oder Salat und geben Sie das Gewicht ein.", slot: "Fach", grams: "Gramm", option: "Sorte wählen", groups: ["Fisch", "Salate"], incomplete: "Füllen Sie alle drei Fächer aus, um den Gesamtpreis zu sehen.", other: "Weitere Wünsche oder Allergien?" },
];

export function DeliTrio({ locale, slug, product }: { locale: string; slug: string; product: string }) {
  const [slots, setSlots] = useState(() => initialSlots(slug));
  const [open, setOpen] = useState(false);
  const ready = useInteractive();
  const [wishes, setWishes] = useState("");
  const lang = deliLanguage(locale), t = copy[lang], gift = giftRequestCopy(locale);
  const money = (cents: number) => feestdagenBedrag(cents, locale);
  const quote = deliQuote(slots);
  function update(index: number, change: Partial<Slot>) {
    setSlots(current => current.map((slot, i) => i === index ? { ...slot, ...change } : slot));
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const href = deliDraft(locale, product, slots, wishes);
    if (href) window.location.assign(href);
  }
  return <div className="deli-trio mt-4 min-w-0">
    <details onToggle={event => setOpen(event.currentTarget.open)} className="rounded-xl border border-[#bad3dd] bg-[#f0f8fb]">
      <summary className="min-h-12 cursor-pointer rounded-xl px-4 py-3 font-bold text-[#075b82]">{t.title}</summary>
      <form className="space-y-4 px-4 pb-4" onSubmit={submit} aria-label={t.title + " · " + product}>
        <p className="text-sm">{t.intro}</p>
        {slots.map((slot, i) => <fieldset key={i} className="min-w-0 border-t border-[#c6dce4] pt-2">
          <legend className="pr-2 font-semibold">{t.slot} {i + 1}</legend>
          <select required value={slot.choice} aria-label={t.option + " · " + t.slot + " " + (i + 1)} onChange={e => update(i, {choice:e.target.value})} className="min-h-12 w-full min-w-0 rounded-lg border border-[#bfd6df] bg-white px-2">
            <option value="">{t.option}</option>
            {deliGroups.map((group, j) => <optgroup key={j} label={t.groups[j]}>{group.map(item =>
              <option key={item.id} value={item.id}>{item.names[lang]} · {money(item.rate)} / 100 g</option>)}</optgroup>)}
          </select>
          <label className="mt-2 flex items-center gap-2">{t.grams}<span className="sr-only">{t.slot} {i + 1}</span>
            <input type="number" min="1" step="1" required inputMode="numeric" value={slot.grams} onChange={e => update(i, {grams:e.target.value})} className="min-h-12 w-24 rounded-lg border border-[#bfd6df] bg-white px-3" />
          </label>
        </fieldset>)}
        <label className="block text-sm font-semibold">{t.other}
          <textarea rows={2} maxLength={700} value={wishes} onChange={e => setWishes(e.target.value)} className="mt-1 w-full rounded-lg border border-[#bfd6df] bg-white p-2 text-base" />
        </label>
        <div aria-live="polite" className="rounded-lg bg-white p-3">
          {quote ? <><strong>{gift.price} · {money(quote.cents)}</strong><div className="text-sm">{quote.weight} g · {gift.packaging}</div></> : t.incomplete}
        </div>
        <button type="submit" disabled={!ready} className="knop knop-navy min-h-12 w-full whitespace-normal">{gift.button} →</button>
        <p className="text-sm">{wishes.trim() ? gift.customCost : gift.note}</p>
      </form>
    </details>
    {!open && <div className="mt-3"><ProductQuantity slug={slug} locale={locale} /></div>}
  </div>;
}
