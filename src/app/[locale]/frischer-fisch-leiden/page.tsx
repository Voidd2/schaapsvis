import { permanentRedirect } from "next/navigation";
import { siteLanguage } from "@/lib/language";
// Consolidate the former German-only duplicate onto the fully translated hub.
export default async function Page({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;
 permanentRedirect(`/${siteLanguage(locale)}/viswinkel-leiden`);
}
