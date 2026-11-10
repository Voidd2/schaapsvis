import { analyticsConsentKey, journeyVersion, journeyIdleMs, journeyMaxMs, journeyMaxPages, journeyPath, journeySource, journeySnapshot, validJourneyId } from "./journey-shared.mjs";

const key = "sv-journey-tab-v1", eraseKey = "sv-journey-erase-v1";
let session = null, currentPath = "", clockAt = 0, visible = false;
export function allowsJourney() {
  try { return localStorage.getItem(analyticsConsentKey) === "accepted"; } catch { return false; }
}
function persist() { try { if (session) sessionStorage.setItem(key,JSON.stringify(session)); } catch { /* Optional. */ } }
function elapsed() {
  const now=Date.now();
  if (session && visible && clockAt && allowsJourney()) session.visibleMs=Math.min(journeyMaxMs,session.visibleMs+Math.max(0,Math.min(30000,now-clockAt)));
  clockAt=now;
}
function getSession() {
  if (!allowsJourney() || !journeyPath(currentPath)) return null;
  const now=Date.now();
  if (!session) try {
    const saved=JSON.parse(sessionStorage.getItem(key)||"null");
    if (saved && journeySnapshot({...saved,consent:true,version:journeyVersion})) session=saved;
  } catch { /* Start a fresh visit when browser storage is unavailable. */ }
  if (!session || now-session.last>journeyIdleMs || now-session.started>journeyMaxMs) {
    session={id:crypto.randomUUID(),seq:0,source:journeySource(location.href,document.referrer,location.origin),pages:[],lastPage:currentPath,
      views:0,clicks:0,visibleMs:0,emailEntered:false,draftSaved:false,regionSelected:false,subscribed:false,signupError:false,contact:false,started:now,last:now};
    clockAt=now;
  }
  if (session.lastPage!==currentPath || !session.pages.length) {
    if (session.pages.length<journeyMaxPages) session.pages.push(currentPath);
    session.views++;
    session.lastPage=currentPath;
  }
  session.last=now;
  return session;
}
function send(beacon=false) {
  if (!allowsJourney() || !journeyPath(currentPath)) return;
  elapsed();
  const s=getSession();
  if (!s || s.excluded) return;
  s.seq++;persist();
  const data=journeySnapshot({...s,consent:true,version:journeyVersion});
  if (!data) return;
  const body=JSON.stringify({...data,consent:true,version:journeyVersion});
  try { if (beacon && navigator.sendBeacon?.("/api/members/analytics/visits",new Blob([body],{type:"application/json"}))) return; } catch { /* Fall back to fetch. */ }
  void fetch("/api/members/analytics/visits",{method:"POST",headers:{"Content-Type":"application/json"},body,keepalive:true,credentials:"same-origin"})
    .then(async response=>{if(response.ok && (await response.json()).excluded && session?.id===s.id){s.excluded=true;persist();}}).catch(()=>{});
}

export function recordJourneyStep(step) {
  if (!["emailEntered","draftSaved","regionSelected","subscribed","signupError"].includes(step)) return;
  try {
    if (!allowsJourney() || !journeyPath(location.pathname)) return;
    currentPath=location.pathname;
    const s=getSession();
    if (!s || s[step]) return;
    s[step]=true;
    if (["draftSaved","subscribed"].includes(step)) s.emailEntered=true;
    send();
  } catch { /* Signup must never depend on analytics. */ }
}

export async function flushJourneyErasures() {
  try {
    const pending=JSON.parse(localStorage.getItem(eraseKey)||"{}");
    const completed=[];
    for (const [id,expiry] of Object.entries(pending)) {
      if (!validJourneyId(id) || Number(expiry)<Date.now()) {completed.push(id);continue;}
      const r=await fetch("/api/members/analytics/visits/forget",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id}),keepalive:true});
      if(r.ok) completed.push(id);
    }
    // Another tab may have queued an erasure while these requests were in flight.
    const current=JSON.parse(localStorage.getItem(eraseKey)||"{}");
    for (const id of completed) if(current[id]===pending[id]) delete current[id];
    localStorage.setItem(eraseKey,JSON.stringify(current));
  } catch { /* Retry on next load or online event. */ }
}

export function revokeJourney() {
  try {
    const old=session || JSON.parse(sessionStorage.getItem(key)||"null");
    if (old && validJourneyId(old.id)) {
      const pending=JSON.parse(localStorage.getItem(eraseKey)||"{}");
      pending[old.id]=Date.now()+30*86400000;
      localStorage.setItem(eraseKey,JSON.stringify(pending));
    }
    sessionStorage.removeItem(key);
  } catch { /* Optional browser storage. */ }
  session=null;visible=false;clockAt=0;
  void flushJourneyErasures();
}

export function observeJourney(path) {
  currentPath=path;
  void flushJourneyErasures();
  if (!allowsJourney() || !journeyPath(path)) return ()=>{};
  visible=document.visibilityState==="visible";clockAt=Date.now();
  send();
  const visibility=()=>{elapsed();visible=document.visibilityState==="visible";send(!visible);};
  const hide=()=>{elapsed();visible=false;send(true);};
  const show=()=>{visible=document.visibilityState==="visible";clockAt=Date.now();send();};
  const input=event=>{
    const field=event.target;
    if(field instanceof HTMLInputElement && field.name==="email" && field.type==="email" && field.value && field.validity.valid && field.closest("form[data-newsletter-form]")) recordJourneyStep("emailEntered");
  };
  const click=event=>{
    const anchor=event.target instanceof Element ? event.target.closest("a[href]") : null;
    if(!anchor) return;
    const s=getSession();if(!s)return;
    s.clicks++;
    if(/^(tel:|mailto:|https:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)(\/|$))/.test(anchor.href))s.contact=true;
    send();
  };
  const timer=setInterval(()=>{if(document.visibilityState==="visible")send();},15000);
  document.addEventListener("visibilitychange",visibility);
  document.addEventListener("input",input,true);
  document.addEventListener("click",click,true);
  window.addEventListener("pagehide",hide);
  window.addEventListener("pageshow",show);
  return ()=>{
    clearInterval(timer);send(true);visible=false;clockAt=0;
    document.removeEventListener("visibilitychange",visibility);
    document.removeEventListener("input",input,true);
    document.removeEventListener("click",click,true);
    window.removeEventListener("pagehide",hide);
    window.removeEventListener("pageshow",show);
  };
}
