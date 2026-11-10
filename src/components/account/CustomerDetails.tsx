"use client";

import { useEffect, useRef, useState } from "react";
import { SignupVisitDetails } from "./SignupVisitDetails";

const labels = {
  nl:{close:"Sluiten",private:"Privé-e-mailadres",school:"School-e-mailadres",verified:"Bevestigd",unverified:"Niet bevestigd",missing:"Niet opgegeven",applications:"Aanvragen studentenkorting",none:"Er is nog geen studentenaanvraag ingediend.",pending:"Wacht op beoordeling",approved:"Goedgekeurd",rejected:"Afgewezen",schoolProof:"Schoolmail als bewijs",document:"Inschrijfbewijs als document",reviewed:"Beoordeeld",loading:"Klantgegevens laden…",error:"Klantgegevens konden niet worden geladen.",retry:"Opnieuw proberen"},
  en:{close:"Close",private:"Personal email",school:"School email",verified:"Verified",unverified:"Not verified",missing:"Not provided",applications:"Student discount applications",none:"No student application has been submitted.",pending:"Awaiting review",approved:"Approved",rejected:"Rejected",schoolProof:"School email as proof",document:"Enrolment document",reviewed:"Reviewed",loading:"Loading customer details…",error:"Could not load customer details.",retry:"Try again"},
  de:{close:"Schließen",private:"Private E-Mail-Adresse",school:"Schul-E-Mail-Adresse",verified:"Bestätigt",unverified:"Nicht bestätigt",missing:"Nicht angegeben",applications:"Anträge auf Studentenrabatt",none:"Es wurde noch kein Antrag eingereicht.",pending:"Prüfung ausstehend",approved:"Genehmigt",rejected:"Abgelehnt",schoolProof:"Schul-E-Mail als Nachweis",document:"Immatrikulationsnachweis",reviewed:"Geprüft",loading:"Kundendaten werden geladen…",error:"Kundendaten konnten nicht geladen werden.",retry:"Erneut versuchen"}
};
type Details = {
  person:{email:string;school_email:string|null;email_verified_at:string|null;school_email_verified_at:string|null};
  applications:{institution:string;education_level:string;study_city:string;eligibility_method:string;submitted_at:string;reviewed_at:string|null;status:"pending"|"approved"|"rejected"}[];
};

export function CustomerDetails({id,name,locale,onClose}:{id:string;name:string;locale:string;onClose:()=>void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [result,setResult] = useState<Details|null>(null);
  const [error,setError] = useState(false);
  const [attempt,retry] = useState(0);
  const t = labels[locale==="de"||locale==="en" ? locale : "nl"];
  const dates = new Intl.DateTimeFormat(locale,{timeZone:"Europe/Amsterdam",dateStyle:"medium",timeStyle:"short"});
  useEffect(()=>{
    const element=dialog.current;
    element?.showModal();
    return ()=>element?.close();
  },[]);
  useEffect(()=>{
    const controller=new AbortController();
    async function load() {
      try {
        const response=await fetch(`/api/members/admin/customers/${id}/details`,{method:"POST",credentials:"same-origin",cache:"no-store",signal:controller.signal});
        if(!response.ok) throw new Error("customer_unavailable");
        const data=await response.json() as Details;
        if(!controller.signal.aborted) setResult(data);
      } catch { if(!controller.signal.aborted) setError(true); }
    }
    void load();
    return ()=>controller.abort();
  },[id,attempt]);
  return <dialog ref={dialog} onCancel={onClose} aria-labelledby="customer-detail-name" className="fixed inset-0 m-auto max-h-[85dvh] w-[min(42rem,94vw)] overflow-y-auto rounded-xl bg-white p-5 text-slate-900 shadow-xl backdrop:bg-slate-900/50 sm:p-7">
    <div className="mb-4 flex items-start justify-between gap-3"><h2 id="customer-detail-name" className="text-2xl">{name}</h2><button type="button" className="knop knop-lijn" onClick={onClose}>{t.close}</button></div>
    {error ? <p role="alert">{t.error} <button type="button" className="underline" onClick={()=>{setError(false);retry(n=>n+1);}}>{t.retry}</button></p>
      : !result ? <p role="status">{t.loading}</p> : <>
        <dl className="grid gap-3 sm:grid-cols-2">{[
          [t.private,result.person.email,result.person.email_verified_at],
          [t.school,result.person.school_email,result.person.school_email_verified_at]
        ].map(([label,address,verified])=><div key={label}><dt className="font-semibold">{label}</dt>
          <dd className="break-all">{address || t.missing}</dd>
          {address && <dd className="text-sm">{verified ? `${t.verified} · ${dates.format(new Date(verified))}` : t.unverified}</dd>}
        </div>)}</dl>
        <section className="my-5 border-t border-sky-100 pt-3"><h3 className="text-lg">{t.applications}</h3>
          {result.applications.length===0 ? <p>{t.none}</p> : <ul>{result.applications.map((a,index)=><li key={index} className="mt-2">
            <p><strong>{t[a.status]}</strong> · {dates.format(new Date(a.submitted_at))}</p>
            <p>{[a.institution,a.education_level?.toUpperCase(),a.study_city].filter(Boolean).join(" · ")}</p>
            <p>{a.eligibility_method==="verified-school-email" ? t.schoolProof : t.document}</p>
            {a.reviewed_at && <p>{t.reviewed} · {dates.format(new Date(a.reviewed_at))}</p>}
          </li>)}</ul>}
        </section>
        <SignupVisitDetails email={result.person.email} locale={locale}/>
      </>}
  </dialog>;
}
