import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { Locations } from "@/components/shared/Locations";
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }) { const {locale}=await params;const t=await getTranslations({locale,namespace:"site"});return paginaMetadata({locale,pad:"/marktkraam-leiden",title:t("localMarketTitle"),description:t("localMarketIntro"),geenIndex:false}); }
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; const t=await getTranslations({locale,namespace:"site"});const nav=await getTranslations({locale,namespace:"nav"});return <><PaginaKop label={t("brand")} titel={t("localMarketTitle")} intro={t("localMarketIntro")} kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:t("localMarketTitle")}]} /><Sectie grond="papier"><Locations locale={locale} only="markt"/><p className="mt-8">{t("pickupText")}</p></Sectie><Sectie grond="zand"><Kop titel={t("catalogTitle")} intro={t("catalogIntro")}/><Link href={`/${locale}/assortiment`} className="knop knop-navy">{nav("assortiment")}</Link></Sectie><PaginaSlot titel={t("delivery")} tekst={t("deliveryDetail")} knoppen={[{label:nav("bestellen"),href:`/${locale}/bestellen`},{label:t("visit"),href:`/${locale}/bezoek-ons`,soort:"lijn"}]} /></>;}
