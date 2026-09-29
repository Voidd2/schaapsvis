import type { ReactNode } from "react";

/**
 * De vaste bouwstenen van een pagina.
 *
 * Er zitten precies drie achtergronden in — papier, zand en marineblauw — en
 * secties wisselen elkaar af. Dat is genoeg ritme; meer varianten maken een
 * pagina onrustig en gaan er al snel uitzien als een verzameling losse blokken
 * uit een sjabloon.
 */

type Grond = "papier" | "zand" | "navy" | "wit";

const GROND: Record<Grond, { backgroundColor: string; color?: string }> = {
  papier: { backgroundColor: "var(--cream)" },
  zand: { backgroundColor: "var(--sand)" },
  wit: { backgroundColor: "#fff" },
  navy: { backgroundColor: "var(--navy)", color: "rgba(250,246,239,0.82)" },
};

export function Sectie({
  children,
  grond = "papier",
  smal = false,
  id,
  lijn = false,
}: {
  children: ReactNode;
  grond?: Grond;
  /** Smalle leeskolom in plaats van de volle breedte. */
  smal?: boolean;
  id?: string;
  /** Dunne lijn bovenaan, voor secties met dezelfde achtergrond als de vorige. */
  lijn?: boolean;
}) {
  return (
    <section
      id={id}
      style={{
        ...GROND[grond],
        ...(lijn ? { borderTop: "1px solid var(--linen)" } : {}),
      }}
      className="py-16 md:py-24"
    >
      <div className={`mx-auto px-4 ${smal ? "max-w-3xl" : "max-w-6xl"}`}>{children}</div>
    </section>
  );
}

export function Kop({
  label,
  titel,
  intro,
  donker = false,
  gecentreerd = false,
  als = "h2",
}: {
  label?: string;
  titel: string;
  intro?: string;
  donker?: boolean;
  gecentreerd?: boolean;
  als?: "h1" | "h2";
}) {
  const Titel = als;
  return (
    <div className={`${gecentreerd ? "text-center mx-auto" : ""} max-w-3xl mb-9`}>
      {label && (
        <p className={`kapitaal ${donker ? "kapitaal-licht" : ""} mb-3`}>{label}</p>
      )}
      <Titel
        className={
          als === "h1"
            ? "text-[2.3rem] md:text-[3.2rem] leading-[1.06]"
            : "text-[1.85rem] md:text-[2.5rem] leading-[1.1]"
        }
        style={{ color: donker ? "var(--cream)" : "var(--ink)" }}
      >
        {titel}
      </Titel>
      {intro && (
        <p
          className="mt-4 text-[1.05rem] leading-relaxed"
          style={{ color: donker ? "rgba(250,246,239,0.8)" : "var(--charcoal)" }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

/** Vraag-en-antwoordlijst. Ook los bruikbaar, altijd samen met vraagSchema(). */
export function Vragen({
  vragen,
  donker = false,
}: {
  vragen: { v: string; a: string }[];
  donker?: boolean;
}) {
  return (
    <div style={{ borderTop: donker ? "1px solid rgba(250,246,239,0.18)" : "1px solid var(--linen)" }}>
      {vragen.map((q) => (
        <details
          key={q.v}
          className="group py-4"
          style={{
            borderBottom: donker ? "1px solid rgba(250,246,239,0.18)" : "1px solid var(--linen)",
          }}
        >
          <summary
            className="flex items-start justify-between gap-4 text-[1.05rem] font-semibold"
            style={{
              color: donker ? "var(--cream)" : "var(--navy)",
              fontFamily: "var(--font-display)",
            }}
          >
            {q.v}
            <span
              className="shrink-0 mt-1 transition-transform group-open:rotate-45"
              style={{ color: "var(--gold)", fontSize: "1.2rem", lineHeight: 1 }}
              aria-hidden
            >
              +
            </span>
          </summary>
          <p
            className="mt-3 leading-relaxed max-w-2xl"
            style={{ color: donker ? "rgba(250,246,239,0.78)" : "var(--charcoal)" }}
          >
            {q.a}
          </p>
        </details>
      ))}
    </div>
  );
}

/** Kruimelpad boven aan een pagina — helpt bezoeker én zoekmachine. */
export function Kruimels({
  items,
  donker = false,
}: {
  items: { naam: string; href?: string }[];
  donker?: boolean;
}) {
  return (
    <nav
      aria-label={items.find(i => i.href)?.href?.startsWith("/de") ? "Brotkrümelnavigation" : items.find(i => i.href)?.href?.startsWith("/en") ? "Breadcrumbs" : "Kruimelpad"}
      className="text-xs mb-6"
      style={{ color: donker ? "rgba(250,246,239,0.6)" : "var(--grijs)" }}
    >
      {items.map((item, i) => (
        <span key={item.naam}>
          {i > 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <a href={item.href} className="hover:underline underline-offset-2">
              {item.naam}
            </a>
          ) : (
            <span aria-current="page">{item.naam}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
