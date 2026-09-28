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
          alt={plek.alt}
          className={`w-full h-full ${vullend ? "object-cover" : "object-contain p-5"}`}
          loading={prioriteit ? "eager" : "lazy"}
          fetchPriority={prioriteit ? "high" : undefined}
        />
      }
    </div>
  );
}

/** Staat er al een foto op deze plek? Voor blokken die zonder foto anders leeg zijn. */
export function heeftBeeld(naam: BeeldNaam): boolean {
  return BEELD[naam].bestand !== "";
}
