import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Schema } from "@/components/Schema";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { bestelContact } from "@/lib/bestel-contact";
import { gesorteerdAssortiment } from "@/lib/assortiment-volgorde";
import { AssortimentFilter } from "./AssortimentFilter";
import { localizeProduct } from "@/lib/product-localization";

const copy = {
  nl: {
    label: "Schaap’s Vishandel · Leiden", title: "Ons assortiment.",
    intro: "Van een mooie zalmfilet tot vers gebakken kibbeling. Goede vis voor aan tafel, bij de borrel of gewoon tussendoor.",
    browse: "Ontdek het assortiment", platter: "Visschaal samenstellen",
    policy: "Alleen visschalen bestelt u online.", policySub: "Zoekt u iets anders? Stuur ons een WhatsApp-bericht. Dan kijken we samen wat mogelijk is.",
    question: "Iets in gedachten?", note: "Een bepaalde vis, een speciale wens of iets wat u hier niet ziet? App ons gerust. We bespreken de mogelijkheden en beschikbaarheid met u.",
    image: "Zalm met citroen en dille",
    bbqTitle: "Vis op de barbecue?", bbqText: "Deze foto’s zijn ideeën voor de presentatie, geen vaste pakketten van Schaap’s. Laat weten wat u zoekt; we kijken graag welke vis en bereidingen we voor u kunnen regelen.", bbqAction: "Bespreek uw barbecuewensen", bbqCaption: "Voorbeeldfoto: visspiesjes en vis voor de barbecue; samenstelling bij ons kan afwijken.",
  },
  en: {
    label: "Schaap’s Vishandel · Leiden", title: "Our fish selection.",
    intro: "From a beautiful salmon fillet to freshly fried kibbeling. Good fish for dinner, sharing or a little treat.",
    browse: "Explore our range", platter: "Create a seafood platter",
    policy: "Only seafood platters can be ordered online.", policySub: "Looking for something else? Send us a WhatsApp message to discuss the options.",
    question: "Something in mind?", note: "A particular fish, a special request or something you can't find here? Ask us on WhatsApp about availability and options.",
    image: "Salmon with lemon and dill",
    bbqTitle: "Fish for the barbecue?", bbqText: "These photos show presentation ideas, not fixed Schaap’s packages. Tell us what you have in mind and we’ll see which fish and preparations we can arrange.", bbqAction: "Ask about barbecue fish", bbqCaption: "Example photo: fish skewers and barbecue fish; our selection may differ.",
  },
  de: {
    label: "Schaap’s Vishandel · Leiden", title: "Unser Sortiment.",
    intro: "Vom schönen Lachsfilet bis zum frisch gebackenen Kibbeling. Guter Fisch zum Abendessen, zum Teilen oder für zwischendurch.",
    browse: "Sortiment entdecken", platter: "Fischplatte zusammenstellen",
    policy: "Nur Fischplatten können Sie online bestellen.", policySub: "Suchen Sie etwas anderes? Schreiben Sie uns per WhatsApp. Gemeinsam schauen wir, was möglich ist.",
    question: "Einen besonderen Wunsch?", note: "Ein bestimmter Fisch, ein besonderer Wunsch oder etwas, das Sie hier nicht finden? Fragen Sie uns per WhatsApp nach Verfügbarkeit und Möglichkeiten.",
    image: "Lachs mit Zitrone und Dill",
    bbqTitle: "Fisch für den Grill?", bbqText: "Diese Fotos zeigen Servierideen, keine festen Pakete von Schaap’s. Beschreiben Sie uns Ihre Wünsche; wir prüfen gerne, welche Fische und Zubereitungen möglich sind.", bbqAction: "Grillwünsche besprechen", bbqCaption: "Beispielfoto: Fischspieße und Fisch zum Grillen; unser Angebot kann abweichen.",
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
  const wa = bestelContact(locale);
  return <>
    <Schema data={{
      "@context": "https://schema.org", "@type": "ItemList", name: `${c.title} ${BEDRIJF.naam}`,
      numberOfItems: gesorteerdAssortiment.length,
      itemListElement: gesorteerdAssortiment.map((p, i) => ({
        "@type": "ListItem", position: i + 1, name: localizeProduct(p, locale).naam,
        url: `${BEDRIJF.domein}/${locale}/assortiment/${p.slug}`,
      })),
    }} />
    <header className="collection-hero">
      <div className="section-wrap collection-hero-grid">
        <div className="collection-hero-copy">
          <p className="kapitaal">{c.label}</p><h1>{c.title}</h1><p className="collection-intro">{c.intro}</p>
          <div className="collection-hero-actions">
            <a href="#assortiment" className="knop knop-rood">{c.browse}<ArrowUpRight size={17} aria-hidden="true" /></a>
            <Link href={`/${locale}/visschalen`} className="collection-text-link">{c.platter}<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          <p className="collection-heritage">Leiden · {locale === "nl" ? "Sinds" : locale === "de" ? "Seit" : "Since"} 1938</p>
        </div>
        <figure className="collection-hero-image">
          <Image width={1400} height={933} sizes="(max-width: 800px) 100vw, 50vw" src="/images/editorial/zalm.webp" alt={c.image} priority />
        </figure>
      </div>
    </header>
    <aside className="collection-policy"><div className="section-wrap"><div><strong>{c.policy}</strong><p>{c.policySub}</p></div><a href={wa.href}><MessageCircle size={19} aria-hidden="true" />{wa.label}<ArrowUpRight size={17} aria-hidden="true" /></a></div></aside>
    <div id="assortiment"><AssortimentFilter localized={gesorteerdAssortiment.map(p => localizeProduct(p, locale))} /></div>
    <section className="collection-bbq"><div className="section-wrap"><div className="collection-bbq-heading"><p className="kapitaal">{locale === "nl" ? "Ter inspiratie" : locale === "de" ? "Zur Inspiration" : "For inspiration"}</p><h2>{c.bbqTitle}</h2><p>{c.bbqText}</p><a href={wa.href} className="knop knop-rood"><MessageCircle size={18} aria-hidden="true" />{c.bbqAction}</a></div><div className="collection-bbq-photos"><figure><Image src="/images/dirks/barbecuepakket.webp" alt={c.bbqCaption} width={1000} height={700} sizes="(max-width: 700px) 100vw, 30vw" /><figcaption>{c.bbqCaption}</figcaption></figure><figure><Image src="/images/dirks/barbecuepakket-xxl.webp" alt={c.bbqCaption} width={1000} height={700} sizes="(max-width: 700px) 100vw, 30vw" /><figcaption>{c.bbqCaption}</figcaption></figure></div></div></section>
    <section className="collection-contact"><div className="section-wrap"><div><p className="kapitaal">{locale === "nl" ? "Persoonlijk advies" : locale === "de" ? "Persönliche Beratung" : "Personal advice"}</p><h2>{c.question}</h2><p>{c.note}</p></div><a className="knop knop-rood" href={wa.href}><MessageCircle size={19} aria-hidden="true" />{wa.label}</a></div></section>
  </>;
}
