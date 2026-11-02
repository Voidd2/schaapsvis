import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Schema } from "@/components/Schema";
import { Sectie } from "@/components/ui/Sectie";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { bestelContact } from "@/lib/bestel-contact";
import { gesorteerdAssortiment } from "@/lib/assortiment-volgorde";
import { AssortimentFilter } from "./AssortimentFilter";
import { localizeProduct } from "@/lib/product-localization";
import { DIRKS_BARBECUE, selectieNaam } from "@/lib/dirks-selectie";

const copy = {
  nl: {
    label: "Schaap’s Vishandel · Leiden", title: "Ons assortiment.",
    intro: "Van een mooie zalmfilet tot vers gebakken kibbeling. Goede vis voor aan tafel, bij de borrel of gewoon tussendoor.",
    browse: "Ontdek het assortiment", platter: "Bekijk visschalen",
    policy: "Visschalen en barbecue op aanvraag via WhatsApp.", policySub: "Stel samen met ons iets samen dat past bij uw gezelschap en gelegenheid. We bespreken uw wensen persoonlijk.",
    question: "Iets in gedachten?", note: "Een bepaalde vis, een speciale wens of iets wat u hier niet ziet? App ons gerust. We bespreken de mogelijkheden en beschikbaarheid met u.",
    image: "Zalm met citroen en dille",
  },
  en: {
    label: "Schaap’s Vishandel · Leiden", title: "Our fish selection.",
    intro: "From a beautiful salmon fillet to freshly fried kibbeling. Good fish for dinner, sharing or a little treat.",
    browse: "Explore our range", platter: "View seafood platters",
    policy: "Seafood platters and barbecue selections by WhatsApp request.", policySub: "We can help you put together a selection to suit your guests and occasion. Tell us what you have in mind.",
    question: "Something in mind?", note: "A particular fish, a special request or something you can't find here? Ask us on WhatsApp about availability and options.",
    image: "Salmon with lemon and dill",
  },
  de: {
    label: "Schaap’s Vishandel · Leiden", title: "Unser Sortiment.",
    intro: "Vom schönen Lachsfilet bis zum frisch gebackenen Kibbeling. Guter Fisch zum Abendessen, zum Teilen oder für zwischendurch.",
    browse: "Sortiment entdecken", platter: "Fischplatten ansehen",
    policy: "Fischplatten und Grillauswahl auf Anfrage per WhatsApp.", policySub: "Wir stellen gemeinsam eine Auswahl für Ihre Gäste und Ihren Anlass zusammen. Erzählen Sie uns von Ihren Wünschen.",
    question: "Einen besonderen Wunsch?", note: "Ein bestimmter Fisch, ein besonderer Wunsch oder etwas, das Sie hier nicht finden? Fragen Sie uns per WhatsApp nach Verfügbarkeit und Möglichkeiten.",
    image: "Lachs mit Zitrone und Dill",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return paginaMetadata({ locale, pad: "/assortiment", title: t("assortimentTitle"), description: t("assortimentDesc") });
}

export default async function AssortimentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = copy[locale as keyof typeof copy] ?? copy.nl;
  const bbq = await getTranslations({ locale, namespace: "barbecuePage" });
  const wa = bestelContact(locale);
  return <>
    <Schema data={{
      "@context": "https://schema.org", "@type": "ItemList", name: `${c.title} ${BEDRIJF.naam}`,
      numberOfItems: gesorteerdAssortiment.length + DIRKS_BARBECUE.length,
      itemListElement: [...gesorteerdAssortiment.map((p, i) => ({
        "@type": "ListItem", position: i + 1, name: localizeProduct(p, locale).naam,
        url: `${BEDRIJF.domein}/${locale}/assortiment/${p.slug}`,
      })), ...DIRKS_BARBECUE.map((item, i) => ({
        "@type": "ListItem", position: gesorteerdAssortiment.length + i + 1,
        name: selectieNaam(item.slug, locale),
        url: `${BEDRIJF.domein}/${locale}/barbecue-gourmet#${item.slug}`,
      }))],
    }} />
    <header className="collection-hero">
      <div className="section-wrap collection-hero-grid">
        <div className="collection-hero-copy">
          <p className="kapitaal">{c.label}</p><h1>{c.title}</h1><p className="collection-intro">{c.intro}</p>
          <div className="collection-hero-actions">
            <Link href={`/${locale}/visschalen`} className="collection-text-link">{c.platter}<ArrowUpRight size={17} aria-hidden="true" /></Link>
            <Link href={`/${locale}/barbecue-gourmet`} className="collection-text-link">{bbq("assortimentLink")}<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
        <figure className="collection-hero-image">
          <Link href={`/${locale}/assortiment/varlaks-zalm`} aria-label={locale === "de" ? "Produktinformationen zu VÅRLAKS-Lachs ansehen" : locale === "en" ? "View VÅRLAKS salmon product information" : "Bekijk de productinformatie over VÅRLAKS-zalm"}>
            <Image width={1400} height={1050} sizes="(max-width: 800px) 100vw, 50vw" src="/images/editorial/varlaks-zalm-rauw-ai.webp" alt={locale === "de" ? "Rohes frisches Lachsfilet auf Eis mit Zitrone und Dill" : locale === "en" ? "Raw fresh salmon fillet on ice with lemon and dill" : "Rauwe verse zalmfilet op ijs met citroen en dille"} priority />
          </Link>
        </figure>
      </div>
    </header>
    <div id="assortiment"><AssortimentFilter localized={gesorteerdAssortiment.map(p => localizeProduct(p, locale))} /></div>
    <aside className="collection-policy"><div className="section-wrap"><div><strong>{c.policy}</strong><p>{c.policySub}</p></div><a href={wa.href}><MessageCircle size={19} aria-hidden="true" />{wa.label}<ArrowUpRight size={17} aria-hidden="true" /></a></div></aside>
    <Sectie grond="zand"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div><p className="kapitaal">{bbq("assortimentLink")}</p><h2 className="text-2xl md:text-3xl mt-2">{bbq("assortimentHeading")}</h2><p className="max-w-2xl mt-3 text-[#4d6370]">{bbq("assortimentIntro")}</p></div>
      <Link href={`/${locale}/barbecue-gourmet`} className="knop knop-rood shrink-0">{bbq("assortimentLink")}<ArrowUpRight size={17} aria-hidden="true" /></Link>
    </div></Sectie>
    <section className="collection-contact"><div className="section-wrap"><div><p className="kapitaal">{locale === "nl" ? "Persoonlijk advies" : locale === "de" ? "Persönliche Beratung" : "Personal advice"}</p><h2>{c.question}</h2><p>{c.note}</p></div><a className="knop knop-rood" href={wa.href}><MessageCircle size={19} aria-hidden="true" />{wa.label}</a></div></section>
  </>;
}
