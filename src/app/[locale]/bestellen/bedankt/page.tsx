import { getTranslations } from "next-intl/server";
import { PaginaKop } from "@/components/ui/PaginaKop";
import { Sectie } from "@/components/ui/Sectie";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }) { const {locale}=await params;const t=await getTranslations({locale,namespace:"site"});return paginaMetadata({locale,pad:"/bestellen/bedankt",title:t("thankTitle"),description:t("thankText"),geenIndex:true}); }
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; const t=await getTranslations({locale,namespace:"site"});return <><PaginaKop label={t("brand")} titel={t("thankTitle")} intro={t("thankText")} kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:t("thankTitle")}]} /><Sectie grond="papier"><a className="knop knop-rood" href={`tel:${BEDRIJF.telefoon.e164}`}>{t("call")} {BEDRIJF.telefoon.weergave}</a></Sectie></>;}
