import { productHref } from "@/lib/product-href";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { Schema } from "@/components/Schema";
import { StaticResponsiveImage } from "@/components/StaticResponsiveImage";
import { VarlaksFilm } from "@/components/shared/VarlaksFilm";
import { BEDRIJF } from "@/lib/bedrijf";
import { bestelContact } from "@/lib/bestel-contact";
import { kruimelSchema, paginaMetadata } from "@/lib/seo";
import { origins } from "./content";
import styles from "./origins.module.css";

type PageProps = { params: Promise<{ locale: string }> };
const route = "/biologische-vis";
const farm = "/images/varlaks/from-egg-to-plate-2.jpg.webp";
const sources = [
  { key: "bio", name: "BIO", organisation: "Skal", href: "https://www.skal.nl/onderwerpen/aquacultuur/vissen/kweken-van-biologische-vis" },
  { key: "asc", name: "ASC", organisation: "ASC", href: "https://asc-aqua.org/about-the-asc-sustainability-label/" },
  { key: "msc", name: "MSC", organisation: "MSC", href: "https://www.msc.org/nl/het-blauwe-msc-keurmerk-wat-het-betekent-voor-jou-als-consument" },
] as const;

function copy(locale: string) {
  return origins[locale as keyof typeof origins] ?? origins.nl;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const c = copy(locale);
  return paginaMetadata({ locale, pad: route, title: c.meta, description: c.description, image: farm });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const c = copy(locale);
  const contact = bestelContact(locale);
  const examples = [
    { slug: "varlaks-zalm", title: c.salmon, origin: c.salmonOrigin, body: c.salmonText, link: c.salmonLink, image: "/images/varlaks/from-egg-to-plate-3.jpg.webp", alt: c.salmonAlt, width: 600, height: 600, credit: c.credit },
    { slug: "hollandse-garnalen", title: c.shrimp, origin: c.shrimpOrigin, body: c.shrimpText, link: c.shrimpLink, image: "/images/assortiment-internet/hollandse-garnalen-solt.jpeg", alt: c.shrimpAlt, width: 5472, height: 3648, credit: c.shrimpCredit, creditUrl: "https://www.dulkhaasnoot.nl/onze-producten/hollandse-garnalen/", story: { label: c.shrimpStory, href: "https://www.soltmen.com/ons-avontuur/" } },
  ];
  return (
    <div className={styles.page}>
      <Schema data={kruimelSchema(locale, [{ naam: BEDRIJF.naamKort, pad: "/" }, { naam: c.title, pad: route }])} />

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Schaap’s Vishandel · {c.since} {BEDRIJF.opgericht}</p>
          <h1>{c.title}</h1>
          <p className={styles.intro}>{c.intro}</p>
          <a className={styles.heroButton} href="#keurmerken">{c.compare}<ArrowDown size={18} aria-hidden="true" /></a>
        </div>
        <figure className={styles.heroPhoto}>
          <Image src={farm} alt={c.farmAlt} width={600} height={600} sizes="(max-width: 760px) 100vw, 50vw" loading="eager" fetchPriority="high" />
          <figcaption><MapPin size={16} aria-hidden="true" />{c.farmPlace}<span>{c.credit}</span></figcaption>
        </figure>
      </header>

      <section id="keurmerken" className={styles.section}>
        <h2>{c.guide}</h2>
        <div className={styles.labelGrid}>
          {sources.map(({ key, name, organisation, href }) => (
            <article key={key} className={styles.label}>
              <h3><span>{name}</span>{c.labels[key].title}</h3>
              <p>{c.labels[key].text}</p>
              <a className={styles.source} href={href}>{organisation} ↗</a>
            </article>
          ))}
        </div>
        <Link className={styles.textLink} href={`/${locale}/blog/wat-betekenen-msc-asc-en-het-eu-bio-logo`}>{c.readGuide}<ArrowRight size={17} aria-hidden="true" /></Link>
      </section>

      <section className={styles.counter}>
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>{c.counter}</h2>
            <Link className={styles.textLink} href={`/${locale}/assortiment`}>{c.range}<ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className={styles.products}>
            {examples.map((item) => (
              <article className={styles.product} key={item.slug}>
                <figure>
                  <StaticResponsiveImage src={item.image} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 680px) 100vw, (max-width: 1440px) 46vw, 654px" />
                  <figcaption>{item.creditUrl ? <a href={item.creditUrl}>{item.credit}</a> : item.credit}</figcaption>
                </figure>
                <div>
                  <p className={styles.kicker}>{item.origin}</p>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <Link className={styles.textLink} href={productHref(locale, item.slug)}>{item.link}<ArrowRight size={17} aria-hidden="true" /></Link>
                  {item.story && <a className={styles.source} href={item.story.href}>{item.story.label} ↗</a>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.story}`}>
        <div>
          <h2>{c.story}</h2>
          <p>{c.storyText}</p>
          <Link className={styles.textLink} href={productHref(locale, "varlaks-zalm")}>{c.landing}<ArrowRight size={17} aria-hidden="true" /></Link>
          <a className={styles.source} href="https://varlaks.no/retail/">{c.supplier} ↗</a>
        </div>
        <VarlaksFilm locale={locale} poster="/images/varlaks/from-egg-to-plate-4.jpg.webp" />
      </section>

      <div className={`${styles.section} ${styles.advice}`}>
        <section>
          <h2>{c.faq}</h2>
          {c.questions.map(({ q, a }) => (
            <details key={q}>
              <summary>{q}<ChevronDown size={19} aria-hidden="true" /></summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
        <section className={styles.visit}>
          <h2>{c.visit}</h2>
          <p className={styles.address}><MapPin size={18} aria-hidden="true" />{BEDRIJF.adres.straat}, {BEDRIJF.adres.plaats}</p>
          <p>{c.invitation}</p>
          <div className={styles.actions}>
            <Link className="knop knop-lijn" href={`/${locale}/bezoek-ons`}>{c.locations}</Link>
            <a className={styles.textLink} href={contact.href}>{c.whatsapp}<ArrowRight size={17} aria-hidden="true" /></a>
          </div>
        </section>
      </div>
    </div>
  );
}

