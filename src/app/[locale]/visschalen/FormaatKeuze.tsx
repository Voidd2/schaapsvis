"use client";

import { useSearchParams } from "next/navigation";
import { feestdagenBedrag } from "@/lib/feestdagen-producten";
import { selectedPlatter, platterSelectionParams, platterDetailHref, type PlatterFamily } from "@/lib/platter-families";
import { useInteractive } from "@/lib/use-interactive";
import { SelectieGalerij, type SelectieGalerijKaart } from "./SelectieGalerij";

export function FormaatKeuze({ id, family, locale, title, description, label, kaarten, tekst }: {
  family: PlatterFamily; locale: string;
  id: string; title: string; description: string; label: string;
  kaarten: (SelectieGalerijKaart & { formaat: string; prijs: number })[];
  tekst: { open: string; close: string; previous: string; next: string; counter: string };
}) {
  const params = useSearchParams();
  const slug = selectedPlatter(family, params).slug;
  const interactive = useInteractive();
  const selected = kaarten.find(item => item.slug === slug) ?? kaarten[0];
  const kaart = { ...selected, detailsHref: platterDetailHref(locale, selected.slug, params.toString()) };
  function selectSize(value: string) {
    const url = new URL(window.location.href);
    url.search = platterSelectionParams(url.search, family, value).toString();
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
  return <section className="platter-choice" id={id} aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>{title}</h3>
    <p className="sr-only" role="status">{kaart.naam}. {kaart.prijsTekst}</p>
    <SelectieGalerij kaarten={[kaart]} tekst={tekst} family={{ description, sizeControl:
      <label className="platter-size" htmlFor={`${id}-size`}>{label}
        <select id={`${id}-size`} disabled={!interactive} value={kaart.slug} onChange={event => selectSize(event.target.value)}>
          {kaarten.map(item => <option key={item.slug} value={item.slug}>{item.formaat} · {feestdagenBedrag(Math.round(item.prijs * 100), locale)}</option>)}
        </select>
      </label>
    }} />
  </section>;
}
