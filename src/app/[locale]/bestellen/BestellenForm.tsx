"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { products, CATEGORIE_LABELS, eenheidVoor, type Categorie } from "@/lib/assortiment-data";
import { searchScore } from "@/lib/search";
import {
  BEZORGING,
  checkPostcode,
  isBezorgbaar,
  bezorgdagenTekst,
  type PostcodeResultaat,
} from "@/lib/bezorging";
import { BEDRIJF, euro, whatsappLink } from "@/lib/bedrijf";
import {
  ONDERDELEN,
  hoeveelheidTekst,
  regels as schaalRegelsVan,
  totaal as schaalTotaalVan,
  type Keuze,
} from "@/lib/visschaal";
import { SCHAAL_OPSLAG } from "../visschalen/VisschaalConfigurator";
import { useSchaalTekst } from "@/components/visschaal/tekst";

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

const MANDJE_OPSLAG = "sv_bestelling_v2";

type Soort = "verse-vis" | "visschaal";
type Wijze = "bezorgen" | "afhalen";
type Status = "invullen" | "versturen" | "gelukt" | "mislukt";

interface Regel {
  slug: string;
  naam: string;
  categorie: Categorie;
  eenheid: string;
  bezorgbaar: boolean;
  hoeveelheid: string;
  snijwijze: string;
}

const POPULAIR = [
  "kabeljauwfilet",
  "zalmfilet",
  "hollandse-garnalen",
  "zeetong",
  "dorade",
  "heilbotfilet",
];

const AFHAALPUNTEN = [
  "Winkel Herenstraat 48, Leiden",
  "Markt Leiden (woensdag of zaterdag)",
  "Hoogvliet Voorschoten (vrijdag)",
];

/** Snijwijzes zijn alleen zinvol bij verse vis die nog heel is. */
function snijOpties(naam: string, categorie: Categorie): string[] | null {
  if (categorie !== "verse-vis") return null;
  if (/filet|haas|moot|snippers|tong(en)?\b|wangen/i.test(naam)) {
    return ["Zoals aangeboden", "In stukken gesneden", "Anders — zie opmerking"];
  }
  return ["Heel, schoongemaakt", "Gefileerd", "In moten", "Anders — zie opmerking"];
}

/** De eerstvolgende bezorgdagen, als lijst om uit te kiezen. */
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
  const zoekParams = useSearchParams();
  const schaalTekst = useSchaalTekst();

  const [soort, setSoort] = useState<Soort>("verse-vis");
  const [regels, setRegels] = useState<Regel[]>([]);
  const [schaal, setSchaal] = useState<Keuze>({});
  const [zoek, setZoek] = useState("");
  const [bladeren, setBladeren] = useState(false);

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

  const eersteOpslag = useRef(true);

  /* ── Beginstand uit de URL en de opslag ──────────────────────────────── */
  // Eén keer bij het openen: de adresbalk en localStorage uitlezen. Dat kan niet
  // tijdens het renderen (de opslag bestaat op de server niet), dus dit is
  // precies waarvoor een effect bedoeld is — het is geen afgeleide staat.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (zoekParams.get("type") === "visschaal") setSoort("visschaal");

    const slug = zoekParams.get("product");
    if (slug) {
      const product = products.find((p) => p.slug === slug);
      if (product) {
        setRegels((vorige) =>
          vorige.some((r) => r.slug === slug) ? vorige : [...vorige, maakRegel(product.slug)!]
        );
      }
    }

    try {
      const opgeslagenSchaal = localStorage.getItem(SCHAAL_OPSLAG);
      if (opgeslagenSchaal) {
        const gelezen = JSON.parse(opgeslagenSchaal) as Keuze;
        const geldig: Keuze = {};
        for (const [id, n] of Object.entries(gelezen)) {
          if (ONDERDELEN.some((o) => o.id === id) && Number(n) > 0) geldig[id] = Number(n);
        }
        setSchaal(geldig);
      }

      const opgeslagenMandje = localStorage.getItem(MANDJE_OPSLAG);
      if (opgeslagenMandje) {
        const gelezen = JSON.parse(opgeslagenMandje) as {
          slug: string;
          hoeveelheid?: string;
          snijwijze?: string;
        }[];
        const hersteld = gelezen
          .map((r) => {
            const basis = maakRegel(r.slug);
            return basis
              ? { ...basis, hoeveelheid: r.hoeveelheid ?? "", snijwijze: r.snijwijze ?? "" }
              : null;
          })
          .filter((r): r is Regel => r !== null);
        if (hersteld.length) {
          setRegels((vorige) => {
            const bekend = new Set(vorige.map((r) => r.slug));
            return [...vorige, ...hersteld.filter((r) => !bekend.has(r.slug))];
          });
        }
      }
    } catch {
      /* geen opslag beschikbaar */
    }
    // Alleen bij het openen van de pagina.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (eersteOpslag.current) {
      eersteOpslag.current = false;
      return;
    }
    try {
      localStorage.setItem(
        MANDJE_OPSLAG,
        JSON.stringify(
          regels.map((r) => ({
            slug: r.slug,
            hoeveelheid: r.hoeveelheid,
            snijwijze: r.snijwijze,
          }))
        )
      );
    } catch {
      /* niets aan te doen */
    }
  }, [regels]);

  /* ── Afgeleide waarden ───────────────────────────────────────────────── */
  const postcodeUitkomst: PostcodeResultaat | null = useMemo(
    () => (postcode.replace(/\s/g, "").length >= 4 ? checkPostcode(postcode) : null),
    [postcode]
  );

  const bezorgkosten =
    wijze === "bezorgen" && postcodeUitkomst?.status === "binnen" ? postcodeUitkomst.kosten : 0;

  const schaalRegels = useMemo(() => schaalRegelsVan(schaal), [schaal]);
  const schaalTotaal = useMemo(() => schaalTotaalVan(schaal), [schaal]);
  const teBetalen = soort === "visschaal" ? schaalTotaal + bezorgkosten : null;

  const suggesties = useMemo(() => {
    if (zoek.trim().length < 1) return [];
    return products
      .map((p) => ({
        p,
        score: searchScore(
          { naam: p.naam, desc: p.desc, categorie: CATEGORIE_LABELS[p.categorie] },
          zoek
        ),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.p);
  }, [zoek]);

  const dagen = useMemo(() => bezorgdagen(), []);
  const bezorgdagenLabel = bezorgdagenTekst();

  const nietBezorgbaar = regels.filter((r) => !r.bezorgbaar);
  const bezorgenGeblokkeerd = wijze === "bezorgen" && nietBezorgbaar.length > 0;

  /* ── Bewerkingen op het mandje ───────────────────────────────────────── */
  const voegToe = useCallback((slug: string) => {
    const regel = maakRegel(slug);
    if (!regel) return;
    setRegels((vorige) => (vorige.some((r) => r.slug === slug) ? vorige : [...vorige, regel]));
    setZoek("");
  }, []);

  function werkBij(slug: string, veld: "hoeveelheid" | "snijwijze", waarde: string) {
    setRegels((vorige) =>
      vorige.map((r) => (r.slug === slug ? { ...r, [veld]: waarde } : r))
    );
  }

  function verwijder(slug: string) {
    setRegels((vorige) => vorige.filter((r) => r.slug !== slug));
  }

  /* ── Versturen ───────────────────────────────────────────────────────── */
  const kanVersturen =
    naam.trim() !== "" &&
    telefoon.trim() !== "" &&
    (soort === "visschaal" || regels.length > 0) &&
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
          visschaal: soort === "visschaal" ? { keuze: schaal } : undefined,
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

      // Mandje leegmaken; wat besteld is hoort niet in de volgende bestelling.
      try {
        localStorage.removeItem(MANDJE_OPSLAG);
        if (soort === "visschaal") localStorage.removeItem(SCHAAL_OPSLAG);
      } catch {
        /* niets aan te doen */
      }

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
                ["verse-vis", t("soortVis")],
                ["visschaal", t("soortSchaal")],
              ] as [Soort, string][]
            ).map(([waarde, label]) => (
              <button
                key={waarde}
                type="button"
                onClick={() => setSoort(waarde)}
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

          {soort === "verse-vis" ? (
            <>
              <label className="block mb-4">
                <span className="veld-label">{t("zoekLabel")}</span>
                <input
                  type="search"
                  value={zoek}
                  onChange={(e) => setZoek(e.target.value)}
                  placeholder={t("zoekPlaceholder")}
                  className="veld"
                  autoComplete="off"
                />
              </label>

              {suggesties.length > 0 && (
                <ul className="mb-6" style={{ border: "1px solid var(--linen)" }}>
                  {suggesties.map((p) => (
                    <li key={p.slug} style={{ borderBottom: "1px solid var(--linen)" }}>
                      <button
                        type="button"
                        onClick={() => voegToe(p.slug)}
                        className="w-full text-left px-4 py-3 hover:bg-[var(--sand)] transition-colors"
                      >
                        <span className="font-semibold" style={{ color: "var(--ink)" }}>
                          {p.naam}
                        </span>
                        <span className="block text-sm" style={{ color: "var(--grijs)" }}>
                          {CATEGORIE_LABELS[p.categorie]}
                          {!isBezorgbaar(p.categorie) && ` · ${t("alleenAfhalen")}`}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {zoek.trim() === "" && (
                <div className="mb-6">
                  <p className="kapitaal mb-2">{t("populair")}</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAIR.map((slug) => {
                      const p = products.find((x) => x.slug === slug);
                      if (!p) return null;
                      return (
                        <button
                          key={slug}
                          type="button"
                          onClick={() => voegToe(slug)}
                          className="px-3 py-1.5 text-sm"
                          style={{ border: "1px solid var(--linen)", color: "var(--navy)" }}
                        >
                          + {p.naam}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setBladeren(!bladeren)}
                      className="px-3 py-1.5 text-sm underline underline-offset-4"
                      style={{ color: "var(--grijs)" }}
                    >
                      {t("allesBekijken")}
                    </button>
                  </div>
                </div>
              )}

              {bladeren && (
                <div
                  className="mb-6 max-h-80 overflow-y-auto"
                  style={{ border: "1px solid var(--linen)" }}
                >
                  {(Object.keys(CATEGORIE_LABELS) as Categorie[]).map((cat) => (
                    <div key={cat}>
                      <p
                        className="kapitaal px-4 py-2 sticky top-0"
                        style={{ backgroundColor: "var(--sand)" }}
                      >
                        {CATEGORIE_LABELS[cat]}
                      </p>
                      {products
                        .filter((p) => p.categorie === cat)
                        .map((p) => (
                          <button
                            key={p.slug}
                            type="button"
                            onClick={() => voegToe(p.slug)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--sand)]"
                          >
                            {p.naam}
                          </button>
                        ))}
                    </div>
                  ))}
                </div>
              )}

              {regels.length === 0 ? (
                <p className="py-6 text-sm" style={{ color: "var(--grijs)" }}>
                  {t("leegMandje")}
                </p>
              ) : (
                <ul>
                  {regels.map((r) => {
                    const opties = snijOpties(r.naam, r.categorie);
                    return (
                      <li
                        key={r.slug}
                        className="py-4"
                        style={{ borderTop: "1px solid var(--linen)" }}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="font-semibold" style={{ color: "var(--ink)" }}>
                              {r.naam}
                            </p>
                            <p className="text-sm" style={{ color: "var(--grijs)" }}>
                              {r.eenheid} · {g("dagprijs")}
                              {!r.bezorgbaar && (
                                <span style={{ color: "var(--gold)" }}> · {t("alleenAfhalen")}</span>
                              )}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => verwijder(r.slug)}
                            className="text-sm underline underline-offset-4 shrink-0"
                            style={{ color: "var(--grijs)" }}
                          >
                            {t("verwijderen")}
                          </button>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <label>
                            <span className="veld-label">{t("hoeveelheid")}</span>
                            <input
                              type="text"
                              value={r.hoeveelheid}
                              onChange={(e) => werkBij(r.slug, "hoeveelheid", e.target.value)}
                              placeholder={t("hoeveelheidHint")}
                              className="veld"
                            />
                          </label>
                          {opties && (
                            <label>
                              <span className="veld-label">{t("snijwijze")}</span>
                              <select
                                value={r.snijwijze}
                                onChange={(e) => werkBij(r.slug, "snijwijze", e.target.value)}
                                className="veld"
                              >
                                <option value="">—</option>
                                {opties.map((optie) => (
                                  <option key={optie} value={optie}>
                                    {optie}
                                  </option>
                                ))}
                              </select>
                            </label>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ) : (
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
          )}
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
              {schaalRegels.map((r) => (
                <Rij
                  key={r.naam}
                  label={`${hoeveelheidTekst(r)} ${schaalTekst.naam(r.id, r.naam)}`}
                  waarde={euro(r.bedrag)}
                />
              ))}
              {wijze === "bezorgen" && bezorgkosten > 0 && (
                <Rij label={t("bezorgkosten")} waarde={euro(bezorgkosten)} />
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

function maakRegel(slug: string): Regel | null {
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  return {
    slug: product.slug,
    naam: product.naam,
    categorie: product.categorie,
    eenheid: eenheidVoor(product.categorie),
    bezorgbaar: isBezorgbaar(product.categorie),
    hoeveelheid: "",
    snijwijze: "",
  };
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
