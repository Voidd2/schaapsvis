"use client";

import Link from "next/link";
import { useState } from "react";
import { recepten, receptBeeld, ALLE_TAGS, type ReceptTag } from "@/lib/recepten";
import { ReceptFoto } from "@/components/recepten/ReceptFoto";

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
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {zichtbaar.map((recept) => {
            const beeld = receptBeeld(recept);
            return (
              <li key={recept.slug}>
                <Link
                  href={`/${locale}/recepten/${recept.slug}`}
                  className="group flex flex-col h-full"
                  style={{ backgroundColor: "#fff", border: "1px solid var(--linen)" }}
                >
                  <ReceptFoto beeld={beeld} titel={recept.title} klein />
                  <div className="px-4 pt-3.5 pb-4 flex flex-col flex-1">
                    <p className="kapitaal mb-2" style={{ color: "var(--grijs)" }}>
                      {recept.tijd} · {recept.moeilijkheid}
                    </p>
                    <h2
                      className="text-[1.1rem] leading-snug mb-1.5 group-hover:underline underline-offset-4"
                      style={{ color: "var(--ink)" }}
                    >
                      {recept.title}
                    </h2>
                    <p
                      className="text-[0.88rem] leading-relaxed flex-1"
                      style={{ color: "var(--charcoal)" }}
                    >
                      {recept.subtitle}
                    </p>
                    <p className="mt-3 text-[0.8rem]" style={{ color: "var(--grijs)" }}>
                      <span className="kapitaal" style={{ color: "var(--gold)" }}>
                        Bij ons
                      </span>{" "}
                      {recept.vanSchaap[0]}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
