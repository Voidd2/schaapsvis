"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { checkPostcode, type PostcodeResultaat } from "@/lib/bezorging";
import { BEDRIJF, euro } from "@/lib/bedrijf";

/**
 * "Bezorgen jullie bij mij?" is de eerste vraag die iemand heeft, en het
 * antwoord staat anders verstopt in een lijstje gemeenten. Hier is het één
 * invoerveld: vier cijfers en je weet het, inclusief wat de bezorging kost.
 *
 * De controle gebeurt in de browser, zonder verzoek naar de server — dus het
 * antwoord komt onmiddellijk.
 */
export function PostcodeCheck({ donker = false }: { donker?: boolean }) {
  const t = useTranslations("bezorgen");
  const [invoer, setInvoer] = useState("");
  const [uitkomst, setUitkomst] = useState<PostcodeResultaat | null>(null);

  function controleer(e: React.FormEvent) {
    e.preventDefault();
    setUitkomst(checkPostcode(invoer));
  }

  const tekstKleur = donker ? "rgba(250,246,239,0.82)" : "var(--charcoal)";

  return (
    <div>
      <form onSubmit={controleer} className="flex flex-wrap gap-2 items-end">
        <label className="flex-1 min-w-[9rem]">
          <span
            className="block text-sm font-semibold mb-1.5"
            style={{ color: donker ? "var(--cream)" : "var(--ink)" }}
          >
            {t("checkLabel")}
          </span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={7}
            value={invoer}
            onChange={(e) => {
              setInvoer(e.target.value);
              if (uitkomst) setUitkomst(null);
            }}
            placeholder="2313 AL"
            className="veld"
            aria-describedby="postcode-uitkomst"
          />
        </label>
        <button type="submit" className="knop knop-navy">
          {t("checkKnop")}
        </button>
      </form>

      <p
        id="postcode-uitkomst"
        role="status"
        aria-live="polite"
        className="mt-3 text-sm leading-relaxed min-h-[1.5rem]"
        style={{ color: tekstKleur }}
      >
        {uitkomst?.status === "binnen" && (
          <span style={{ color: donker ? "#8fd3ae" : "var(--seafoam)", fontWeight: 600 }}>
            {t("checkBinnen", {
              plaats: uitkomst.gemeente.naam,
              bedrag: uitkomst.kosten === 0 ? "€ 0,00" : euro(uitkomst.kosten),
            })}
          </span>
        )}
        {uitkomst?.status === "buiten" && (
          <>
            {t("checkBuiten", { nummer: BEDRIJF.telefoon.weergave })}{" "}
            <a
              href={`tel:${BEDRIJF.telefoon.e164}`}
              className="underline underline-offset-2 font-semibold"
            >
              {BEDRIJF.telefoon.weergave}
            </a>
          </>
        )}
        {uitkomst?.status === "ongeldig" && t("checkOngeldig")}
      </p>
    </div>
  );
}
