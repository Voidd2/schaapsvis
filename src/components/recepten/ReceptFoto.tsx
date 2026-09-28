import type { ReceptBeeld } from "@/lib/recepten";

/**
 * Het beeldvlak bij een recept.
 *
 * Altijd vierkant, altijd hetzelfde formaat, zodat een lijst met recepten een
 * rustig raster blijft. Is er (nog) geen foto, dan komt er geen leeg vak maar
 * een naamvlak — hetzelfde als bij het assortiment, zodat het als één site leest.
 */
export function ReceptFoto({
  beeld,
  titel,
  klein = false,
}: {
  beeld: ReceptBeeld;
  titel: string;
  /** In een lijst iets kleinere letters in het naamvlak. */
  klein?: boolean;
}) {
  return (
    <div
      className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: beeld.src ? "#fff" : "var(--sand)",
        borderBottom: "2px solid var(--gold)",
      }}
    >
      {beeld.src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={beeld.src}
          alt={beeld.alt}
          className={beeld.bijschrift ? "w-full h-full object-contain p-5" : "w-full h-full object-cover"}
          loading="lazy"
          width={1400}
          height={1050}
        />
      ) : (
        <span
          className="px-5 text-center"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--navy)",
            fontSize: klein ? "1.05rem" : "1.5rem",
            lineHeight: 1.25,
            opacity: 0.5,
          }}
        >
          {titel}
        </span>
      )}
    </div>
  );
}
