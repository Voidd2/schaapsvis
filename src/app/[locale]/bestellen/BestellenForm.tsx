"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  BEZORGING,
  checkPostcode,
  bezorgdagenTekst,
  type PostcodeResultaat,
} from "@/lib/bezorging";
import { BEDRIJF, euro, whatsappLink } from "@/lib/bedrijf";
import {
  hoeveelheidTekst,
  regels as schaalRegelsVan,
  totaal as schaalTotaalVan,
} from "@/lib/visschaal";
import { useSchaalTekst } from "@/components/visschaal/tekst";
import { useWinkelwagen } from "@/components/winkel/Winkelwagen";

/**
 * Het bestelformulier.
 *
 * Twee soorten bestellingen komen hier samen:
 *
 *  • Verse vis — gaat op gewicht, dus er staat géén totaalbedrag. Dat zou een
 *    belofte zijn die de weegschaal niet kan waarmaken. We bellen met de
 *    dagprijs voordat we inpakken, en dat staat er ook zo.
 *  • Een visschaal — die is wél op de cent uit te rekenen, en kan daarom straks
 *    via SumUp meteen worden afgerekend.
 *
 * Het mandje blijft in de browser bewaard, zodat iemand die halverwege wordt
 * weggeroepen niet opnieuw hoeft te beginnen.
 */

type Soort = "verse-vis" | "visschaal";
type Wijze = "bezorgen" | "afhalen";
type Status = "invullen" | "versturen" | "gelukt" | "mislukt";

const AFHAALPUNTEN = [
  "Winkel Herenstraat 48, Leiden",
  "Markt Leiden (woensdag of zaterdag)",
  "Hoogvliet Voorschoten (vrijdag)",
];

/** Snijwijzes zijn alleen zinvol bij verse vis die nog heel is. */
function bezorgdagen(aantal = 8): { waarde: string; label: string }[] {
  const dagen: { waarde: string; label: string }[] = [];
  const nu = new Date();
  const [grensUur] = BEZORGING.uitersteBesteltijd.split(":").map(Number);
  const start = nu.getHours() >= grensUur ? 2 : 1;

  for (let i = start; dagen.length < aantal && i < start + 21; i++) {
    const dag = new Date(nu);
    dag.setDate(nu.getDate() + i);
    if (!(BEZORGING.bezorgdagen as readonly number[]).includes(dag.getDay())) continue;
    dagen.push({
      waarde: dag.toISOString().slice(0, 10),
      label: dag.toLocaleDateString("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    });
  }
  return dagen;
}

export function BestellenForm({ sumupActief }: { sumupActief: boolean }) {
  const t = useTranslations("bestel");
  const g = useTranslations("gedeeld");
  const locale = useLocale();
  const schaalTekst = useSchaalTekst();
  const w = useTranslations("winkelwagen");

  // Wat er in de wagen zit is niet van dit formulier maar van de winkelwagen:
  // de knop rechtsboven, het paneel en dit formulier moeten hetzelfde weten.
  const wagen = useWinkelwagen();
  const regels = wagen.regels;
  const schaal = wagen.samenstelling;

  const [soort] = useState<Soort>("visschaal");

  const [wijze, setWijze] = useState<Wijze>("bezorgen");
  const [postcode, setPostcode] = useState("");
  const [huisnummer, setHuisnummer] = useState("");
  const [straat, setStraat] = useState("");
  const [datum, setDatum] = useState("");
  const [tijdvak, setTijdvak] = useState("");
  const [afhaalpunt, setAfhaalpunt] = useState(AFHAALPUNTEN[0]);

  const [naam, setNaam] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [email, setEmail] = useState("");
  const [allergie, setAllergie] = useState("");
  const [opmerking, setOpmerking] = useState("");
  const [nieuwsbrief, setNieuwsbrief] = useState(false);

  const [status, setStatus] = useState<Status>("invullen");
  const [fout, setFout] = useState("");
  const [bestelnummer, setBestelnummer] = useState("");

  /* ── Beginstand uit de URL en de opslag ──────────────────────────────── */
  // Eén keer bij het openen: kijken wat er in de adresbalk staat. Het mandje
  // zelf wordt door de winkelwagen bewaard en teruggelezen — dat hoeft hier dus
  // niet nog een keer.

  /* ── Afgeleide waarden ───────────────────────────────────────────────── */
  const postcodeUitkomst: PostcodeResultaat | null = useMemo(
    () => (postcode.replace(/\s/g, "").length >= 4 ? checkPostcode(postcode) : null),
    [postcode]
  );

  const schaalRegels = useMemo(() => schaalRegelsVan(schaal), [schaal]);
  const schaalTotaal = useMemo(() => schaalTotaalVan(schaal), [schaal]);

  // Boven de drempel vervalt de bezorging. Alleen bij een visschaal kunnen we
  // dat vooraf zeggen; verse vis gaat op gewicht en dat weten we pas op de
  // weegschaal. Hetzelfde staat in de API-route, want die rekent opnieuw.
  const gratisBezorging = soort === "visschaal" && schaalTotaal >= BEZORGING.gratisVanaf;
  const bezorgkosten =
    wijze === "bezorgen" && postcodeUitkomst?.status === "binnen" && !gratisBezorging
      ? postcodeUitkomst.kosten
      : 0;

  const teBetalen = soort === "visschaal" ? schaalTotaal + bezorgkosten : null;

  const dagen = useMemo(() => bezorgdagen(), []);
  const bezorgdagenLabel = bezorgdagenTekst();

  const nietBezorgbaar = regels.filter((r) => !r.bezorgbaar);
  const bezorgenGeblokkeerd = wijze === "bezorgen" && nietBezorgbaar.length > 0;

  /* ── Bewerkingen op het mandje ───────────────────────────────────────── */
  /* ── Versturen ───────────────────────────────────────────────────────── */
  const kanVersturen =
    naam.trim() !== "" &&
    telefoon.trim() !== "" &&
    (soort === "visschaal" ? schaal.schaal !== null : regels.length > 0) &&
    (wijze === "afhalen" ||
      (postcodeUitkomst?.status === "binnen" && straat.trim() !== "" && huisnummer.trim() !== "")) &&
    !bezorgenGeblokkeerd;

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    if (!kanVersturen) return;
    setStatus("versturen");
    setFout("");

    try {
      const antwoord = await fetch("/api/bestelling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soort,
          locale,
          klant: { naam, telefoon, email },
          levering: {
            wijze,
            postcode,
            huisnummer,
            straat,
            plaats:
              postcodeUitkomst?.status === "binnen" ? postcodeUitkomst.gemeente.naam : "",
            datum,
            tijdvak,
            afhaalpunt,
          },
          regels: regels.map((r) => ({
            naam: r.naam,
            hoeveelheid: r.hoeveelheid,
            toelichting: r.snijwijze,
          })),
          visschaal: soort === "visschaal" ? { samenstelling: schaal } : undefined,
          allergie,
          opmerking,
          nieuwsbrief,
        }),
      });

      const data = (await antwoord.json()) as {
        ok?: boolean;
        fout?: string;
        referentie?: string;
        betaalUrl?: string;
      };

      if (!antwoord.ok || !data.ok) {
        setFout(data.fout ?? t("misluktTekst"));
        setStatus("mislukt");
        return;
      }

      // Wagen leegmaken; wat besteld is hoort niet in de volgende bestelling.
      wagen.leeg();

      if (data.betaalUrl) {
        window.location.href = data.betaalUrl;
        return;
      }

      setBestelnummer(data.referentie ?? "");
      setStatus("gelukt");
    } catch {
      setFout(t("misluktTekst"));
      setStatus("mislukt");
    }
  }

  /* ── Gelukt ──────────────────────────────────────────────────────────── */
  if (status === "gelukt") {
    return (
      <div
        className="max-w-2xl mx-auto p-8 md:p-10 text-center"
        style={{ backgroundColor: "#fff", border: "1px solid var(--linen)" }}
      >
        <h2 className="text-[1.8rem] mb-3">{t("gelukt", { naam: naam.split(" ")[0] })}</h2>
        <p className="leading-relaxed mb-6" style={{ color: "var(--charcoal)" }}>
          {t("geluktTekst", { nummer: bestelnummer })}
        </p>
        <p className="text-sm mb-7" style={{ color: "var(--grijs)" }}>
          {t("betalenNu")}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href={`/${locale}`} className="knop knop-navy">
            {g("terug")}
          </Link>
          <a href={`tel:${BEDRIJF.telefoon.e164}`} className="knop knop-lijn">
            {g("bellen", { nummer: BEDRIJF.telefoon.weergave })}
          </a>
        </div>
      </div>
    );
  }

  /* ── Formulier ───────────────────────────────────────────────────────── */
  return (
    <form onSubmit={verstuur} className="grid lg:grid-cols-[1fr_20rem] gap-10 lg:gap-14 items-start">
      <div>
        {/* ── Wat bestelt u? ────────────────────────────────────────────── */}
        <fieldset className="mb-10">
          <legend className="kapitaal mb-3">{t("stapProduct")}</legend>
          <div className="flex gap-2 mb-6">
            {(
              [
                ["visschaal", t("soortSchaal")],
              ] as [Soort, string][]
            ).map(([waarde, label]) => (
              <button
                key={waarde}
                type="button"
                className="px-4 py-2 text-sm font-semibold transition-colors"
                style={{
                  border: "1px solid var(--navy)",
                  backgroundColor: soort === waarde ? "var(--navy)" : "transparent",
                  color: soort === waarde ? "var(--cream)" : "var(--navy)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

            <div>
              <div
                className="p-5 mb-4"
                style={{ backgroundColor: "#fff", border: "1px solid var(--linen)" }}
              >
                {schaalRegels.map((r) => (
                  <div
                    key={r.naam}
                    className="flex justify-between gap-3 py-1.5 text-sm"
                    style={{ borderTop: "1px solid var(--linen)", color: "var(--charcoal)" }}
                  >
                    <span>
                      <span className="bedrag" style={{ color: "var(--grijs)" }}>
                        {hoeveelheidTekst(r)}
                      </span>{" "}
                      {schaalTekst.naam(r.id, r.naam)}
                    </span>
                    <span className="bedrag shrink-0">{euro(r.bedrag)}</span>
                  </div>
                ))}
                <div
                  className="flex justify-between gap-3 pt-2.5 mt-1.5 font-semibold"
                  style={{ borderTop: "2px solid var(--navy)" }}
                >
                  <span>{g("totaal")}</span>
                  <span className="bedrag">{euro(schaalTotaal)}</span>
                </div>
              </div>
              <Link
                href={`/${locale}/visschalen#samenstellen`}
                className="text-sm underline underline-offset-4"
                style={{ color: "var(--navy)" }}
              >
                {schaalRegels.length === 0 ? t("schaalKiezen") : t("schaalAanpassen")}
              </Link>
            </div>
        </fieldset>

        {/* ── Bezorgen of afhalen ───────────────────────────────────────── */}
        <fieldset className="mb-10">
          <legend className="kapitaal mb-3">{t("stapLevering")}</legend>

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {(
              [
                ["bezorgen", t("bezorgenKop"), t("bezorgenTekst", { dagen: bezorgdagenLabel })],
                ["afhalen", t("afhalenKop"), t("afhalenTekst")],
              ] as [Wijze, string, string][]
            ).map(([waarde, kop, uitleg]) => (
              <label
                key={waarde}
                className="p-4 cursor-pointer transition-colors"
                style={{
                  border: "1px solid",
                  borderColor: wijze === waarde ? "var(--navy)" : "var(--linen)",
                  backgroundColor: wijze === waarde ? "var(--sand)" : "#fff",
                }}
              >
                <input
                  type="radio"
                  name="wijze"
                  value={waarde}
                  checked={wijze === waarde}
                  onChange={() => setWijze(waarde)}
                  className="sr-only"
                />
                <span className="block font-semibold" style={{ color: "var(--ink)" }}>
                  {kop}
                </span>
                <span className="block text-sm mt-0.5" style={{ color: "var(--grijs)" }}>
                  {uitleg}
                </span>
              </label>
            ))}
          </div>

          {wijze === "bezorgen" ? (
            <>
              <div className="grid sm:grid-cols-[1fr_1fr] gap-3 mb-3">
                <label>
                  <span className="veld-label">
                    {t("postcode")} <Ster />
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="2313 AL"
                    className="veld"
                    required
                  />
                </label>
                <label>
                  <span className="veld-label">
                    {t("huisnummer")} <Ster />
                  </span>
                  <input
                    type="text"
                    value={huisnummer}
                    onChange={(e) => setHuisnummer(e.target.value)}
                    className="veld"
                    required
                  />
                </label>
              </div>

              <label className="block mb-3">
                <span className="veld-label">
                  {t("straat")} <Ster />
                </span>
                <input
                  type="text"
                  autoComplete="street-address"
                  value={straat}
                  onChange={(e) => setStraat(e.target.value)}
                  className="veld"
                  required
                />
              </label>

              {postcodeUitkomst?.status === "binnen" && (
                <p className="text-sm mb-4" style={{ color: "var(--seafoam)" }}>
                  {postcodeUitkomst.gemeente.naam} · {t("bezorgkosten")}{" "}
                  {euro(postcodeUitkomst.kosten)}
                </p>
              )}
              {postcodeUitkomst?.status === "buiten" && (
                <p className="text-sm mb-4" style={{ color: "var(--rood)" }}>
                  {t("buitenGebied")}
                </p>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <label>
                  <span className="veld-label">{t("datum")}</span>
                  <select
                    value={datum}
                    onChange={(e) => setDatum(e.target.value)}
                    className="veld"
                  >
                    <option value="">—</option>
                    {dagen.map((d) => (
                      <option key={d.waarde} value={d.waarde}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="veld-label">{t("tijdvak")}</span>
                  <select
                    value={tijdvak}
                    onChange={(e) => setTijdvak(e.target.value)}
                    className="veld"
                  >
                    <option value="">—</option>
                    {BEZORGING.tijdvakken.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              <label>
                <span className="veld-label">{t("afhaalpunt")}</span>
                <select
                  value={afhaalpunt}
                  onChange={(e) => setAfhaalpunt(e.target.value)}
                  className="veld"
                >
                  {AFHAALPUNTEN.map((punt) => (
                    <option key={punt} value={punt}>
                      {punt}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="veld-label">{t("datum")}</span>
                <input
                  type="date"
                  value={datum}
                  onChange={(e) => setDatum(e.target.value)}
                  className="veld"
                />
              </label>
            </div>
          )}

          {bezorgenGeblokkeerd && (
            <p
              className="mt-4 p-3 text-sm"
              style={{ backgroundColor: "rgba(156,43,33,0.08)", color: "var(--rood)" }}
            >
              {t("alleenAfhalenUitleg")} —{" "}
              {nietBezorgbaar.map((r) => r.naam).join(", ")}
            </p>
          )}
        </fieldset>

        {/* ── Uw gegevens ───────────────────────────────────────────────── */}
        <fieldset>
          <legend className="kapitaal mb-3">{t("stapGegevens")}</legend>

          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <label>
              <span className="veld-label">
                {t("naam")} <Ster />
              </span>
              <input
                type="text"
                autoComplete="name"
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                className="veld"
                required
              />
            </label>
            <label>
              <span className="veld-label">
                {t("telefoon")} <Ster />
                <span className="font-normal" style={{ color: "var(--grijs)" }}>
                  {" "}
                  — {t("telefoonHint")}
                </span>
              </span>
              <input
                type="tel"
                autoComplete="tel"
                value={telefoon}
                onChange={(e) => setTelefoon(e.target.value)}
                className="veld"
                required
              />
            </label>
          </div>

          <label className="block mb-3">
            <span className="veld-label">
              {t("email")}{" "}
              <span className="font-normal" style={{ color: "var(--grijs)" }}>
                ({g("optioneel")})
              </span>
            </span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="veld"
            />
          </label>

          <label className="block mb-3">
            <span className="veld-label">{t("allergie")}</span>
            <textarea
              rows={2}
              value={allergie}
              onChange={(e) => setAllergie(e.target.value)}
              className="veld resize-none"
            />
          </label>

          <label className="block mb-4">
            <span className="veld-label">{t("opmerking")}</span>
            <textarea
              rows={3}
              value={opmerking}
              onChange={(e) => setOpmerking(e.target.value)}
              placeholder={t("opmerkingHint")}
              className="veld resize-none"
            />
          </label>

          <label className="flex items-start gap-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={nieuwsbrief}
              onChange={(e) => setNieuwsbrief(e.target.checked)}
              className="mt-1"
            />
            <span style={{ color: "var(--charcoal)" }}>{t("nieuwsbrief")}</span>
          </label>
        </fieldset>
      </div>

      {/* ── Overzicht en versturen ────────────────────────────────────────── */}
      <aside className="lg:sticky lg:top-32">
        <div className="p-6" style={{ backgroundColor: "var(--navy)", color: "rgba(250,246,239,0.85)" }}>
          <h2 className="text-[1.2rem] mb-4" style={{ color: "var(--cream)" }}>
            {t("stapProduct")}
          </h2>

          {soort === "visschaal" ? (
            <dl className="text-sm">
              {schaalRegels.length === 0 && (
                <p style={{ opacity: 0.6 }}>{w("leeg")}</p>
              )}
              {schaalRegels.map((r) => (
                <Rij
                  key={r.id}
                  label={`${hoeveelheidTekst(r)} ${r.isSchaal ? r.naam : schaalTekst.naam(r.id, r.naam)}`}
                  waarde={euro(r.bedrag)}
                />
              ))}
              {wijze === "bezorgen" && bezorgkosten > 0 && (
                <Rij label={t("bezorgkosten")} waarde={euro(bezorgkosten)} />
              )}
              {wijze === "bezorgen" && gratisBezorging && (
                <Rij label={t("bezorgkosten")} waarde={w("gratisGehaald")} />
              )}
              <div
                className="flex justify-between gap-3 pt-3 mt-1 text-[1.1rem] font-semibold"
                style={{ borderTop: "2px solid rgba(250,246,239,0.5)", color: "var(--cream)" }}
              >
                <dt>{g("totaal")}</dt>
                <dd className="bedrag">{euro(teBetalen ?? schaalTotaal)}</dd>
              </div>
            </dl>
          ) : (
            <ul className="text-sm">
              {regels.length === 0 ? (
                <li style={{ opacity: 0.6 }}>{t("leegMandje")}</li>
              ) : (
                regels.map((r) => (
                  <li
                    key={r.slug}
                    className="flex justify-between gap-3 py-2"
                    style={{ borderTop: "1px solid rgba(250,246,239,0.22)" }}
                  >
                    <span>{r.naam}</span>
                    <span className="shrink-0" style={{ opacity: 0.6 }}>
                      {r.hoeveelheid || "—"}
                    </span>
                  </li>
                ))
              )}
              <li className="pt-3 mt-1 text-[0.85rem]" style={{ borderTop: "1px solid rgba(250,246,239,0.35)", opacity: 0.75 }}>
                {g("dagprijs")} — {t("telefoonHint").toLowerCase()}
              </li>
            </ul>
          )}

          <p className="mt-5 text-[0.8rem] leading-relaxed" style={{ opacity: 0.7 }}>
            {t("betalenNu")}
            {!sumupActief && ` ${t("betalenStraks")}`}
          </p>

          <button
            type="submit"
            disabled={!kanVersturen || status === "versturen"}
            className="knop knop-rood w-full mt-5"
          >
            {status === "versturen"
              ? t("bezig")
              : sumupActief && soort === "visschaal"
                ? t("versturenBetalen")
                : t("versturen")}
          </button>

          {status === "mislukt" && (
            <div className="mt-4 p-3 text-sm" style={{ backgroundColor: "rgba(250,246,239,0.12)" }}>
              <p className="font-semibold mb-1" style={{ color: "var(--cream)" }}>
                {t("mislukt")}
              </p>
              <p className="mb-2">{fout}</p>
              <a
                href={`tel:${BEDRIJF.telefoon.e164}`}
                className="underline underline-offset-4 font-semibold"
                style={{ color: "var(--cream)" }}
              >
                {BEDRIJF.telefoon.weergave}
              </a>
            </div>
          )}

          <a
            href={whatsappLink("Hallo Schaap's Vishandel, ik wil graag iets bestellen.")}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-[0.8rem] underline underline-offset-4 mt-4"
            style={{ opacity: 0.7 }}
          >
            {g("whatsapp")}
          </a>
        </div>
      </aside>
    </form>
  );
}

function Ster() {
  return <span style={{ color: "var(--rood)" }}>*</span>;
}

function Rij({ label, waarde }: { label: string; waarde: string }) {
  return (
    <div
      className="flex justify-between gap-3 py-2"
      style={{ borderTop: "1px solid rgba(250,246,239,0.22)" }}
    >
      <dt>{label}</dt>
      <dd className="bedrag shrink-0">{waarde}</dd>
    </div>
  );
}
