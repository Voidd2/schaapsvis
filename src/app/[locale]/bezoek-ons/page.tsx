import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { StaticResponsiveImage } from "@/components/StaticResponsiveImage";
import { Kruimels } from "@/components/ui/Sectie";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { BEELD } from "@/lib/beeld";
import { ADRES_REGEL, BEDRIJF, whatsappLink } from "@/lib/bedrijf";
import { bestelContact } from "@/lib/bestel-contact";
import { localLocations } from "@/lib/local-pages-copy";
import { openingRows, scheduledCounters } from "@/lib/openingHours";
import { kruimelSchema, paginaMetadata } from "@/lib/seo";
import styles from "./visit.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return paginaMetadata({
    locale,
    pad: "/bezoek-ons",
    title: t("bezoekTitle"),
    description: t("bezoekDesc"),
    image: BEELD.historieNu.bestand,
  });
}

export default async function BezoekOnsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bezoekPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const places = await getTranslations({ locale, namespace: "plekken" });
  const locations = localLocations(locale);
  const stall = locations.find(point => point.id === "voorschoten")!;
  const shop = locations.find(point => point.id === "winkel")!;
  const markets = [
    { id: "woensdag", point: locations.find(point => point.id === "markt-woensdag")!, day: 3 },
    { id: "zaterdag", point: locations.find(point => point.id === "markt")!, day: 6 },
  ];
  const marketHours = openingRows("markt", locale);
  const mapsRoute = new URL("https://www.google.com/maps/dir/");
  mapsRoute.search = new URLSearchParams({
    api: "1",
    destination: `Hoogvliet, ${stall.straat}, ${stall.postcode} ${stall.plaats}`,
  }).toString();
  await connection();
  const visit = scheduledCounters(new Date());
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "Europe/Amsterdam" }).format(visit.date);
  const breadcrumbs = [{ naam: BEDRIJF.naamKort, pad: "/" }, { naam: nav("locaties"), pad: "/bezoek-ons" }];
  const storefront = BEELD.winkelGevel;
  const shopAlt = locale === "de" || locale === "en" ? storefront.vertalingen[locale].alt : storefront.alt;

  return <>
    <JsonLd locale={locale} />
    <Schema data={kruimelSchema(locale, breadcrumbs)} />
    <section id="locatie-voorschoten" className={styles.hero} aria-labelledby="visit-title">
      <div className={`section-wrap ${styles.heroGrid}`}>
        <div>
          <Kruimels items={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: nav("locaties") }]} />
          <p className="kapitaal">{t("brand")}</p>
          <h1 id="visit-title">{t("title")}</h1>
          <p className={styles.intro}>{t("sub")}</p>
          <div className={styles.address}>
            {openingRows("voorschoten", locale).map(row => <strong key={row.day}>{row.label} · {row.time}</strong>)}
            <span>{stall.straat}, {stall.postcode} {stall.plaats}</span>
          </div>
          <div className={styles.actions}>
            <a className="knop knop-navy" href={mapsRoute.href}>{t("route")} ↗</a>
            <a className="knop knop-lijn" href={whatsappLink(t("message"))}>{t("contact")}</a>
          </div>
          <div className={styles.moreLinks}>
            <a className={styles.textLink} href="#locatieoverzicht">{t("other")} ↓</a>
            <Link className={styles.textLink} href={`/${locale}/viswinkel-voorschoten`}>{t("details")} →</Link>
          </div>
        </div>
        <figure className={styles.stallPhoto}>
          <StaticResponsiveImage src={BEELD.historieNu.bestand} alt={t("viskarAlt")}
            width={1600} height={900} loading="eager" fetchPriority="high"
            sizes="(max-width: 799px) 100vw, (max-width: 1720px) 48vw, 790px" />
          <figcaption>{t("viskarBijschrift")}</figcaption>
        </figure>
      </div>
    </section>

    <section className={styles.schedule} aria-labelledby="visit-next">
      <div className={`section-wrap ${styles.scheduleGrid}`}>
        <h2 id="visit-next">{t(visit.today ? "today" : "next")} · {weekday}</h2>
        <ul>{locations.filter(point => visit.ids.includes(point.id)).map(point =>
          <li key={point.id}>
            <a href={point.mapsUrl}><strong>{point.naam}</strong><span>{point.adres} · {visit.hours[point.id]} ↗</span></a>
          </li>
        )}</ul>
      </div>
    </section>

    <section id="locatieoverzicht" className={`section-wrap ${styles.locations}`} aria-labelledby="visit-leiden">
      <h2 id="visit-leiden">{t("leiden")}</h2>
      <div className={styles.locationsGrid}>
        <article id="locatie-winkel" className={styles.card}>
          <div className={styles.shopHeading}>
            <div><h3>{t("shop")}</h3><p>{ADRES_REGEL}</p></div>
            <StaticResponsiveImage src={storefront.bestand} alt={shopAlt} width={1320} height={984}
              sizes="(max-width: 799px) 80px, 160px" className={styles.storePhoto} />
          </div>
          <dl className={styles.hours}>
            {openingRows("winkel", locale).map(row =>
              <div key={row.day}><dt>{row.label}</dt><dd>{row.time}</dd></div>
            )}
            <div><dt>{places("zoMa")}</dt><dd>{places("gesloten")}</dd></div>
          </dl>
          <div className={styles.actions}>
            <a href={shop.mapsUrl} className="knop knop-navy">{t("directions")} ↗</a>
            <a href={`tel:${BEDRIJF.telefoon.e164}`} className={styles.textLink}>{t("call")}</a>
          </div>
        </article>
        <article className={styles.card}>
          <h3>{t("market")}</h3>
          {markets.map(({ id, point, day }) => {
            const hours = marketHours.find(row => row.day === day)!;
            return <div id={`locatie-${id}`} key={id} className={styles.market}>
              <h4>{hours.label} · {hours.time}</h4>
              <p>{point.adres}, {point.plaats}</p>
              <a className={styles.textLink} href={point.mapsUrl} aria-label={`${t("directions")} · ${point.adres}`}>{t("directions")} ↗</a>
            </div>;
          })}
        </article>
      </div>
    </section>

    <PaginaSlot titel={t("rangeTitle")} tekst={t("rangeIntro")} knoppen={[
      { label: t("range"), href: `/${locale}/assortiment` },
      { ...bestelContact(locale), extern: true, soort: "lijn" },
    ]} />
  </>;
}
