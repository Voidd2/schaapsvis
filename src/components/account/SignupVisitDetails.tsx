"use client";
import {useEffect,useState} from "react";

const copy = {
  nl:{title:"Bezoek rond de inschrijving",region:"Zelf opgegeven regio",city:"Geschatte plaats op basis van IP",ip:"IP-adres bij inschrijving",pages:"Bezochte pagina’s, in volgorde",at:"Ingeschreven",empty:"Voor dit adres zijn geen persoonlijke bezoekgegevens beschikbaar.",missing:"Onbekend",loading:"Bezoekgegevens laden…",error:"Laden mislukt. Probeer het opnieuw.",retry:"Opnieuw proberen",erase:"Bezoekgegevens wissen",confirm:"De persoonlijke bezoekgegevens voor dit adres wissen?",other:"Elders",area:"Overig regio 071"},
  en:{title:"Visit around signup",region:"Self-reported area",city:"Estimated city based on IP",ip:"IP address at signup",pages:"Pages in the order visited",at:"Signed up",empty:"No personal visit data is available for this address.",missing:"Unknown",loading:"Loading visit…",error:"Could not load. Please try again.",retry:"Try again",erase:"Erase visit data",confirm:"Erase the personal visit data for this address?",other:"Elsewhere",area:"Elsewhere in area 071"},
  de:{title:"Besuch bei der Anmeldung",region:"Selbst angegebene Region",city:"Anhand der IP geschätzter Ort",ip:"IP-Adresse bei der Anmeldung",pages:"Besuchte Seiten in zeitlicher Reihenfolge",at:"Angemeldet",empty:"Für diese Adresse liegen keine persönlichen Besuchsdaten vor.",missing:"Unbekannt",loading:"Besuchsdaten werden geladen…",error:"Laden fehlgeschlagen. Bitte erneut versuchen.",retry:"Erneut versuchen",erase:"Besuchsdaten löschen",confirm:"Persönliche Besuchsdaten für diese Adresse löschen?",other:"Andernorts",area:"Übriges Gebiet 071"}
};
type Details = {region:string|null;visit:null|{ip:string;city:string|null;signup_at:string;pages:string[]}};

async function load(email:string, signal?:AbortSignal, action?:string):Promise<Details> {
  const response = await fetch("/api/members/admin/signup-visit",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",cache:"no-store",body:JSON.stringify({email,action}),signal});
  if (!response.ok) throw new Error("visit_details_unavailable");
  return response.json();
}

export function SignupVisitDetails({email,locale}:{email:string;locale:string}) {
  const t = copy[locale==="de" || locale==="en" ? locale : "nl"];
  const [data,setData] = useState<Details|null>(null);
  const [error,setError] = useState(false);
  const [attempt,retry] = useState(0);
  useEffect(()=>{
    const controller=new AbortController();
    load(email,controller.signal).then(result=>{if (!controller.signal.aborted) setData(result);})
      .catch(()=>{if (!controller.signal.aborted) setError(true);});
    return ()=>controller.abort();
  },[email,attempt]);
  async function erase() {
    if (!window.confirm(t.confirm)) return;
    try {setData(await load(email,undefined,"erase"));} catch {setError(true);}
  }
  const region = data?.region;
  return <section className="my-2 rounded-lg bg-sky-50 p-4">
    <h2 className="text-lg">{t.title}</h2>
    {error ? <p role="alert">{t.error} <button type="button" className="underline" onClick={()=>{setError(false);retry(n=>n+1);}}>{t.retry}</button></p> : !data ? <p role="status">{t.loading}</p> : <>
      <p><strong>{t.region}</strong> · {region==="elders" ? t.other : region==="regio-071" ? t.area : region ? region[0].toUpperCase()+region.slice(1) : t.missing}</p>
      {data.visit ? <>
        <p>{locale==="en" ? "This is the browser visit in which this email was entered. The estimated city refers to the network used." : locale==="de" ? "Angezeigt wird der Besuch, bei dem diese Adresse eingegeben wurde. Der geschätzte Ort bezieht sich auf das verwendete Netz." : "Dit is het bezoek waarin het adres is ingevuld. De geschatte plaats hoort bij het gebruikte netwerk."}</p>
        <p><strong>{t.at}</strong> · {new Intl.DateTimeFormat(locale,{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Amsterdam"}).format(new Date(data.visit.signup_at))}</p>
        <p><strong>{t.ip}</strong> · <span className="break-all">{data.visit.ip}</span></p>
        <p><strong>{t.city}</strong> · {data.visit.city || t.missing}</p>
        <h3 className="mt-3 font-semibold">{t.pages}</h3><ol className="list-decimal pl-6">{data.visit.pages.map((page,index)=><li className="break-all" key={index}>{page}</li>)}</ol>
        <button type="button" className="mt-3 underline" onClick={erase}>{t.erase}</button>
      </> : <p>{t.empty}</p>}
    </>}
  </section>;
}
