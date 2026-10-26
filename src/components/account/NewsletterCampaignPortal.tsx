"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Campaign = { id: string; subject: string; audience: "all" | "students"; status: "draft" | "queued" | "sent" | "partial_failure"; recipient_count: number; sent_count: number; failed_count: number; created_at: string };
type Data = { campaigns: Campaign[]; subscriberCount: number; studentSubscriberCount: number; subscriberRegions?: { region_tag: string | null; count: number }[] };

const copy = {
  nl: { title: "Aanbiedingen per e-mail", intro: "Maak een concept en verstuur het alleen wanneer u daar zelf bewust voor kiest. Alleen bevestigde inschrijvers ontvangen de mail; iedere mail bevat een afmeldlink.", subject: "Onderwerp", body: "Aanbieding en voorwaarden", save: "Concept opslaan", send: "Stuur naar ingeschreven klanten", confirm: "Deze e-mail wordt verstuurd naar alle bevestigde inschrijvers. Doorgaan?", count: "bevestigde inschrijvers", drafts: "Campagnes", loading: "Gegevens laden…", forbidden: "Geen beheerderstoegang.", empty: "Nog geen campagnes.", fail: "Opslaan of versturen lukte niet.", saved: "Concept opgeslagen.", queued: "Campagne in de verzendwachtrij.", draft: "Concept", queuedStatus: "Wordt verzonden", sent: "Verzonden", partial: "Verzonden met fouten", sentCount: "verzonden", failedCount: "mislukt" },
  en: { title: "Customer offers", intro: "Create a draft and send it only when you deliberately choose to. Only confirmed subscribers receive it; every email includes an unsubscribe link.", subject: "Subject", body: "Offer and terms", save: "Save draft", send: "Send to subscribed customers", confirm: "This email will go to all confirmed subscribers. Continue?", count: "confirmed subscribers", drafts: "Campaigns", loading: "Loading…", forbidden: "Administrator access required.", empty: "No campaigns yet.", fail: "Could not save or send the campaign.", saved: "Draft saved.", queued: "Campaign added to the send queue.", draft: "Draft", queuedStatus: "Sending", sent: "Sent", partial: "Sent with errors", sentCount: "sent", failedCount: "failed" },
  de: { title: "Angebote per E-Mail", intro: "Erstellen Sie einen Entwurf und versenden Sie ihn nur nach Ihrer bewussten Freigabe. Nur bestätigte Abonnenten erhalten die E-Mail; jede Nachricht enthält einen Abmeldelink.", subject: "Betreff", body: "Angebot und Bedingungen", save: "Entwurf speichern", send: "An angemeldete Kunden senden", confirm: "Diese E-Mail wird an alle bestätigten Abonnenten gesendet. Fortfahren?", count: "bestätigte Abonnenten", drafts: "Kampagnen", loading: "Wird geladen…", forbidden: "Administratorzugriff erforderlich.", empty: "Noch keine Kampagnen.", fail: "Kampagne konnte nicht gespeichert oder gesendet werden.", saved: "Entwurf gespeichert.", queued: "Kampagne wurde zur Warteschlange hinzugefügt.", draft: "Entwurf", queuedStatus: "Wird gesendet", sent: "Gesendet", partial: "Mit Fehlern gesendet", sentCount: "gesendet", failedCount: "fehlgeschlagen" },
} as const;

const regionLabels: Record<string, Record<"nl" | "en" | "de", string>> = {
  leiden: { nl: "Leiden", en: "Leiden", de: "Leiden" },
  voorschoten: { nl: "Voorschoten", en: "Voorschoten", de: "Voorschoten" },
  wassenaar: { nl: "Wassenaar", en: "Wassenaar", de: "Wassenaar" },
  leidschendam: { nl: "Leidschendam", en: "Leidschendam", de: "Leidschendam" },
  "regio-071": { nl: "Elders in regio 071", en: "Elsewhere in area 071", de: "Anderswo in der Region 071" },
  elders: { nl: "Elders", en: "Elsewhere", de: "Anderswo" },
  unknown: { nl: "Niet opgegeven", en: "Not specified", de: "Ohne Angabe" },
};

const audienceCopy = {
  nl: { audience: "Ontvangers", students: "Studenten met geldige korting en bevestigde e-mail", all: "Alle bevestigde inschrijvers", studentCount: "studenten in de maildoelgroep", confirmStudents: "Deze e-mail gaat alleen naar bevestigde inschrijvers met een geldige studentenkorting. Doorgaan?" },
  en: { audience: "Recipients", students: "Students with a valid discount and confirmed email", all: "All confirmed subscribers", studentCount: "students in the email audience", confirmStudents: "Send this email only to confirmed subscribers with a valid student discount?" },
  de: { audience: "Empfänger", students: "Studierende mit gültigem Rabatt und bestätigter E-Mail", all: "Alle bestätigten Abonnenten", studentCount: "Studierende im E-Mail-Verteiler", confirmStudents: "Diese E-Mail nur an bestätigte Abonnenten mit gültigem Studentenrabatt senden?" },
} as const;

export function NewsletterCampaignPortal({ locale }: { locale: string }) {
  const language = locale in copy ? locale as keyof typeof copy : "nl";
  const t = copy[language];
  const audienceText = audienceCopy[language];
  const [data, setData] = useState<Data | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function reload() {
    const response = await fetch("/api/members/admin/newsletter-campaigns", { credentials: "same-origin", cache: "no-store" });
    if (response.status === 403) { setForbidden(true); setData({ campaigns: [], subscriberCount: 0, studentSubscriberCount: 0 }); return; }
    if (!response.ok) throw new Error("load-failed");
    setData(await response.json() as Data);
    setForbidden(false);
  }

  useEffect(() => {
    let active = true;
    fetch("/api/members/admin/newsletter-campaigns", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        if (response.status === 403) return { forbidden: true, data: { campaigns: [], subscriberCount: 0, studentSubscriberCount: 0 } as Data };
        if (!response.ok) throw new Error("load-failed");
        return { forbidden: false, data: await response.json() as Data };
      })
      .then((result) => { if (active) { setForbidden(result.forbidden); setData(result.data); } })
      .catch(() => { if (active) { setData({ campaigns: [], subscriberCount: 0, studentSubscriberCount: 0 }); setMessage(t.fail); } });
    return () => { active = false; };
  }, [t.fail]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/members/admin/newsletter-campaigns", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ subject: fields.get("subject"), body: fields.get("body"), audience: fields.get("audience") }),
      });
      if (!response.ok) throw new Error("save-failed");
      form.reset();
      setMessage(t.saved);
      await reload();
    } catch { setMessage(t.fail); }
    finally { setBusy(false); }
  }

  async function send(campaign: Campaign) {
    if (!window.confirm(campaign.audience === "students" ? audienceText.confirmStudents : t.confirm)) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/members/admin/newsletter-campaigns/${campaign.id}/send`, { method: "POST", credentials: "same-origin" });
      if (!response.ok) throw new Error("send-failed");
      setMessage(t.queued);
      await reload();
    } catch { setMessage(t.fail); }
    finally { setBusy(false); }
  }

  return (
    <div className="section-wrap min-h-[60vh] py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="kapitaal">Schaap&apos;s Vishandel · beheer</p>
        <h1 className="font-display text-4xl font-bold text-slate-900">{t.title}</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">{t.intro}</p>
        <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2"><a href={`/${language}/beheer/studenten`} className="font-semibold text-sky-800 underline underline-offset-4">{language === "de" ? "Studentenanträge prüfen" : language === "en" ? "Review student applications" : "Studentaanvragen beoordelen"} →</a><a href={`/${language}/beheer/overzicht`} className="font-semibold text-sky-800 underline underline-offset-4">{language === "de" ? "Website-Statistiken" : language === "en" ? "Website analytics" : "Website-statistieken"} →</a></nav>
        {data === null ? <p className="mt-8">{t.loading}</p> : forbidden ? <p role="alert" className="mt-8 rounded-xl bg-amber-50 p-5">{t.forbidden}</p> : (
          <>
            <div className="mt-6 rounded-lg bg-sky-50 p-4 text-sm font-semibold text-sky-950">
              <p>{data.subscriberCount} {t.count} · {data.studentSubscriberCount} {audienceText.studentCount}</p>
              {data.subscriberRegions && <p className="mt-2 font-normal">{language === "de" ? "Nach Ort" : language === "en" ? "By area" : "Per plaats"}: {data.subscriberRegions.map(({ region_tag, count }) => `${regionLabels[region_tag || "unknown"]?.[language] || regionLabels.unknown[language]}: ${count}`).join(" · ")}</p>}
            </div>
            <form onSubmit={create} className="mt-6 space-y-4 rounded-2xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8">
              <label className="block text-sm font-semibold">{audienceText.audience}<select name="audience" required defaultValue="students" className="mt-1 block w-full rounded-lg border border-sky-200 bg-white px-3 py-2.5"><option value="students">{audienceText.students}</option><option value="all">{audienceText.all}</option></select></label>
              <label className="block text-sm font-semibold">{t.subject}<input name="subject" required maxLength={140} className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
              <label className="block text-sm font-semibold">{t.body}<textarea name="body" required maxLength={3000} rows={7} className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
              <button disabled={busy} className="knop knop-navy">{t.save}</button>
            </form>
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-slate-900">{t.drafts}</h2>
              {data.campaigns.length === 0 ? <p className="mt-4 text-slate-600">{t.empty}</p> : <ul className="mt-4 divide-y divide-sky-100 rounded-xl border border-sky-100 bg-white">
                {data.campaigns.map((campaign) => <li key={campaign.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div><p className="font-semibold text-slate-900">{campaign.subject}</p><p className="mt-1 text-sm text-slate-600">{campaign.audience === "students" ? audienceText.students : audienceText.all} · {campaign.status === "draft" ? t.draft : campaign.status === "queued" ? t.queuedStatus : campaign.status === "sent" ? t.sent : t.partial} · {campaign.sent_count}/{campaign.recipient_count} {t.sentCount}{campaign.failed_count ? ` · ${campaign.failed_count} ${t.failedCount}` : ""}</p></div>
                  {campaign.status === "draft" && <button type="button" disabled={busy || !(campaign.audience === "students" ? data.studentSubscriberCount : data.subscriberCount)} onClick={() => void send(campaign)} className="knop knop-lijn">{t.send}</button>}
                </li>)}
              </ul>}
            </section>
          </>
        )}
        {message && <p role="status" className="mt-5 rounded-lg bg-sky-50 p-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}
