import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { paginaMetadata } from "@/lib/seo";

const copy = {
  nl: {
    title: "10% studentenkorting in Leiden | Schaap's Vis",
    description:
      "Leidse MBO-, HBO- en WO-studenten krijgen 10% korting op kibbeling, haring, broodjes haring en drinken bij Schaap's Vishandel.",
    eyebrow: "Voor studenten in Leiden",
    heading: "Goed eten. Een beetje minder betalen.",
    intro:
      "Studeer je in Leiden aan het mbo, hbo of de universiteit? Na goedkeuring krijg je 10% studentenkorting op kibbeling, haring, broodjes haring en drinken bij Schaap's Vishandel.",
    categories: ["Kibbeling", "Haring", "Broodjes haring", "Drinken"],
    condition: "Voor wie is de korting?",
    conditionText:
      "Voor studenten die in Leiden een MBO-, HBO- of WO-opleiding volgen. Middelbare scholieren vallen buiten deze actie. Na handmatige goedkeuring toon je je digitale studentenpas. Die is één studiejaar geldig; daarna lever je opnieuw bewijs aan.",
    card: "Je digitale studentenpas",
    cardExample: "Voorbeeld · na beoordeling beschikbaar in je account",
    steps: "Zo werkt aanmelden",
    step1: "Maak een account met je e-mailadres en bevestig dat adres.",
    step2: "Dien je studentenaanvraag in en upload bewijs dat je in Leiden studeert.",
    step3: "We beoordelen je aanvraag handmatig. Na goedkeuring verschijnt je digitale kortingspas in je account.",
    privacy: "Je bewijs is alleen zichtbaar voor de beoordelaar en wordt na de beoordeling verwijderd. E-maildeals zijn optioneel: je kiest daar apart voor en kunt je altijd afmelden.",
    weekly: "Elke week iets nieuws proeven",
    weeklyText:
      "We testen geregeld nieuwe producten. Wie zich later vrijwillig aanmeldt voor e-mail, ontvangt onze weekdeals en kan ons laten weten wat ervan op tafel mag blijven.",
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
      "Leiden MBO, college and university students get 10% off kibbeling, herring, herring sandwiches and drinks at Schaap's Vishandel.",
    eyebrow: "For students in Leiden",
    heading: "Good food. A little less to pay.",
    intro:
      "Studying in Leiden at MBO, HBO or university level? After approval, get 10% off kibbeling, herring, herring sandwiches and drinks at Schaap's Vishandel.",
    categories: ["Kibbeling", "Herring", "Herring sandwiches", "Drinks"],
    condition: "Who is eligible?",
    conditionText:
      "Students enrolled in an MBO, HBO or university programme in Leiden. Secondary-school pupils are not eligible. After manual approval, show your digital student pass. It is valid for one academic year; you must then submit proof again.",
    card: "Your digital student pass",
    cardExample: "Preview · available in your account after approval",
    steps: "How to apply",
    step1: "Create an account with your email address and verify it.",
    step2: "Submit a student application and upload proof that you study in Leiden.",
    step3: "We review each application manually. Once approved, your digital discount pass appears in your account.",
    privacy:
      "Only the reviewer can access your proof, which is deleted after review. Email offers are optional: you choose separately and can unsubscribe at any time.",
    weekly: "Try something new each week",
    weeklyText:
      "We regularly test new products. People who choose to join our email list receive our weekly offers and can tell us what deserves a place on the counter.",
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
      "Studierende in Leiden (MBO, HBO oder Uni) erhalten 10 % Rabatt auf Kibbeling, Hering, Heringsbrötchen und Getränke bei Schaap's Vishandel.",
    eyebrow: "Für Studierende in Leiden",
    heading: "Gutes Essen. Ein bisschen günstiger.",
    intro:
      "Studieren Sie in Leiden auf MBO-, HBO- oder Universitätsniveau? Nach der Genehmigung erhalten Sie 10 % Rabatt auf Kibbeling, Hering, Heringsbrötchen und Getränke bei Schaap's Vishandel.",
    categories: ["Kibbeling", "Hering", "Heringsbrötchen", "Getränke"],
    condition: "Wer kann den Rabatt erhalten?",
    conditionText:
      "Studierende, die in Leiden ein MBO-, HBO- oder Universitätsstudium absolvieren. Schülerinnen und Schüler der weiterführenden Schule sind ausgeschlossen. Nach manueller Genehmigung zeigen Sie Ihren digitalen Rabattpass. Er gilt ein Studienjahr; danach müssen Sie erneut einen Nachweis einreichen.",
    card: "Ihr digitaler Studentenausweis",
    cardExample: "Vorschau · nach der Prüfung in Ihrem Konto verfügbar",
    steps: "So funktioniert die Anmeldung",
    step1: "Erstellen Sie ein Konto mit Ihrer E-Mail-Adresse und bestätigen Sie diese.",
    step2: "Stellen Sie einen Studenten-Antrag und laden Sie einen Nachweis Ihres Studiums in Leiden hoch.",
    step3: "Wir prüfen jeden Antrag manuell. Nach der Freigabe erscheint Ihr digitaler Rabattpass im Konto.",
    privacy:
      "Nur die prüfende Person kann den Nachweis sehen; nach der Prüfung wird er gelöscht. E-Mail-Angebote sind freiwillig und können jederzeit abbestellt werden.",
    weekly: "Jede Woche etwas Neues probieren",
    weeklyText:
      "Wir testen regelmäßig neue Produkte. Wer sich freiwillig für E-Mails anmeldet, erhält unsere wöchentlichen Angebote und kann uns sagen, was im Sortiment bleiben soll.",
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
          </div>
          <figure className="relative overflow-hidden rounded-2xl min-h-[280px]">
            <Image src="/images/editorial/kibbeling.webp" alt={c.alt} fill sizes="(max-width: 800px) 100vw, 50vw" className="object-cover" priority />
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
            <p className="mt-3 max-w-xl leading-relaxed">{c.conditionText}</p>
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
