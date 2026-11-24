import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StaticResponsiveImage } from "@/components/StaticResponsiveImage";
import { AnalyticsConsent } from "@/components/shared/AnalyticsConsent";
import { DiscountSignup } from "@/components/shared/DiscountSignup";
import { ADRES_REGEL } from "@/lib/bedrijf";
import { BEELD } from "@/lib/beeld";
import { paginaMetadata } from "@/lib/seo";
import styles from "./nieuwsbrief.module.css";

const photo = BEELD.oestersInDeWinkel;
const copy = {
  nl: {
    title: "Ontvang de aanbiedingen van Schaap’s Vis",
    eyebrow: "Uw visboer sinds 1938",
    heading: "Onze aanbiedingen,", accent: "vers in uw inbox.",
    intro: "Zin in kibbeling of iets lekkers voor vanavond? Meld u aan voor de nieuwsbrief van Schaap’s Vis en ontvang onze kortingen per e-mail.",
    website: "Naar de website", home: "Schaap’s Vishandel, naar de homepage",
    caption: "Achter de toonbank aan de Herenstraat in Leiden",
    alt: photo.alt,
  },
  en: {
    title: "Get offers from Schaap’s Vis",
    eyebrow: "Your fishmonger since 1938",
    heading: "Our offers,", accent: "fresh in your inbox.",
    intro: "Fancy some kibbeling or looking for something for dinner? Sign up for the Schaap’s Vis newsletter to get our offers by email.",
    website: "Visit our website", home: "Schaap’s Vishandel home",
    caption: "Behind the counter at our shop on Herenstraat in Leiden",
    alt: "A member of staff holds up an oyster and a box of oysters behind the fish counter",
  },
  de: {
    title: "Angebote von Schaap’s Vis per E-Mail",
    eyebrow: "Ihr Fischhändler seit 1938",
    heading: "Unsere Angebote,", accent: "frisch im Postfach.",
    intro: "Lust auf Kibbeling oder auf etwas Gutes fürs Abendessen? Melden Sie sich für den Newsletter von Schaap’s Vis an und erhalten Sie unsere Angebote per E-Mail.",
    website: "Zur Website", home: "Zur Startseite von Schaap’s Vishandel",
    caption: "Hinter der Theke in unserem Geschäft an der Herenstraat in Leiden",
    alt: "Ein Mitarbeiter zeigt hinter der Fischtheke eine Auster und eine Kiste mit Austern",
  },
} as const;

type Props = { params: Promise<{ locale: string }> };

function landingCopy(locale: string) {
  return copy[locale === "en" || locale === "de" ? locale : "nl"];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = landingCopy(locale);
  return {
    ...paginaMetadata({ locale, pad: "/nieuwsbrief", title: t.title, description: t.intro, image: photo.bestand, geenIndex: true }),
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  };
}

export default async function NewsletterLanding({ params }: Props) {
  const { locale } = await params;
  const t = landingCopy(locale);
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href={`/${locale}`} className={styles.brand} aria-label={t.home}>
            <Image src="/images/brand/schaapsvis-logo-192.webp" alt="" width={52} height={52} unoptimized />
            <span>Schaap’s<br />Vishandel</span>
          </Link>
          <Link href={`/${locale}`} className={styles.website}>{t.website} <span aria-hidden="true">→</span></Link>
        </div>
      </header>
      <main id="inhoud" className={styles.hero}>
        <div className={styles.message}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h1 className={styles.headline}>{t.heading} <em>{t.accent}</em></h1>
          <p className={styles.intro}>{t.intro}</p>
          <DiscountSignup locale={locale} newsletterLanding />
        </div>
        <figure className={styles.figure}>
          <StaticResponsiveImage className={styles.photo} src={photo.bestand} width={1600} height={1066}
            sizes="(max-width: 760px) 100vw, (max-width: 1250px) 66vw, 880px" alt={t.alt}
            loading="eager" fetchPriority="high" />
          <figcaption>{t.caption}</figcaption>
        </figure>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <address>Schaap’s Vishandel <span aria-hidden="true">·</span> {ADRES_REGEL}</address>
          <AnalyticsConsent locale={locale} />
        </div>
      </footer>
    </div>
  );
}
