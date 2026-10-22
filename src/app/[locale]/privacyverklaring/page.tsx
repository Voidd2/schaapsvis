import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BEDRIJF } from "@/lib/bedrijf";
import { paginaMetadata } from "@/lib/seo";

const copy = {
  nl: {
    title: "Privacyinformatie voor account en studentenkorting",
    description: "Voorlopige privacyinformatie over accounts, studentenbewijs en vrijwillige e-maildeals bij Schaap's Vishandel.",
    eyebrow: "Voorbereiding · bijgewerkt 17 oktober 2026",
    intro: "De account- en studentenkortingsfunctie wordt voorbereid en is nog niet live gekoppeld. Deze conceptinformatie beschrijft het beoogde gebruik. We openen registratie pas nadat contactgegevens, bewaartermijnen, opslag en e-mailverwerking definitief zijn gecontroleerd.",
    controller: "Wie is verantwoordelijk?",
    controllerText: `${BEDRIJF.naam}, ${BEDRIJF.adres.straat}, ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats}. U kunt een privacyverzoek indienen via ${BEDRIJF.telefoon.weergave} of per post op dit adres. De juridische bedrijfsnaam en een apart privacy-e-mailadres moeten vóór livegang nog worden bevestigd.`,
    data: "Welke gegevens zijn voorzien?",
    dataText: "Voor een account: naam, persoonlijk e-mailadres, school-e-mailadres, verificatiestatus en een beveiligde wachtwoordhash. Voor een studentenaanvraag: onderwijsinstelling, opleidingsniveau, de aanvraagbeslissing en het bewijsbestand dat u zelf uploadt. Voor e-mailaanbiedingen: e-mailadres, uw afzonderlijke keuze, bevestiging, globale regiokeuze en eventuele afmelding. We vragen niet naar uw geboortedatum.",
    purposes: "Waarvoor gebruiken we die gegevens?",
    purposeItems: ["Een account aanmaken, beveiligen en beheren op uw verzoek.", "Controleren of u in Leiden een mbo-, hbo- of universitaire opleiding volgt en na handmatige goedkeuring een kortingspas beheren.", "Een e-mailadres maximaal 30 minuten tijdelijk bewaren terwijl u een e-mailaanmelding afrondt; onafgemaakte aanmeldingen worden daarna verwijderd.", "Alleen na aparte, vrijwillige toestemming en e-mailbevestiging aanbiedingen en nieuws versturen; afmelden kan via de link in iedere e-mail.", "Misbruik tegengaan en de beveiliging van de accountomgeving bewaken."],
    proof: "Studentenbewijs en privacy",
    proofText: "Een bewijsbestand is alleen bedoeld om uw studentenaanvraag te beoordelen. Het hoort in een afgeschermde opslag te staan en wordt verwijderd zodra de beoordeling is vastgelegd. De aanvraagstatus, onderwijsinstelling, toestemmingsregistratie en beslissing zijn aparte administratieve gegevens. De definitieve bewaartermijn voor die gegevens na afloop van een account of kortingspas is nog niet vastgesteld.",
    minimize: "Upload geen document dat meer laat zien dan nodig is. Maak bijvoorbeeld een BSN, pasfoto, adres of andere niet-noodzakelijke gegevens onleesbaar, zolang uw naam, instelling en actuele inschrijving controleerbaar blijven.",
    consent: "Toestemming en e-mailaanbiedingen",
    consentText: "De nieuwsbriefkeuze staat los van een account en studentenkorting, is standaard niet aangevinkt en wordt pas actief na bevestiging per e-mail. U kunt uw toestemming altijd intrekken via de afmeldlink. Voor de controle van studentenbewijs vraagt het formulier afzonderlijk toestemming; zonder die toestemming kunnen we het bewijs niet beoordelen.",
    providers: "Opslag en dienstverleners",
    providersText: "De site blijft voorlopig bij Vercel. Cloudflare is nog niet live voor dit domein: de zone staat op pending, er zijn geen DNS-records in de nieuwe zone en de nameservers zijn niet aangepast. Voor de toekomstige accountfunctie zijn EU-D1-databases voorbereid. De private R2-buckets en e-mailverzending zijn nog niet ingericht. De definitieve opslaglocaties, dienstverleners en eventuele doorgifte buiten de EER worden vóór registratie-opening gecontroleerd en hier vermeld.",
    retention: "Bewaren en uw rechten",
    retentionText: "Bewaartermijnen voor accountgegevens, aanvraagmetadata, toestemmingsregistraties en afmeldgegevens moeten nog formeel worden vastgesteld. We openen de verwerking niet voordat daarvoor een schema bestaat. U kunt vragen om inzage, correctie of verwijdering via telefoon of post; we controleren eerst dat het verzoek van u komt. U kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.",
    authority: "Autoriteit Persoonsgegevens",
    cookie: "De accountomgeving gebruikt een noodzakelijke beveiligde sessiecookie wanneer u bent ingelogd. Er zijn geen marketingcookies nodig voor de account- of kortingsfunctie.",
    contact: "Contact",
    contactText: `${BEDRIJF.naam} · ${BEDRIJF.adres.straat} · ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats} · ${BEDRIJF.telefoon.weergave}`,
    review: "Concepttekst — laat de bedrijfsidentiteit, wettelijke grondslagen, opslaglocaties en bewaartermijnen vóór het openen van registratie controleren.",
  },
  en: {
    title: "Privacy information for accounts and student discounts",
    description: "Preliminary privacy information about accounts, student proof and optional email offers at Schaap's Vishandel.",
    eyebrow: "Preparation · updated 17 October 2026",
    intro: "The account and student-discount service is being prepared and is not connected live yet. This draft describes the intended use. Registration will open only after contact details, retention periods, storage and email processing have been confirmed.",
    controller: "Who is responsible?",
    controllerText: `${BEDRIJF.naam}, ${BEDRIJF.adres.straat}, ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats}, Netherlands. Submit a privacy request by calling ${BEDRIJF.telefoon.weergave} or by post to this address. The legal entity name and a dedicated privacy email address still need confirmation before launch.`,
    data: "What information is planned?",
    dataText: "For an account: your name, personal email, school email, verification status and a securely hashed password. For a student application: educational institution, study level, review decision and the proof file you upload. For email offers: email address, your separate choice, confirmation, broad area preference and any unsubscribe request. We do not ask for your date of birth.",
    purposes: "How would we use it?",
    purposeItems: ["Create, secure and manage an account at your request.", "Check that you study in Leiden at MBO, HBO or university level and manage a discount pass after manual approval.", "Hold an email address temporarily for up to 30 minutes while you complete an email sign-up; incomplete sign-ups are then deleted.", "Send offers and news only after separate, voluntary consent and email confirmation; every email includes an unsubscribe link.", "Prevent abuse and protect the account service."],
    proof: "Student proof and privacy",
    proofText: "A proof file is used only to review your student application. It is intended for restricted storage and deletion as soon as the decision is recorded. Application status, institution, consent record and decision are separate administrative data. The final retention period for these records after an account or pass ends has not yet been set.",
    minimize: "Do not upload a document showing more than necessary. For example, redact your national identification number, photo, address or other unnecessary details, provided your name, institution and current enrolment can still be checked.",
    consent: "Consent and email offers",
    consentText: "Email offers are separate from an account and student discount, the box is unchecked by default, and a subscription becomes active only after email confirmation. You can withdraw consent at any time through the unsubscribe link. Student-proof processing has its own consent checkbox; without it we cannot review the proof.",
    providers: "Storage and service providers",
    providersText: "The website remains on Vercel for now. Cloudflare is not live for this domain: its zone is pending, the new zone has no DNS records and nameservers have not changed. EU D1 databases have been prepared for the future account service. Private R2 buckets and email sending are not configured yet. Final storage locations, providers and any transfers outside the EEA will be checked and listed here before registration opens.",
    retention: "Retention and your rights",
    retentionText: "Retention periods for account data, application metadata, consent records and unsubscribe records still need formal approval. Processing will not open until a schedule exists. You can request access, correction or deletion by phone or post; we will first verify your identity. You may also complain to the Dutch Data Protection Authority.",
    authority: "Dutch Data Protection Authority",
    cookie: "The account service uses a necessary secure session cookie when you are signed in. Marketing cookies are not needed for accounts or discounts.",
    contact: "Contact",
    contactText: `${BEDRIJF.naam} · ${BEDRIJF.adres.straat} · ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats} · ${BEDRIJF.telefoon.weergave}`,
    review: "Draft — confirm the legal entity, lawful bases, storage locations and retention periods before opening registration.",
  },
  de: {
    title: "Datenschutzhinweise für Konto und Studentenrabatt",
    description: "Vorläufige Datenschutzhinweise zu Konten, Studiennachweisen und freiwilligen E-Mail-Angeboten bei Schaap's Vishandel.",
    eyebrow: "Vorbereitung · aktualisiert am 17. Oktober 2026",
    intro: "Der Konto- und Studentenrabattdienst wird vorbereitet und ist noch nicht live verbunden. Dieser Entwurf beschreibt die geplante Nutzung. Die Registrierung wird erst geöffnet, wenn Kontaktdaten, Aufbewahrungsfristen, Speicher und E-Mail-Verarbeitung bestätigt sind.",
    controller: "Wer ist verantwortlich?",
    controllerText: `${BEDRIJF.naam}, ${BEDRIJF.adres.straat}, ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats}, Niederlande. Datenschutzanfragen können Sie telefonisch unter ${BEDRIJF.telefoon.weergave} oder per Post an diese Adresse richten. Der rechtliche Unternehmensname und eine eigene Datenschutz-E-Mail-Adresse müssen vor dem Start noch bestätigt werden.`,
    data: "Welche Daten sind vorgesehen?",
    dataText: "Für ein Konto: Name, private E-Mail-Adresse, Schul-E-Mail-Adresse, Bestätigungsstatus und ein sicher gehashter Passwortwert. Für einen Studenten-Antrag: Bildungseinrichtung, Ausbildungsniveau, Prüfentscheidung und der hochgeladene Nachweis. Für E-Mail-Angebote: E-Mail-Adresse, gesonderte Auswahl, Bestätigung, grobe Ortspräferenz und eine etwaige Abmeldung. Ihr Geburtsdatum fragen wir nicht ab.",
    purposes: "Wofür würden wir die Daten verwenden?",
    purposeItems: ["Ein Konto auf Ihren Wunsch einrichten, schützen und verwalten.", "Prüfen, ob Sie in Leiden eine MBO-, HBO- oder Hochschulausbildung absolvieren, und nach manueller Freigabe einen Rabattpass verwalten.", "Eine E-Mail-Adresse bis zu 30 Minuten speichern, während Sie die Anmeldung abschließen; unvollständige Anmeldungen werden danach gelöscht.", "Angebote und Neuigkeiten nur nach gesonderter freiwilliger Einwilligung und E-Mail-Bestätigung senden; jede E-Mail enthält einen Abmeldelink.", "Missbrauch verhindern und den Kontodienst schützen."],
    proof: "Studiennachweis und Datenschutz",
    proofText: "Ein Nachweis wird nur zur Prüfung Ihres Studenten-Antrags verwendet. Er soll in einem zugriffsbeschränkten Speicher liegen und gelöscht werden, sobald die Entscheidung dokumentiert ist. Antragsstatus, Bildungseinrichtung, Einwilligung und Entscheidung sind getrennte Verwaltungsdaten. Die endgültige Aufbewahrungsfrist dieser Daten nach Ende eines Kontos oder Passes ist noch nicht festgelegt.",
    minimize: "Laden Sie kein Dokument hoch, das mehr als nötig zeigt. Schwärzen Sie zum Beispiel Ihre nationale Kennnummer, Ihr Foto, Ihre Anschrift oder andere nicht erforderliche Angaben, sofern Name, Einrichtung und aktuelle Einschreibung weiterhin geprüft werden können.",
    consent: "Einwilligung und E-Mail-Angebote",
    consentText: "E-Mail-Angebote sind von Konto und Studentenrabatt getrennt; das Kästchen ist standardmäßig nicht angekreuzt und ein Abonnement wird erst nach Bestätigung per E-Mail aktiv. Sie können Ihre Einwilligung jederzeit über den Abmeldelink widerrufen. Für die Prüfung des Studiennachweises gibt es eine eigene Einwilligung; ohne sie können wir den Nachweis nicht prüfen.",
    providers: "Speicherung und Dienstleister",
    providersText: "Die Website bleibt vorerst bei Vercel. Cloudflare ist für diese Domain noch nicht live: Die Zone steht auf pending, die neue Zone enthält keine DNS-Einträge und die Nameserver wurden nicht geändert. EU-D1-Datenbanken wurden für den künftigen Kontodienst vorbereitet. Private R2-Buckets und E-Mail-Versand sind noch nicht eingerichtet. Endgültige Speicherorte, Dienstleister und etwaige Übermittlungen außerhalb des EWR werden vor der Registrierung geprüft und hier angegeben.",
    retention: "Aufbewahrung und Ihre Rechte",
    retentionText: "Aufbewahrungsfristen für Kontodaten, Antragsmetadaten, Einwilligungs- und Abmeldedaten müssen noch formal genehmigt werden. Die Verarbeitung beginnt erst, wenn ein Aufbewahrungsplan feststeht. Sie können telefonisch oder per Post Auskunft, Berichtigung oder Löschung beantragen; zuvor prüfen wir Ihre Identität. Sie können sich auch bei der niederländischen Datenschutzbehörde beschweren.",
    authority: "Niederländische Datenschutzbehörde",
    cookie: "Der Kontodienst verwendet während der Anmeldung ein notwendiges sicheres Sitzungscookie. Marketing-Cookies sind für Konto und Rabatt nicht erforderlich.",
    contact: "Kontakt",
    contactText: `${BEDRIJF.naam} · ${BEDRIJF.adres.straat} · ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats} · ${BEDRIJF.telefoon.weergave}`,
    review: "Entwurf — bestätigen Sie vor der Registrierung den rechtlichen Unternehmensnamen, die Rechtsgrundlagen, Speicherorte und Aufbewahrungsfristen.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in copy)) notFound();
  const c = copy[locale as keyof typeof copy];
  return {
    ...paginaMetadata({ locale, pad: "/privacyverklaring", title: c.title, description: c.description }),
    robots: { index: false, follow: false },
  };
}

export default async function PrivacyverklaringPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in copy)) notFound();
  const c = copy[locale as keyof typeof copy];

  return (
    <div className="section-wrap max-w-4xl py-12 md:py-16">
      <p className="kapitaal">{c.eyebrow}</p>
      <h1 className="font-display text-4xl font-bold text-slate-900">{c.title}</h1>
      <p className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">{c.intro}</p>
      <div className="mt-10 space-y-9 leading-relaxed text-slate-700">
        <section><h2 className="font-display text-2xl font-bold text-slate-900">{c.controller}</h2><p className="mt-3">{c.controllerText}</p></section>
        <section><h2 className="font-display text-2xl font-bold text-slate-900">{c.data}</h2><p className="mt-3">{c.dataText}</p></section>
        <section><h2 className="font-display text-2xl font-bold text-slate-900">{c.purposes}</h2><ul className="mt-3 list-disc space-y-2 pl-6">{c.purposeItems.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section><h2 className="font-display text-2xl font-bold text-slate-900">{c.proof}</h2><p className="mt-3">{c.proofText}</p><p className="mt-3 rounded-xl bg-sky-50 p-4 text-sm">{c.minimize}</p></section>
        <section><h2 className="font-display text-2xl font-bold text-slate-900">{c.consent}</h2><p className="mt-3">{c.consentText}</p></section>
        <section><h2 className="font-display text-2xl font-bold text-slate-900">{c.providers}</h2><p className="mt-3">{c.providersText}</p></section>
        <section><h2 className="font-display text-2xl font-bold text-slate-900">{c.retention}</h2><p className="mt-3">{c.retentionText}</p><p className="mt-2"><a className="font-semibold text-sky-800 underline underline-offset-4" href="https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/privacyrechten/recht-op-informatie" target="_blank" rel="noopener noreferrer">{c.authority} ↗</a></p></section>
        <section><p>{c.cookie}</p><h2 className="mt-6 font-display text-2xl font-bold text-slate-900">{locale === "nl" ? "Geaggregeerde website-statistieken" : locale === "de" ? "Aggregierte Website-Statistiken" : "Aggregate website statistics"}</h2><p className="mt-3">{locale === "nl" ? "Alleen na uw uitdrukkelijke keuze voor ‘Toestaan’ meten we paginaweergaven en klikken op links. We bewaren alleen dagtotalen per openbare pagina en klikdoel; URL-query’s, bezochte account-/beheerpagina’s en persoonlijke formuliergegevens worden niet opgenomen. Het IP-adres wordt door Cloudflare tijdelijk gebruikt voor misbruikbeperking; alleen een met een geheime sleutel gehasht IP-rate-limit wordt maximaal 30 dagen bewaard. Dagtotalen worden na 13 maanden verwijderd. De meting staat momenteel uit en start pas als deze bewust op de server wordt aangezet. U kunt weigeren; weigeren beïnvloedt de site niet." : locale === "de" ? "Nur wenn Sie ausdrücklich ‘Zulassen’ wählen, messen wir Seitenaufrufe und Linkklicks. Gespeichert werden nur Tagessummen pro öffentlicher Seite und Klickziel; URL-Parameter, Konto-/Verwaltungsseiten und persönliche Formulardaten werden ausgeschlossen. Cloudflare verarbeitet die IP-Adresse vorübergehend zur Missbrauchsbegrenzung; ein nur mit geheimem Schlüssel gehashter Rate-Limit-Wert wird höchstens 30 Tage gespeichert. Tagessummen werden nach 13 Monaten gelöscht. Die Messung ist derzeit deaktiviert und beginnt erst nach bewusster Aktivierung auf dem Server. Sie können ablehnen, ohne die Website einzuschränken." : "Only if you explicitly choose ‘Allow’ do we measure page views and link clicks. We store daily totals per public page and click destination only; URL query strings, account/admin pages and personal form data are excluded. Cloudflare temporarily processes the IP address to limit abuse; a rate-limit key hashed with a secret is retained for no more than 30 days. Daily totals are deleted after 13 months. Measurement is currently off and starts only when deliberately enabled server-side. You can decline without affecting the site."}</p></section>
        <section><h2 className="font-display text-2xl font-bold text-slate-900">{c.contact}</h2><p className="mt-3">{c.contactText}</p></section>
      </div>
      <p className="mt-10 border-t border-sky-200 pt-5 text-sm font-semibold text-slate-600">{c.review}</p>
    </div>
  );
}
