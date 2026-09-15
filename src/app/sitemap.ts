import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { products } from "@/lib/assortiment-data";
import { recepten } from "@/lib/recepten";
import { GEMEENTEN } from "@/lib/bezorging";
import { BEDRIJF } from "@/lib/bedrijf";
import { LOCALES } from "@/lib/seo";
import { siteOpSlot } from "@/lib/siteAccess";
export const dynamic="force-dynamic";
const modified=new Date("2026-09-15");
export default function sitemap():MetadataRoute.Sitemap{
 if(siteOpSlot() || process.env.VERCEL_ENV==="preview")return [];
 const base=BEDRIJF.domein;
 const paths=["","/bezorgen","/visschalen","/bestellen","/assortiment","/bezoek-ons","/biologische-vis","/varlaks","/ons-verhaal","/contact","/viswinkel-leiden","/marktkraam-leiden","/viswinkel-voorschoten",...GEMEENTEN.map(g=>`/bezorgen/${g.slug}`),...products.map(p=>`/assortiment/${p.slug}`)];
 const pages:MetadataRoute.Sitemap=paths.flatMap(pad=>LOCALES.map(locale=>({url:`${base}/${locale}${pad}`,lastModified:modified,alternates:{languages:{...Object.fromEntries(LOCALES.map(l=>[l,`${base}/${l}${pad}`])),"x-default":`${base}/nl${pad}`}}})));
 for(const pad of ["/blog","/recepten","/viskalender","/too-good-to-go",...blogPosts.map(p=>`/blog/${p.slug}`),...recepten.map(r=>`/recepten/${r.slug}`)])pages.push({url:`${base}/nl${pad}`,lastModified:modified});
 return pages;
}
