import { getTranslations } from "next-intl/server";import { paginaMetadata } from "@/lib/seo";import { DeliveryPage } from "@/components/shared/DeliveryPage";
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }) { const {locale}=await params;const t=await getTranslations({locale,namespace:"site"});return paginaMetadata({locale,pad:"/bezorgen",title:t("deliveryTitle"),description:t("deliveryIntro"),geenIndex:false}); }

export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <DeliveryPage locale={locale} />;}
