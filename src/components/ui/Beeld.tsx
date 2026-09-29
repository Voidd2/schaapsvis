"use client";
import { useLocale } from "next-intl";
import { BEELD, type BeeldNaam, type Verhouding } from "@/lib/beeld";

/**
 * Een beeldvlak op de site.
 *
 * Is er een foto, dan staat die er. Zonder foto wordt geen leeg vlak gerenderd.
 * Winkel- en historische foto's moeten echte eigenaarfoto's blijven.
 *
 * Welke foto's de site wil hebben staat in `src/lib/beeld.ts`.
 */

const VERHOUDING: Record<Verhouding, string> = {
  vierkant: "aspect-square",
  liggend: "aspect-[4/3]",
  portret: "aspect-[3/4]",
  breed: "aspect-[16/6]",
};

export function Beeld({
  naam,
  verhouding,
  klasse = "",
  /** Een randje onderaan in de categoriekleur, zoals bij het assortiment. */
  streep = "var(--sand-diep)",
  /** Voor een foto die het vlak mag vullen in plaats van erin passen. */
  vullend = true,
  prioriteit = false,
}: {
  naam: BeeldNaam;
  verhouding?: Verhouding;
  klasse?: string;
  streep?: string | null;
  vullend?: boolean;
  prioriteit?: boolean;
}) {
  const locale = useLocale();
  const plek = BEELD[naam];
  // Do not reserve a giant empty photo box when an owner photo is unavailable.
  if (!plek.bestand) return null;
  const vorm = VERHOUDING[verhouding ?? plek.verhouding];

  return (
    <div
      className={`w-full ${vorm} flex items-center justify-center overflow-hidden ${klasse}`}
      style={{
        backgroundColor: plek.bestand ? "#fff" : "var(--sand)",
        ...(streep ? { borderBottom: `2px solid ${streep}` } : {}),
      }}
    >
      {
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={plek.bestand}
          alt={locale === "nl" ? plek.alt : ALT[naam][locale === "de" ? 1 : 0]}
          className={`w-full h-full ${vullend ? "object-cover" : "object-contain p-5"}`}
          loading={prioriteit ? "eager" : "lazy"}
          fetchPriority={prioriteit ? "high" : undefined}
        />
      }
    </div>
  );
}

const ALT:Record<BeeldNaam,readonly [string,string]> = {
logoBadge:["Schaap’s Vishandel logo, Leiden, since 1938","Logo von Schaap’s Vishandel in Leiden, seit 1938"],
logoLiggend:["Schaap’s Vishandel, Leiden","Schaap’s Vishandel, Leiden"],
winkelGevel:["Schaap’s fish shop at Herenstraat 48, Leiden","Schaap’s Fischgeschäft an der Herenstraat 48 in Leiden"],
toonbank:["Fresh cod from our range","Frischer Kabeljau aus unserem Sortiment"],
achterDeToonbank:["Behind the counter at Schaap’s Vishandel, Leiden","Hinter der Theke bei Schaap’s Vishandel in Leiden"],
gebakkenVis:["Crispy kibbeling with sauce","Knuspriger Kibbeling mit Sauce"],
marktZaterdag:["Schaap’s fish stall on Aalmarkt near De Waag, Leiden","Schaap’s Fischstand am Aalmarkt bei De Waag in Leiden"],
marktWoensdag:["Schaap’s fish stall at Leiden’s Wednesday market","Schaap’s Fischstand auf dem Leidener Mittwochsmarkt"],
marktVoorschoten:["Schaap’s fish stall by Hoogvliet in Voorschoten","Schaap’s Fischstand bei Hoogvliet in Voorschoten"],
historie1938:["Schaap’s Vishandel in Leiden around its founding in 1938","Schaap’s Vishandel in Leiden um die Gründung 1938"],
historie1960:["Schaap’s Vishandel, Leiden, in the 1960s","Schaap’s Vishandel in Leiden in den 1960er Jahren"],
historie1980:["Schaap’s Vishandel, Leiden, in the 1980s","Schaap’s Vishandel in Leiden in den 1980er Jahren"],
historie2000:["Aldert Haasnoot at Schaap’s Vishandel in Leiden","Aldert Haasnoot bei Schaap’s Vishandel in Leiden"],
historieNu:["The team at Schaap’s Vishandel, Leiden, today","Das heutige Team von Schaap’s Vishandel in Leiden"],
schaalBorrel:["Serving suggestion: seafood platter with smoked fish, shrimp and salads","Serviervorschlag: Fischplatte mit Räucherfisch, Garnelen und Salaten"],
schaalFamilie:["Example family platter with smoked salmon, eel, shrimp and salads","Beispiel einer Familienplatte mit Räucherlachs, Aal, Garnelen und Salaten"],
schaalFeest:["Example celebration platter with smoked fish, shrimp, prawns and oysters","Beispiel einer Festplatte mit Räucherfisch, Garnelen und Austern"],
varlaksFilet:["VÅRLAKS salmon fillet at Schaap’s Vishandel, Leiden","VÅRLAKS-Lachsfilet bei Schaap’s Vishandel in Leiden"]
};
