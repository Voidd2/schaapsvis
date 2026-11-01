import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Kop, Sectie, Vragen } from "@/components/ui/Sectie";
import { bestelContact } from "@/lib/bestel-contact";
import { feestdagenCopy } from "@/lib/feestdagen";
import { paginaMetadata } from "@/lib/seo";
import { FeestdagenUitgelicht } from "@/components/feestdagen/FeestdagenUitgelicht";

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
  const c = feestdagenCopy(locale);
  const contact = bestelContact(locale, c.title);

  return <>
    <FeestdagenUitgelicht
      locale={locale}
      label={c.featuredLabel}
      title={c.featuredTitle}
      hint={c.featuredHint}
      linkLabel={c.featuredLink}
      products={c.items}
    />
    <PaginaKop
      kruimels={[{ naam: c.home, href: `/${locale}` }, { naam: c.title }]}
      label={c.label}
      titel={c.title}
      intro={c.intro}
      knoppen={[
        { label: c.ask, href: contact.href, extern: true },
        { label: c.gifts, href: `/${locale}/relatiegeschenken`, soort: "lijn" },
      ]}
      zijkant={<div className="overflow-hidden rounded-2xl border border-white/20 shadow-xl">
        <Image src="/images/editorial/feestschaal-voorbeeld.webp" alt={c.items[0][3]} width={1200} height={800} priority className="aspect-[4/3] w-full object-cover" />
      </div>}
      uitgelijnd="boven"
    />

    <Sectie grond="papier" id="mogelijkheden">
      <Kop label={c.categories} titel={c.categoriesTitle} intro={c.categoriesIntro} />
      <ul className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-6 gap-y-8 sm:gap-y-10">
        {c.items.map(([titel, tekst, beeld, alt, href, prijs], index) => <li key={titel} className="group min-w-0">
          <Link href={`/${locale}${href}`} className="flex h-full flex-col">
            <div className="overflow-hidden rounded-lg bg-white aspect-[4/3]">
              <Image src={beeld} alt={alt} width={900} height={675} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
            </div>
            <p className="kapitaal mt-3 mb-1 sm:mt-4 sm:mb-2">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="text-[1.05rem] leading-tight sm:text-[1.25rem] group-hover:underline underline-offset-4">{titel}</h2>
            <p className="mt-2 hidden text-[0.95rem] leading-relaxed sm:block" style={{ color: "var(--charcoal)" }}>{tekst}</p>
            <p className="mt-2 text-[0.78rem] font-bold leading-snug sm:text-sm" style={{ color: "#a61f2b" }}>{prijs}</p>
            <span className="mt-auto inline-block pt-3 text-[0.78rem] font-semibold underline underline-offset-4 sm:text-sm" style={{ color: "var(--navy)" }}>
              {locale === "nl" ? "Bekijk de mogelijkheden" : locale === "de" ? "Möglichkeiten ansehen" : "Explore the options"} →
            </span>
          </Link>
        </li>)}
      </ul>
    </Sectie>

    <Sectie grond="zand">
      <Kop label={c.orderLabel} titel={c.orderTitle} />
      <ol className="grid md:grid-cols-3 gap-6">
        {c.steps.map(([nummer, titel, tekst]) => <li key={nummer} className="bg-white p-6 md:p-8 border-t-4" style={{ borderColor: "var(--gold)" }}>
          <span className="bedrag text-[2rem]" style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}>{nummer}</span>
          <h3 className="text-[1.25rem] mt-4 mb-2">{titel}</h3>
          <p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>{tekst}</p>
        </li>)}
      </ol>
    </Sectie>

    <Sectie grond="navy">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-center">
        <div>
          <Kop label={c.giftLabel} titel={c.giftTitle} donker />
          <p className="lees mb-7" style={{ color: "rgba(250,246,239,0.82)" }}>{c.giftText}</p>
          <Link href={`/${locale}/relatiegeschenken`} className="knop knop-lijn-licht">{c.giftLink}</Link>
        </div>
        <Image src="/images/editorial/gerookte-zalm-serveervoorbeeld.png" alt={c.items[3][3]} width={1200} height={800} className="rounded-2xl w-full aspect-[3/2] object-cover" />
      </div>
    </Sectie>

    <Sectie grond="papier" smal>
      <Kop label={c.practicalLabel} titel={c.practicalTitle} />
      <Vragen vragen={c.practical.map(([v, a]) => ({ v, a }))} />
    </Sectie>

    <PaginaSlot titel={c.slotTitle} tekst={c.slotText} knoppen={[
      { label: c.ask, href: contact.href, extern: true },
      { label: c.gifts, href: `/${locale}/relatiegeschenken`, soort: "lijn" },
    ]} />
  </>;
}
