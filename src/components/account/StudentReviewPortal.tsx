"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Application = {
  id: string;
  institution: string;
  study_city?: string | null;
  has_proof?: number;
  education_level: "mbo" | "hbo" | "wo";
  submitted_at: string;
  full_name: string;
  email: string;
};

const copy = {
  nl: { title: "Studentaanvragen", intro: "Alleen beheerders op de serverallowlist kunnen deze aanvragen zien.", campaigns: "E-maildeals beheren", loading: "Aanvragen ophalen…", forbidden: "Geen beheerderstoegang. Log in met het toegestane beheerdersaccount.", none: "Er staan geen aanvragen open.", city: "Studiestad", proof: "Ouder bewijs veilig openen", approve: "Goedkeuren", reject: "Afwijzen", note: "Notitie (optioneel)", done: "Beslissing opgeslagen.", cleanupNeeded: "Beslissing is opgeslagen, maar een ouder bewijsbestand kon niet worden verwijderd. Probeer de verwijdering opnieuw.", cleanup: "Bewijsbestand opnieuw verwijderen", fail: "Dit lukte niet. Vernieuw de pagina en probeer opnieuw.", verify: "Kortingspas controleren", code: "Pascode", check: "Controleren", valid: "Geldige pas", invalid: "Pas ongeldig of verlopen", holder: "Pas staat op naam van", discount: "Korting", eligible: "Geldig voor", kibbeling: "kibbeling", herring: "haring", herringSandwich: "broodjes haring", drinks: "drinken", wholeRange: "het hele assortiment", menu: "MBO", levelHbo: "HBO", levelWo: "WO" },
  en: { title: "Student applications", intro: "Only administrators on the server allowlist can view these applications.", campaigns: "Manage email offers", loading: "Loading applications…", forbidden: "Administrator access required. Sign in using an approved administrator account.", none: "There are no pending applications.", city: "Study city", proof: "Open older proof securely", approve: "Approve", reject: "Decline", note: "Note (optional)", done: "Decision saved.", cleanupNeeded: "Decision saved, but an older proof file could not be deleted. Please retry deletion.", cleanup: "Retry proof deletion", fail: "That did not work. Refresh the page and try again.", verify: "Verify discount pass", code: "Pass code", check: "Verify", valid: "Valid pass", invalid: "Pass is invalid or expired", holder: "Pass issued to", discount: "Discount", eligible: "Eligible products", kibbeling: "kibbeling", herring: "herring", herringSandwich: "herring sandwiches", drinks: "drinks", wholeRange: "the entire range", menu: "MBO", levelHbo: "HBO", levelWo: "University" },
  de: { title: "Studentenanträge", intro: "Nur Administratoren auf der Serverfreigabeliste können diese Anträge sehen.", campaigns: "E-Mail-Angebote verwalten", loading: "Anträge werden geladen…", forbidden: "Kein Administratorzugriff. Melden Sie sich mit einem freigegebenen Administratorkonto an.", none: "Es sind keine Anträge offen.", city: "Studienort", proof: "Älteren Nachweis sicher öffnen", approve: "Genehmigen", reject: "Ablehnen", note: "Notiz (optional)", done: "Entscheidung gespeichert.", cleanupNeeded: "Die Entscheidung wurde gespeichert, aber ein älterer Nachweis konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.", cleanup: "Nachweis erneut löschen", fail: "Das hat nicht funktioniert. Aktualisieren Sie die Seite und versuchen Sie es erneut.", verify: "Rabattpass prüfen", code: "Passcode", check: "Prüfen", valid: "Gültiger Pass", invalid: "Pass ungültig oder abgelaufen", holder: "Pass ausgestellt für", discount: "Rabatt", eligible: "Gültig für", kibbeling: "Kibbeling", herring: "Hering", herringSandwich: "Heringsbrötchen", drinks: "Getränke", wholeRange: "das gesamte Sortiment", menu: "MBO", levelHbo: "HBO", levelWo: "Universität" },
} as const;

type VerifiedPass = { valid: boolean; name?: string; discountPercent?: number; eligibleProducts?: string[] };
const ELIGIBLE_LABEL: Record<string, keyof typeof copy.nl> = {
  assortiment: "wholeRange",
};

export function StudentReviewPortal({ locale }: { locale: string }) {
  const language = locale in copy ? locale as keyof typeof copy : "nl";
  const t = copy[language];
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  const [code, setCode] = useState("");
  const [passResult, setPassResult] = useState<VerifiedPass | null>(null);
  const [cleanupApplicationId, setCleanupApplicationId] = useState("");

  async function reload() {
    try {
      const response = await fetch("/api/members/admin/student-applications", { credentials: "same-origin", cache: "no-store" });
      if (response.status === 403) { setForbidden(true); setApplications([]); return; }
      if (!response.ok) throw new Error("load-failed");
      const body = await response.json() as { applications: Application[] };
      setApplications(body.applications);
      setForbidden(false);
    } catch {
      setApplications([]);
      setMessage(t.fail);
    }
  }

  useEffect(() => {
    let active = true;
    fetch("/api/members/admin/student-applications", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        if (response.status === 403) return { forbidden: true, applications: [] as Application[] };
        if (!response.ok) throw new Error("load-failed");
        return await response.json() as { applications: Application[] };
      })
      .then((body) => { if (active) { setForbidden("forbidden" in body && body.forbidden); setApplications(body.applications); } })
      .catch(() => { if (active) { setApplications([]); setMessage(t.fail); } });
    return () => { active = false; };
  }, [t.fail]);

  async function decide(application: Application, decision: "approved" | "rejected", form: HTMLFormElement) {
    setBusy(application.id);
    setMessage("");
    try {
      const fields = new FormData(form);
      const response = await fetch(`/api/members/admin/student-applications/${application.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ decision, note: fields.get("note") }),
      });
      if (!response.ok) throw new Error("decision-failed");
      const result = await response.json() as { proofDeleted?: boolean };
      setCleanupApplicationId(result.proofDeleted ? "" : application.id);
      setMessage(result.proofDeleted ? t.done : t.cleanupNeeded);
      await reload();
    } catch { setMessage(t.fail); }
    finally { setBusy(""); }
  }

  async function retryProofCleanup() {
    if (!cleanupApplicationId) return;
    setBusy("cleanup");
    try {
      const response = await fetch(`/api/members/admin/student-applications/${cleanupApplicationId}/cleanup`, {
        method: "POST",
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("cleanup-failed");
      setCleanupApplicationId("");
      setMessage(t.done);
    } catch { setMessage(t.fail); }
    finally { setBusy(""); }
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("pass");
    setPassResult(null);
    try {
      const response = await fetch("/api/members/admin/pass/verify", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ code }),
      });
      const result = await response.json() as VerifiedPass;
      setPassResult(response.ok && result.valid === true ? result : { valid: false });
    } catch { setPassResult({ valid: false }); }
    finally { setBusy(""); }
  }

  return (
    <div className="section-wrap min-h-[60vh] py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="kapitaal">Schaap&apos;s Vishandel · beheer</p>
        <h1 className="font-display text-4xl font-bold text-slate-900">{t.title}</h1>
        <p className="mt-3 text-slate-700">{t.intro}</p>
        <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2"><a href={`/${language}/beheer/emaildeals`} className="font-semibold text-sky-800 underline underline-offset-4">{t.campaigns} →</a><a href={`/${language}/beheer/overzicht`} className="font-semibold text-sky-800 underline underline-offset-4">{language === "de" ? "Website-Statistiken" : language === "en" ? "Website analytics" : "Website-statistieken"} →</a></nav>
        {applications === null ? <p className="mt-8">{t.loading}</p> : forbidden ? <div role="alert" className="mt-8 rounded-xl bg-amber-50 p-5"><p>{t.forbidden}</p><a href={`/${language}/beheer/start`} className="mt-3 inline-block font-semibold text-sky-800 underline underline-offset-4">{language === "de" ? "Verwaltungskonto aktivieren" : language === "en" ? "Activate admin account" : "Beheeraccount activeren"} →</a></div> : applications.length === 0 ? <p className="mt-8 rounded-xl border border-sky-200 bg-sky-50 p-5">{t.none}</p> : (
          <ul className="mt-8 space-y-5">
            {applications.map((application) => (
              <li key={application.id} className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><h2 className="font-display text-2xl font-bold text-slate-900">{application.full_name}</h2><p className="text-sm text-slate-600">{application.email}</p></div>
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-900">{application.education_level === "mbo" ? t.menu : application.education_level === "hbo" ? t.levelHbo : t.levelWo}</span>
                </div>
                <p className="mt-4">{application.institution}</p>
                {application.study_city && <p className="mt-1 text-sm text-slate-600">{t.city}: {application.study_city}</p>}
                <p className="mt-1 text-sm text-slate-500">{new Date(application.submitted_at).toLocaleString(language)}</p>
                {application.has_proof ? <a href={`/api/members/admin/student-applications/${application.id}/proof`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-sky-800 underline underline-offset-4">{t.proof} ↗</a> : null}
                <form onSubmit={(event) => { event.preventDefault(); void decide(application, "approved", event.currentTarget); }} className="mt-5 space-y-3">
                  <label className="block text-sm font-medium">{t.note}<textarea name="note" maxLength={500} rows={2} className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2" /></label>
                  <div className="flex flex-wrap gap-3">
                    <button disabled={busy === application.id} className="knop knop-navy">{t.approve}</button>
                    <button type="button" disabled={busy === application.id} onClick={(event) => {
                      const form = event.currentTarget.form;
                      if (form) void decide(application, "rejected", form);
                    }} className="knop knop-lijn">{t.reject}</button>
                  </div>
                </form>
              </li>
            ))}
          </ul>
        )}
        {!forbidden && (
          <form onSubmit={verify} className="mt-12 rounded-2xl bg-sky-50 p-6">
            <h2 className="font-display text-2xl font-bold text-slate-900">{t.verify}</h2>
            <div className="mt-4 flex flex-wrap gap-3"><input value={code} onChange={(event) => { setCode(event.target.value); setPassResult(null); }} required maxLength={160} aria-label={t.code} placeholder={t.code} className="min-w-64 flex-1 rounded-lg border border-sky-200 px-3 py-2.5" /><button disabled={busy === "pass"} className="knop knop-navy">{t.check}</button></div>
            {passResult && !passResult.valid && <p role="status" className="mt-4 font-semibold text-red-800">{t.invalid}</p>}
            {passResult?.valid && <div role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950"><p className="font-bold">{t.valid}</p>{passResult.name && <p className="mt-2">{t.holder}: <strong>{passResult.name}</strong></p>}<p className="mt-1">{t.discount}: <strong>{passResult.discountPercent ?? 10}%</strong></p>{passResult.eligibleProducts?.length ? <p className="mt-1">{t.eligible}: <strong>{passResult.eligibleProducts.map((item) => item in ELIGIBLE_LABEL ? t[ELIGIBLE_LABEL[item]] : null).filter(Boolean).join(", ")}</strong></p> : null}</div>}
          </form>
        )}
        {message && <p role="status" className="mt-5 rounded-lg bg-sky-50 p-4 text-sm">{message}</p>}
        {cleanupApplicationId && <button type="button" onClick={() => void retryProofCleanup()} disabled={busy === "cleanup"} className="mt-3 knop knop-lijn">{t.cleanup}</button>}
      </div>
    </div>
  );
}
