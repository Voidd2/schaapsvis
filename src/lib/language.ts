export type SiteLanguage = "nl" | "en" | "de";
export function siteLanguage(locale:string):SiteLanguage {
 if(locale==="nl"||locale==="en"||locale==="de")return locale;
 throw new Error(`Unsupported language: ${locale}`);
}
