import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { Beeld } from "@/components/ui/Beeld";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }) { const {locale}=await params;const t=await getTranslations({locale,namespace:"site"});return paginaMetadata({locale,pad:"/ons-verhaal",title:t("storyTitle"),description:t("storyIntro"),geenIndex:false}); }
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; const t=await getTranslations({locale,namespace:"site"});const nav=await getTranslations({locale,namespace:"nav"});return <><PaginaKop label={t("brand")} titel={t("storyTitle")} intro={t("storyIntro")} kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:t("storyTitle")}]} />
<Sectie grond="papier"><div className="grid md:grid-cols-2 gap-12 items-center"><Beeld naam="historie1938"/><div><Kop label="1938" titel={t("brand")} intro={t("story1938")}/></div></div></Sectie>
<Sectie grond="zand"><div className="grid md:grid-cols-2 gap-12 items-center"><div><Kop label={t("today")} titel={t("locations")} intro={t("storyNow")}/><Link href={`/${locale}/bezoek-ons`} className="knop knop-navy">{t("visit")}</Link></div><Beeld naam="historieNu"/></div></Sectie><PaginaSlot titel={t("delivery")} tekst={t("deliveryDetail")} knoppen={[{label:nav("bestellen"),href:`/${locale}/bestellen`},{label:t("visit"),href:`/${locale}/bezoek-ons`,soort:"lijn"}]} /></>;}
