import { pagePath } from "@/lib/list-page";
export function PageLinks({ path, page, last, locale }: {path:string;page:number;last:number;locale:string}) {
 const label = locale === "de" ? "Seite" : locale === "en" ? "Page" : "Pagina";
 return last > 1 && <nav className="list-pages" aria-label={label}><span>{label}</span>{Array.from({length:last},(_,i)=><a key={i} href={pagePath(path,i+1)+"#lijst"} aria-label={label+" "+(i+1)} aria-current={page===i+1?"page":undefined}>{i+1}</a>)}</nav>;
}
