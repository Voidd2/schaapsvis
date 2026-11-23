import { legacyVisitConsentVersion, maxVisitPages, signupVisitPath, visitConsentVersion, visitMinutes } from "./signup-visit-path.mjs";
import { journeySource } from "./journey-shared.mjs";

const GRANT = "sv-signup-visit-v1";
const INTENT = "sv-signup-visit-request";
const TRAIL = "sv-signup-visit-tab";
const ERASE = "sv-forget-visit:";
export const visitChanged = "sv-signup-visit-change";
type Grant = {token:string; expires:string; version:string};
type Trail = {token:string; pages:string[]; last:number; linkedUntil:number; captureId?:string; entryPath?:string; trafficSource?:string};
let pendingGrant: Promise<void> | undefined;

function readGrant(): Grant | null {
  try {
    const grant = JSON.parse(localStorage.getItem(GRANT) || "null");
    if (grant?.token && Date.parse(grant.expires) > Date.now()) {
      const version = grant.version ?? legacyVisitConsentVersion;
      if (version === legacyVisitConsentVersion || version === visitConsentVersion) return {...grant,version};
    }
    if (grant) localStorage.removeItem(GRANT);
  } catch { /* Storage can be disabled. */ }
  return null;
}
export function sharesVisit() { return Boolean(readGrant()); }

async function post(action:string, data:object) {
  const response = await fetch("/api/members/signup-visit/"+action, {method:"POST",credentials:"same-origin",
    headers:{"Content-Type":"application/json"},body:JSON.stringify(data),keepalive:true,cache:"no-store",
    signal:action === "grant" ? AbortSignal.timeout(4000) : undefined});
  if (!response.ok) throw new Error("visit_request_failed");
  return response.json();
}

export async function flushVisitErasures() {
  const pending = Object.keys(localStorage).filter(key=>key.startsWith(ERASE));
  await Promise.all(pending.map(async key=>{
    if (Number(localStorage.getItem(key)) > Date.now()) await post("forget",{token:key.slice(ERASE.length)});
    localStorage.removeItem(key);
  }));
}

export async function setVisitChoice(allow:boolean, requestedVersion = legacyVisitConsentVersion) {
  const old = readGrant();
  if (!allow) {
    localStorage.removeItem(INTENT);
    if (old) localStorage.setItem(ERASE+old.token,String(Date.parse(old.expires)));
    localStorage.removeItem(GRANT);
    sessionStorage.removeItem(TRAIL);
    window.dispatchEvent(new Event(visitChanged));
    await flushVisitErasures();
    return;
  }
  if (old && (old.version === requestedVersion || old.version === visitConsentVersion)) return;
  if (pendingGrant && localStorage.getItem(INTENT)) return pendingGrant;
  const request = obtainGrant(old,requestedVersion);
  pendingGrant = request;
  try {await request;} finally {if (pendingGrant === request) pendingGrant = undefined;}
}

async function obtainGrant(old: Grant | null, requestedVersion: string) {
  const intent = crypto.randomUUID();
  localStorage.setItem(INTENT,intent);
  const grant = await post("grant",{consent:true,version:requestedVersion,previousToken:old?.token});
  if (!grant.token) {
    if (localStorage.getItem(INTENT) === intent) localStorage.removeItem(INTENT);
    return; // Shop network is excluded.
  }
  if (localStorage.getItem(INTENT) !== intent) {
    // Two tabs can reconfirm the same unused legacy token. Only erase it if neither choice still uses it.
    if (grant.token === old?.token && (localStorage.getItem(INTENT) || readGrant()?.token === grant.token)) return;
    localStorage.setItem(ERASE+grant.token,String(Date.parse(grant.expires)));
    await flushVisitErasures();
    return;
  }
  if (old && old.version !== grant.version) sessionStorage.removeItem(TRAIL);
  localStorage.setItem(GRANT, JSON.stringify({token:grant.token, expires:grant.expires, version:grant.version}));
  localStorage.removeItem(INTENT);
  window.dispatchEvent(new Event(visitChanged));
}

function trailFor(grant:Grant): Trail {
  const trail = JSON.parse(sessionStorage.getItem(TRAIL) || "null");
  if (trail?.token === grant.token && Date.now()-trail.last < visitMinutes*60000) return trail;
  return {token:grant.token, pages:[],last:0,linkedUntil:0};
}

export function recordVisitPage(pathname:string) {
  try {
    const grant = readGrant();
    if (!grant) { sessionStorage.removeItem(TRAIL); return; }
    const path = signupVisitPath(pathname);
    if (!path) return;
    const trail = trailFor(grant);
    if (!trail.entryPath && !trail.pages.length) {
      trail.entryPath = path;
      if (grant.version === visitConsentVersion) trail.trafficSource = journeySource(window.location.href,document.referrer,window.location.origin);
    }
    if (trail.pages.at(-1) === path) return;
    trail.pages = [...trail.pages, path].slice(-maxVisitPages);
    trail.last = Date.now();
    sessionStorage.setItem(TRAIL,JSON.stringify(trail));
    if (trail.captureId && trail.linkedUntil > Date.now()) void post("page",{token:grant.token,captureId:trail.captureId,consent:true,version:grant.version,path}).catch(()=>{});
  } catch { /* Optional measurements must not interrupt browsing. */ }
}

export async function visitAtSignup() {
  try {
    // A visitor may submit the form while their explicit cookie choice is being saved.
    await pendingGrant?.catch(()=>undefined);
    const grant = readGrant();
    if (!grant) return;
    const signupPath = signupVisitPath(window.location.pathname);
    if (signupPath) recordVisitPage(signupPath);
    const trail = trailFor(grant);
    // Private pages never enter the trail, including when the visitor registers directly from an account page.
    return {token:grant.token,captureId:crypto.randomUUID(),version:grant.version,pages:trail.pages,
      entryPath:trail.entryPath, signupPath:signupPath || undefined,
      ...(grant.version === visitConsentVersion && {trafficSource:trail.trafficSource})};
  } catch { return; }
}

export function signupVisitComplete(visit:Awaited<ReturnType<typeof visitAtSignup>>) {
  try {
    const grant = readGrant();
    if (!grant || !visit || visit.token !== grant.token) return;
    const trail = trailFor(grant);
    trail.captureId=visit.captureId;
    trail.linkedUntil=Date.now()+visitMinutes*60000;
    sessionStorage.setItem(TRAIL,JSON.stringify(trail));
  } catch { /* Signup itself is already saved. */ }
}
