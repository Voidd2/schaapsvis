import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { paginaMetadata } from "@/lib/seo";

const copy = {
  nl: {
    title: "Aanbiedingen van Schaap’s Vishandel | Af en toe iets lekkers",
    description: "Ontvang af en toe aanbiedingen en nieuws van Schaap’s Vishandel. Kies uw regio en meld u direct aan.",
    eyebrow: "Voor wie graag lekker eet",
    heading: "Iets lekkers, precies wanneer we iets moois hebben",
    intro: "Soms hebben we een aanbieding, een mooie seizoensvis of iets nieuws uit de winkel dat we graag met u delen. Schrijf u in en ontvang af en toe een bericht van Schaap’s Vishandel — geen vaste wekelijkse belofte.",
    benefits: ["Aanbiedingen speciaal voor klanten van Schaap’s", "Nieuws over seizoensvis en wat er vers binnenkomt", "Berichten afgestemd op uw gekozen regio"],
    form: "Houd mij op de hoogte",
    note: "Na uw duidelijke toestemming is uw e-mailadres direct ingeschreven. Iedere e-mail bevat een afmeldmogelijkheid.",
    locations: "Liever persoonlijk advies? Kom langs in onze viswinkel of bij een marktkraam.",
    locationsLink: "Bekijk waar u ons vindt",
  },
  en: {
    title: "Offers from Schaap’s Vishandel | Occasional customer treats",
    description: "Get occasional offers and news from Schaap’s Vishandel. Choose your area and subscribe directly.",
    eyebrow: "For people who love good food",
    heading: "A good treat, when we have something worth sharing",
    intro: "Sometimes we have a special offer, a seasonal fish worth talking about or something new in the shop. Sign up to hear from Schaap’s Vishandel now and then — with no promise of a weekly email.",
    benefits: ["Offers especially for Schaap’s customers", "News about seasonal fish and fresh arrivals", "Updates relevant to your chosen area"],
    form: "Keep me updated",
    note: "After your clear consent, your email is subscribed immediately. Every email includes an unsubscribe option.",
    locations: "Prefer personal advice? Visit our fish shop or one of our market stalls.",
    locationsLink: "Find our locations",
  },
  de: {
    title: "Angebote von Schaap’s Vishandel | Ab und zu etwas Leckeres",
    description: "Erhalten Sie gelegentlich Angebote und Neuigkeiten von Schaap’s Vishandel. Wählen Sie Ihre Region und melden Sie sich direkt an.",
    eyebrow: "Für alle, die gutes Essen lieben",
    heading: "Etwas Leckeres, wenn es wirklich etwas zu teilen gibt",
    intro: "Manchmal haben wir ein Angebot, einen besonderen Saisonfisch oder etwas Neues aus dem Geschäft, das wir gern mit Ihnen teilen. Melden Sie sich an und hören Sie ab und zu von Schaap’s Vishandel — ohne Versprechen einer wöchentlichen E-Mail.",
    benefits: ["Angebote speziell für Schaap’s-Kunden", "Neuigkeiten zu Saisonfisch und frischem Fang", "Informationen passend zu Ihrer gewählten Region"],
    form: "Auf dem Laufenden bleiben",
    note: "Nach Ihrer eindeutigen Einwilligung ist Ihre E-Mail-Adresse sofort angemeldet. Jede E-Mail enthält eine Abmeldemöglichkeit.",
    locations: "Sie möchten persönliche Beratung? Besuchen Sie unser Fischgeschäft oder einen unserer Marktstände.",
    locationsLink: "Unsere Standorte ansehen",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in copy)) notFound();
  const c = copy[locale as keyof typeof copy];
  return paginaMetadata({ locale, pad: "/aanbiedingen", title: c.title, description: c.description });
}

export default async function AanbiedingenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in copy)) notFound();
  const c = copy[locale as keyof typeof copy];
  return (
    <main>
      <section className="fresh-hero">
        <div className="section-wrap fresh-hero-grid">
          <div>
            <p className="kapitaal">{c.eyebrow}</p>
            <h1>{c.heading}</h1>
            <p className="fresh-intro">{c.intro}</p>
            <ul className="mt-7 space-y-3">
              {c.benefits.map((benefit) => <li key={benefit} className="flex items-start gap-3"><span aria-hidden="true" className="font-bold text-sky-300">✓</span><span>{benefit}</span></li>)}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-xl sm:p-8">
            <NewsletterSignup locale={locale} />
            <p className="mt-4 text-xs leading-relaxed text-slate-600">{c.note}</p>
          </div>
        </div>
      </section>
      <section className="section-wrap py-10 md:py-14">
        <p className="max-w-3xl leading-relaxed text-slate-700">{c.locations} <Link className="font-semibold text-sky-800 underline underline-offset-4" href={`/${locale}/bezoek-ons`}>{c.locationsLink} →</Link></p>
      </section>
    </main>
  );
}
