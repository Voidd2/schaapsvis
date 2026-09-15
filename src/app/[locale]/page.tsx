import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { Beeld } from "@/components/ui/Beeld";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { Recommendations } from "@/components/shared/Recommendations";import { Locations } from "@/components/shared/Locations";
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;const t=await getTranslations({locale,namespace:"meta"});return paginaMetadata({locale,pad:"/",title:t("homeTitle"),description:t("homeDesc")});}
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; const t=await getTranslations({locale,namespace:"site"});const nav=await getTranslations({locale,namespace:"nav"});return <>
<Sectie grond="papier"><div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"><div><p className="kapitaal mb-4">{t("brand")} · Herenstraat 48</p><h1 className="text-[2.3rem] md:text-[3.4rem] leading-[1.08] mb-6">{t("storyTitle")}</h1><p className="text-lg leading-relaxed mb-8">{t("homeIntro")}</p><div className="flex flex-wrap gap-3"><Link href={`/${locale}/assortiment`} className="knop knop-rood">{nav("assortiment")}</Link><Link href={`/${locale}/bezoek-ons`} className="knop knop-lijn">{t("visit")}</Link></div></div><Beeld naam="winkelGevel" prioriteit/></div></Sectie>
<Recommendations locale={locale}/>
<Sectie grond="papier"><div className="grid md:grid-cols-2 gap-12 items-center"><Beeld naam="historie1938"/><div><Kop label="1938" titel={t("brand")} intro={t("homeStory")}/><Link href={`/${locale}/ons-verhaal`} className="font-semibold underline underline-offset-4">{nav("verhaal")} →</Link></div></div></Sectie>
<Sectie grond="zand"><div className="grid md:grid-cols-2 gap-12 items-center"><div><Kop titel={t("friedTitle")} intro={t("friedText")}/><p className="mb-6">{t("storeOnly")}</p><Link href={`/${locale}/bezoek-ons`} className="knop knop-navy">{t("visit")}</Link></div><Beeld naam="gebakkenVis"/></div></Sectie>
<Sectie grond="navy"><Kop donker label={t("delivery")} titel={t("deliveryTitle")} intro={t("deliveryDetail")}/><Link href={`/${locale}/bezorgen`} className="knop knop-lijn-licht">{nav("bezorgen")} →</Link></Sectie>
<Sectie grond="papier"><div className="grid md:grid-cols-2 gap-12"><div><Kop titel={t("bioTitle")} intro={t("bioIntro")}/><Link href={`/${locale}/biologische-vis`} className="font-semibold underline underline-offset-4">{t("details")} →</Link></div><div><Kop titel={t("reviewTitle")} intro={t("reviewText")}/><a href={BEDRIJF.maps.profiel} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">{t("reviews")} →</a></div></div></Sectie>
<Sectie grond="zand"><Kop titel={t("locations")} intro={t("locationsIntro")}/><Locations locale={locale}/></Sectie><PaginaSlot titel={t("delivery")} tekst={t("deliveryDetail")} knoppen={[{label:nav("bestellen"),href:`/${locale}/bestellen`},{label:t("visit"),href:`/${locale}/bezoek-ons`,soort:"lijn"}]} /></>;}

