import { StaticResponsiveImage as Image } from "@/components/StaticResponsiveImage";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { BEELD } from "@/lib/beeld";
import { ShopHours } from "@/components/shared/ShopHours";
import { siteOpSlot } from "@/lib/siteAccess";

const copy = {
  nl: {
    title: "10% studentenkorting in Leiden | Schaap's Vis",
    description:
      "Nederlandse en internationale mbo-, hbo- en wo-studenten krijgen na goedkeuring 10% korting op het hele assortiment van Schaap's Vishandel.",
    eyebrow: "Voor Nederlandse én internationale studenten",
    heading: "Student in de buurt? Pak 10% korting.",
    intro:
      "Van kibbeling tussendoor tot verse zalm voor het avondeten. Als mbo-, hbo- of wo-student krijg je na goedkeuring 10% korting op het hele assortiment bij Schaap’s in Leiden.",
    categories: ["Op het hele assortiment"],
    card: "Je digitale studentenpas",
    cardText:
      "Na goedkeuring staat je persoonlijke pas in je account. Open de pas op je telefoon en laat hem vóór het afrekenen zien. De pas is één studiejaar geldig; daarna vraag je opnieuw aan met een actueel studentenbewijs.",
    steps: "Zo werkt aanmelden",
    step1: "Maak een account met je privé-e-mailadres. Kies je schoolmail of een inschrijvingsbewijs van je opleiding of DUO.",
    step2: "Bevestig je privé-e-mail met de code. Kies je voor schoolmail, vul dan ook de code uit die mailbox in. Anders upload je het bewijs in je account.",
    step3: "Dien je aanvraag in. We beoordelen deze handmatig. Na goedkeuring verschijnt je digitale kortingspas in je account.",
    account: "Vraag studentenkorting aan",
    home: "Bekijk ons assortiment",
    alt: "Versgebakken kibbeling met citroen en saus",
    privacyPage: "Lees de privacyinformatie",
  },
  en: {
    title: "10% student discount in Leiden | Schaap's Vis",
    description:
      "Dutch and international MBO, HBO and university students receive 10% off the entire Schaap's Vishandel range after approval.",
    eyebrow: "For Dutch and international students",
    heading: "Student nearby? Get 10% off.",
    intro:
      "From kibbeling between lectures to fresh salmon for dinner. MBO, HBO and university students receive 10% off the entire range at Schaap’s in Leiden after approval.",
    categories: ["On the entire range"],
    card: "Your digital student pass",
    cardText:
      "Once approved, your personal pass appears in your account. Open it on your phone and show it before paying. It is valid for one academic year; afterwards you apply again with current proof of enrolment.",
    steps: "How to apply",
    step1: "Create an account with your personal email. Choose your school email or a current enrolment document from your institution or DUO.",
    step2: "Enter the code from your personal email. If you use a school email, enter its code too. Otherwise upload your document in your account.",
    step3: "Submit your application. We review it manually. Once approved, your digital discount pass appears in your account.",
    account: "Apply for your student discount",
    home: "Explore our range",
    alt: "Freshly fried kibbeling with lemon and sauce",
    privacyPage: "Read the privacy information",
  },
  de: {
    title: "10 % Studentenrabatt in Leiden | Schaap's Vis",
    description:
      "Niederländische und internationale MBO-, HBO- und Hochschulstudierende erhalten nach Freigabe 10 % Rabatt auf das gesamte Sortiment von Schaap's Vishandel.",
    eyebrow: "Für niederländische und internationale Studierende",
    heading: "Sie studieren? Sichern Sie sich 10 % Rabatt.",
    intro:
      "Von Kibbeling für zwischendurch bis zu frischem Lachs zum Abendessen. MBO-, HBO- und Hochschulstudierende erhalten nach Freigabe 10 % Rabatt auf das gesamte Sortiment bei Schaap’s in Leiden.",
    categories: ["Auf das gesamte Sortiment"],
    card: "Ihr digitaler Studentenausweis",
    cardText:
      "Nach der Freigabe erscheint Ihr persönlicher Pass im Konto. Öffnen Sie ihn auf Ihrem Smartphone und zeigen Sie ihn vor dem Bezahlen vor. Er gilt ein Studienjahr; danach beantragen Sie ihn mit aktuellem Studiennachweis erneut.",
    steps: "So funktioniert die Anmeldung",
    step1: "Erstellen Sie ein Konto mit Ihrer privaten E-Mail. Wählen Sie Ihre Hochschul-E-Mail oder einen aktuellen Studiennachweis Ihrer Einrichtung oder von DUO.",
    step2: "Bestätigen Sie Ihre private E-Mail mit dem Code. Bei einer Hochschul-E-Mail geben Sie auch deren Code ein. Andernfalls laden Sie den Nachweis im Konto hoch.",
    step3: "Senden Sie Ihren Antrag ab. Wir prüfen ihn manuell. Nach der Freigabe erscheint Ihr digitaler Rabattpass im Konto.",
    account: "Studentenrabatt beantragen",
    home: "Sortiment entdecken",
    alt: "Frisch frittierte Kibbeling mit Zitrone und Sauce",
    privacyPage: "Datenschutzhinweise lesen",
  },
} as const;

const landing = {
  nl: {
    local: "Schaap’s Vishandel · Leiden sinds 1938", login: "Al een account? Log in", how: "Hoe werkt het?",
    fine: "Na goedkeuring · niet te combineren met andere acties", preview: "Besloten preview: aanmelden wordt momenteel getest. De actie is nog niet publiek geopend.",
    benefits: ["10% op het hele assortiment", "Ook als je buiten Leiden studeert", "Digitale pas op je telefoon"],
    stepTitles: ["Maak je account", "Bevestig je e-mails", "Vraag je pas aan"],
    ready: "Voor inloggen gebruik je altijd je privé-e-mailadres.",
    eligible: "Voor wie is het?", checks: ["Mbo-, hbo- en wo-studenten", "Nederlandse én internationale studenten", "Een privé-e-mailadres en een schoolmail of inschrijvingsbewijs"],
    exclusion: "Middelbare scholieren vallen buiten de actie. Je opleiding hoeft niet in Leiden te zijn. Je aanvraag wordt persoonlijk beoordeeld.",
    sample: "Voorbeeldpas · niet geldig als kortingsbewijs", holder: "Jouw naam", passHint: "Je echte pas bevat je naam en een controlecode. Open altijd de actuele pas in je account.",
    faq: "Nog even dit", questions: [
      ["Moet ik een inschrijvingsbewijs uploaden?", "Alleen als je geen schoolmail hebt. Gebruik bijvoorbeeld een DUO-inschrijvingsbewijs met je naam, opleiding en studiejaar. Maak je BSN en financiële gegevens onleesbaar. Bij je aanvraag vul je wel je onderwijsinstelling, opleidingsniveau en studiestad in."],
      ["Krijg ik meteen korting na het aanmelden?", "Je aanvraag wordt eerst handmatig beoordeeld. Pas na goedkeuring kun je de digitale pas laten zien en de 10% korting gebruiken. De korting is niet te combineren met andere acties."],
      ["Hoe vaak krijg ik kortingsmails van Schaap’s?", "Als je je aanmeldt voor kortingsmails, krijg je af en toe een aanbieding op je privé-e-mailadres, maximaal één per week. Je kunt je in elke mail afmelden. Je pas blijft geldig."],
      ["Waarmee log ik later in?", "Met je privé-e-mailadres, niet je schoolmail. Je schoolmail gebruik je om te bevestigen dat je student bent. Zie je de verificatiemail niet? Controleer ook je spammap."],
    ],
    visit: "Tussen college en avondeten: kom langs", visitText: "Je vindt ons aan de Herenstraat en op de Leidse markt. Bekijk de locatie en openingstijden die bij je dag passen.",
    directions: "Route naar de winkel", locations: "Winkel & marktkramen", final: "Klaar voor jouw studentenpas?", finalText: "Maak je account, bevestig je privé-e-mail en dien je aanvraag in. Na goedkeuring staat je pas klaar.",
  },
  en: {
    local: "Schaap’s Vishandel · Leiden since 1938", login: "Already have an account? Sign in", how: "How does it work?",
    fine: "After approval · cannot be combined with other offers", preview: "Restricted preview: registration is being tested. The offer is not publicly available yet.",
    benefits: ["10% off the entire range", "Also if you study outside Leiden", "A digital pass on your phone"],
    stepTitles: ["Create your account", "Verify your emails", "Apply for your pass"],
    ready: "Always sign in with your personal email.",
    eligible: "Who can apply?", checks: ["MBO, HBO and university students", "Dutch and international students", "A personal email and a school email or enrolment document"],
    exclusion: "Secondary-school pupils are not eligible. You do not have to study in Leiden. Each application is reviewed personally.",
    sample: "Example pass · not valid for a discount", holder: "Your name", passHint: "Your real pass includes your name and a verification code. Always open the current pass in your account.",
    faq: "Good to know", questions: [
      ["Do I need to upload proof of enrolment?", "Only if you have no school email. You can use proof from DUO showing your name, institution and academic year. Hide your BSN and financial details. Your application still asks for your institution, education level and study city."],
      ["Do I get the discount as soon as I register?", "We review your application manually first. Only after approval can you show your digital pass and use the 10% discount. It cannot be combined with other offers."],
      ["How often will Schaap’s email me offers?", "If you sign up for offers, we’ll send them to your personal email address at most once a week. You can unsubscribe in any email and keep your pass."],
      ["Which email do I use to sign in?", "Use your personal email, not your school email. Your school email confirms your student status. If you cannot find the verification email, check your spam folder too."],
    ],
    visit: "Between lectures and dinner: drop by", visitText: "Find us on Herenstraat and at Leiden’s market. Choose the location and opening hours that fit your day.",
    directions: "Directions to the shop", locations: "Shop & market stalls", final: "Ready for your student pass?", finalText: "Create your account, verify your personal email and submit your application. Your pass will be ready after approval.",
  },
  de: {
    local: "Schaap’s Vishandel · Leiden seit 1938", login: "Schon ein Konto? Anmelden", how: "Wie funktioniert es?",
    fine: "Nach Freigabe · nicht mit anderen Aktionen kombinierbar", preview: "Geschützte Vorschau: Die Anmeldung wird getestet. Die Aktion ist noch nicht öffentlich verfügbar.",
    benefits: ["10 % auf das gesamte Sortiment", "Auch beim Studium außerhalb Leidens", "Digitaler Pass auf dem Smartphone"],
    stepTitles: ["Konto erstellen", "E-Mails bestätigen", "Pass beantragen"],
    ready: "Zum Anmelden verwenden Sie immer Ihre private E-Mail.",
    eligible: "Wer kann teilnehmen?", checks: ["MBO-, HBO- und Hochschulstudierende", "Niederländische und internationale Studierende", "Eine private E-Mail und eine Hochschul-E-Mail oder ein Studiennachweis"],
    exclusion: "Schülerinnen und Schüler weiterführender Schulen sind ausgeschlossen. Sie müssen nicht in Leiden studieren. Jeder Antrag wird persönlich geprüft.",
    sample: "Beispielpass · kein gültiger Rabattnachweis", holder: "Ihr Name", passHint: "Ihr echter Pass enthält Ihren Namen und einen Prüfcode. Öffnen Sie immer den aktuellen Pass in Ihrem Konto.",
    faq: "Gut zu wissen", questions: [
      ["Muss ich einen Studiennachweis hochladen?", "Nur ohne Hochschul-E-Mail. Ein aktueller DUO-Nachweis mit Name, Einrichtung und Studienjahr genügt. Schwärzen Sie BSN und Finanzdaten. Im Antrag geben Sie Ihre Einrichtung, Ihr Ausbildungsniveau und Ihren Studienort an."],
      ["Erhalte ich den Rabatt sofort nach der Anmeldung?", "Wir prüfen Ihren Antrag zunächst manuell. Erst nach Freigabe können Sie Ihren digitalen Pass zeigen und 10 % Rabatt erhalten. Der Rabatt ist nicht mit anderen Aktionen kombinierbar."],
      ["Wie oft schickt Schaap’s mir Angebote?", "Wenn Sie sich für Angebote anmelden, erhalten Sie diese höchstens einmal pro Woche an Ihre private E-Mail-Adresse. Sie können sich in jeder E-Mail abmelden. Ihr Pass bleibt gültig."],
      ["Mit welcher E-Mail melde ich mich an?", "Mit Ihrer privaten E-Mail, nicht Ihrer Schul-E-Mail. Die Schul-E-Mail bestätigt Ihren Studierendenstatus. Prüfen Sie auch den Spamordner, falls die Bestätigungsmail fehlt."],
    ],
    visit: "Zwischen Vorlesung und Abendessen: kommen Sie vorbei", visitText: "Sie finden uns in der Herenstraat und auf dem Leidener Markt. Wählen Sie den passenden Standort und die passenden Öffnungszeiten.",
    directions: "Route zum Geschäft", locations: "Geschäft & Marktstände", final: "Bereit für Ihren Studentenpass?", finalText: "Erstellen Sie Ihr Konto, bestätigen Sie Ihre private E-Mail und senden Sie den Antrag ab. Nach Freigabe ist Ihr Pass verfügbar.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in copy)) notFound();
  const c = copy[locale as keyof typeof copy];
  return paginaMetadata({ locale, pad: "/studentenkorting", title: c.title, description: c.description });
}

export default async function StudentenkortingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in copy)) notFound();
  const c = copy[locale as keyof typeof copy];

  const l = landing[locale as keyof typeof landing];
  const registerHref = `/${locale}/account?mode=register`;
  const loginHref = `/${locale}/account`;
  return <div className="student-page student-landing">
    <section className="fresh-hero">
      <div className="section-wrap fresh-hero-grid">
        <div>
          <p className="kapitaal">{l.local}</p>
          <h1>{c.heading}</h1>
          <p className="fresh-intro">{c.intro}</p>
          <p className="student-offer"><strong>10%</strong><span>{c.categories[0]}</span></p>
          <p className="student-fine">{l.fine}</p>
          <div className="student-actions"><Link href={registerHref} className="knop knop-rood">{c.account} →</Link><a href="#aanmelden" className="knop knop-lijn">{l.how} ↓</a></div>
          <Link href={loginHref} className="student-login">{l.login} →</Link>
          {siteOpSlot() && <p className="student-preview">{l.preview}</p>}
        </div>
        <figure className="relative overflow-hidden rounded-2xl min-h-[280px]">
          <Image src="/images/editorial/kibbeling-schaapstray.png" alt={c.alt} fill sizes="(max-width: 800px) 100vw, 50vw" className="object-cover" loading="eager" fetchPriority="high" />
        </figure>
      </div>
    </section>
    <ul className="section-wrap student-benefits">{l.benefits.map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
    <section id="aanmelden" className="student-section student-steps" aria-labelledby="student-steps-heading">
      <div className="section-wrap">
        <p className="kapitaal">{c.eyebrow}</p><h2 id="student-steps-heading">{c.steps}</h2>
        <p className="student-ready">{l.ready}</p>
        <ol className="student-step-grid">{[c.step1,c.step2,c.step3].map((step,index) => <li key={step}><span className="student-step-number" aria-hidden="true">{index+1}</span><h3>{l.stepTitles[index]}</h3><p>{step}</p></li>)}</ol>
        <div className="student-actions"><Link href={registerHref} className="knop knop-navy">{c.account} →</Link></div>
      </div>
    </section>
    <section id="voorwaarden" className="section-wrap student-section student-eligibility" aria-labelledby="student-eligible-heading">
      <div><p className="kapitaal">{c.eyebrow}</p><h2 id="student-eligible-heading">{l.eligible}</h2><ul className="student-checks">{l.checks.map(item => <li key={item}>{item}</li>)}</ul><p>{l.exclusion}</p></div>
      <div className="student-pass-explanation"><h2>{c.card}</h2><p>{c.cardText}</p>
        <div className="student-example-pass" aria-label={l.sample}>
          <div className="student-pass-brand"><Image src={BEELD.logoBadge.bestand} alt="Schaap’s Vishandel" width={64} height={64}/><span>Schaap’s Vishandel<small>Leiden · {BEDRIJF.opgericht}</small></span></div>
          <div className="student-pass-value"><strong>10%</strong><span>{c.categories[0]}</span></div><p>{l.holder}</p><p className="student-pass-sample">{l.sample}</p>
        </div><p className="student-fine">{l.passHint}</p>
      </div>
    </section>
    <section className="student-section student-local" aria-labelledby="student-local-heading"><div className="section-wrap student-local-grid">
      <div><p className="kapitaal">{l.local}</p><h2 id="student-local-heading">{l.visit}</h2><p>{l.visitText}</p><div className="student-actions"><Link className="knop knop-navy" href={`/${locale}/bezoek-ons`}>{l.locations} →</Link><Link className="knop knop-lijn" href={`/${locale}/assortiment`}>{c.home} →</Link></div></div>
      <div className="student-shop"><h3>{BEDRIJF.adres.straat}, {BEDRIJF.adres.plaats}</h3><ShopHours locale={locale} /><a className="knop knop-lijn" href={BEDRIJF.maps.route} target="_blank" rel="noopener noreferrer">{l.directions} ↗</a></div>
    </div></section>
    <section className="section-wrap student-section student-faq" aria-labelledby="student-faq-heading"><h2 id="student-faq-heading">{l.faq}</h2>{l.questions.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}<Link className="student-login" href={`/${locale}/privacyverklaring`}>{c.privacyPage} →</Link></section>
    <section className="student-section student-final"><div className="section-wrap"><h2>{l.final}</h2><p>{l.finalText}</p><div className="student-actions"><Link className="knop knop-rood" href={registerHref}>{c.account} →</Link><Link className="knop knop-lijn" href={loginHref}>{l.login} →</Link></div><p className="student-fine">{l.fine}</p></div></section>
  </div>;
}
