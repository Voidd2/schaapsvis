import { getTranslations } from "next-intl/server";
import { BEDRIJF, VERKOOPPUNTEN } from "@/lib/bedrijf";
import { Beeld } from "@/components/ui/Beeld";

export async function Locations({ locale, only }: { locale: string; only?: "leiden" | "markt" | "voorschoten" }) {
  const t = await getTranslations({ locale, namespace: "plekken" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });
  const entries = [
    { id: "winkel", name: "winkelNaam", image: "winkelGevel" as const, address: `${BEDRIJF.adres.straat}, ${BEDRIJF.adres.postcode} Leiden`, hours: `${t("diVr")} 09:00–18:00 · ${t("za")} 09:00–17:00` },
    { id: "markt-woensdag", name: "woensdagNaam", image: "marktWoensdag" as const, address: t("woensdagAdres"), hours: `${t("wo")} 08:30–17:00` },
    { id: "markt", name: "zaterdagNaam", image: "marktZaterdag" as const, address: t("zaterdagAdres"), hours: `${t("za")} 08:30–17:00` },
    { id: "voorschoten", name: "voorschotenNaam", image: "marktVoorschoten" as const, address: t("voorschotenAdres"), hours: `${t("vr")} 08:30–17:30` },
  ].filter(p => !only || (only === "leiden" ? p.id === "winkel" : only === "markt" ? p.id.startsWith("markt") : p.id === "voorschoten"));
  return <div className="grid md:grid-cols-2 gap-x-10 gap-y-12">{entries.map(p => <article key={p.id}>
    <Beeld naam={p.image} verhouding="liggend" />
    <h3 className="text-xl mt-5 mb-2">{t(p.name)}</h3>
    <p>{p.address}</p><p className="my-2">{p.hours}</p>
    <a href={VERKOOPPUNTEN.find(v=>v.id===p.id)!.mapsUrl} className="font-semibold underline underline-offset-4" target="_blank" rel="noopener noreferrer">{g("route")} →</a>
  </article>)}</div>;
}
