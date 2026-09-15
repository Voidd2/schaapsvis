import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Sectie } from "@/components/ui/Sectie";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { AssortimentFilter } from "./AssortimentFilter";
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;const t=await getTranslations({locale,namespace:"site"});return paginaMetadata({locale,pad:"/assortiment",title:t("catalogTitle")+" | Schaap’s Vishandel Leiden",description:t("catalogIntro")});}
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;const t=await getTranslations({locale,namespace:"site"});const nav=await getTranslations({locale,namespace:"nav"});return <>
<PaginaKop label={t("brand")} titel={t("catalogTitle")} intro={t("catalogIntro")} kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:nav("assortiment")}]}/>
<Sectie grond="papier"><Suspense fallback={<p>{t("catalogTitle")}</p>}><AssortimentFilter/></Suspense></Sectie>
<PaginaSlot titel={t("delivery")} tekst={t("deliveryDetail")} knoppen={[{label:nav("bestellen"),href:`/${locale}/bestellen`},{label:t("visit"),href:`/${locale}/bezoek-ons`,soort:"lijn"}]}/></>;}
