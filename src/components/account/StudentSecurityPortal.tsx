"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

type StudentRow = { id: string; full_name: string; email: string; pass_status: string; device_count: number; active_session_count: number; recent_device_count: number; risk_score: number; open_warning_count: number; pending_verification_count: number };
type Device = { id: string; device_type: string; operating_system: string; browser: string; device_model?: string | null; access_context: string; display_name?: string | null; status: string; first_seen_at: string; last_seen_at: string; rule_exemptions_json: string };
type Session = { session_key: string; device_id?: string | null; created_at: string; last_seen_at?: string | null; expires_at: string; access_context: string; revoked_at?: string | null };
type Event = { id: string; event_type: string; severity: string; risk_points: number; reason: string; occurrence_count: number; last_occurred_at: string; status: string };
type Verification = { id: string; method: string; reason: string; pass_policy: string; status: string; created_at: string };
type Detail = { student: { id: string; full_name: string; email: string; school_email?: string; pass_status?: string; pass_expires_at?: string }; devices: Device[]; sessions: Session[]; events: Event[]; verifications: Verification[] };
type Settings = { newDeviceWarningCount: number; newDeviceWindowDays: number; concurrentDeviceMinutes: number; qrIssueLimit: number; qrCheckLimit: number };

const copy = {
  nl: { title: "Studentenpas Beveiliging", intro: "Uitlegbare signalen voor handmatige controle. Een waarschuwing is geen bewijs van fraude en blokkeert nooit vanzelf een student.", all: "Alle studenten", suspicious: "Verdachte activiteit", verification: "Openstaande verificaties", blocked: "Geblokkeerde passen", devices: "Nieuwe apparaten", loading: "Beveiligingsgegevens laden…", denied: "Geen beheerderstoegang vanaf dit account en netwerk.", noRows: "Geen studenten in dit filter.", score: "Risicoscore", warnings: "open waarschuwingen", sessions: "actieve sessies", detail: "Activiteitenoverzicht", registered: "Geregistreerde apparaten", events: "Beveiligingsgebeurtenissen", verifications: "Verificatieverzoeken", safe: "Markeer als veilig", revokeDevice: "Apparaat en sessies intrekken", revokeSession: "Sessie intrekken", logoutAll: "Alle apparaten uitloggen", suspend: "Pas tijdelijk blokkeren", restore: "Pas opnieuw activeren", request: "Extra verificatie aanvragen", reason: "Concrete reden voor de controle", emailCode: "Eenmalige e-mailcode", school: "Studentenstatus opnieuw aantonen", inPerson: "Controle aan winkel of kraam", keep: "Pas actief laten", suspendDuring: "Pas tijdens onderzoek schorsen", send: "Verzoek versturen", empty: "Nog geen gegevens.", confirm: "Weet u zeker dat u deze beveiligingsactie wilt uitvoeren?", done: "Actie opgeslagen.", failed: "De actie kon niet worden opgeslagen.", settingsTitle: "Detectiedrempels aanpassen", newDevicesLabel: "Nieuwe apparaten", windowDays: "Venster (dagen)", concurrentMinutes: "Gelijktijdig (min.)", qrIssue: "QR vernieuwen / 5 min.", qrCheck: "QR controleren / 5 min.", save: "Opslaan", ruleEnable: "Detectieregels activeren", ruleExempt: "Student vrijstellen van apparaatregels", sessionsTitle: "Sessies", revoked: "ingetrokken", active: "actief", points: "punten", completeRestore: "Afronden en pas herstellen", cancelRequest: "Verzoek annuleren", method: "Methode", passPolicy: "Pas tijdens onderzoek" },
  en: { title: "Student pass security", intro: "Explainable signals for manual review. A warning is not proof of fraud and never blocks a student automatically.", all: "All students", suspicious: "Suspicious activity", verification: "Pending verification", blocked: "Blocked passes", devices: "New devices", loading: "Loading security data…", denied: "Administrator access is unavailable for this account and network.", noRows: "No students match this filter.", score: "Risk score", warnings: "open warnings", sessions: "active sessions", detail: "Activity overview", registered: "Registered devices", events: "Security events", verifications: "Verification requests", safe: "Mark as safe", revokeDevice: "Revoke device and sessions", revokeSession: "Revoke session", logoutAll: "Sign out all devices", suspend: "Temporarily block pass", restore: "Reactivate pass", request: "Request extra verification", reason: "Concrete reason for the review", emailCode: "One-time email code", school: "Reconfirm student status", inPerson: "Check at shop or stall", keep: "Keep pass active", suspendDuring: "Suspend pass during review", send: "Send request", empty: "No data yet.", confirm: "Are you sure you want to perform this security action?", done: "Action saved.", failed: "The action could not be saved.", settingsTitle: "Adjust detection thresholds", newDevicesLabel: "New devices", windowDays: "Window (days)", concurrentMinutes: "Concurrent (min.)", qrIssue: "QR refreshes / 5 min.", qrCheck: "QR checks / 5 min.", save: "Save", ruleEnable: "Enable detection rules", ruleExempt: "Exempt student from device rules", sessionsTitle: "Sessions", revoked: "revoked", active: "active", points: "points", completeRestore: "Complete and restore pass", cancelRequest: "Cancel request", method: "Method", passPolicy: "Pass during review" },
  de: { title: "Studentenpass-Sicherheit", intro: "Nachvollziehbare Signale für die manuelle Prüfung. Eine Warnung beweist keinen Betrug und sperrt Studierende nie automatisch.", all: "Alle Studierenden", suspicious: "Auffällige Aktivität", verification: "Offene Prüfungen", blocked: "Gesperrte Pässe", devices: "Neue Geräte", loading: "Sicherheitsdaten werden geladen…", denied: "Kein Administratorzugriff für dieses Konto und Netzwerk.", noRows: "Keine Studierenden in diesem Filter.", score: "Risikowert", warnings: "offene Warnungen", sessions: "aktive Sitzungen", detail: "Aktivitätsübersicht", registered: "Registrierte Geräte", events: "Sicherheitsereignisse", verifications: "Prüfanfragen", safe: "Als sicher markieren", revokeDevice: "Gerät und Sitzungen widerrufen", revokeSession: "Sitzung widerrufen", logoutAll: "Alle Geräte abmelden", suspend: "Pass vorübergehend sperren", restore: "Pass wieder aktivieren", request: "Zusätzliche Prüfung anfordern", reason: "Konkreter Grund für die Prüfung", emailCode: "Einmaliger E-Mail-Code", school: "Studierendenstatus erneut nachweisen", inPerson: "Prüfung im Geschäft oder am Stand", keep: "Pass aktiv lassen", suspendDuring: "Pass während der Prüfung sperren", send: "Anfrage senden", empty: "Noch keine Daten.", confirm: "Möchten Sie diese Sicherheitsaktion wirklich ausführen?", done: "Aktion gespeichert.", failed: "Die Aktion konnte nicht gespeichert werden.", settingsTitle: "Erkennungsschwellen anpassen", newDevicesLabel: "Neue Geräte", windowDays: "Zeitraum (Tage)", concurrentMinutes: "Gleichzeitig (Min.)", qrIssue: "QR-Aktualisierungen / 5 Min.", qrCheck: "QR-Prüfungen / 5 Min.", save: "Speichern", ruleEnable: "Erkennungsregeln aktivieren", ruleExempt: "Studierende von Geräteregeln ausnehmen", sessionsTitle: "Sitzungen", revoked: "widerrufen", active: "aktiv", points: "Punkte", completeRestore: "Abschließen und Pass wiederherstellen", cancelRequest: "Anfrage abbrechen", method: "Methode", passPolicy: "Pass während der Prüfung" },
} as const;

export function StudentSecurityPortal({ locale }: { locale: string }) {
  const language = locale in copy ? locale as keyof typeof copy : "nl";
  const t = copy[language];
  const [filter, setFilter] = useState("all");
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<Detail | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState<Settings | null>(null);

  const loadOverview = useCallback(async () => {
    const response = await fetch(`/api/members/admin/security?filter=${encodeURIComponent(filter)}`, { credentials: "same-origin", cache: "no-store" });
    if (response.status === 403) { setForbidden(true); setStudents([]); return; }
    if (!response.ok) throw new Error("overview");
    const body = await response.json() as { students: StudentRow[]; settings: Settings };
    setStudents(body.students);
    setSettings(body.settings);
    setForbidden(false);
  }, [filter]);

  const loadDetail = useCallback(async (userId: string) => {
    const response = await fetch(`/api/members/admin/security/${userId}`, { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) throw new Error("detail");
    setDetail(await response.json() as Detail);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadOverview().catch(() => setStudents([])), 0);
    return () => window.clearTimeout(timeout);
  }, [loadOverview]);
  useEffect(() => {
    if (!selectedId) return;
    const timeout = window.setTimeout(() => void loadDetail(selectedId).catch(() => setDetail(null)), 0);
    return () => window.clearTimeout(timeout);
  }, [selectedId, loadDetail]);

  async function act(action: string, payload: Record<string, unknown> = {}, needsConfirm = true) {
    if (!selectedId || (needsConfirm && !window.confirm(t.confirm))) return false;
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/members/admin/security/${selectedId}`, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...payload }) });
      if (!response.ok) throw new Error("action");
      setMessage(t.done);
      await Promise.all([loadOverview(), loadDetail(selectedId)]);
      return true;
    } catch { setMessage(t.failed); return false; } finally { setBusy(false); }
  }

  async function requestVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const saved = await act("verification_requested", { method: fields.get("method"), reason: fields.get("reason"), passPolicy: fields.get("passPolicy") }, false);
    if (saved) event.currentTarget.reset();
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const payload = Object.fromEntries(["newDeviceWarningCount", "newDeviceWindowDays", "concurrentDeviceMinutes", "qrIssueLimit", "qrCheckLimit"].map(key => [key, Number(fields.get(key))]));
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/members/admin/security/settings", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("settings");
      setSettings((await response.json() as { settings: Settings }).settings); setMessage(t.done);
    } catch { setMessage(t.failed); } finally { setBusy(false); }
  }

  const filters = [["all", t.all], ["suspicious", t.suspicious], ["verification", t.verification], ["blocked", t.blocked], ["new-devices", t.devices]];
  return <main className="section-wrap py-12 md:py-16">
    <p className="kapitaal">Schaap&apos;s Vishandel · beheer</p>
    <h1 className="font-display text-4xl font-bold text-slate-950 md:text-5xl">{t.title}</h1>
    <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">{t.intro}</p>
    <nav className="mt-6 flex flex-wrap gap-2">{filters.map(([value, label]) => <button key={value} type="button" onClick={() => { setFilter(value); setSelectedId(""); setDetail(null); }} className={`rounded-full px-4 py-2 text-sm font-bold ${filter === value ? "bg-sky-800 text-white" : "bg-sky-50 text-sky-900"}`}>{label}</button>)}</nav>
    {settings && <details className="mt-5 rounded-xl border border-sky-100 bg-white p-4"><summary className="cursor-pointer font-bold">{t.settingsTitle}</summary><form onSubmit={saveSettings} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><label className="text-xs font-bold">{t.newDevicesLabel}<input name="newDeviceWarningCount" type="number" min={2} max={10} defaultValue={settings.newDeviceWarningCount} className="mt-1 w-full rounded border p-2" /></label><label className="text-xs font-bold">{t.windowDays}<input name="newDeviceWindowDays" type="number" min={1} max={30} defaultValue={settings.newDeviceWindowDays} className="mt-1 w-full rounded border p-2" /></label><label className="text-xs font-bold">{t.concurrentMinutes}<input name="concurrentDeviceMinutes" type="number" min={2} max={120} defaultValue={settings.concurrentDeviceMinutes} className="mt-1 w-full rounded border p-2" /></label><label className="text-xs font-bold">{t.qrIssue}<input name="qrIssueLimit" type="number" min={5} max={120} defaultValue={settings.qrIssueLimit} className="mt-1 w-full rounded border p-2" /></label><label className="text-xs font-bold">{t.qrCheck}<input name="qrCheckLimit" type="number" min={5} max={120} defaultValue={settings.qrCheckLimit} className="mt-1 w-full rounded border p-2" /></label><button disabled={busy} className="knop knop-navy sm:col-span-2 lg:col-span-5 lg:justify-self-start">{t.save}</button></form></details>}
    {forbidden ? <p role="alert" className="mt-8 rounded-xl bg-amber-50 p-5">{t.denied}</p> : students === null ? <p className="mt-8">{t.loading}</p> : students.length === 0 ? <p className="mt-8 rounded-xl border border-sky-100 p-5">{t.noRows}</p> : <div className="mt-8 grid gap-3 lg:grid-cols-2">{students.map(student => <button type="button" key={student.id} onClick={() => setSelectedId(student.id)} className={`rounded-2xl border p-5 text-left transition ${selectedId === student.id ? "border-sky-700 bg-sky-50" : "border-sky-100 bg-white hover:border-sky-300"}`}><span className="font-display text-xl font-bold text-slate-950">{student.full_name}</span><span className="mt-1 block text-sm text-slate-600">{student.email}</span><span className="mt-3 block text-sm"><strong>{t.score}: {student.risk_score}</strong> · {student.open_warning_count} {t.warnings} · {student.active_session_count} {t.sessions}</span><span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase">{student.pass_status}</span></button>)}</div>}

    {detail && <section className="mt-12 border-t border-sky-100 pt-10">
      <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="kapitaal">{t.detail}</p><h2 className="font-display text-3xl font-bold">{detail.student.full_name}</h2><p>{detail.student.email}{detail.student.school_email ? ` · ${detail.student.school_email}` : ""}</p></div><div className="flex flex-wrap gap-2"><button disabled={busy} onClick={() => void act("all_sessions_revoked")} className="knop knop-lijn">{t.logoutAll}</button><button disabled={busy} onClick={() => void act(detail.student.pass_status === "suspended" ? "pass_restored" : "pass_suspended")} className="knop knop-navy">{detail.student.pass_status === "suspended" ? t.restore : t.suspend}</button></div></div>
      {message && <p role="status" className="mt-5 rounded-xl bg-sky-50 p-4">{message}</p>}
      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <div><h3 className="font-display text-2xl font-bold">{t.registered}</h3><div className="mt-4 space-y-3">{detail.devices.length ? detail.devices.map(device => { const exempt = JSON.parse(device.rule_exemptions_json || "[]") as string[]; return <article key={device.id} className="rounded-xl border border-sky-100 p-4"><p className="font-bold">{device.device_type} · {device.operating_system} · {device.browser}</p><p className="mt-1 text-sm text-slate-600">{device.access_context}{device.device_model ? ` · ${device.device_model}` : ""}<br />{new Date(device.first_seen_at).toLocaleString(language)} → {new Date(device.last_seen_at).toLocaleString(language)}</p><div className="mt-3 flex flex-wrap gap-4"><button disabled={busy || device.status === "revoked"} onClick={() => void act("device_revoked", { deviceId: device.id })} className="text-sm font-bold text-rose-800 underline disabled:opacity-40">{t.revokeDevice}</button><button disabled={busy} onClick={() => void act("rule_exemption_changed", { deviceId: device.id, rules: exempt.length ? [] : ["device_threshold", "concurrent_devices"] }, false)} className="text-sm font-bold text-sky-900 underline">{exempt.length ? t.ruleEnable : t.ruleExempt}</button></div></article>; }) : <p>{t.empty}</p>}</div></div>
        <div><h3 className="font-display text-2xl font-bold">{t.sessionsTitle}</h3><div className="mt-4 space-y-3">{detail.sessions.length ? detail.sessions.map(session => <article key={session.session_key} className="rounded-xl border border-sky-100 p-4"><p className="font-bold">{session.access_context} · {session.revoked_at ? t.revoked : t.active}</p><p className="mt-1 text-sm text-slate-600">{new Date(session.created_at).toLocaleString(language)} · {new Date(session.expires_at).toLocaleDateString(language)}</p><button disabled={busy || Boolean(session.revoked_at)} onClick={() => void act("session_revoked", { sessionKey: session.session_key })} className="mt-3 text-sm font-bold text-rose-800 underline disabled:opacity-40">{t.revokeSession}</button></article>) : <p>{t.empty}</p>}</div></div>
        <div><h3 className="font-display text-2xl font-bold">{t.events}</h3><div className="mt-4 space-y-3">{detail.events.length ? detail.events.map(event => <article key={event.id} className={`rounded-xl border p-4 ${event.severity === "high" ? "border-rose-200 bg-rose-50" : event.severity === "warning" ? "border-amber-200 bg-amber-50" : "border-sky-100"}`}><p className="font-bold">{event.reason}</p><p className="mt-1 text-sm">{event.risk_points} {t.points} · {event.occurrence_count}× · {new Date(event.last_occurred_at).toLocaleString(language)}</p>{event.status === "open" && <button disabled={busy} onClick={() => void act("event_marked_safe", { eventId: event.id }, false)} className="mt-3 text-sm font-bold text-sky-900 underline">{t.safe}</button>}</article>) : <p>{t.empty}</p>}</div></div>
        <div><h3 className="font-display text-2xl font-bold">{t.verifications}</h3><div className="mt-4 space-y-3">{detail.verifications.length ? detail.verifications.map(item => <article key={item.id} className="rounded-xl border border-sky-100 p-4"><p className="font-bold">{item.method} · {item.status}</p><p className="mt-1 text-sm">{item.reason}</p>{item.status === "pending" && <div className="mt-3 flex flex-wrap gap-4"><button disabled={busy} onClick={() => void act("verification_completed", { verificationId: item.id, restorePass: true })} className="text-sm font-bold text-emerald-800 underline">{t.completeRestore}</button><button disabled={busy} onClick={() => void act("verification_cancelled", { verificationId: item.id })} className="text-sm font-bold text-rose-800 underline">{t.cancelRequest}</button></div>}</article>) : <p>{t.empty}</p>}</div></div>
      </div>
      <form onSubmit={requestVerification} className="mt-10 grid gap-4 rounded-2xl bg-sky-50 p-6 sm:grid-cols-2"><h3 className="font-display text-2xl font-bold sm:col-span-2">{t.request}</h3><label className="text-sm font-bold">{t.method}<select name="method" className="mt-1 block w-full rounded-lg border border-sky-200 bg-white p-3"><option value="email_code">{t.emailCode}</option><option value="student_status">{t.school}</option><option value="in_person">{t.inPerson}</option></select></label><label className="text-sm font-bold">{t.passPolicy}<select name="passPolicy" className="mt-1 block w-full rounded-lg border border-sky-200 bg-white p-3"><option value="keep_active">{t.keep}</option><option value="suspend">{t.suspendDuring}</option></select></label><label className="text-sm font-bold sm:col-span-2">{t.reason}<textarea name="reason" required minLength={8} maxLength={500} className="mt-1 block min-h-24 w-full rounded-lg border border-sky-200 bg-white p-3" /></label><button disabled={busy} className="knop knop-navy sm:col-span-2 sm:justify-self-start">{t.send}</button></form>
    </section>}
  </main>;
}
