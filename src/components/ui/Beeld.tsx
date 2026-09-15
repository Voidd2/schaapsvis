import { BEELD, type BeeldNaam, type Verhouding } from "@/lib/beeld";
import { useTranslations } from "next-intl";

/**
 * Een beeldvlak op de site.
 *
 * Is er een foto, dan staat die er. Is die er nog niet, dan komt er geen
 * gebroken plaatje en geen leeg gat, maar een zandvlak met de naam erin — zoals
 * een kaartje bij de vis in de toonbank. Dat ziet er bewust uit in plaats van
 * kapot, en het maakt meteen zichtbaar waar nog een foto hoort.
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
  const t = useTranslations("site");
  const label = t(`images.${naam}`);
  const vorm = VERHOUDING[verhouding ?? plek.verhouding];

  return (
    <div
      className={`w-full ${vorm} flex items-center justify-center overflow-hidden ${klasse}`}
      style={{
        backgroundColor: plek.bestand ? "#fff" : "var(--sand)",
        ...(streep ? { borderBottom: `2px solid ${streep}` } : {}),
      }}
    >
      {plek.bestand ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={plek.bestand}
          alt={`${label} — Schaap’s Vishandel, Leiden`}
          className={`w-full h-full ${vullend ? "object-cover" : "object-contain p-5"}`}
          loading={prioriteit ? "eager" : "lazy"}
          fetchPriority={prioriteit ? "high" : undefined}
        />
      ) : (
        <span
          className="px-6 text-center text-[1.15rem] md:text-[1.4rem] leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--navy)",
            opacity: 0.45,
          }}
        >
          <span className="block">{label}<span className="block text-xs tracking-wide mt-3">{t("photo")}</span></span>
        </span>
      )}
    </div>
  );
}

/** Staat er al een foto op deze plek? Voor blokken die zonder foto anders leeg zijn. */
export function heeftBeeld(naam: BeeldNaam): boolean {
  return BEELD[naam].bestand !== "";
}
