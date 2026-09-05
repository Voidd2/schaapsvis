"use client";

import Link from "next/link";
import { useState } from "react";
import { recepten, ALLE_TAGS, type ReceptTag } from "@/lib/recepten";

/**
 * De receptenlijst met het filter.
 *
 * Alleen het filteren hoeft in de browser te gebeuren; de kop, de credits en de
 * afsluiting staan in de pagina zelf. De kaartjes met een tekening erboven zijn
 * weg: een recept is tekst, en een lijst leest sneller dan een raster.
 */
export function ReceptenClient({ locale }: { locale: string }) {
  const [filter, setFilter] = useState<ReceptTag | null>(null);
  const zichtbaar = filter ? recepten.filter((r) => r.tags.includes(filter)) : recepten;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          onClick={() => setFilter(null)}
          className="kapitaal px-4 py-2"
          style={{
            border: "1px solid var(--navy)",
            backgroundColor: filter === null ? "var(--navy)" : "transparent",
            color: filter === null ? "var(--cream)" : "var(--navy)",
          }}
          aria-pressed={filter === null}
        >
          Alles ({recepten.length})
        </button>
        {ALLE_TAGS.map((tag) => {
          const aantal = recepten.filter((r) => r.tags.includes(tag)).length;
          if (aantal === 0) return null;
          const actief = filter === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setFilter(actief ? null : tag)}
              className="kapitaal px-4 py-2"
              style={{
                border: `1px solid ${actief ? "var(--navy)" : "var(--linen)"}`,
                backgroundColor: actief ? "var(--navy)" : "transparent",
                color: actief ? "var(--cream)" : "var(--charcoal)",
              }}
              aria-pressed={actief}
            >
              {tag} ({aantal})
            </button>
          );
        })}
      </div>

      {zichtbaar.length === 0 ? (
        <p className="py-10" style={{ color: "var(--grijs)" }}>
          Geen recepten met dit label.
        </p>
      ) : (
        <ul style={{ borderTop: "1px solid var(--linen)" }}>
          {zichtbaar.map((recept) => (
            <li key={recept.slug} style={{ borderBottom: "1px solid var(--linen)" }}>
              <Link
                href={`/${locale}/recepten/${recept.slug}`}
                className="group grid md:grid-cols-[13rem_1fr] gap-x-10 gap-y-2 py-6"
              >
                <div>
                  <p className="kapitaal mb-1">
                    {recept.tijd} · {recept.moeilijkheid}
                  </p>
                  <p className="text-sm" style={{ color: "var(--grijs)" }}>
                    {recept.tags.join(" · ")}
                  </p>
                </div>
                <div>
                  <h2
                    className="text-[1.25rem] leading-snug mb-1 group-hover:underline underline-offset-4"
                    style={{ color: "var(--ink)" }}
                  >
                    {recept.title}
                  </h2>
                  <p className="mb-2" style={{ color: "var(--charcoal)" }}>
                    {recept.subtitle}
                  </p>
                  <p className="text-sm" style={{ color: "var(--grijs)" }}>
                    <span className="kapitaal" style={{ color: "var(--gold)" }}>
                      Bij ons
                    </span>{" "}
                    {recept.vanSchaap[0]}
                    {recept.vanSchaap.length > 1 && " en meer"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
