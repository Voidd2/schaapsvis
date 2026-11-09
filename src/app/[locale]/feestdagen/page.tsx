import { StaticResponsiveImage as Image } from "@/components/StaticResponsiveImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Store } from "lucide-react";
import { Kop, Sectie, Vragen } from "@/components/ui/Sectie";
import { SeafoodCatalog } from "@/components/catalog/SeafoodCatalog";
import { CatalogHelp } from "@/components/catalog/CatalogHelp";
import { catalogText } from "@/lib/catalog-copy";
import { feestdagenCopy } from "@/lib/feestdagen";
import { paginaMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const c = feestdagenCopy(locale);
  return paginaMetadata({
    locale,
    pad: "/feestdagen",
    title: `${c.title} | Schaap’s Vishandel Leiden`,
    description: c.intro,
    image: "/images/editorial/feestschaal-voorbeeld.webp",
  });
}

export default async function FeestdagenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const c = feestdagenCopy(locale), t = catalogText(locale);
  return <>
    <section className="festive-catalog-hero holiday-cover section-wrap">
      <div><p className="kapitaal">{c.label}</p><h1>{c.title}</h1><p>{t.festiveIntro}</p>
        <div className="catalog-intro-links"><a className="knop knop-rood" href="#visschalen">{t.browse} →</a><a className="knop knop-lijn" href="#geschenken">{t.gifts} ↓</a>
          <a href="#gourmet-keuzes">{locale === "en" ? "Create a gourmet platter" : locale === "de" ? "Gourmetplatte zusammenstellen" : "Visgourmet samenstellen"}</a>
        </div>
      </div>
      <figure><Image src="/images/editorial/feestschaal-voorbeeld.webp" alt={locale === "en" ? "Festive seafood platter, serving suggestion" : locale === "de" ? "Festliche Fischplatte als Servierbeispiel" : "Feestelijke visschaal als serveervoorbeeld"} width={1200} height={800} sizes="(max-width: 767px) 100vw, 50vw" loading="eager" fetchPriority="high" /><figcaption>{locale === "en" ? "Festive serving suggestion" : locale === "de" ? "Festlicher Serviervorschlag" : "Feestelijk serveervoorbeeld"}</figcaption></figure>
    </section>
    <div className="section-wrap"><div className="festive-practical"><div><CalendarDays aria-hidden="true" /><div><h2>{t.orderTitle}</h2><p>{t.orderText}</p></div></div><div><Store aria-hidden="true" /><div><h2>{t.pickupTitle}</h2><p>{t.pickupText}</p></div></div></div></div>
    <nav className="catalog-section-links section-wrap" aria-label={locale === "en" ? "Holiday categories" : locale === "de" ? "Festtagskategorien" : "Feestdagencategorieën"}>
      {[["visschalen", locale === "en" ? "Seafood platters" : locale === "de" ? "Fischplatten" : "Visschalen"], ["gourmet", t.gourmet], ["geschenken", t.gifts], ["delicatessen", t.delicacies], ["salades", locale === "en" ? "Salads" : locale === "de" ? "Salate" : "Salades"]].map(([id,label]) => <a key={id} href={`#${id}`}>{label}</a>)}
    </nav>
    <div className="section-wrap"><CatalogHelp locale={locale} /></div>
      <SeafoodCatalog locale={locale} festive />
    <Sectie grond="zand"><div className="catalog-gift-link"><div><h2>{t.gifts}</h2><p>{t.giftText}</p></div><Link className="knop knop-lijn" href={`/${locale}/relatiegeschenken`}>{c.giftLink} →</Link></div></Sectie>
    <Sectie grond="papier" smal><Kop label={c.practicalLabel} titel={c.practicalTitle} /><Vragen vragen={c.practical.map(([v,a])=>({v,a}))} /></Sectie>
  </>;
}
