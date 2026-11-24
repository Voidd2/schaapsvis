import type { Metadata } from "next";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { StaticResponsiveImage } from "@/components/StaticResponsiveImage";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { Kruimels, Vragen } from "@/components/ui/Sectie";
import { BEDRIJF } from "@/lib/bedrijf";
import { BEELD } from "@/lib/beeld";
import { bestelContact } from "@/lib/bestel-contact";
import { siteLanguage } from "@/lib/language";
import { localLocations, localPageCopy, localUI } from "@/lib/local-pages-copy";
import { productHref } from "@/lib/product-href";
import { localizedProduct } from "@/lib/product-localization";
import { kruimelSchema, paginaMetadata } from "@/lib/seo";
import styles from "./markt.module.css";

type Props = { params: Promise<{ locale: string }> };
const pagePath = "/marktkraam-leiden";
const products = [
  { slug: "kibbeling", photo: "/images/editorial/kibbeling-schaapstray.png" },
  { slug: "haring", photo: "/images/editorial/hollandse-nieuwe-uitjes.webp" },
  { slug: "varlaks-zalm", photo: "/images/schaaps/varlaks-viskraam-voorschoten.webp" },
];
const marketLabels = {
  nl: { overview: "De viskraam van Schaap’s op de Leidse markt met klanten", herring: "Een medewerker snijdt haring aan de marktkraam", salmon: "Zalmfilets in de viskraam", friday: "Meer over onze vrijdagkraam" },
  en: { overview: "Schaap’s fish stall at Leiden market with customers", herring: "A member of staff slicing herring at the market stall", salmon: "Salmon fillets at the fish stall", friday: "More about our Friday stall" },
  de: { overview: "Schaap’s Fischstand auf dem Leidener Markt mit Kundschaft", herring: "Ein Mitarbeiter schneidet Hering am Marktstand", salmon: "Lachsfilets am Fischstand", friday: "Mehr über unseren Freitagsstand" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = localPageCopy("marktkraam-leiden", locale);
  return paginaMetadata({ locale, pad: pagePath, title: copy.meta, description: copy.description, image: BEELD.historieNu.bestand });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const lang = siteLanguage(locale);
  const copy = localPageCopy("marktkraam-leiden", lang);
  const ui = localUI(lang);
  const labels = marketLabels[lang];
  const contact = bestelContact(lang);
  const locations = localLocations(lang);
  const stalls = ["markt-woensdag", "markt", "voorschoten"].flatMap(id => locations.filter(place => place.id === id));
  const fridayPhoto = BEELD.marktVoorschoten;

  return <div data-market-page className={styles.page}>
    <JsonLd locale={lang} />
    <Schema data={[kruimelSchema(lang, [{ naam: BEDRIJF.naamKort, pad: "/" }, { naam: copy.name, pad: pagePath }])]} />
    <header className={styles.hero}>
      <div className={styles.wrap}>
        <Kruimels items={[{ naam: BEDRIJF.naamKort, href: `/${lang}` }, { naam: copy.name }]} />
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.since}>{ui.since}</p>
            <h1>{copy.title}</h1>
            <p className={styles.intro}>{copy.intro}</p>
            <div className={styles.actions}>
              <Link className="knop knop-rood" href={`/${lang}/assortiment`}>{ui.range}</Link>
              <a className="knop knop-lijn-licht" href={contact.href} target="_blank" rel="noopener noreferrer">{contact.label}</a>
            </div>
          </div>
          <div className={styles.heroMedia}>
            <StaticResponsiveImage src={BEELD.historieNu.bestand} alt={labels.overview} width={1600} height={900}
            sizes="(max-width: 900px) 100vw, (max-width: 1450px) 52vw, 720px" className={styles.heroPhoto} loading="eager" fetchPriority="high" />
          </div>
        </div>
      </div>
    </header>

    <section id="marktdagen" className={`${styles.wrap} ${styles.section}`} aria-labelledby="market-places">
      <h2 id="market-places">{ui.locations}</h2>
      <div className={styles.schedule}>
        {stalls.map(place => {
          const friday = place.id === "voorschoten";
          return <article key={place.id} className={friday ? styles.friday : styles.leiden}>
            {friday && <StaticResponsiveImage src={fridayPhoto.bestand} alt={lang === "nl" ? fridayPhoto.alt : fridayPhoto.vertalingen[lang].alt}
              width={1600} height={900} sizes="(max-width: 900px) 100vw, (max-width: 1450px) 40vw, 550px" className={styles.fridayPhoto} loading="lazy" />}
            <div className={styles.placeBody}>
              <p className={styles.hours}><Clock3 size={16} aria-hidden="true" />{place.dagen}</p>
              <h3>{place.naam}</h3>
              <p className={styles.address}>{place.adres}<br />{place.postcode} {place.plaats}</p>
              <div className={styles.placeLinks}>
                <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`${ui.route}: ${place.naam}`}>{ui.route} →</a>
                {friday && <Link href={`/${lang}/viswinkel-voorschoten`}>{labels.friday} →</Link>}
              </div>
            </div>
          </article>;
        })}
      </div>
    </section>

    <section id="marktkraam-verhaal" className={styles.story} aria-labelledby="market-days">
      <div className={`${styles.wrap} ${styles.storyGrid}`}>
        <div className={styles.storyMedia}>
          <StaticResponsiveImage src={BEELD.haringkraam.bestand} alt={labels.herring} width={1600} height={900}
          sizes="(max-width: 900px) 100vw, (max-width: 1450px) 48vw, 660px" className={styles.storyPhoto} loading="lazy" />
        </div>
        <div>
          <h2 id="market-days">{copy.heading}</h2>
          {copy.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <div className={styles.storyLinks}>
            <Link href={`/${lang}/varlaks#certificaten`}>{ui.cert}</Link>
            <Link href={`/${lang}/recepten`}>{ui.recipes}</Link>
            <Link href={`/${lang}/viskalender`}>{ui.calendar}</Link>
          </div>
        </div>
      </div>
    </section>

    <section id="marktkraam-assortiment" className={`${styles.wrap} ${styles.section}`} aria-labelledby="market-products">
      <h2 id="market-products">{ui.fish}</h2>
      <div className={styles.products}>
        {products.map(({ slug, photo }) => {
          const product = localizedProduct(slug, lang)!;
          return <article key={slug}>
            <Link className={styles.product} href={productHref(lang, slug)}>
              <StaticResponsiveImage src={photo} alt={slug === "varlaks-zalm" ? labels.salmon : `${product.naam} — ${ui.serving}`}
                width={600} height={400} sizes="(max-width: 640px) 100vw, (max-width: 1450px) 32vw, 440px" loading="lazy" />
              <div><h3>{product.naam}</h3><p>{product.desc}</p></div>
            </Link>
          </article>;
        })}
      </div>
    </section>

    <section className={styles.faq} aria-labelledby="market-questions">
      <div className={`${styles.wrap} ${styles.faqGrid}`}><h2 id="market-questions">{ui.questions}</h2><Vragen vragen={copy.questions} /></div>
    </section>
    <PaginaSlot titel={ui.budget} tekst={ui.policy} knoppen={[{ label: contact.label, href: contact.href, extern: true }, { label: ui.platter, href: `/${lang}/visschalen`, soort: "lijn" }]} />
  </div>;
}
