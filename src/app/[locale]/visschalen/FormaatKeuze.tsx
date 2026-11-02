"use client";

import { useState } from "react";
import { useInteractive } from "@/lib/use-interactive";
import { SelectieGalerij, type SelectieGalerijKaart } from "./SelectieGalerij";

export function FormaatKeuze({ id, title, description, label, kaarten, tekst }: {
  id: string; title: string; description: string; label: string;
  kaarten: (SelectieGalerijKaart & { formaat: string })[];
  tekst: { open: string; close: string; previous: string; next: string; counter: string };
}) {
  const [slug, setSlug] = useState(kaarten[0].slug);
  const interactive = useInteractive();
  const kaart = kaarten.find(item => item.slug === slug) ?? kaarten[0];
  return <section className="platter-choice" id={id} aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>{title}</h3>
    <p className="platter-choice-description">{description}</p>
    <label className="platter-size" htmlFor={`${id}-size`}>{label}
      <select id={`${id}-size`} disabled={!interactive} value={kaart.slug} onChange={event => setSlug(event.target.value)}>
        {kaarten.map(item => <option key={item.slug} value={item.slug}>{item.formaat}</option>)}
      </select>
    </label>
    <p className="sr-only" role="status">{kaart.naam}. {kaart.prijsTekst}</p>
    <SelectieGalerij kaarten={[kaart]} tekst={tekst} />
  </section>;
}
