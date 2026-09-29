import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Schema } from "@/components/Schema";
import { JsonLd } from "@/components/JsonLd";
import { Sectie, Vragen } from "@/components/ui/Sectie";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { paginaMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { BEDRIJF, VERKOOPPUNTEN } from "@/lib/bedrijf";
import { bestelContact } from "@/lib/bestel-contact";
import { blogPosts } from "@/lib/blog";
import { localizeBlog } from "@/lib/blog-localization";
import { voorschotenText } from "@/lib/voorschoten-copy";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}): Promise<Metadata> {
  const {locale}=await params;
  const t=(text:string)=>voorschotenText(text,locale);
  return paginaMetadata({
    locale, pad: "/viswinkel-voorschoten",
    title: t("Visboer Voorschoten bij Hoogvliet op vrijdag | Schaap’s"),
    image: "/images/editorial/kibbeling.webp",
    description: t("Visboer Voorschoten? Probeer Schaap’s bij Hoogvliet, Veurseweg 18. Elke vrijdag 08:00–17:30: verse vis, haring en kibbeling voor scherpe prijzen. Bekijk de route."),
  });
}

const FAQNL = [
  { v: "Waar staat jullie visboer in Voorschoten?", a: "Schaap’s Vishandel staat elke vrijdag op de parkeerplaats bij Hoogvliet aan de Veurseweg 18, 2252 AA Voorschoten. Onze viskraam is open van 08:00 tot 17:30. Het is een wekelijkse kraam, geen vaste winkel die iedere dag open is." },
  { v: "Wat zijn de openingstijden in Voorschoten?", a: "Elke vrijdag van 08:00 tot 17:30. U kunt ’s ochtends langskomen of aan het einde van de middag nog vis meenemen voor het avondeten. Op andere dagen vindt u onze winkel aan de Herenstraat 48 in Leiden, dinsdag tot en met zaterdag." },
  { v: "Kan ik kibbeling en haring halen bij Hoogvliet?", a: "Ja, kom vrijdag langs voor kibbeling, haring en ons visassortiment. Vraag naar wat er die dag beschikbaar is. Bij kibbeling past onze ravigotesaus." },
  { v: "Welke verse vis hebben jullie in Voorschoten?", a: "U vindt bij ons onder andere zalm, verse visfilets, gerookte vis en Hollandse garnalen. Onze VÅRLAKS-zalm is een favoriet. De aanvoer verschilt per dag; vraag via WhatsApp of een bepaald product er is." },
  { v: "Kan ik iets vooraf aanvragen om vrijdag op te halen?", a: "Stuur ons een WhatsApp-bericht met uw wensen en vermeld dat u vrijdag in Voorschoten wilt ophalen. We bespreken de beschikbaarheid, hoeveelheid en prijs. Alleen visschalen kunt u online samenstellen en bestellen." },
  { v: "Hebben jullie vis met keurmerken in Voorschoten?", a: "Onze Hollandse garnalen zijn MSC-gecertificeerd. Voor andere vis, waaronder de zalm, informeren we u graag over de certificering van de actuele levering. Niet alle producten hebben hetzelfde keurmerk." },
  { v: "Wat kost verse vis bij jullie kraam?", a: "We staan voor goede kwaliteit en scherpe prijzen. De prijs verschilt per vissoort, hoeveelheid en actuele aanvoer. Vraag bij de kraam naar de dagprijs of stuur ons vooraf een WhatsApp-bericht met uw wensen. We spreken de prijs met u af voordat u beslist." },
];

const AANBOD = [
  { title: "Kibbeling voor de lunch of mee naar huis", text: "Krokante kibbeling met ravigotesaus. Een vertrouwde favoriet voor tijdens het boodschappen doen.", src: "/images/editorial/kibbeling.webp", alt: "Krokante kibbeling met saus", slug: "kibbeling" },
  { title: "Haring en Hollandse garnalen", text: "Hollandse klassiekers voor op brood, bij de lunch of als voorgerecht. Vraag naar de aanvoer van de dag.", src: "/images/editorial/hollandse-nieuwe-uitjes.webp", alt: "Hollandse haring met uitjes en augurk", slug: "haring" },
  { title: "Zalm en verse filet voor het avondeten", text: "Vertel ons wat u wilt koken. We helpen kiezen welke vis en hoeveel porties bij uw gerecht passen.", src: "/images/editorial/zalm.webp", alt: "Zalmfilet met citroen en dille", slug: "varlaks-zalm" },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t=(text:string)=>voorschotenText(text,locale);
  const FAQ=FAQNL.map(q=>({v:t(q.v),a:t(q.a)}));
  const aanbod=AANBOD.map(p=>({...p,title:t(p.title),text:t(p.text),alt:t(p.alt)}));
  const kraam = VERKOOPPUNTEN.find(p => p.id === "voorschoten")!;
  const contact = bestelContact(locale);
  const localSchema = {
    "@context": "https://schema.org", "@type": "GroceryStore",
    "@id": `${BEDRIJF.domein}/#kraam-voorschoten`,
    name: t("Schaap’s Vishandel — vrijdagse viskraam Voorschoten"),
    description: t("Wekelijkse viskraam op de parkeerplaats bij Hoogvliet in Voorschoten, elke vrijdag van 08:00 tot 17:30."),
    url: `${BEDRIJF.domein}/${locale}/viswinkel-voorschoten`,
    telephone: BEDRIJF.telefoon.e164,
    image: `${BEDRIJF.domein}/images/editorial/kibbeling.webp`,
    address: { "@type": "PostalAddress", streetAddress: kraam.straat, postalCode: kraam.postcode, addressLocality: "Voorschoten", addressRegion: "Zuid-Holland", addressCountry: "NL" },
    hasMap: kraam.mapsUrl,
    parentOrganization: { "@id": `${BEDRIJF.domein}/#organisatie` },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday"], opens: "08:00", closes: "17:30" }],
  };
  return <>
    <JsonLd locale={locale} />
    <Schema data={[localSchema, vraagSchema(FAQ), kruimelSchema(locale, [{ naam: BEDRIJF.naamKort, pad: "/" }, { naam: t("Viswinkel Voorschoten"), pad: "/viswinkel-voorschoten" }])]} />
    <header className="fresh-hero"><div className="section-wrap fresh-hero-grid">
      <div><p className="kapitaal">{t("Schaap’s Vishandel · sinds 1938")}</p><h1>{t("Visboer Voorschoten: elke vrijdag bij Hoogvliet")}</h1><p className="fresh-intro">{t("Goede vis, scherpe prijzen en persoonlijk advies. Probeer onze viskraam op vrijdag: van verse zalm voor het avondeten tot krokante kibbeling met ravigotesaus en haring met uitjes.")}</p><div className="mt-6 rounded-xl border border-sky-200 bg-white p-5"><p className="font-semibold text-lg">{t("Elke vrijdag · 08:00–17:30")}</p><p className="mt-1">{t("Parkeerplaats Hoogvliet · Veurseweg 18")}<br />{t("2252 AA Voorschoten")}</p><p className="mt-3 text-sm">{t("Ook aan het einde van de middag nog vis halen voor het avondeten.")}</p></div><div className="flex flex-wrap gap-3 mt-6"><a className="knop knop-rood" href={kraam.mapsUrl} target="_blank" rel="noopener noreferrer">{t("Route naar Hoogvliet")}</a><Link className="knop knop-lijn" href={`/${locale}/assortiment`}>{t("Bekijk ons visassortiment")}</Link></div></div>
      <Image src="/images/editorial/kibbeling.webp" alt={t("Krokante kibbeling met ravigotesaus — serveerinspiratie bij onze viskraam")} width={1400} height={933} sizes="(max-width: 800px) 100vw, 50vw" fetchPriority="high" className="rounded-2xl" />
    </div></header>
    <Sectie grond="papier"><div className="grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
      <div><p className="kapitaal mb-3">{t("Vis voor uw vrijdagavond")}</p><h2 className="text-3xl mb-5">{t("Van boodschappen naar een goed avondeten")}</h2><div className="lees"><p>{t("Zoekt u een viswinkel in Voorschoten? Onze wekelijkse kraam staat op de parkeerplaats bij Hoogvliet. U hoeft niet vroeg op de dag te komen: tot 17:30 kunt u nog vis uitzoeken voor de avond.")}</p><p>{t("Zalm uit de oven, gebakken kabeljauw of een snelle maaltijd met kibbeling: vertel ons wat u van plan bent. We denken mee over porties, bereiding en wat er vandaag het mooist ligt.")}</p><p>{t("Op andere dagen bent u welkom in onze")} <Link className="underline" href={`/${locale}/viswinkel-leiden`}>{t("viswinkel in Leiden")}</Link>{t(". Bekijk de")} <Link className="underline" href={`/${locale}/bezoek-ons`}>{t("locaties en openingstijden")}</Link> {t("voor alle verkooppunten.")}</p></div></div>
      <aside className="rounded-2xl p-7" style={{ background: "var(--lichtblauw)" }}><h2 className="text-xl mb-4">{t("Waar en wanneer?")}</h2><dl className="space-y-4"><div><dt className="kapitaal">{t("Locatie")}</dt><dd>{kraam.adres}<br />{kraam.postcode} {kraam.plaats}</dd></div><div><dt className="kapitaal">{t("Open")}</dt><dd>{t("Elke vrijdag 08:00–17:30")}</dd></div><div><dt className="kapitaal">{t("Een vraag?")}</dt><dd><a className="underline" href={`tel:${BEDRIJF.telefoon.e164}`}>{BEDRIJF.telefoon.weergave}</a></dd></div></dl><a className="knop knop-lijn mt-6" href={kraam.mapsUrl} target="_blank" rel="noopener noreferrer">{t("Bekijk de route →")}</a></aside>
    </div></Sectie>
    <Sectie grond="papier"><div className="grid md:grid-cols-3 gap-7"><div><p className="kapitaal mb-3">{t("Scherpe prijzen")}</p><h2 className="text-2xl mb-3">{t("Kies wat bij uw budget past")}</h2><p className="leading-relaxed">{t("Vraag naar de dagprijs en vertel voor hoeveel mensen u vis zoekt. We denken mee over de vissoort en hoeveelheid, zodat u gericht kunt kiezen.")}</p></div><div><p className="kapitaal mb-3">{t("Goede kwaliteit")}</p><h2 className="text-2xl mb-3">{t("Vis met aandacht uitgezocht")}</h2><p className="leading-relaxed">{t("Onze VÅRLAKS-zalm is een favoriet. Liever Hollandse garnalen, haring of een andere filet? Vraag wat er die vrijdag ligt en welke bereiding erbij past.")}</p><Link className="inline-block mt-4 underline" href={`/${locale}/biologische-vis`}>{t("Onze vis en keurmerken →")}</Link></div><div><p className="kapitaal mb-3">{t("Persoonlijk advies")}</p><h2 className="text-2xl mb-3">{t("Zoekt u iets speciaals?")}</h2><p className="leading-relaxed">{t("Stuur ons uw wensen via WhatsApp en vermeld dat u vrijdag in Voorschoten wilt ophalen. We bespreken wat mogelijk is, de hoeveelheid en de prijs. Alleen visschalen bestelt u online.")}</p><a className="inline-block mt-4 underline font-semibold" href={contact.href}>{t("Vraag via WhatsApp →")}</a></div></div></Sectie>
    <Sectie grond="zand"><h2 className="text-3xl mb-7">{t("Wat haalt u bij onze viskraam?")}</h2><div className="grid md:grid-cols-3 gap-6">{aanbod.map(p => <article key={p.slug} className="recipe-card"><Image src={p.src} alt={p.alt} width={1200} height={800} sizes="(max-width: 768px) 100vw, 33vw" className="w-full aspect-[3/2] object-cover" /><div className="recipe-card-body"><h3 className="text-xl mb-3">{p.title}</h3><p className="leading-relaxed mb-5">{p.text}</p><Link className="underline font-semibold" href={`/${locale}/assortiment/${p.slug}`}>{t("Bekijk de vis →")}</Link></div></article>)}</div><p className="mt-7 max-w-3xl">{t("Het aanbod wisselt met de vangst en levering. Bekijk het")} <Link className="underline" href={`/${locale}/assortiment`}>{t("assortiment")}</Link>{t(", onze")} <Link className="underline" href={`/${locale}/viskalender`}>{t("viskalender")}</Link> {t("of de")} <Link className="underline" href={`/${locale}/recepten`}>{t("visrecepten")}</Link> {t("voor inspiratie.")}</p></Sectie>
    <Sectie grond="papier"><p className="kapitaal mb-3">{t("Voor uw vrijdag in Voorschoten")}</p><h2 className="text-3xl mb-6">{t("Van vis uitzoeken naar iets lekkers op tafel")}</h2><p className="max-w-3xl mb-7 leading-relaxed">{t("Praktische tips voor een snelle maaltijd, vis uit de oven of een borrel met gasten. Zo kunt u gericht boodschappen doen en uw wensen met ons bespreken.")}</p><div className="grid md:grid-cols-3 gap-6">{blogPosts.filter(p => p.regio === "Voorschoten").map(p=>localizeBlog(p,locale)).map(post => <article key={post.slug} className="recipe-card"><Image src={post.fotoUrl} alt={post.fotoAlt} width={1200} height={800} sizes="(max-width: 768px) 100vw, 33vw" className="w-full aspect-[3/2] object-cover" /><div className="recipe-card-body"><h3 className="text-xl mb-3"><Link className="hover:underline" href={`/${locale}/blog/${post.slug}`}>{post.title}</Link></h3><p className="leading-relaxed mb-4">{post.excerpt}</p><Link className="underline font-semibold" href={`/${locale}/blog/${post.slug}`}>{t("Lees de tips →")}</Link></div></article>)}</div></Sectie>
    <Sectie grond="papier" smal><h2 className="text-3xl mb-6">{t("Vragen over vis kopen in Voorschoten")}</h2><Vragen vragen={FAQ} /></Sectie>
    <PaginaSlot titel={t("Vrijdag nog vis halen voor het avondeten?")} tekst={t("Kom langs bij Hoogvliet tussen 08:00 en 17:30. Zoekt u iets speciaals? Stuur ons een WhatsApp-bericht, dan kijken we wat mogelijk is. Alleen visschalen bestelt u online.")} knoppen={[{ label: t("Vraag via WhatsApp"), href: contact.href, extern: true }, { label: t("Bekijk de visschalen"), href: `/${locale}/visschalen`, soort: "lijn" }]} />
  </>;
}
