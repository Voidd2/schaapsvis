import { notFound } from "next/navigation";import { getTranslations } from "next-intl/server";import { paginaMetadata, LOCALES } from "@/lib/seo";import { GEMEENTEN,gemeenteBySlug } from "@/lib/bezorging";import { DeliveryPage } from "@/components/shared/DeliveryPage";
type Props={params:Promise<{locale:string;gemeente:string}>};
export function generateStaticParams(){return LOCALES.flatMap(locale=>GEMEENTEN.map(g=>({locale,gemeente:g.slug})));}
export async function generateMetadata({params}:Props){const {locale,gemeente}=await params;const g=gemeenteBySlug(gemeente);if(!g)notFound();const t=await getTranslations({locale,namespace:"site"});return paginaMetadata({locale,pad:`/bezorgen/${g.slug}`,title:t("deliveryPlace",{plaats:g.naam}),description:t("placeIntro",{plaats:g.naam})});}
export default async function Page({params}:Props){const {locale,gemeente}=await params;const g=gemeenteBySlug(gemeente);if(!g)notFound();return <DeliveryPage locale={locale} gemeente={g}/>;}
