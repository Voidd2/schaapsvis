import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { MessageCircle } from "lucide-react";
import { StaticResponsiveImage as Image } from "@/components/StaticResponsiveImage";
import { gesorteerdAssortiment } from "@/lib/assortiment-volgorde";
import { holidayFishCopy, holidayFishWhatsApp } from "@/lib/feestdagen-verse-vis";
import { localizeProduct } from "@/lib/product-localization";
import { paginaMetadata } from "@/lib/seo";
import { AssortimentFilter } from "../../assortiment/AssortimentFilter";

type Props = { params: Promise<{ locale: string }> };
const photo = "/images/schaaps/toonbank-marktkraam.webp";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const c = holidayFishCopy(locale);
  return paginaMetadata({ locale, pad: "/feestdagen/verse-vis", title: c.title, description: c.intro, image: photo });
}

export default async function HolidayFreshFish({ params }: Props) {
  await connection();
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const c = holidayFishCopy(locale);
  return <>
    <header className="festive-catalog-hero holiday-cover section-wrap">
      <div>
        <Link className="collection-text-link" href={`/${locale}/feestdagen`}>← {c.back}</Link>
        <h1>{c.title}</h1><p>{c.intro}</p>
        <div className="catalog-intro-links">
          <a className="knop knop-rood" href={holidayFishWhatsApp(locale)}><MessageCircle size={18} aria-hidden="true" />{c.request}</a>
          <a href="#assortiment">{c.browse} ↓</a>
        </div>
      </div>
      <figure><Image src={photo} alt={c.photo} width={1600} height={1200} sizes="(max-width: 767px) 100vw, 50vw" priority /></figure>
    </header>
    <aside className="collection-policy"><div className="section-wrap">
      <div><h2 className="text-xl">{c.lobster}</h2><p>{c.lobsterNote}</p></div>
      <a href={holidayFishWhatsApp(locale, c.lobsterProduct)}><MessageCircle size={18} aria-hidden="true" />{c.askLobster}</a>
    </div></aside>
    <div id="assortiment">
      <AssortimentFilter localized={gesorteerdAssortiment.map(p => localizeProduct(p, locale))} holiday />
    </div>
  </>;
}
