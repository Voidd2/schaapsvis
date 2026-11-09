import { StaticResponsiveImage as Image } from "@/components/StaticResponsiveImage";
import { feestdagenBedrag } from "@/lib/feestdagen-producten";
import { STANDARD_FISH_TRIO } from "@/lib/gift-pricing";
import { GiftRequest } from "@/components/catalog/CatalogEnhancements";
import { giftRequestCopy } from "@/lib/gift-request";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Kop, Sectie } from "@/components/ui/Sectie";
import { bestelContact } from "@/lib/bestel-contact";
import { paginaMetadata } from "@/lib/seo";

import { giftCopy as copy } from "@/lib/gift-copy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const c = copy(locale);
  return paginaMetadata({ locale, pad: "/relatiegeschenken", title: `${c.title} | Schaap’s Vishandel`, description: c.intro, image: c.items[1][2] });
}

export default async function RelatiegeschenkenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const c = copy(locale);
  const contact = bestelContact(locale, c.title);
  const requestCopy = giftRequestCopy(locale);
  return <>
    <PaginaKop kruimels={[{ naam: c.home, href: `/${locale}` }, { naam: c.feast, href: `/${locale}/feestdagen` }, { naam: c.title }]} label={c.label} titel={c.title} intro={c.intro} knoppen={[{ label: c.ask, href: contact.href, extern: true }, { label: c.back, href: `/${locale}/feestdagen`, soort: "lijn" }]} zijkant={<div className="overflow-hidden rounded-2xl border border-white/20 shadow-xl"><Image src={c.items[1][2]} alt={c.items[1][3]} width={1536} height={1024} sizes="(max-width: 1023px) 100vw, 36vw" loading="eager" fetchPriority="high" className="aspect-[3/2] w-full object-cover" /></div>} uitgelijnd="boven" />
    <Sectie grond="papier" id="mogelijkheden">
      <Kop label={c.options} titel={c.optionsTitle} intro={c.note} />
      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
        {c.items.map(([titel, tekst, beeld, alt, detail], index) => <li id={`geschenk-${index + 1}`} key={titel} className="group flex min-w-0 flex-col overflow-hidden rounded-lg border bg-white" style={{ borderColor: "var(--linen)" }}>
          <div className="overflow-hidden"><Image src={beeld} alt={alt} width={1000} height={700} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" /></div>
          <div className="flex flex-1 flex-col p-4 sm:p-6"><h2 className="text-[1.05rem] leading-tight sm:text-[1.35rem]">{titel}</h2><p className="mt-2 leading-relaxed" style={{ color: "var(--charcoal)" }}>{tekst}</p><p className="mt-3 text-[0.78rem] font-bold sm:text-sm" style={{ color: "#a61f2b" }}>{index !== 1 && index !== 2 && <>{c.priceNote} · </>}{index === 1 ? feestdagenBedrag(STANDARD_FISH_TRIO,locale) : detail}</p>{[1, 2].includes(index) ? <><p className="mt-3 text-sm">{index === 1 ? requestCopy.trioExample : requestCopy.example}</p><GiftRequest locale={locale} product={titel} kind={index === 1 ? "trio" : "custom"} /></> : <a href={bestelContact(locale, titel).href} className="knop knop-lijn mt-4">{c.view} →</a>}</div>
        </li>)}
      </ul>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl px-5 py-5 sm:px-7" style={{ backgroundColor: "#eaf7fc" }}><p className="max-w-2xl font-semibold" style={{ color: "var(--navy-dark)" }}>{c.note}</p><Link href={`/${locale}/feestdagen`} className="knop knop-lijn">{c.back}</Link></div>
    </Sectie>
    <Sectie grond="zand">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
        <Kop label={c.howLabel} titel={c.howTitle} />
        <ol className="grid sm:grid-cols-2 gap-x-8">
          {c.how.map((item, index) => <li key={item} className="flex gap-4 py-5" style={{ borderTop: "1px solid var(--linen)" }}><span className="bedrag font-semibold" style={{ color: "var(--gold)" }}>{String(index + 1).padStart(2, "0")}</span><span className="font-semibold" style={{ color: "var(--navy)" }}>{item}</span></li>)}
        </ol>
      </div>
    </Sectie>
    <Sectie grond="navy" smal><Kop titel={c.honestTitle} donker /><p className="lees" style={{ color: "rgba(250,246,239,0.82)" }}>{c.honestText}</p></Sectie>
    <PaginaSlot titel={c.slotTitle} tekst={c.slotText} knoppen={[{ label: c.ask, href: contact.href, extern: true }, { label: c.back, href: `/${locale}/feestdagen`, soort: "lijn" }]} />
  </>;
}
