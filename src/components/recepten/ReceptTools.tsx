"use client";
import { useState } from "react";
import { Printer, ListChecks } from "lucide-react";
export function ReceptTools({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  return <div className="recipe-tools">
    <div className="flex flex-wrap gap-3">
      <button type="button" className="knop knop-lijn" onClick={() => window.print()}><Printer size={17} aria-hidden /> Print het recept</button>
      <button type="button" className="knop knop-lijn" aria-expanded={open} aria-controls="boodschappenlijst" onClick={() => setOpen(!open)}><ListChecks size={17} aria-hidden /> Boodschappen afvinken</button>
      <a className="knop knop-navy" href="#bereiding">Direct naar de bereiding</a>
    </div>
    {open && <div id="boodschappenlijst" className="recipe-checklist mt-6"><h2 className="text-xl mb-3">Uw boodschappenlijst</h2><p className="text-sm mb-4">{checked.length} van {items.length} afgevinkt. Alleen opgeslagen zolang deze pagina open is.</p>{items.map(item => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={e => setChecked(e.target.checked ? [...checked,item] : checked.filter(x => x !== item))} /><span className={checked.includes(item) ? "line-through opacity-60" : ""}>{item}</span></label>)}</div>}
  </div>;
}
