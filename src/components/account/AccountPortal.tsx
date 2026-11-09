"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { PassQrCode } from "./PassQrCode";
import Image from "next/image";
import { BEELD } from "@/lib/beeld";

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
  proofMethod?: "document" | "school-email";
  studentApplication?: StudentApplication | null;
  securityVerification?: { id: string; method: "email_code" | "student_status" | "in_person"; reason: string; pass_policy: "keep_active" | "suspend"; expires_at?: string | null } | null;
  discountPass?: { displayCode: string; issuedAt: string; expiresAt: string | null } | null;
  inactivePass?: { displayCode: string | null; issuedAt: string; expiresAt: string | null; status: "suspended" | "expired" } | null;
  newsletter?: string;
  wallet?: { google?: { available?: boolean }; apple?: { available?: boolean } };
};

function appContextHeaders(json = false) {
  const standalone = typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true);
  return { ...(json ? { "Content-Type": "application/json" } : {}), "X-SV-App-Context": standalone ? "standalone" : "browser" };
}

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
    verifyCodes: "E-mail bevestigen",
    verificationHelp: "Vul beide codes in. Ze zijn 10 minuten geldig. Kijk ook in Ongewenste e-mail als u geen bericht ziet.",
    invalidCodes: "De codes zijn onjuist of verlopen. Vraag nieuwe codes aan en probeer opnieuw.",
    method: "Hoe toont u uw inschrijving aan?",
    byEmail: "Met mijn schoolmail",
    byDocument: "Ik heb geen schoolmail en gebruik een inschrijvingsbewijs",
    uploadLater: "Na bevestiging van uw privé-e-mail uploadt u het bewijs in uw account.",
    personalHelp: "Vul de code uit uw privé-e-mail in. Deze is 10 minuten geldig.",
    proof: "Inschrijvingsbewijs",
    proofHelp: "Upload een actueel inschrijvingsbewijs van uw opleiding of DUO. Laat alleen uw naam, onderwijsinstelling en studiejaar of inschrijfperiode zichtbaar. Maak BSN, adres, bedragen en andere gegevens onleesbaar.",
    file: "Bestand (PDF, JPG of PNG, maximaal 8 MB)",
    proofConsent: "Ik geef toestemming om dit bewijs voor mijn aanvraag te beoordelen. Na de beoordeling wordt het verwijderd.",
    badFile: "Kies een geldig PDF-, JPG- of PNG-bestand van maximaal 8 MB en geef toestemming voor de beoordeling.",
    optionalOffers: "Ja, ik wil kortingsbonnen per e-mail op mijn privé-e-mailadres ontvangen. Dit is vrijwillig. Afmelden kan in elke kortingsmail.",
    send: "Verder",
    logout: "Uitloggen",
    reset: "Wachtwoord vergeten? Stuur een resetlink",
    magicLogin: "Inloggen zonder wachtwoord via e-mail",
    magicSent: "Als er een bevestigd account bij dit adres hoort, ontvangt u een eenmalige inloglink.",
    resend: "Nieuwe verificatiecodes sturen",
    studentTitle: "Studentenkorting aanvragen",
    studentInfo: "De 10% korting geldt voor Nederlandse en internationale studenten die een MBO-, HBO- of WO-opleiding volgen; middelbare school is uitgesloten. Na goedkeuring geldt de korting voor het hele assortiment. De korting is niet te combineren met andere acties. De pas is één studiejaar geldig.",
    institution: "Onderwijsinstelling",
    studyCity: "Stad van uw opleiding",
    level: "Opleidingsniveau",
    mbo: "MBO",
    hbo: "HBO",
    wo: "Universiteit (WO)",
    apply: "Aanvraag indienen",
    pending: "Uw aanvraag wacht op beoordeling. U krijgt uw pas zodra deze is goedgekeurd.",
    approved: "Uw aanvraag is goedgekeurd. Toon deze pas bij de kassa.",
    expired: "Uw studentenpas is verlopen. U kunt met een actueel studentenbewijs opnieuw een aanvraag indienen.",
    suspended: "Uw studentenpas is tijdelijk geblokkeerd en geeft nu geen recht op korting. Volg een eventuele controle hierboven of neem contact op met de winkel. Een nieuwe aanvraag is niet nodig.",
    rejected: "Uw vorige aanvraag is afgewezen. U kunt opnieuw aanvragen.",
    pass: "Digitale studentenpas",
    passCode: "Laat deze code door een medewerker controleren",
    qrLabel: "QR-code van uw studentenpas",
    qrRefreshing: "Beveiligde QR-code vernieuwen…",
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
    appleWallet: "Toevoegen aan Apple Wallet",
    googleWallet: "Toevoegen aan Google Wallet",
    privacy: "Lees de voorlopige privacyinformatie over accounts, schoolmailverificatie en e-maildeals.",
    securityTitle: "Extra controle nodig",
    securityIntro: "Een beheerder heeft om een aanvullende controle gevraagd. Dit is geen beschuldiging; hieronder staat de concrete reden.",
    securityCode: "Eenmalige code uit uw e-mail",
    securityVerify: "Code controleren",
    securitySchool: "Controleer uw schoolmail en volg de instructies om uw studentenstatus opnieuw te bevestigen.",
    securityPerson: "Neem uw studentenpas mee naar onze winkel of kraam. Een medewerker rondt de controle daarna af.",
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
    verifyCodes: "Verify your email",
    verificationHelp: "Enter both codes. They are valid for 10 minutes. Check your spam folder if you do not see the messages.",
    invalidCodes: "The codes are incorrect or expired. Request new codes and try again.",
    method: "How will you prove enrolment?",
    byEmail: "With my school email",
    byDocument: "I have no school email and will use proof of enrolment",
    uploadLater: "After verifying your personal email, upload the document in your account.",
    personalHelp: "Enter the code sent to your personal email. It is valid for 10 minutes.",
    proof: "Proof of enrolment",
    proofHelp: "Upload a current enrolment document from your institution or DUO. Show only your name, institution and academic year or enrolment period. Hide your BSN, address, financial details and other information.",
    file: "File (PDF, JPG or PNG, up to 8 MB)",
    proofConsent: "I agree to this document being reviewed for my application. It will be deleted after review.",
    badFile: "Choose a valid PDF, JPG or PNG up to 8 MB and consent to review.",
    optionalOffers: "Yes, send discount vouchers to my personal email. This is optional. I can unsubscribe in any offers email.",
    send: "Continue",
    logout: "Log out",
    reset: "Forgot your password? Send a reset link",
    magicLogin: "Sign in by email without a password", magicSent: "If a verified account exists for this address, you will receive a one-time sign-in link.",
    resend: "Resend verification codes",
    studentTitle: "Apply for the student discount",
    studentInfo: "The 10% discount is for Dutch and international students who attend an MBO, HBO or university programme; secondary school is not eligible. After approval, it applies to the entire range and cannot be combined with other offers. The pass is valid for one academic year.",
    institution: "Educational institution",
    studyCity: "City where you study",
    level: "Education level",
    mbo: "MBO",
    hbo: "HBO",
    wo: "University",
    apply: "Submit application",
    pending: "Your application is awaiting review. Your pass will appear after approval.",
    approved: "Your application is approved. Show this pass at the counter.",
    expired: "Your student pass has expired. You can apply again with current proof of enrolment.",
    suspended: "Your student pass is temporarily blocked and cannot be used for a discount. Follow any verification steps above or contact the shop. You do not need to submit a new application.",
    rejected: "Your previous application was declined. You can apply again.",
    pass: "Digital student pass",
    passCode: "Ask a staff member to verify this code",
    qrLabel: "QR code for your student pass",
    qrRefreshing: "Refreshing secure QR code…",
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
    appleWallet: "Add to Apple Wallet",
    googleWallet: "Add to Google Wallet",
    privacy: "Read the preliminary privacy information about accounts, school-email verification and email offers.",
    securityTitle: "Extra verification required", securityIntro: "An administrator requested an additional check. This is not an accusation; the concrete reason is shown below.", securityCode: "One-time code from your email", securityVerify: "Verify code", securitySchool: "Check your school email and follow the instructions to reconfirm your student status.", securityPerson: "Bring your student pass to our shop or stall. A staff member will complete the check.",
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
    verifyCodes: "E-Mail bestätigen",
    verificationHelp: "Geben Sie beide Codes ein. Sie sind 10 Minuten gültig. Prüfen Sie auch den Spamordner, falls die Nachrichten fehlen.",
    invalidCodes: "Die Codes sind falsch oder abgelaufen. Fordern Sie neue Codes an und versuchen Sie es erneut.",
    method: "Wie weisen Sie Ihre Einschreibung nach?",
    byEmail: "Mit meiner Hochschul-E-Mail",
    byDocument: "Ich habe keine Hochschul-E-Mail und nutze einen Studiennachweis",
    uploadLater: "Nach Bestätigung Ihrer privaten E-Mail laden Sie den Nachweis im Konto hoch.",
    personalHelp: "Geben Sie den Code aus Ihrer privaten E-Mail ein. Er ist 10 Minuten gültig.",
    proof: "Immatrikulationsbescheinigung",
    proofHelp: "Laden Sie einen aktuellen Nachweis Ihrer Einrichtung oder von DUO hoch. Sichtbar sein sollen nur Name, Einrichtung und Studienjahr oder Einschreibezeitraum. Schwärzen Sie BSN, Anschrift, Beträge und andere Angaben.",
    file: "Datei (PDF, JPG oder PNG, maximal 8 MB)",
    proofConsent: "Ich stimme der Prüfung dieses Nachweises für meinen Antrag zu. Nach der Prüfung wird er gelöscht.",
    badFile: "Wählen Sie eine gültige PDF-, JPG- oder PNG-Datei bis 8 MB und stimmen Sie der Prüfung zu.",
    optionalOffers: "Ja, ich möchte Rabattgutscheine an meine private E-Mail-Adresse erhalten. Dies ist freiwillig. Ich kann mich in jeder Angebotsmail abmelden.",
    send: "Weiter",
    logout: "Abmelden",
    reset: "Passwort vergessen? Link zum Zurücksetzen senden",
    magicLogin: "Ohne Passwort per E-Mail anmelden", magicSent: "Wenn für diese Adresse ein bestätigtes Konto besteht, erhalten Sie einen einmaligen Anmeldelink.",
    resend: "Neue Bestätigungscodes senden",
    studentTitle: "Studentenrabatt beantragen",
    studentInfo: "Der Rabatt von 10 % gilt für niederländische und internationale Studierende in einer MBO-, HBO- oder Hochschulausbildung; weiterführende Schulen sind ausgeschlossen. Nach Freigabe gilt er für das gesamte Sortiment und ist nicht mit anderen Aktionen kombinierbar. Der Pass ist ein Studienjahr gültig.",
    institution: "Bildungseinrichtung",
    studyCity: "Studienort",
    level: "Ausbildungsniveau",
    mbo: "MBO",
    hbo: "HBO",
    wo: "Universität",
    apply: "Antrag einreichen",
    pending: "Ihr Antrag wird geprüft. Nach der Freigabe erscheint Ihr Rabattpass.",
    approved: "Ihr Antrag wurde genehmigt. Zeigen Sie diesen Pass an der Theke vor.",
    expired: "Ihr Studentenpass ist abgelaufen. Sie können mit aktuellem Studiennachweis erneut einen Antrag stellen.",
    suspended: "Ihr Studentenpass ist vorübergehend gesperrt und kann derzeit nicht für einen Rabatt genutzt werden. Folgen Sie gegebenenfalls der Prüfung oben oder kontaktieren Sie das Geschäft. Ein neuer Antrag ist nicht nötig.",
    rejected: "Ihr vorheriger Antrag wurde abgelehnt. Sie können erneut beantragen.",
    pass: "Digitaler Studentenpass",
    passCode: "Lassen Sie diesen Code vom Personal prüfen",
    qrLabel: "QR-Code Ihres Studentenpasses",
    qrRefreshing: "Sicheren QR-Code aktualisieren…",
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
    appleWallet: "Zu Apple Wallet hinzufügen",
    googleWallet: "Zu Google Wallet hinzufügen",
    privacy: "Lesen Sie die vorläufigen Datenschutzhinweise zu Konto, Schul-E-Mail-Bestätigung und E-Mail-Angeboten.",
    securityTitle: "Zusätzliche Prüfung erforderlich", securityIntro: "Ein Administrator hat eine zusätzliche Prüfung angefordert. Dies ist keine Beschuldigung; der konkrete Grund steht unten.", securityCode: "Einmaliger Code aus Ihrer E-Mail", securityVerify: "Code prüfen", securitySchool: "Prüfen Sie Ihre Schul-E-Mail und folgen Sie den Hinweisen, um Ihren Studierendenstatus erneut zu bestätigen.", securityPerson: "Bringen Sie Ihren Studentenpass in unser Geschäft oder zum Stand. Ein Mitarbeiter schließt die Prüfung ab.",
  },
} as const;

export function AccountPortal({ locale, initialMode = "login" }: { locale: string; initialMode?: "login" | "register" }) {
  const language = locale in translations ? locale as keyof typeof translations : "nl";
  const t = translations[language];
  const [data, setData] = useState<MemberData | null>(null);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [documentRoute,setDocumentRoute] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [dynamicQr, setDynamicQr] = useState("");

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/members/me", { credentials: "same-origin", cache: "no-store", headers: appContextHeaders() });
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
    fetch("/api/members/me", { credentials: "same-origin", cache: "no-store", headers: appContextHeaders() })
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

  useEffect(() => {
    if (!data?.user || !data.discountPass) return;
    let active = true;
    const load = () => fetch("/api/members/pass/qr", { credentials: "same-origin", cache: "no-store", headers: appContextHeaders() })
      .then(async (response) => {
        if (!response.ok) throw new Error("qr-unavailable");
        return await response.json() as { value: string };
      })
      .then((body) => { if (active) setDynamicQr(body.value); })
      .catch(() => { if (active) setDynamicQr(""); });
    void load();
    const interval = window.setInterval(load, 90_000);
    return () => { active = false; window.clearInterval(interval); };
  }, [data?.user, data?.discountPass]);

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
        body.proofMethod = documentRoute ? "document" : "school-email";
        body.schoolEmail = fields.get("schoolEmail");
        body.marketingConsent = fields.get("marketingConsent") === "on";
      }
      const response = await fetch(`/api/members/${mode}`, {
        method: "POST",
        headers: appContextHeaders(true),
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
        setMessage(documentRoute ? t.personalHelp : t.accountCreated);
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
        method: "POST", headers: appContextHeaders(true), credentials: "same-origin",
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

  async function completeSecurityCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get("code") || "");
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/members/security/verification", { method: "POST", credentials: "same-origin", headers: appContextHeaders(true), body: JSON.stringify({ code }) });
      if (!response.ok) throw new Error("security-check");
      setSuccess(true);
      setMessage(language === "nl" ? "De extra e-mailcontrole is afgerond." : language === "de" ? "Die zusätzliche E-Mail-Prüfung ist abgeschlossen." : "The additional email check is complete.");
      await refresh();
    } catch { setSuccess(false); setMessage(t.genericError); } finally { setBusy(false); }
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

  async function requestMagicLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") || "");
    setBusy(true);
    try {
      const response = await fetch("/api/members/magic-login", { method: "POST", credentials: "same-origin", headers: appContextHeaders(true), body: JSON.stringify({ email, locale: language }) });
      if (!response.ok) throw new Error("magic-login");
      setSuccess(true); setMessage(t.magicSent);
    } catch { setSuccess(false); setMessage(t.genericError); } finally { setBusy(false); }
  }

  async function resendVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") || "");
    setBusy(true);
    try {
      const response = await fetch("/api/members/verify/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, locale: language }) });
      if (!response.ok) throw new Error("verification-unavailable");
      setVerificationEmail(email.trim().toLowerCase());
      setVerificationPending(true);
      setSuccess(true);
      setMessage(documentRoute ? t.personalHelp : t.accountCreated);
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
      const proof = fields.get("proof");
      if (proof instanceof File && proof.size > 8 * 1024 * 1024) { setSuccess(false); setMessage(t.badFile); return; }
      const response = await fetch("/api/members/student-application", { method: "POST", body: fields, credentials: "same-origin" });
      if (!response.ok) {
        const {error} = await response.json().catch(() => ({}));
        if (error === "invalid_proof" || error === "file_too_large") {setSuccess(false); setMessage(t.badFile); return;}
        throw new Error("application-failed");
      }
      await refresh();
      form.reset();
      setSuccess(true);
      setMessage(t.applicationSent);
    } catch {
      setSuccess(false);
      setMessage(t.genericError);
    } finally { setBusy(false); }
  }

  if (!data) return <div className="section-wrap py-20"><p role="status">{language === "en" ? "Loading your account…" : language === "de" ? "Konto wird geladen…" : "Uw account wordt geladen…"}</p></div>;

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
                <a href={`/${language}/beheer/emailadressen`} className="font-semibold text-sky-800 underline underline-offset-4">{language === "nl" ? "E-mailadressen" : language === "de" ? "E-Mail-Adressen" : "Email addresses"} →</a>
                <a href={`/${language}/beheer/klanten`} className="font-semibold text-sky-800 underline underline-offset-4">{language === "nl" ? "Klantaccounts" : language === "de" ? "Kundenkonten" : "Customer accounts"} →</a>
                <a href={`/${language}/beheer/overzicht`} className="font-semibold text-sky-800 underline underline-offset-4">{language === "nl" ? "Website-statistieken" : language === "de" ? "Website-Statistiken" : "Website analytics"} →</a>
                <a href={`/${language}/beheer/beveiliging`} className="font-semibold text-sky-800 underline underline-offset-4">{language === "nl" ? "Studentenpas Beveiliging" : language === "de" ? "Studentenpass-Sicherheit" : "Student pass security"} →</a>
              </div>
            </nav>}

            {data.securityVerification && <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6" aria-labelledby="security-verification-title">
              <h2 id="security-verification-title" className="font-display text-2xl font-bold text-slate-950">{t.securityTitle}</h2>
              <p className="mt-2 leading-relaxed">{t.securityIntro}</p>
              <p className="mt-3 rounded-lg bg-white/70 p-3 font-semibold">{data.securityVerification.reason}</p>
              {data.securityVerification.pass_policy === "suspend" && <p className="mt-3 text-sm font-bold">{language === "nl" ? "Uw kortingspas is tijdens deze controle tijdelijk niet geldig." : language === "de" ? "Ihr Rabattpass ist während dieser Prüfung vorübergehend ungültig." : "Your discount pass is temporarily invalid during this check."}</p>}
              {data.securityVerification.method !== "in_person" ? <><p className="mt-4 font-semibold">{data.securityVerification.method === "student_status" ? t.securitySchool : null}</p><form onSubmit={completeSecurityCheck} className="mt-5 flex flex-wrap items-end gap-3"><label className="text-sm font-bold">{data.securityVerification.method === "student_status" ? t.schoolCode : t.securityCode}<input name="code" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" className="mt-1 block rounded-lg border border-amber-300 bg-white px-3 py-2.5 tracking-[.25em]" /></label><button disabled={busy} className="knop knop-navy">{t.securityVerify}</button></form></> : <p className="mt-4 font-semibold">{t.securityPerson}</p>}
            </section>}

            {data.studentApplication?.status === "pending" && <p className="rounded-xl border border-amber-300 bg-amber-50 p-5">{t.pending}</p>}
            {data.studentApplication?.status === "approved" && data.discountPass && (
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#073d56] via-[#075c7c] to-[#0792b8] p-7 text-white shadow-xl sm:p-10">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3"><Image src={BEELD.logoBadge.bestand} alt="Schaap's Vis" width={64} height={64} unoptimized className="size-16 shrink-0 rounded-lg bg-white p-1 object-contain" /><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">Schaap&apos;s Vishandel</p><p className="mt-2 text-xs tracking-[0.12em] text-sky-100">LEIDEN · SINDS 1938</p></div></div>
                  <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-widest">Student</span>
                </div>
                <div className="mt-8 grid items-end gap-7 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">{t.holder}</p>
                    <p className="mt-1 font-display text-3xl font-bold">{data.user.name}</p>
                    <p className="mt-7 text-6xl font-bold tracking-tight">10<span className="text-4xl">%</span></p>
                    <p className="mt-3 max-w-64 text-sm leading-relaxed text-sky-100">{t.discount}</p>
                  </div>
                  {dynamicQr ? <PassQrCode value={dynamicQr} label={t.qrLabel} /> : <div role="status" className="grid size-40 place-items-center rounded-xl bg-white/95 p-4 text-center text-sm font-semibold text-sky-950">{t.qrRefreshing}</div>}
                </div>
                <p className="mt-8 border-t border-white/20 pt-4 text-xs uppercase tracking-widest text-sky-100">{t.passCode}</p>
                <code className="mt-2 block rounded-lg bg-black/20 p-3 text-center font-mono text-xl font-bold tracking-[0.14em]">{data.discountPass.displayCode}</code>
                <p className="mt-4 text-xs text-sky-100">{t.date}: {new Date(data.discountPass.issuedAt).toLocaleDateString(language)}{data.discountPass.expiresAt && <> · {t.expiry}: {new Date(data.discountPass.expiresAt).toLocaleDateString(language)}</>}</p>
              </div>
            )}
            {data.studentApplication?.status === "approved" && data.discountPass && (data.wallet?.apple?.available || data.wallet?.google?.available) && (
              <div className="flex flex-wrap gap-3">
                {data.wallet?.apple?.available && <form method="post" action={`/api/members/wallet/apple?locale=${language}`}>
                  <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky-600">
                    {t.appleWallet}
                  </button>
                </form>}
                {data.wallet?.google?.available && <form method="post" action={`/api/members/wallet/google?locale=${language}`}>
                  <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky-600">
                    {t.googleWallet}
                  </button>
                </form>}
              </div>
            )}
            {data.studentApplication?.status === "approved" && !data.discountPass && data.inactivePass && <div className="overflow-hidden rounded-3xl border-2 border-slate-300 bg-slate-100 p-7 text-slate-700 shadow-sm sm:p-10"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.24em]">Schaap&apos;s Vishandel</p><p className="mt-2 font-display text-3xl font-bold">{data.user.name}</p></div><span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">{data.inactivePass.status === "suspended" ? (language === "nl" ? "Tijdelijk geblokkeerd" : language === "de" ? "Vorübergehend gesperrt" : "Temporarily blocked") : (language === "nl" ? "Ongeldig" : language === "de" ? "Ungültig" : "Invalid")}</span></div><p className="mt-8 text-5xl font-bold opacity-50">10%</p>{data.inactivePass.displayCode && <code className="mt-6 block rounded-lg bg-white p-3 text-center font-mono text-lg font-bold tracking-[0.12em]">{data.inactivePass.displayCode}</code>}<p className="mt-4 text-sm">{data.inactivePass.status === "suspended" ? t.suspended : t.expired}</p></div>}
            {data.studentApplication?.status === "approved" && !data.discountPass && !data.inactivePass && <p className="rounded-xl border border-amber-300 bg-amber-50 p-5">{t.expired}</p>}
            {data.studentApplication?.status === "rejected" && <p className="rounded-xl border border-rose-200 bg-rose-50 p-5">{t.rejected}</p>}

            {!data.isAdmin && data.inactivePass?.status !== "suspended" && data.studentApplication?.status !== "pending" && (data.studentApplication?.status !== "approved" || !data.discountPass) && (
              <form onSubmit={applyForDiscount} className="space-y-5 rounded-2xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8">
                <div><h2 className="font-display text-2xl font-bold text-slate-900">{t.studentTitle}</h2><p className="mt-2 text-sm leading-relaxed text-slate-700">{t.studentInfo}</p></div>
                <label className="block text-sm font-medium">{t.institution}<input name="institution" required maxLength={180} className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
                <label className="block text-sm font-medium">{t.studyCity}<input name="studyCity" required maxLength={120} autoComplete="address-level2" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
                <label className="block text-sm font-medium">{t.level}<select name="educationLevel" required defaultValue="" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5"><option value="" disabled>{t.level}</option><option value="mbo">{t.mbo}</option><option value="hbo">{t.hbo}</option><option value="wo">{t.wo}</option></select></label>
                {data.proofMethod === "document" && <fieldset className="space-y-3 rounded-xl bg-sky-50 p-4">
                  <legend className="font-semibold">{t.proof}</legend><p className="text-sm">{t.proofHelp}</p>
                  <label className="block text-sm font-medium">{t.file}<input type="file" name="proof" accept="application/pdf,image/jpeg,image/png" required className="mt-2 block w-full"/></label>
                  <label className="flex gap-2 text-sm"><input type="checkbox" name="proofConsent" value="true" required/>{t.proofConsent}</label>
                </fieldset>}
                <button type="submit" disabled={busy} className="knop knop-navy disabled:opacity-60">{t.apply}</button>
              </form>
            )}
          </section>
        ) : (
          verificationPending ? <section className="mt-10 max-w-xl rounded-2xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-bold text-slate-900">{t.verifyCodes}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{documentRoute ? t.personalHelp : t.verificationHelp}<br /><span className="font-semibold">{verificationEmail}</span></p>
            <label className="mt-4 flex gap-2"><input type="checkbox" checked={documentRoute} onChange={e=>setDocumentRoute(e.target.checked)}/>{t.byDocument}</label>
            <form onSubmit={verifyBothAddresses} className="mt-6 space-y-4">
              <label className="block text-sm font-medium">{t.personalCode}<input name="personalCode" type="text" inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" required maxLength={6} className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5 tracking-[.3em]" /></label>
              {!documentRoute && <label className="block text-sm font-medium">{t.schoolCode}<input name="schoolCode" type="text" inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" required maxLength={6} className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5 tracking-[.3em]" /></label>}
              <button type="submit" disabled={busy} className="knop knop-navy w-full disabled:opacity-60">{busy ? "…" : t.verifyCodes}</button>
            </form>
            <form onSubmit={resendVerification} className="mt-4">
              <input type="hidden" name="email" value={verificationEmail} />
              <button type="submit" disabled={busy} className="text-sm font-semibold text-sky-800 underline underline-offset-4">{t.resend}</button>
            </form>
            {message && <p role="status" aria-live="polite" className={`mt-4 text-sm ${success ? "text-emerald-800" : "text-red-800"}`}>{message}</p>}
          </section> : <section className="mt-10 grid gap-8">
            <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex gap-2" role="tablist" aria-label={t.title}>
                <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => { setMode("login"); setMessage(""); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-sky-800 text-white" : "bg-sky-50 text-sky-900"}`}>{t.login}</button>
                <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => { setMode("register"); setMessage(""); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "register" ? "bg-sky-800 text-white" : "bg-sky-50 text-sky-900"}`}>{t.register}</button>
              </div>
              <form onSubmit={submitAuth} className="space-y-4">
                {mode === "register" && <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">{t.firstName}<input name="firstName" required minLength={1} maxLength={60} autoComplete="given-name" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label><label className="block text-sm font-medium">{t.lastName}<input name="lastName" required minLength={1} maxLength={80} autoComplete="family-name" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label></div>}
                <label className="block text-sm font-medium">{t.email}<input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
                {mode === "register" && <label className="block text-sm font-medium">{t.method}
                  <select className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" value={documentRoute ? "document" : "school-email"} onChange={e=>setDocumentRoute(e.target.value === "document")}>
                    <option value="school-email">{t.byEmail}</option><option value="document">{t.byDocument}</option>
                  </select>
                </label>}
                {mode === "register" && documentRoute && <p className="text-sm">{t.uploadLater}</p>}
                {mode === "register" && !documentRoute && <label className="block text-sm font-medium">{t.schoolEmail}<input name="schoolEmail" type="email" required maxLength={254} autoComplete="email" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>}
                <label className="block text-sm font-medium">{t.password}<input name="password" type="password" required minLength={12} maxLength={128} autoComplete={mode === "register" ? "new-password" : "current-password"} className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2.5" /></label>
                {mode === "register" && <label className="flex items-start gap-2 text-sm leading-relaxed"><input type="checkbox" name="marketingConsent" className="mt-1 size-4 shrink-0 accent-sky-700" /><span>{t.optionalOffers} <a className="underline" href={`/${language}/privacyverklaring#emailaanbiedingen`}>{t.privacy}</a></span></label>}
                <button type="submit" disabled={busy} className="knop knop-navy w-full disabled:opacity-60">{busy ? (language === "en" ? "Please wait…" : language === "de" ? "Bitte warten…" : "Even geduld…") : mode === "login" ? t.login : t.register}</button>
              </form>
              {mode === "login" && <details className="mt-5"><summary className="text-sm font-semibold text-sky-800">{t.magicLogin}</summary><form onSubmit={requestMagicLogin} className="mt-5 space-y-2"><label className="block text-xs font-medium text-slate-600">{t.email}<input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2" /></label><button disabled={busy} className="text-sm font-semibold text-sky-800 underline underline-offset-4">{t.magicLogin}</button></form></details>}
              <details className="mt-5"><summary className="text-sm font-semibold text-sky-800">{t.reset}</summary><form onSubmit={requestPasswordReset} className="mt-5 space-y-2"><label className="block text-xs font-medium text-slate-600">{t.email}<input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2" /></label><button disabled={busy} className="text-sm font-semibold text-sky-800 underline underline-offset-4">{t.reset}</button></form></details>
              {message === t.resend && <form onSubmit={resendVerification} className="mt-3 space-y-2"><label className="block text-xs font-medium text-slate-600">{t.email}<input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1 block w-full rounded-lg border border-sky-200 px-3 py-2" /></label><button className="text-sm font-semibold text-sky-800 underline underline-offset-4">{t.resend}</button></form>}
              {message && <p role="status" aria-live="polite" className={`mt-4 text-sm ${success ? "text-emerald-800" : "text-red-800"}`}>{message}</p>}
            </div>
            <aside className="rounded-2xl bg-sky-50 p-6 sm:p-8"><h2 className="font-display text-2xl font-bold text-slate-900">{t.studentTitle}</h2><p className="mt-3 leading-relaxed text-slate-700">{t.studentInfo}</p><p className="mt-5 text-sm leading-relaxed text-slate-600">{language === "en" ? "This portal is for students. Regular customer accounts are not active yet." : language === "de" ? "Dieses Portal ist für Studierende. Reguläre Kundenkonten sind noch nicht aktiv." : "Dit portaal is voor studenten. Gewone klantaccounts zijn nog niet actief."}</p></aside>
          </section>
        )}
        <p className="mt-8 text-sm text-slate-600"><a className="font-semibold text-sky-800 underline underline-offset-4" href={`/${language}/privacyverklaring`}>{t.privacy}</a></p>
        {data.user && message && <p role="status" aria-live="polite" className={`mt-5 rounded-lg p-4 text-sm ${success ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>{message}</p>}
      </div>
    </div>
  );
}

