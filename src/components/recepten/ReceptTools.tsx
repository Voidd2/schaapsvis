"use client";
import { useState } from "react";
import { Printer, ListChecks } from "lucide-react";
import { recipeCopy } from "@/lib/recipe-copy";
export function ReceptTools({ items, locale = "nl" }: { items: string[]; locale?:string }) {
  const c=recipeCopy(locale);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  return <div className="recipe-tools">
    <div className="flex flex-wrap gap-3">
      <button type="button" className="knop knop-lijn" onClick={() => window.print()}><Printer size={17} aria-hidden /> {c.print}</button>
      <button type="button" className="knop knop-lijn" aria-expanded={open} aria-controls="boodschappenlijst" onClick={() => setOpen(!open)}><ListChecks size={17} aria-hidden /> {c.check}</button>
      <a className="knop knop-navy" href="#bereiding">{c.jump}</a>
    </div>
    {open && <div id="boodschappenlijst" className="recipe-checklist mt-6"><h2 className="text-xl mb-3">{c.list}</h2><p className="text-sm mb-4">{checked.length} {c.of} {items.length} {c.checked}. {c.temporary}</p>{items.map(item => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={e => setChecked(e.target.checked ? [...checked,item] : checked.filter(x => x !== item))} /><span className={checked.includes(item) ? "line-through opacity-60" : ""}>{item}</span></label>)}</div>}
  </div>;
}
