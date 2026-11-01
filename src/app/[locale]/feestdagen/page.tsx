import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Kop, Sectie, Vragen } from "@/components/ui/Sectie";
import { bestelContact } from "@/lib/bestel-contact";
import { feestdagenCopy } from "@/lib/feestdagen";
import { FEESTDAGEN_CATEGORIEEN, FEESTDAGEN_PRODUCTEN, feestdagenPrijs } from "@/lib/feestdagen-producten";
import { paginaMetadata } from "@/lib/seo";
import { FeestdagenUitgelicht } from "@/components/feestdagen/FeestdagenUitgelicht";

const categorieCopy = {
  nl: {
    visschalen: ["Visschalen", "Klassiek, luxe of als hapjesschotel: kies de schaal die past bij uw gezelschap.", "Voor de hele tafel"],
    gourmet: ["Visgourmet", "Voor een gezellige avond aan tafel, per persoon of als complete schaal.", "Samen aan tafel"],
    delicatessen: ["Luxe vis & delicatessen", "Voor voorgerecht, lunch, borrel of als aanvulling op de feesttafel.", "Vooraf & bij de borrel"],
  },
  en: {
    visschalen: ["Seafood platters", "Classic, deluxe or bite-sized: choose the platter that suits your party.", "For the whole table"],
    gourmet: ["Fish gourmet", "For a relaxed evening at the table, per person or as a complete platter.", "Together at the table"],
    delicatessen: ["Luxury fish & delicacies", "For a starter, lunch, drinks or as an addition to your festive table.", "Starters & drinks"],
  },
  de: {
    visschalen: ["Fischplatten", "Klassisch, deluxe oder als Häppchenplatte: passend zu Ihrer Gästezahl.", "Für die ganze Tafel"],
    gourmet: ["Fischgourmet", "Für einen gemütlichen Abend am Tisch, pro Person oder als komplette Platte.", "Gemeinsam am Tisch"],
    delicatessen: ["Edelfisch & Delikatessen", "Als Vorspeise, zum Mittagessen, zum Aperitif oder für Ihre Festtafel.", "Vorspeise & Aperitif"],
  },
} as const;

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
  const taal = locale === "en" || locale === "de" ? locale : "nl";
  const contact = bestelContact(locale, c.title);

  return <>
    <FeestdagenUitgelicht
      locale={locale}
      label={c.featuredLabel}
      title={c.featuredTitle}
      hint={c.featuredHint}
      linkLabel={c.featuredLink}
      products={FEESTDAGEN_PRODUCTEN}
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
        <Image src="/images/dirks/visschotel-luxe-8-10-pers.webp" alt="Luxe visschotel voor de feestdagen" width={1200} height={800} priority className="aspect-[4/3] w-full object-cover" />
      </div>}
      uitgelijnd="boven"
    />

    <Sectie grond="papier" id="mogelijkheden">
      <Kop label={c.categories} titel={c.categoriesTitle} intro={c.categoriesIntro} />
      <nav aria-label={c.categoriesTitle} className="mb-10 flex flex-wrap gap-3">
        {FEESTDAGEN_CATEGORIEEN.map((categorie) => <a key={categorie.id} href={`#${categorie.id}`} className="knop knop-lijn">{categorieCopy[taal][categorie.id][0]}</a>)}
      </nav>
      <div className="space-y-16">
        {FEESTDAGEN_CATEGORIEEN.map((categorie) => <section key={categorie.id} id={categorie.id} className="scroll-mt-32">
          <div className="mb-7 max-w-3xl">
            <p className="kapitaal mb-2">{categorieCopy[taal][categorie.id][2]}</p>
            <h2 className="text-[1.8rem] sm:text-[2.2rem]">{categorieCopy[taal][categorie.id][0]}</h2>
            <p className="mt-2 leading-relaxed" style={{ color: "var(--charcoal)" }}>{categorieCopy[taal][categorie.id][1]}</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-3">
            {FEESTDAGEN_PRODUCTEN.filter((product) => product.categorie === categorie.id).map((product, index) => <li key={product.slug} className="group min-w-0">
              <Link href={`/${locale}/feestdagen/${product.slug}`} className="flex h-full flex-col">
                <div className="overflow-hidden rounded-lg bg-white aspect-[4/3]">
                  <Image src={product.afbeelding} alt={product.naam} width={900} height={675} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
                </div>
                <p className="kapitaal mt-3 mb-1 sm:mt-4 sm:mb-2">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="text-[1.05rem] leading-tight sm:text-[1.25rem] group-hover:underline underline-offset-4">{product.naam}</h3>
                <p className="mt-2 hidden text-[0.95rem] leading-relaxed sm:block" style={{ color: "var(--charcoal)" }}>{product.intro}</p>
                <p className="mt-2 text-[0.78rem] font-bold leading-snug sm:text-sm" style={{ color: "#a61f2b" }}>{feestdagenPrijs(product, locale)}</p>
                <span className="mt-auto inline-block pt-3 text-[0.78rem] font-semibold underline underline-offset-4 sm:text-sm" style={{ color: "var(--navy)" }}>
                  {locale === "nl" ? "Bekijk product" : locale === "de" ? "Produkt ansehen" : "View product"} →
                </span>
              </Link>
            </li>)}
          </ul>
        </section>)}
      </div>
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
        <Image src="/images/editorial/gerookte-zalm-serveervoorbeeld.png" alt="Gerookte zalm als feestelijk relatiegeschenk" width={1200} height={800} className="rounded-2xl w-full aspect-[3/2] object-cover" />
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
