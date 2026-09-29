import { BEDRIJF } from "@/lib/bedrijf";
import { blogCopy } from "@/lib/blog-copy";
/** No collection of email addresses until a real newsletter service is configured. */
export function NewsletterSignup({compact=false,locale="nl"}:{compact?:boolean;locale?:string}){
 const c=blogCopy(locale);
 return <a className={compact?"text-sm font-semibold underline underline-offset-4":"knop knop-navy"} href={BEDRIJF.socials.facebook} target="_blank" rel="noopener noreferrer">{c.follow} ↗</a>;
}
