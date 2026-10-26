import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { paginaMetadata } from "@/lib/seo";

const copy = {
  nl: {
    title: "10% studentenkorting in Leiden | Schaap's Vis",
    description:
      "Nederlandse en internationale studenten in Leiden krijgen 10% korting op kibbeling, haring, broodjes haring en drinken bij Schaap's Vishandel.",
    eyebrow: "Voor Nederlandse én internationale studenten",
    heading: "Student in Leiden? Eet lekker mee.",
    intro:
      "Studeer je in Leiden aan het mbo, hbo of de universiteit? Nederlandse en internationale studenten kunnen na goedkeuring 10% korting krijgen op kibbeling, haring, broodjes haring en drinken bij Schaap's Vishandel.",
    categories: ["Kibbeling", "Haring", "Broodjes haring", "Drinken"],
    condition: "Voor wie is de korting?",
    conditionText:
      "Voor Nederlandse en internationale studenten die in Leiden een MBO-, HBO- of WO-opleiding volgen; middelbare scholieren vallen buiten de actie. De korting geldt alleen voor kibbeling, haring, broodjes haring en drinken en kan niet worden gecombineerd met nieuwsbriefkortingen of andere acties.",
    card: "Je digitale studentenpas",
    cardText:
      "Na goedkeuring verschijnt je persoonlijke pas in je account. De pas is één studiejaar geldig; daarna lever je opnieuw bewijs aan. Het accountportaal is nog niet geopend.",
    cardExample: "Voorbeeld · na beoordeling beschikbaar in je account",
    steps: "Zo werkt aanmelden",
    step1: "Maak een account met je persoonlijke e-mailadres, je schoolmail en een sterk wachtwoord.",
    step2: "Vul de twee aparte verificatiecodes in die we naar beide adressen sturen. Pas daarna kun je je inschrijvingsbewijs veilig indienen.",
    step3: "We beoordelen je aanvraag handmatig. Na goedkeuring verschijnt je digitale kortingspas in je account.",
    privacy: "De registratie is technisch voorbereid, maar nog niet live. Voor studentverificatie controleren we beide adressen met een aparte code. Aanbiedingen per e-mail zijn vrijwillig, staan los van de korting en kun je altijd afmelden.",
    weekly: "Regelmatig iets nieuws proeven",
    weeklyText:
      "Meld je apart en vrijwillig aan voor nieuws en aanbiedingen speciaal voor Schaap’s-klanten. Soms delen we ook een groepsaanbieding voor studentenverenigingen. We sturen alleen een bericht wanneer er iets leuks te delen is. Deze aanbiedingen zijn niet te combineren met de studentenkorting of andere acties.",
    status: "Aanmelden voor korting opent zodra de veilige opslag, e-mail en beheeromgeving in Cloudflare zijn gekoppeld.",
    account: "Bekijk accountpagina",
    home: "Bekijk ons assortiment",
    alt: "Versgebakken kibbeling met citroen en saus",
    photoAlt: "Hollandse nieuwe haring met uitjes",
    privacyPage: "Lees de privacyinformatie",
  },
  en: {
    title: "10% student discount in Leiden | Schaap's Vis",
    description:
      "Dutch and international students in Leiden get 10% off kibbeling, herring, herring sandwiches and drinks at Schaap's Vishandel.",
    eyebrow: "For Dutch and international students",
    heading: "Studying in Leiden? Eat well with us.",
    intro:
      "Studying in Leiden at MBO, HBO or university level? Dutch and international students can get 10% off kibbeling, herring, herring sandwiches and drinks at Schaap's Vishandel after approval.",
    categories: ["Kibbeling", "Herring", "Herring sandwiches", "Drinks"],
    condition: "Who is eligible?",
    conditionText:
      "For Dutch and international students enrolled in an MBO, HBO or university programme in Leiden; secondary-school pupils are not eligible. The discount applies only to kibbeling, herring, herring sandwiches and drinks. It cannot be combined with newsletter discounts or other offers.",
    card: "Your digital student pass",
    cardText:
      "Once approved, your personal pass will appear in your account. It is valid for one academic year; you will need to provide new proof afterwards. The account portal is not open yet.",
    cardExample: "Preview · available in your account after approval",
    steps: "How to apply",
    step1: "Create an account with your personal email, school email and a strong password.",
    step2: "Enter the two separate verification codes sent to both addresses. You can then securely submit proof of enrolment.",
    step3: "We review each application manually. Once approved, your digital discount pass appears in your account.",
    privacy:
      "Registration is prepared in the codebase but is not live yet. Student verification checks both addresses with a separate code. Email offers are optional, separate from the discount, and can be cancelled at any time.",
    weekly: "Discover something new from time to time",
    weeklyText:
      "Sign up separately and voluntarily for news and offers especially for Schaap’s customers. From time to time, we may also share a group offer for student associations. We will email only when there is something worth sharing. These offers cannot be combined with the student discount or other promotions.",
    status: "Student applications open when secure storage, email and admin review are connected in Cloudflare.",
    account: "Open your account",
    home: "Explore our range",
    alt: "Freshly fried kibbeling with lemon and sauce",
    photoAlt: "Dutch herring served with onions",
    privacyPage: "Read the privacy information",
  },
  de: {
    title: "10 % Studentenrabatt in Leiden | Schaap's Vis",
    description:
      "Niederländische und internationale Studierende in Leiden erhalten 10 % Rabatt auf Kibbeling, Hering, Heringsbrötchen und Getränke bei Schaap's Vishandel.",
    eyebrow: "Für niederländische und internationale Studierende",
    heading: "Du studierst in Leiden? Iss gut bei uns.",
    intro:
      "Studieren Sie in Leiden auf MBO-, HBO- oder Universitätsniveau? Niederländische und internationale Studierende können nach Freigabe 10 % Rabatt auf Kibbeling, Hering, Heringsbrötchen und Getränke bei Schaap's Vishandel erhalten.",
    categories: ["Kibbeling", "Hering", "Heringsbrötchen", "Getränke"],
    condition: "Wer kann den Rabatt erhalten?",
    conditionText:
      "Für niederländische und internationale Studierende in einem MBO-, HBO- oder Hochschulstudium in Leiden; Schülerinnen und Schüler weiterführender Schulen sind ausgeschlossen. Der Rabatt gilt nur für Kibbeling, Hering, Heringsbrötchen und Getränke und ist nicht mit Newsletter-Rabatten oder anderen Aktionen kombinierbar.",
    card: "Ihr digitaler Studentenausweis",
    cardText:
      "Nach der Freigabe erscheint Ihr persönlicher Pass im Konto. Er ist ein Studienjahr gültig; danach müssen Sie einen neuen Nachweis einreichen. Das Kontenportal ist noch nicht geöffnet.",
    cardExample: "Vorschau · nach der Prüfung in Ihrem Konto verfügbar",
    steps: "So funktioniert die Anmeldung",
    step1: "Erstellen Sie ein Konto mit Ihrer privaten E-Mail-Adresse, Schul-E-Mail und einem sicheren Passwort.",
    step2: "Geben Sie die zwei separaten Bestätigungscodes ein, die wir an beide Adressen senden. Danach können Sie den Studiennachweis sicher einreichen.",
    step3: "Wir prüfen jeden Antrag manuell. Nach der Freigabe erscheint Ihr digitaler Rabattpass im Konto.",
    privacy:
      "Die Registrierung ist im Code vorbereitet, aber noch nicht live. Für die Studentenprüfung bestätigen wir beide Adressen mit separaten Codes. E-Mail-Angebote sind freiwillig, vom Rabatt getrennt und jederzeit abbestellbar.",
    weekly: "Ab und zu etwas Neues entdecken",
    weeklyText:
      "Melden Sie sich separat und freiwillig für Neuigkeiten und Angebote speziell für Schaap’s-Kunden an. Gelegentlich teilen wir auch ein Gruppenangebot für Studierendenvereine. Wir schreiben nur, wenn es etwas Schönes zu teilen gibt. Diese Angebote sind nicht mit dem Studentenrabatt oder anderen Aktionen kombinierbar.",
    status: "Studentenanträge werden freigeschaltet, sobald sicherer Speicher, E-Mail und Verwaltung in Cloudflare verbunden sind.",
    account: "Kontoseite öffnen",
    home: "Sortiment entdecken",
    alt: "Frisch frittierte Kibbeling mit Zitrone und Sauce",
    photoAlt: "Holländischer neuer Hering mit Zwiebeln",
    privacyPage: "Datenschutzhinweise lesen",
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

  return (
    <div>
      <section className="fresh-hero">
        <div className="section-wrap fresh-hero-grid">
          <div>
            <p className="kapitaal">{c.eyebrow}</p>
            <h1>{c.heading}</h1>
            <p className="fresh-intro">{c.intro}</p>
            <div className="flex flex-wrap gap-3 mt-7" aria-label={locale === "nl" ? "Producten met korting" : locale === "de" ? "Produkte mit Rabatt" : "Discounted categories"}>
              {c.categories.map((category) => <span key={category} className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold">10% · {category}</span>)}
            </div>
            <Link href={`/${locale}/account`} className="knop knop-rood mt-7 inline-flex">{c.account} →</Link>
          </div>
          <figure className="relative overflow-hidden rounded-2xl min-h-[280px]">
            <Image src="/images/editorial/kibbeling-schaapstray.png" alt={c.alt} fill sizes="(max-width: 800px) 100vw, 50vw" className="object-cover" priority />
          </figure>
        </div>
      </section>

      <section className="story-section section-wrap">
        <div className="grid gap-12 md:grid-cols-[1fr_0.8fr] items-center">
          <div>
            <p className="kapitaal">{locale === "nl" ? "Eerlijke voorwaarden" : locale === "de" ? "Klare Bedingungen" : "Clear eligibility"}</p>
            <h2>{c.condition}</h2>
            <p className="max-w-2xl leading-relaxed">{c.conditionText}</p>
          </div>
          <Image src="/images/editorial/hollandse-nieuwe-uitjes.webp" alt={c.photoAlt} width={1000} height={667} sizes="(max-width: 768px) 100vw, 40vw" className="w-full rounded-2xl object-cover" />
        </div>
      </section>

      <section className="section-wrap py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="kapitaal">{locale === "nl" ? "Na goedkeuring" : locale === "de" ? "Nach der Freigabe" : "After approval"}</p>
            <h2>{c.card}</h2>
            <p className="mt-3 max-w-xl leading-relaxed">{c.cardText}</p>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-[#073d56] p-7 text-white shadow-xl sm:p-9" aria-label={c.cardExample}>
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[36px] border-white/5" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-200">Schaap&apos;s Vishandel</p>
                  <p className="mt-2 text-sm text-sky-100">LEIDEN · SINDS 1938</p>
                </div>
                <span className="rounded-full border border-white/25 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em]">Student</span>
              </div>
              <div className="mt-10 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-sky-100">{c.card}</p>
                  <p className="mt-1 text-5xl font-bold tracking-tight">10%</p>
                </div>
                <p className="max-w-36 text-right text-sm leading-relaxed text-sky-100">{c.categories.join(" · ")}</p>
              </div>
              <p className="mt-8 border-t border-white/20 pt-4 text-xs text-sky-100">{c.cardExample}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="fresh-contact">
        <div className="section-wrap">
          <p className="kapitaal">{locale === "nl" ? "Na de start van het accountportaal" : locale === "de" ? "Nach Start des Kontobereichs" : "When the account area opens"}</p>
          <h2>{c.steps}</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {[c.step1, c.step2, c.step3].map((step, index) => (
              <li key={step} className="rounded-2xl border border-sky-200 bg-white p-6">
                <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-900">{index + 1}</span>
                <p className="leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-7 max-w-4xl text-sm leading-relaxed text-slate-600">{c.privacy}</p>
          <a href={`/${locale}/privacyverklaring`} className="mt-2 inline-block text-sm font-semibold underline underline-offset-4">{c.privacyPage} →</a>
          <p className="mt-6 rounded-xl border border-sky-200 bg-sky-50 px-5 py-4 font-semibold">{c.status} <a className="ml-2 underline underline-offset-4" href={`/${locale}/account`}>{c.account} →</a></p>
        </div>
      </section>

      <section className="story-section section-wrap">
        <div className="max-w-3xl">
          <p className="kapitaal">{locale === "nl" ? "Vrijwillig, nooit verplicht" : locale === "de" ? "Freiwillig, niemals verpflichtend" : "Optional, never required"}</p>
          <h2>{c.weekly}</h2>
          <p className="leading-relaxed">{c.weeklyText}</p>
          <a href={`/${locale}/assortiment`} className="knop knop-lijn mt-6">{c.home} →</a>
        </div>
      </section>
    </div>
  );
}

