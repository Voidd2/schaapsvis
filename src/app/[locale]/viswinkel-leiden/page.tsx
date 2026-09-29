import type { Metadata } from "next";
import { LocalLandingPage } from "@/components/LocalLandingPage";
import { localPageCopy } from "@/lib/local-pages-copy";
import { paginaMetadata } from "@/lib/seo";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale}=await params,c=localPageCopy("viswinkel-leiden",locale);return paginaMetadata({locale,pad:"/viswinkel-leiden",title:c.meta,description:c.description,image:"/images/editorial/kibbeling.webp"});}
export default async function Page({params}:Props){const {locale}=await params;return <LocalLandingPage kind="viswinkel-leiden" locale={locale}/>;}
