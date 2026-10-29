"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { PassQrCode } from "./PassQrCode";

type Member = {
  id: string;
  name: string;
  email: string;
};

type StudentApplication = {
  status: "pending" | "approved" | "rejected";
  education_level: "mbo" | "hbo" | "wo";
  institution: string;
  study_city?: string | null;
  submitted_at: string;
};

type MemberData = {
  user: Member | null;
  isAdmin?: boolean;
  studentApplication?: StudentApplication | null;
  discountPass?: { code: string; displayCode: string; issuedAt: string; expiresAt: string | null } | null;
  newsletter?: string;
  wallet?: { google?: { available?: boolean }; apple?: { available?: boolean } };
};

const translations = {
  nl: {
    title: "Uw Schaap's account",
    intro: "Maak een account aan, bekijk uw studentenaanvraag en toon na goedkeuring uw kortingspas in de winkel.",
    login: "Inloggen",
    register: "Account maken",
    firstName: "Voornaam",
    lastName: "Achternaam",
    email: "Privé-e-mailadres (hiermee logt u in)",
    schoolEmail: "E-mailadres van uw onderwijsinstelling",
    password: "Wachtwoord (minimaal 12 tekens)",
    personalCode: "Code uit uw persoonlijke e-mail",
    schoolCode: "Code uit uw schoolmail",
    verifyCodes: "E-mailadressen bevestigen",
    verificationHelp: "Vul beide codes in. Ze zijn 10 minuten geldig. Kijk ook in Ongewenste e-mail als u geen bericht ziet.",
    invalidCodes: "De codes zijn onjuist of verlopen. Vraag nieuwe codes aan en probeer opnieuw.",
    optionalOffers: "Ja, ik wil aanbiedingen per e-mail ontvangen, soms ook voor studentengroepen of verenigingen. Mijn inschrijving wordt direct actief en ik kan me via iedere e-mail afmelden.",
    send: "Verder",
    logout: "Uitloggen",
    reset: "Wachtwoord vergeten? Stuur een resetlink",
    resend: "Nieuwe verificatiecodes sturen",
    studentTitle: "Studentenkorting aanvragen",
    studentInfo: "De 10% korting geldt voor Nederlandse en internationale studenten met een bevestigde schoolmail die een MBO-, HBO- of WO-opleiding volgen; middelbare school is uitgesloten. Na goedkeuring geldt de korting voor het hele assortiment. De korting is niet te combineren met andere acties. De pas is één studiejaar geldig.",
    institution: "Onderwijsinstelling",
    studyCity: "Stad van uw opleiding",
    level: "Opleidingsniveau",
    mbo: "MBO",
    hbo: "HBO",
    wo: "Universiteit (WO)",
    apply: "Aanvraag indienen",
    pending: "Uw aanvraag wacht op beoordeling. U krijgt uw pas zodra deze is goedgekeurd.",
    approved: "Uw aanvraag is goedgekeurd. Toon deze pas bij de kassa.",
    expired: "Uw studentenpas is verlopen. U kunt met uw bevestigde schoolmail opnieuw een aanvraag indienen.",
    rejected: "Uw vorige aanvraag is afgewezen. U kunt opnieuw aanvragen.",
    pass: "Digitale studentenpas",
    passCode: "Laat deze code door een medewerker controleren",
    qrLabel: "QR-code van uw studentenpas",
    holder: "Studentenpas van",
    discount: "10% korting op het hele assortiment · niet combineerbaar met andere acties",
    unavailable: "De accountomgeving wordt nog gekoppeld. Probeer het later opnieuw.",
    accountCreated: "We sturen één code naar uw privé-e-mailadres en één naar uw schoolmail. Controleer zo nodig ook Ongewenste e-mail.",
    verificationFailed: "Uw account is aangemaakt, maar een of beide e-mails konden niet worden verstuurd. Vraag de codes opnieuw aan.",
    verificationDeliveryFailed: "Uw account is aangemaakt, maar de verificatiemails konden niet worden bezorgd. Gebruik hieronder ‘Nieuwe verificatiecodes sturen’ om het opnieuw te proberen.",
    genericError: "Dit lukte niet. Controleer uw gegevens of probeer het later opnieuw.",
    resetSent: "Als er een account bij dit adres hoort, ontvangt u een resetlink.",
    applicationSent: "Uw aanvraag is veilig ontvangen en wacht op beoordeling.",
    accountLabel: "Ingelogd als",
    date: "Pas geldig vanaf",
    expiry: "Geldig tot",
    googleWallet: "Toevoegen aan Google Wallet",
    privacy: "Lees de voorlopige privacyinformatie over accounts, schoolmailverificatie en e-maildeals.",
  },
  en: {
    title: "Your Schaap's account",
    intro: "Create an account, check your student application and show your discount pass in store after approval.",
    login: "Log in",
    register: "Create account",
    firstName: "First name",
    lastName: "Last name",
    email: "Personal email address (used to log in)",
    schoolEmail: "Email address from your educational institution",
    password: "Password (at least 12 characters)",
    personalCode: "Code from your personal email",
    schoolCode: "Code from your school email",
    verifyCodes: "Verify both email addresses",
    verificationHelp: "Enter both codes. They are valid for 10 minutes. Check your spam folder if you do not see the messages.",
    invalidCodes: "The codes are incorrect or expired. Request new codes and try again.",
    optionalOffers: "Yes, I would like to receive email offers, occasionally including offers for student groups or associations. My subscription starts immediately and I can unsubscribe from every email.",
    send: "Continue",
    logout: "Log out",
    reset: "Forgot your password? Send a reset link",
    resend: "Resend verification codes",
    studentTitle: "Apply for the student discount",
    studentInfo: "The 10% discount is for Dutch and international students with a verified school email who attend an MBO, HBO or university programme; secondary school is not eligible. After approval, it applies to the entire range and cannot be combined with other offers. The pass is valid for one academic year.",
    institution: "Educational institution",
    studyCity: "City where you study",
    level: "Education level",
    mbo: "MBO",
    hbo: "HBO",
    wo: "University",
    apply: "Submit application",
    pending: "Your application is awaiting review. Your pass will appear after approval.",
    approved: "Your application is approved. Show this pass at the counter.",
    expired: "Your student pass has expired. You can apply again using your verified school email.",
    rejected: "Your previous application was declined. You can apply again.",
    pass: "Digital student pass",
    passCode: "Ask a staff member to verify this code",
    qrLabel: "QR code for your student pass",
    holder: "Student pass for",
    discount: "10% off the entire range · cannot be combined with other offers",
    unavailable: "The account area is still being connected. Please try again later.",
    accountCreated: "We will send one code to your personal email and one to your school email. Check your spam folder if needed.",
    verificationFailed: "Your account was created, but one or both emails could not be sent. Request new codes.",
    verificationDeliveryFailed: "Your account was created, but the verification emails could not be delivered. Use ‘Resend verification codes’ below to try again.",
    genericError: "That did not work. Check your details or try again later.",
    resetSent: "If an account exists for this address, you will receive a reset link.",
    applicationSent: "Your application was received securely and is awaiting review.",
    accountLabel: "Signed in as",
    date: "Pass issued",
    expiry: "Valid until",
    googleWallet: "Add to Google Wallet",
    privacy: "Read the preliminary privacy information about accounts, school-email verification and email offers.",
  },
  de: {
    title: "Ihr Schaap's-Konto",
    intro: "Erstellen Sie ein Konto, verfolgen Sie Ihren Studentenantrag und zeigen Sie nach der Freigabe Ihren Rabattpass im Geschäft.",
    login: "Anmelden",
    register: "Konto erstellen",
    firstName: "Vorname",
    lastName: "Nachname",
    email: "Private E-Mail-Adresse (für die Anmeldung)",
    schoolEmail: "E-Mail-Adresse Ihrer Bildungseinrichtung",
    password: "Passwort (mindestens 12 Zeichen)",
    personalCode: "Code aus Ihrer privaten E-Mail",
    schoolCode: "Code aus Ihrer Schul-E-Mail",
    verifyCodes: "Beide E-Mail-Adressen bestätigen",
    verificationHelp: "Geben Sie beide Codes ein. Sie sind 10 Minuten gültig. Prüfen Sie auch den Spamordner, falls die Nachrichten fehlen.",
    invalidCodes: "Die Codes sind falsch oder abgelaufen. Fordern Sie neue Codes an und versuchen Sie es erneut.",
    optionalOffers: "Ja, ich möchte E-Mail-Angebote erhalten, gelegentlich auch für Studierendengruppen oder -vereine. Die Anmeldung wird sofort aktiv; ich kann mich über jede E-Mail abmelden.",
    send: "Weiter",
    logout: "Abmelden",
    reset: "Passwort vergessen? Link zum Zurücksetzen senden",
    resend: "Neue Bestätigungscodes senden",
    studentTitle: "Studentenrabatt beantragen",
    studentInfo: "Der Rabatt von 10 % gilt für niederländische und internationale Studierende mit bestätigter Schul-E-Mail in einer MBO-, HBO- oder Hochschulausbildung; weiterführende Schulen sind ausgeschlossen. Nach Freigabe gilt er für das gesamte Sortiment und ist nicht mit anderen Aktionen kombinierbar. Der Pass ist ein Studienjahr gültig.",
    institution: "Bildungseinrichtung",
    studyCity: "Studienort",
    level: "Ausbildungsniveau",
    mbo: "MBO",
    hbo: "HBO",
    wo: "Universität",
    apply: "Antrag einreichen",
    pending: "Ihr Antrag wird geprüft. Nach der Freigabe erscheint Ihr Rabattpass.",
    approved: "Ihr Antrag wurde genehmigt. Zeigen Sie diesen Pass an der Theke vor.",
    expired: "Ihr Studentenpass ist abgelaufen. Sie können mit Ihrer bestätigten Schul-E-Mail erneut einen Antrag stellen.",
    rejected: "Ihr vorheriger Antrag wurde abgelehnt. Sie können erneut beantragen.",
    pass: "Digitaler Studentenpass",
    passCode: "Lassen Sie diesen Code vom Personal prüfen",
    qrLabel: "QR-Code Ihres Studentenpasses",
    holder: "Studentenpass für",
    discount: "10 % Rabatt auf das gesamte Sortiment · nicht mit anderen Aktionen kombinierbar",
    unavailable: "Der Kontobereich wird noch angebunden. Bitte versuchen Sie es später erneut.",
    accountCreated: "Wir senden einen Code an Ihre private E-Mail und einen an Ihre Schul-E-Mail. Prüfen Sie bei Bedarf auch den Spamordner.",
    verificationFailed: "Ihr Konto wurde erstellt, aber eine oder beide E-Mails konnten nicht gesendet werden. Fordern Sie neue Codes an.",
    verificationDeliveryFailed: "Ihr Konto wurde erstellt, aber die Bestätigungsmails konnten nicht zugestellt werden. Verwenden Sie unten ‘Neue Bestätigungscodes senden’, um es erneut zu versuchen.",
    genericError: "Das hat nicht funktioniert. Prüfen Sie Ihre Angaben oder versuchen Sie es später erneut.",
    resetSent: "Wenn es ein Konto zu dieser Adresse gibt, erhalten Sie einen Link zum Zurücksetzen.",
    applicationSent: "Ihr Antrag wurde sicher empfangen und wird geprüft.",
    accountLabel: "Angemeldet als",
    date: "Pass ausgestellt am",
    expiry: "Gültig bis",
    googleWallet: "Zu Google Wallet hinzufügen",
    privacy: "Lesen Sie die vorläufigen Datenschutzhinweise zu Konto, Schul-E-Mail-Bestätigung und E-Mail-Angeboten.",
  },
} as const;

export function AccountPortal({ locale }: { locale: string }) {
  const language = locale in translations ? locale as keyof typeof translations : "nl";
  const t = translations[language];
  const [data, setData] = useState<MemberData | null>(null);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/members/me", { credentials: "same-origin", cache: "no-store" });
      // An unauthenticated visitor is a normal account state, not an offline
      // API. Keep the register/login form available when the Worker returns
      // its expected 401 with { user: null }.
      if (response.status === 401) {
        setData({ user: null });
        setApiAvailable(true);
        return;
      }
      if (!response.ok) throw new Error("members-unavailable");
      const body = await response.json() as MemberData;
      setData(body);
      setApiAvailable(true);
    } catch {
      setData({ user: null });
      setApiAvailable(false);
      setMessage(t.unavailable);
    }
  }, [t.unavailable]);

  useEffect(() => {
    let active = true;
    fetch("/api/members/me", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) return { user: null } as MemberData;
        if (!response.ok) throw new Error("members-unavailable");
        return await response.json() as MemberData;
      })
      .then((body) => { if (active) { setData(body); setApiAvailable(true); } })
      .catch(() => {
        if (!active) return;
        setData({ user: null });
        setApiAvailable(false);
        setMessage(t.unavailable);
      });
    return () => { active = false; };
  }, [t.unavailable]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true);
    setMessage("");
    setSuccess(false);
    try {
      const body: Record<string, unknown> = { email: fields.get("email"), password: fields.get("password"), locale: language };
      if (mode === "register") {
        body.firstName = fields.get("firstName");
        body.lastName = fields.get("lastName");
        body.schoolEmail = fields.get("schoolEmail");
        body.marketingConsent = fields.get("marketingConsent") === "on";
      }
      const response = await fetch(`/api/members/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({})) as { error?: string };
        if (result.error === "email_unverified") throw new Error("unverified");
        if (mode === "register" && result.error === "verification_email_failed") {
          setVerificationEmail(String(fields.get("email") || "").trim().toLowerCase());
          setVerificationPending(true);
          setMode("login");
          throw new Error("verification-email-failed");
        }
        throw new Error("request-failed");
      }
      if (mode === "register") {
        setSuccess(true);
        setMessage(t.accountCreated);
        setVerificationEmail(String(fields.get("email") || "").trim().toLowerCase());
        setVerificationPending(true);
        setMode("login");
      } else {
        await refresh();
        setMessage("");
      }
    } catch (error) {
      setMessage(error instanceof Error && error.message === "unverified" ? t.resend
        : error instanceof Error && error.message === "verification-email-failed" ? t.verificationDeliveryFailed
        : t.genericError);
      setSuccess(false);
    } finally {
      setBusy(false);
    }
  }

  async function verifyBothAddresses(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/members/verify-codes", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ email: verificationEmail, personalCode: fields.get("personalCode"), schoolCode: fields.get("schoolCode") }),
      });
      if (!response.ok) throw new Error("verification-failed");
      setVerificationPending(false);
      setSuccess(true);
      setMessage(language === "nl" ? "Uw account is bevestigd. U bent nu ingelogd en kunt direct studentenkorting aanvragen." : language === "de" ? "Ihr Konto wurde bestätigt. Sie sind jetzt angemeldet und können den Studentenrabatt direkt beantragen." : "Your account is verified. You are now signed in and can apply for the student discount right away.");
      await refresh();
    } catch {
      setSuccess(false);
      setMessage(t.invalidCodes);
    } finally { setBusy(false); }
  }

  async function requestPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") || "");
    setBusy(true);
    try {
      const response = await fetch("/api/members/password-reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, locale: language }) });
      if (!response.ok) throw new Error("reset-unavailable");
      setSuccess(true);
      setMessage(t.resetSent);
    } catch {
      setSuccess(false);
      setMessage(t.genericError);
    } finally { setBusy(false); }
  }

  async function resendVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") || "");
    setBusy(true);
    try {
      const response = await fetch("/api/members/verify/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, locale: language }) });
      if (!response.ok) throw new Error("verification-unavailable");
      setSuccess(true);
      setMessage(t.accountCreated);
    } catch {
      setSuccess(false);
      setMessage(t.genericError);
    } finally { setBusy(false); }
  }

  async function logout() {
    setBusy(true);
    try {
      const response = await fetch("/api/members/logout", { method: "POST", credentials: "same-origin" });
      if (!response.ok) throw new Error("logout-unavailable");
      setData({ user: null });
      setMessage("");
    } catch { setMessage(t.genericError); }
    finally { setBusy(false); }
  }

  async function applyForDiscount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/members/student-application", { method: "POST", body: fields, credentials: "same-origin" });
      if (!response.ok) throw new Error("application-failed");
      await refresh();
      form.reset();
      setSuccess(true);
      setMessage(t.applicationSent);
    } catch {
      setSuccess(false);
      setMessage(t.genericError);
    } finally { setBusy(false); }
  }

  if (!data) return <div className="section-wrap py-20"><p role="status">…</p></div>;

  return (
    <div className="section-wrap py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="kapitaal">Schaap&apos;s Vishandel · Leiden</p>
        <h1 className="font-display text-4xl font-bold text-slate-900 md:text-5xl">{t.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">{t.intro}</p>

        {!apiAvailable ? (
          <p role="status" aria-live="polite" className="mt-10 rounded-2xl border border-sky-200 bg-sky-50 p-6 leading-relaxed text-slate-700">{t.unavailable}</p>
        ) : data.user ? (
          <section className="mt-10 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p><span className="block text-xs font-bold uppercase tracking-widest text-sky-800">{t.accountLabel}</span><strong>{data.user.name}</strong><br />{data.user.email}</p>
              <button type="button" onClick={logout} disabled={busy} className="knop knop-lijn">{t.logout}</button>
            </div>

            {data.isAdmin && <nav aria-label={language === "nl" ? "Beheer" : language === "de" ? "Verwaltung" : "Administration"} className="rounded-2xl border border-sky-200 bg-white p-5">
              <h2 className="font-display text-2xl font-bold text-slate-900">{language === "nl" ? "Beheer" : language === "de" ? "Verwaltung" : "Administration"}</h2>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                <a href={`/${language}/beheer/studenten`} className="font-semibold text-sky-800 underline underline-offset-4">{language === "nl" ? "Studentaanvragen" : language === "de" ? "Studentenanträge" : "Student applications"} →</a>
                <a href={`/${language}/beheer/emaildeals`} className="font-semibold text-sky-800 underline underline-offset-4">{language === "nl" ? "E-mailcampagnes" : language === "de" ? "E-Mail-Kampagnen" : "Email campaigns"} →</a>
                <a href={`/${language}/beheer/klanten`} className="font-semibold text-sky-800 underline underline-offset-4">{language === "nl" ? "Klantaccounts" : language === "de" ? "Kundenkonten" : "Customer accounts"} →</a>
                <a href={`/${language}/beheer/overzicht`} className="font-semibold text-sky-800 underline underline-offset-4">{language === "nl" ? "Website-statistieken" : language === "de" ? "Website-Statistiken" : "Website analytics"} →</a>
              </div>
            </nav>}

            {data.studentApplication?.status === "pending" && <p className="rounded-xl border border-amber-300 bg-amber-50 p-5">{t.pending}</p>}
            {data.studentApplication?.status === "approved" && data.discountPass && (
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#073d56] via-[#075c7c] to-[#0792b8] p-7 text-white shadow-xl sm:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3"><span aria-hidden="true" className="grid size-12 place-items-center rounded-full border-2 border-white/70 bg-white/10 font-display text-lg font-bold">SV</span><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-200">Schaap&apos;s Vishandel</p><p className="mt-2 text-sm tracking-[0.18em] text-sky-100">LEIDEN · SINDS 1938</p></div></div>
                  <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-widest">Student</span>
                </div>
                <div className="mt-8 grid items-end gap-7 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">{t.holder}</p>
                    <p className="mt-1 font-display text-3xl font-bold">{data.user.name}</p>
                    <p className="mt-7 text-6xl font-bold tracking-tight">10<span className="text-4xl">%</span></p>
                    <p className="mt-3 max-w-64 text-sm leading-relaxed text-sky-100">{t.discount}</p>
                  </div>
                  <PassQrCode value={data.discountPass.displayCode} label={t.qrLabel} />
                </div>
                <p className="mt-8 border-t border-white/20 pt-4 text-xs uppercase tracking-widest text-sky-100">{t.passCode}</p>
                <code className="mt-2 block rounded-lg bg-black/20 p-3 text-center font-mono text-xl font-bold tracking-[0.14em]">{data.discountPass.displayCode}</code>
                <p className="mt-4 text-xs text-sky-100">{t.date}: {new Date(data.discountPass.issuedAt).toLocaleDateString(language)}{data.discountPass.expiresAt && <> · {t.expiry}: {new Date(data.discountPass.expiresAt).toLocaleDateString(language)}</>}</p>
              </div>
            )}
            {data.studentApplication?.status === "approved" && data.discountPass && data.wallet?.google?.available && (
              <form method="post" action={`/api/members/wallet/google?locale=${language}`}>
                <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky-600">
                  {t.googleWallet}
                </button>
              </form>
            )}
            {data.studentApplication?.status === "approved" && !data.discountPass && <p className="rounded-xl border border-amber-300 bg-amber-50 p-5">{t.expired}</p>}
            {data.studentApplication?.status === "rejected" && <p className="rounded-xl border border-rose-200 bg-rose-50 p-5">{t.rejected}</p>}

            {!data.isAdmin && data.studentApplication?.status !== "pending" && (data.studentApplication?.status !== "approved" || !data.discountPass) && (
              <form onSubmit={applyForDiscount} className="space-y-5 rounded-2xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8">
                <div><h2 className="font-display text-2xl font-bold text-slate-900">{t.studentTitle}</h2><p className="mt-2 text-sm leading-relaxed text-slate-700">{t.studentInfo}</p></div>
                <label className="block text-sm font-medium">{t.institution}<input name="institution" required maxLength={180} className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
                <label className="block text-sm font-medium">{t.studyCity}<input name="studyCity" required maxLength={120} autoComplete="address-level2" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
                <label className="block text-sm font-medium">{t.level}<select name="educationLevel" required defaultValue="" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5"><option value="" disabled>{t.level}</option><option value="mbo">{t.mbo}</option><option value="hbo">{t.hbo}</option><option value="wo">{t.wo}</option></select></label>
                <button type="submit" disabled={busy} className="knop knop-navy disabled:opacity-60">{t.apply}</button>
              </form>
            )}
          </section>
        ) : (
          verificationPending ? <section className="mt-10 max-w-xl rounded-2xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-bold text-slate-900">{t.verifyCodes}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{t.verificationHelp}<br /><span className="font-semibold">{verificationEmail}</span></p>
            <form onSubmit={verifyBothAddresses} className="mt-6 space-y-4">
              <label className="block text-sm font-medium">{t.personalCode}<input name="personalCode" type="text" inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" required maxLength={6} className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5 tracking-[.3em]" /></label>
              <label className="block text-sm font-medium">{t.schoolCode}<input name="schoolCode" type="text" inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" required maxLength={6} className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5 tracking-[.3em]" /></label>
              <button type="submit" disabled={busy} className="knop knop-navy w-full disabled:opacity-60">{busy ? "…" : t.verifyCodes}</button>
            </form>
            <form onSubmit={resendVerification} className="mt-4">
              <input type="hidden" name="email" value={verificationEmail} />
              <button type="submit" disabled={busy} className="text-sm font-semibold text-sky-800 underline underline-offset-4">{t.resend}</button>
            </form>
            {message && <p role="status" aria-live="polite" className={`mt-4 text-sm ${success ? "text-emerald-800" : "text-red-800"}`}>{message}</p>}
          </section> : <section className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex gap-2" role="tablist" aria-label={t.title}>
                <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => { setMode("login"); setMessage(""); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-sky-800 text-white" : "bg-sky-50 text-sky-900"}`}>{t.login}</button>
                <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => { setMode("register"); setMessage(""); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "register" ? "bg-sky-800 text-white" : "bg-sky-50 text-sky-900"}`}>{t.register}</button>
              </div>
              <form onSubmit={submitAuth} className="space-y-4">
                {mode === "register" && <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">{t.firstName}<input name="firstName" required minLength={1} maxLength={60} autoComplete="given-name" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label><label className="block text-sm font-medium">{t.lastName}<input name="lastName" required minLength={1} maxLength={80} autoComplete="family-name" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label></div>}
                <label className="block text-sm font-medium">{t.email}<input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
                {mode === "register" && <label className="block text-sm font-medium">{t.schoolEmail}<input name="schoolEmail" type="email" required maxLength={254} autoComplete="email" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>}
                <label className="block text-sm font-medium">{t.password}<input name="password" type="password" required minLength={12} maxLength={128} autoComplete={mode === "register" ? "new-password" : "current-password"} className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
                {mode === "register" && <label className="flex items-start gap-2 text-sm leading-relaxed"><input type="checkbox" name="marketingConsent" className="mt-1 size-4 shrink-0 accent-sky-700" /><span>{t.optionalOffers}</span></label>}
                <button type="submit" disabled={busy} className="knop knop-navy w-full disabled:opacity-60">{busy ? "…" : mode === "login" ? t.login : t.register}</button>
              </form>
              <form onSubmit={requestPasswordReset} className="mt-5 space-y-2"><label className="block text-xs font-medium text-slate-600">{t.email}<input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2" /></label><button className="text-sm font-semibold text-sky-800 underline underline-offset-4">{t.reset}</button></form>
              {message === t.resend && <form onSubmit={resendVerification} className="mt-3 space-y-2"><label className="block text-xs font-medium text-slate-600">{t.email}<input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2" /></label><button className="text-sm font-semibold text-sky-800 underline underline-offset-4">{t.resend}</button></form>}
              {message && <p role="status" aria-live="polite" className={`mt-4 text-sm ${success ? "text-emerald-800" : "text-red-800"}`}>{message}</p>}
            </div>
            <aside className="rounded-2xl bg-sky-50 p-6 sm:p-8"><h2 className="font-display text-2xl font-bold text-slate-900">{t.studentTitle}</h2><p className="mt-3 leading-relaxed text-slate-700">{t.studentInfo}</p><p className="mt-5 text-sm leading-relaxed text-slate-600">{t.optionalOffers}</p></aside>
          </section>
        )}
        <p className="mt-8 text-sm text-slate-600"><a className="font-semibold text-sky-800 underline underline-offset-4" href={`/${language}/privacyverklaring`}>{t.privacy}</a></p>
        {data.user && message && <p role="status" aria-live="polite" className={`mt-5 rounded-lg p-4 text-sm ${success ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>{message}</p>}
      </div>
    </div>
  );
}

