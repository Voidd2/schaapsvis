import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BEDRIJF } from "@/lib/bedrijf";
import { paginaMetadata } from "@/lib/seo";

const copy = {
  nl: {
    title: "Privacyinformatie voor account en studentenkorting",
    description: "Voorlopige privacyinformatie over accounts, schoolmailverificatie en vrijwillige e-maildeals bij Schaap's Vishandel.",
    eyebrow: "Voorbereiding · bijgewerkt 1 november 2026",
    intro: "De website staat in een met wachtwoord afgeschermde preview. De account- en studentenregistratie is alleen daar voor bevoegde previewgebruikers beschikbaar en is niet geopend voor het publiek. We testen de e-mailbezorging en privacy-informatie. Voor nieuwe aanvragen is een bevestigde schoolmail voldoende; we vragen geen inschrijvingsbewijs. Publieke registratie gaat pas open nadat contactgegevens, bewaartermijnen en e-mailverwerking definitief zijn gecontroleerd.",
    controller: "Wie is verantwoordelijk?",
    controllerText: `${BEDRIJF.naam}, ${BEDRIJF.adres.straat}, ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats}. U kunt een privacyverzoek indienen via ${BEDRIJF.telefoon.weergave} of per post op dit adres. De juridische bedrijfsnaam en een apart privacy-e-mailadres moeten vóór livegang nog worden bevestigd.`,
    data: "Welke gegevens zijn voorzien?",
    dataText: "Voor een account: voornaam, achternaam, privé-e-mailadres, school-e-mailadres, verificatiestatus en een beveiligde wachtwoordhash. Voor een studentenaanvraag: onderwijsinstelling, opleidingsniveau, studiestad en de aanvraagbeslissing. Voor accountbeveiliging: een willekeurig installatiekenmerk dat alleen gehasht wordt opgeslagen, globaal apparaattype, besturingssysteem, browser, browser- of PWA-gebruik, eerste en laatste gebruik, sessiestatus en beperkte beveiligingsgebeurtenissen. Voor e-mailaanbiedingen: e-mailadres, uw afzonderlijke keuze, de versie en het moment van toestemming, globale regiokeuze en eventuele afmelding. We vragen niet naar uw geboortedatum en maken geen browserfingerprint.",
    purposes: "Waarvoor gebruiken we die gegevens?",
    purposeItems: ["Een account aanmaken, beveiligen en beheren op uw verzoek.", "Uw privé- en schooladres bevestigen, uw aanvraag handmatig beoordelen en een kortingspas beheren.", "Een e-mailadres maximaal 30 minuten tijdelijk bewaren terwijl u een e-mailaanmelding afrondt; onafgemaakte aanmeldingen worden daarna verwijderd.", "Alleen na aparte, vrijwillige toestemming aanbiedingen en nieuws versturen; afmelden kan via de link in iedere e-mail.", "Misbruik tegengaan en de accountomgeving bewaken met uitlegbare signalen. Een signaal blokkeert een student niet automatisch; een bevoegde beheerder beoordeelt de context."],
    security: "Apparaatherkenning en pasbeveiliging",
    securityText: "Bij een geslaagde aanmelding plaatsen we een noodzakelijke cookie met een willekeurig installatiekenmerk. De server bewaart daarvan alleen een HMAC-hash, samen met algemene technische kenmerken die de browser zelf meestuurt. We bewaren geen volledig IP-adres in het apparaatprofiel en combineren kenmerken niet tot een browserfingerprint. Een nieuw apparaat, meerdere apparaten kort na elkaar of een ingetrokken sessie kan een waarschuwing opleveren. Alleen bevoegde beheerders vanaf het toegestane netwerk kunnen deze waarschuwingen, apparaten en sessies bekijken en handmatig actie nemen. De wisselende QR-code van de studentenpas bevat geen naam, e-mailadres of permanent toegangstoken en verloopt na twee minuten.",
    noPhoto: "We verzamelen voor deze beveiliging geen gezichts-, identiteits- of pasfoto. Zo'n controle wordt alleen overwogen na een afzonderlijke privacy- en rechtmatigheidsbeoordeling en met een gelijkwaardig alternatief zonder foto.",
    proof: "Schoolmail als studentenbewijs",
    proofText: "Voor nieuwe aanvragen bevestigen we een apart adres van uw onderwijsinstelling. Daardoor hoeft u geen inschrijvingsdocument te uploaden. Eerder geüploade bewijsbestanden blijven afgeschermd en worden via de bestaande verwijderprocedure opgeruimd. De aanvraagstatus, onderwijsinstelling, studiestad en beslissing zijn aparte administratieve gegevens.",
    minimize: "Gebruik het privé-e-mailadres waarmee u wilt inloggen en alleen uw eigen schooladres. Stuur geen inschrijvingsdocument per e-mail of via een contactformulier.",
    consent: "Toestemming en e-mailaanbiedingen",
    consentText: "De nieuwsbriefkeuze staat los van een account en studentenkorting en is standaard niet aangevinkt. Na uw duidelijke keuze wordt de inschrijving direct actief; we bewaren de tekstversie, bron en het tijdstip om uw toestemming te kunnen aantonen. U kunt uw toestemming altijd intrekken via de afmeldlink in iedere campagne.",
    providers: "Opslag en dienstverleners",
    providersText: "De website en het domein gebruiken Cloudflare. Voor accounts en studentenkorting is een aparte Cloudflare Worker met een gekoppelde D1-database en afgeschermde EU-opslag ingericht. De registratie is alleen beschikbaar in de besloten preview; live e-mailbezorging en volledige privacy-informatie moeten nog worden gecontroleerd voordat publieke registratie opengaat. We vullen dienstverleners, opslaglocaties en eventuele doorgifte buiten de EER aan vóór de publieke start.",
    retention: "Bewaren en uw rechten",
    retentionText: "Account-, aanvraag-, toestemmings- en afmeldgegevens blijven afhankelijk van de nog formeel vast te stellen hoofdtermijnen. Technisch worden verlopen verificatieverzoeken dagelijks opgeruimd, afgehandelde beveiligingsgebeurtenissen na maximaal 395 dagen en beveiligde beheerlogs na maximaal twee jaar. Verlopen QR-controles worden dagelijks verwijderd. Apparaat- en sessiegegevens horen bij het account en worden bij een geldig verwijderverzoek verwijderd, behalve wanneer een wettelijke verplichting of noodzakelijk lopend beveiligingsonderzoek tijdelijk anders vereist. U kunt vragen om inzage, correctie of verwijdering via telefoon of post; we controleren eerst dat het verzoek van u komt. U kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.",
    authority: "Autoriteit Persoonsgegevens",
    cookie: "De accountomgeving gebruikt een noodzakelijke beveiligde sessiecookie wanneer u bent ingelogd. Er zijn geen marketingcookies nodig voor de account- of kortingsfunctie.",
    contact: "Contact",
    contactText: `${BEDRIJF.naam} · ${BEDRIJF.adres.straat} · ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats} · ${BEDRIJF.telefoon.weergave}`,
    review: "Concepttekst — de registratie is alleen beschikbaar in een besloten preview. Laat de bedrijfsidentiteit, wettelijke grondslagen, opslaglocaties en bewaartermijnen vóór publieke registratie controleren.",
  },
  en: {
    title: "Privacy information for accounts and student discounts",
    description: "Preliminary privacy information about accounts, school-email verification and optional email offers at Schaap's Vishandel.",
    eyebrow: "Preparation · updated 1 November 2026",
    intro: "The website is in a password-protected preview. Account and student registration is available only there to authorized preview users and is not open to the public. We are testing email delivery and privacy information. A verified school email is sufficient for new applications; no enrolment document is requested. Public registration will open only after contact details, retention periods and email processing have been confirmed.",
    controller: "Who is responsible?",
    controllerText: `${BEDRIJF.naam}, ${BEDRIJF.adres.straat}, ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats}, Netherlands. Submit a privacy request by calling ${BEDRIJF.telefoon.weergave} or by post to this address. The legal entity name and a dedicated privacy email address still need confirmation before launch.`,
    data: "What information is planned?",
    dataText: "For an account: first name, last name, personal email, school email, verification status and a securely hashed password. For a student application: educational institution, study level, study city and review decision. For account security: a random installation identifier stored only as a hash, broad device type, operating system, browser, browser or PWA use, first and last use, session status and limited security events. For email offers: email address, your separate choice, consent text version and time, broad area preference and any unsubscribe request. We do not ask for your date of birth or create a browser fingerprint.",
    purposes: "How would we use it?",
    purposeItems: ["Create, secure and manage an account at your request.", "Verify your personal and school addresses, review your application manually and manage a discount pass.", "Hold an email address temporarily for up to 30 minutes while you complete an email sign-up; incomplete sign-ups are then deleted.", "Send offers and news only after separate, voluntary consent; every email includes an unsubscribe link.", "Prevent abuse with explainable security signals. A signal never blocks a student automatically; an authorized administrator reviews the context."],
    security: "Device recognition and pass security",
    securityText: "After a successful sign-in we set a necessary cookie with a random installation identifier. The server stores only its HMAC hash, together with broad technical details supplied by the browser. We do not store a full IP address in the device profile or combine properties into a browser fingerprint. A new device, several devices used close together or a revoked session may create a warning. Only authorized administrators on the approved network can view these warnings, devices and sessions and take manual action. The student pass's changing QR code contains no name, email address or permanent access token and expires after two minutes.",
    noPhoto: "We do not collect a face, identity document or pass photo for this security feature. Such a check would be considered only after a separate privacy and lawfulness review and with an equivalent no-photo alternative.",
    proof: "School email as student evidence",
    proofText: "For new applications we verify a separate address from your educational institution, so you do not need to upload an enrolment document. Older uploaded proof files remain restricted and are removed through the existing cleanup process. Application status, institution, study city and decision remain separate administrative records.",
    minimize: "Use the personal address you want to log in with and only your own school address. Do not send enrolment documents by email or through a contact form.",
    consent: "Consent and email offers",
    consentText: "Email offers are separate from an account and student discount and the box is unchecked by default. After your clear choice, the subscription becomes active immediately; we retain the consent text version, source and time so the choice can be demonstrated. You can withdraw consent through the unsubscribe link in every campaign.",
    providers: "Storage and service providers",
    providersText: "The website and domain use Cloudflare. A separate Cloudflare Worker for accounts and student discounts is configured with a D1 database and restricted EU storage. Registration is available only in the restricted preview; live email delivery and complete privacy information still need to be checked before public registration opens. We will specify providers, storage locations and any transfers outside the EEA before the public launch.",
    retention: "Retention and your rights",
    retentionText: "The main retention periods for account, application, consent and unsubscribe data still require formal approval. Technically, expired verification requests are cleaned up daily, resolved security events after no more than 395 days and protected administrator audit records after no more than two years. Expired QR checks are removed daily. Device and session records belong to the account and are removed following a valid deletion request, unless a legal obligation or necessary ongoing security investigation temporarily requires otherwise. You can request access, correction or deletion by phone or post; we first verify your identity. You may also complain to the Dutch Data Protection Authority.",
    authority: "Dutch Data Protection Authority",
    cookie: "The account service uses a necessary secure session cookie when you are signed in. Marketing cookies are not needed for accounts or discounts.",
    contact: "Contact",
    contactText: `${BEDRIJF.naam} · ${BEDRIJF.adres.straat} · ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats} · ${BEDRIJF.telefoon.weergave}`,
    review: "Draft — registration is available only in a restricted preview. Confirm the legal entity, lawful bases, storage locations and retention periods before public registration opens.",
  },
  de: {
    title: "Datenschutzhinweise für Konto und Studentenrabatt",
    description: "Vorläufige Datenschutzhinweise zu Konten, Schul-E-Mail-Bestätigung und freiwilligen E-Mail-Angeboten bei Schaap's Vishandel.",
    eyebrow: "Vorbereitung · aktualisiert am 1. November 2026",
    intro: "Die Website befindet sich in einer passwortgeschützten Vorschau. Konto- und Studentenregistrierung ist nur dort für autorisierte Vorschau-Nutzer verfügbar und nicht öffentlich geöffnet. Wir testen E-Mail-Zustellung und Datenschutzinformationen. Für neue Anträge genügt eine bestätigte Schul-E-Mail; ein Studiennachweis wird nicht verlangt. Die öffentliche Registrierung wird erst geöffnet, wenn Kontaktdaten, Aufbewahrungsfristen und E-Mail-Verarbeitung bestätigt sind.",
    controller: "Wer ist verantwortlich?",
    controllerText: `${BEDRIJF.naam}, ${BEDRIJF.adres.straat}, ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats}, Niederlande. Datenschutzanfragen können Sie telefonisch unter ${BEDRIJF.telefoon.weergave} oder per Post an diese Adresse richten. Der rechtliche Unternehmensname und eine eigene Datenschutz-E-Mail-Adresse müssen vor dem Start noch bestätigt werden.`,
    data: "Welche Daten sind vorgesehen?",
    dataText: "Für ein Konto: Vorname, Nachname, private E-Mail-Adresse, Schul-E-Mail-Adresse, Bestätigungsstatus und ein sicher gehashter Passwortwert. Für einen Studenten-Antrag: Bildungseinrichtung, Ausbildungsniveau, Studienort und Prüfentscheidung. Für die Kontosicherheit: eine zufällige Installationskennung, die nur gehasht gespeichert wird, allgemeiner Gerätetyp, Betriebssystem, Browser, Browser- oder PWA-Nutzung, erste und letzte Nutzung, Sitzungsstatus und begrenzte Sicherheitsereignisse. Für E-Mail-Angebote: E-Mail-Adresse, gesonderte Auswahl, Textversion und Zeitpunkt der Einwilligung, grobe Ortspräferenz und eine etwaige Abmeldung. Wir fragen nicht nach Ihrem Geburtsdatum und erstellen keinen Browser-Fingerabdruck.",
    purposes: "Wofür würden wir die Daten verwenden?",
    purposeItems: ["Ein Konto auf Ihren Wunsch einrichten, schützen und verwalten.", "Ihre private und schulische Adresse bestätigen, den Antrag manuell prüfen und einen Rabattpass verwalten.", "Eine E-Mail-Adresse bis zu 30 Minuten speichern, während Sie die Anmeldung abschließen; unvollständige Anmeldungen werden danach gelöscht.", "Angebote und Neuigkeiten nur nach gesonderter freiwilliger Einwilligung senden; jede E-Mail enthält einen Abmeldelink.", "Missbrauch mit nachvollziehbaren Sicherheitssignalen verhindern. Ein Signal sperrt Studierende nie automatisch; ein befugter Administrator bewertet den Zusammenhang."],
    security: "Geräteerkennung und Passsicherheit",
    securityText: "Nach einer erfolgreichen Anmeldung setzen wir ein notwendiges Cookie mit einer zufälligen Installationskennung. Der Server speichert nur deren HMAC-Hash zusammen mit allgemeinen technischen Angaben, die der Browser selbst übermittelt. Wir speichern keine vollständige IP-Adresse im Geräteprofil und kombinieren Merkmale nicht zu einem Browser-Fingerabdruck. Ein neues Gerät, mehrere kurz nacheinander verwendete Geräte oder eine widerrufene Sitzung können eine Warnung erzeugen. Nur befugte Administratoren im erlaubten Netzwerk können diese Warnungen, Geräte und Sitzungen sehen und manuell handeln. Der wechselnde QR-Code des Studentenpasses enthält weder Namen noch E-Mail-Adresse oder dauerhaftes Zugriffstoken und läuft nach zwei Minuten ab.",
    noPhoto: "Für diese Sicherheitsfunktion erfassen wir weder Gesichts-, Ausweis- noch Passfotos. Eine solche Prüfung wird nur nach einer gesonderten Datenschutz- und Rechtmäßigkeitsprüfung und mit einer gleichwertigen Alternative ohne Foto erwogen.",
    proof: "Schul-E-Mail als Studentennachweis",
    proofText: "Für neue Anträge bestätigen wir eine eigene Adresse Ihrer Bildungseinrichtung. Daher müssen Sie keinen Studiennachweis hochladen. Ältere hochgeladene Nachweise bleiben zugriffsbeschränkt und werden über den bestehenden Löschprozess entfernt. Antragsstatus, Einrichtung, Studienort und Entscheidung bleiben getrennte Verwaltungsdaten.",
    minimize: "Verwenden Sie die private Adresse, mit der Sie sich anmelden möchten, und nur Ihre eigene Schul-E-Mail. Senden Sie keine Studiennachweise per E-Mail oder Kontaktformular.",
    consent: "Einwilligung und E-Mail-Angebote",
    consentText: "E-Mail-Angebote sind von Konto und Studentenrabatt getrennt; das Kästchen ist standardmäßig nicht angekreuzt. Nach Ihrer eindeutigen Auswahl wird das Abonnement sofort aktiv; Textversion, Quelle und Zeitpunkt werden gespeichert, um die Einwilligung nachweisen zu können. Über den Abmeldelink jeder Kampagne können Sie die Einwilligung widerrufen.",
    providers: "Speicherung und Dienstleister",
    providersText: "Die Website und die Domain nutzen Cloudflare. Für Konten und Studentenrabatte ist ein separater Cloudflare-Worker mit D1-Datenbank und zugriffsbeschränktem EU-Speicher eingerichtet. Die Registrierung ist nur in der geschützten Vorschau verfügbar; der Live-E-Mail-Versand und die vollständigen Datenschutzhinweise müssen noch geprüft werden, bevor die öffentliche Registrierung geöffnet wird. Dienstleister, Speicherorte und etwaige Übermittlungen außerhalb des EWR werden vor dem öffentlichen Start ergänzt.",
    retention: "Aufbewahrung und Ihre Rechte",
    retentionText: "Die Hauptfristen für Konto-, Antrags-, Einwilligungs- und Abmeldedaten müssen noch formal genehmigt werden. Technisch werden abgelaufene Prüfanforderungen täglich, erledigte Sicherheitsereignisse nach höchstens 395 Tagen und geschützte Administrator-Protokolle nach höchstens zwei Jahren entfernt. Abgelaufene QR-Prüfungen werden täglich gelöscht. Geräte- und Sitzungsdaten gehören zum Konto und werden nach einem gültigen Löschverlangen entfernt, sofern nicht eine gesetzliche Pflicht oder eine notwendige laufende Sicherheitsprüfung vorübergehend entgegensteht. Sie können telefonisch oder per Post Auskunft, Berichtigung oder Löschung beantragen; zuvor prüfen wir Ihre Identität. Sie können sich auch bei der niederländischen Datenschutzbehörde beschweren.",
    authority: "Niederländische Datenschutzbehörde",
    cookie: "Der Kontodienst verwendet während der Anmeldung ein notwendiges sicheres Sitzungscookie. Marketing-Cookies sind für Konto und Rabatt nicht erforderlich.",
    contact: "Kontakt",
    contactText: `${BEDRIJF.naam} · ${BEDRIJF.adres.straat} · ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats} · ${BEDRIJF.telefoon.weergave}`,
    review: "Entwurf — Registrierung ist nur in einer geschützten Vorschau verfügbar. Bestätigen Sie den rechtlichen Unternehmensnamen, die Rechtsgrundlagen, Speicherorte und Aufbewahrungsfristen vor der öffentlichen Öffnung.",
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
        <section><h2 className="font-display text-2xl font-bold text-slate-900">{c.security}</h2><p className="mt-3">{c.securityText}</p><p className="mt-3 rounded-xl bg-sky-50 p-4 text-sm">{c.noPhoto}</p></section>
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
