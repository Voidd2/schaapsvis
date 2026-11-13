import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { StaticResponsiveImage } from "@/components/StaticResponsiveImage";
import { DiscountOfferPopup } from "@/components/shared/DiscountOfferPopup";
import { BedieningSlot } from "@/components/catalog/BedieningSlot";
import { Kruimels } from "@/components/ui/Sectie";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { BEELD } from "@/lib/beeld";
import { ADRES_REGEL, BEDRIJF } from "@/lib/bedrijf";
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
    <BedieningSlot><DiscountOfferPopup locale={locale} experiment="locations" /></BedieningSlot>
    <Schema data={kruimelSchema(locale, breadcrumbs)} />
    <section id="locatieoverzicht" className={styles.hero} aria-labelledby="visit-title">
      <div className="section-wrap">
        <div className={styles.heading}>
          <Kruimels items={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: nav("locaties") }]} />
          <p className="kapitaal">{t("brand")}</p>
          <h1 id="visit-title">{t("title")}</h1>
          <p className={styles.intro}>{t("sub")}</p>
          <nav className={styles.locationNav} aria-label={nav("locaties")}>
            <a href="#locatie-winkel" className="knop knop-lijn">{t("shopLink")} ↓</a>
            <a href="#locatie-voorschoten" className="knop knop-lijn">{t("stallLink")} ↓</a>
          </nav>
        </div>
        <div className={styles.locationsGrid}>
          <article id="locatie-winkel" className={styles.locationCard} aria-labelledby="shop-title">
            <StaticResponsiveImage src={storefront.bestand} alt={shopAlt} width={1320} height={984}
              sizes="(max-width: 799px) 100vw, (max-width: 1720px) 48vw, 790px"
              className={styles.locationPhoto} loading="eager" fetchPriority="high" />
            <div className={styles.cardBody}>
              <h2 id="shop-title">{t("shop")}</h2>
              <p>{ADRES_REGEL}</p>
              <dl className={styles.hours}>
                {openingRows("winkel", locale).map(row =>
                  <div key={row.day}><dt>{row.label}</dt><dd>{row.time}</dd></div>
                )}
                <div><dt>{places("zoMa")}</dt><dd>{places("gesloten")}</dd></div>
              </dl>
              <div className={styles.actions}>
                <a href={shop.mapsUrl} className="knop knop-navy">{t("shopRoute")} ↗</a>
                <a href={`tel:${BEDRIJF.telefoon.e164}`} className={styles.textLink}>{t("call")}</a>
              </div>
            </div>
          </article>
          <article id="locatie-voorschoten" className={styles.locationCard} aria-labelledby="stall-title">
            <StaticResponsiveImage src={BEELD.historieNu.bestand} alt={t("viskarAlt")}
              width={1600} height={900} loading="eager"
              sizes="(max-width: 799px) 100vw, (max-width: 1720px) 48vw, 790px"
              className={styles.locationPhoto} />
            <div className={styles.cardBody}>
              <h2 id="stall-title">{t("stall")}</h2>
              <p>{stall.straat}, {stall.postcode} {stall.plaats}</p>
              <p className={styles.stallIntro}>{t("stallIntro")}</p>
              <div className={styles.address}>
                {openingRows("voorschoten", locale).map(row => <strong key={row.day}>{row.label} · {row.time}</strong>)}
              </div>
              <div className={styles.actions}>
                <a className="knop knop-navy" href={mapsRoute.href}>{t("route")} ↗</a>
              </div>
              <Link className={styles.textLink} href={`/${locale}/viswinkel-voorschoten`}>{t("details")} →</Link>
            </div>
          </article>
        </div>
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

    <section className={`section-wrap ${styles.locations}`} aria-labelledby="visit-markets">
      <h2 id="visit-markets">{t("market")}</h2>
      <div className={styles.locationsGrid}>
        {markets.map(({ id, point, day }) => {
          const hours = marketHours.find(row => row.day === day)!;
          return <article id={`locatie-${id}`} key={id} className={styles.card}>
            <h3>{hours.label} · {hours.time}</h3>
            <p>{point.adres}, {point.plaats}</p>
            <a className={styles.textLink} href={point.mapsUrl} aria-label={`${t("directions")} · ${point.adres}`}>{t("directions")} ↗</a>
          </article>;
        })}
      </div>
    </section>

    <PaginaSlot titel={t("rangeTitle")} tekst={t("rangeIntro")} knoppen={[
      { label: t("range"), href: `/${locale}/assortiment` },
      { ...bestelContact(locale), extern: true, soort: "lijn" },
    ]} />
  </>;
}
