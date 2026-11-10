import assert from "node:assert/strict";
import { journeySnapshot, journeySource, journeyPath, journeyVersion } from "../../src/lib/journey-shared.mjs";
import { storeJourney, forgetJourney, journeyReport } from "./src/journeys.mjs";

export async function checkJourneys({call,sqlite,env,sessionCookie,testDigest}) {
  const base={id:crypto.randomUUID(),consent:true,version:journeyVersion,seq:1,source:"facebook",pages:["/nl/varlaks"],lastPage:"/nl/varlaks",views:1,clicks:0,visibleMs:0};
  const post=(body,options={})=>call("/api/members/analytics/visits",{method:"POST",body,...options});
  for(const path of ["/nl/account","/nl/beheer/overzicht","/nl/bestellen","/nl/studentenkorting","/nl/varlaks?email=private@example.test","/nl/varlaks#private","/nl/assortiment/a%40b","https://bad.example/nl"]) {
    assert.equal(journeyPath(path),"",path);
    assert.equal(journeySnapshot({...base,pages:[path]}),null);
  }
  for(const path of ["/nl","/en/assortiment/kibbeling","/de/recepten/zalm","/nl/feestdagen/kerst","/nl/barbecue-gourmet"]) assert.equal(journeyPath(path),path);
  for(const [url,ref,expected] of [
    ["/nl?utm_source=facebook&utm_campaign=secret","","facebook"],
    ["/nl?utm_source=fb","","facebook"],
    ["/nl?utm_source=private@example.test","https://l.facebook.com/private?q=secret","facebook"],
    ["/nl","https://www.google.nl/search?q=private","google"],
    ["/nl","https://www.instagram.com/secret","instagram"],
    ["/nl","https://facebook.com.attacker.test/","other"],
    ["/nl","https://schaapsvishandel.nl/nl/account","direct_unknown"],
    ["/nl","","direct_unknown"],
  ]) assert.equal(journeySource(url,ref,env.SITE_ORIGIN),expected);
  assert.equal(journeySnapshot({...base,email:"secret@example.test"}).email,undefined,"ignore all raw form values");
  for(const change of [{consent:false},{version:"old"},{id:"bad"},{source:"secret@example.test"},{seq:0},{visibleMs:-1},{visibleMs:Infinity},{pages:Array(51).fill('/nl')},{views:0}]) {
    assert.equal((await post({...base,...change})).status,400);
  }
  assert.equal((await post(base,{headers:{Origin:"https://bad.example"}})).status,403);
  env.ANALYTICS_ENABLED="off";
  assert.equal((await post(base)).status,400);
  env.ANALYTICS_ENABLED="on";
  env.ANALYTICS_EXCLUDED_IP_HASH=await testDigest("192.0.2.17");
  assert.equal((await (await post(base,{headers:{"CF-Connecting-IP":"192.0.2.17"}})).json()).excluded,true);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM visitor_journeys").get().n,0);
  delete env.ANALYTICS_EXCLUDED_IP_HASH;
  assert.equal((await post({...base,email:"private@example.test",referrer:"https://facebook.com/private"})).status,202);
  const first=sqlite.prepare("SELECT * FROM visitor_journeys").get();
  assert.notEqual(first.session_hash,base.id,"server stores a keyed hash, not the browser identifier");
  assert.ok(!JSON.stringify(first).includes("private"));
  assert.equal((await post({...base,seq:3,pages:["/nl/varlaks","/nl/recepten"],lastPage:"/nl/recepten",views:2,visibleMs:32000,clicks:1,emailEntered:true,subscribed:true})).status,202);
  await post({...base,seq:2});await post(base);
  const updated=sqlite.prepare("SELECT * FROM visitor_journeys").get();
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM visitor_journeys").get().n,1,"replays and heartbeat updates are one visit");
  assert.equal(updated.last_page,"/nl/recepten");assert.equal(updated.visible_ms,32000);assert.equal(updated.subscribed,1);
  assert.equal(updated.started_at,first.started_at);assert.equal(updated.expires_at,first.expires_at,"updates never extend retention");
  const report=await (await call("/api/members/admin/analytics?days=90",{cookie:sessionCookie})).json();
  assert.equal(report.journeys.summary.visits,1);assert.equal(report.journeys.summary.subscribed,1);assert.equal(report.journeys.retentionDays,30);
  assert.equal(report.journeys.summary.shortExits,0);assert.equal(report.journeys.summary.ended,0,"new visits are not classified as exits");
  assert.equal(report.journeys.recent[0].session_hash,undefined,"admin output does not expose session identifiers");
  assert.equal((await call("/api/members/admin/analytics")).status,403);
  const forget=id=>call("/api/members/analytics/visits/forget",{method:"POST",body:{id}});
  assert.equal((await forget(base.id)).status,202);
  await post({...base,seq:99});
  const erased=sqlite.prepare("SELECT * FROM visitor_journeys").get();
  assert.equal(erased.revoked,1);assert.equal(erased.pages,"[]");assert.equal(erased.source,"");assert.equal(erased.subscribed,0);
  assert.equal((await journeyReport(env,30)).summary.visits,0,"revoked data is absent from totals and routes");
  const pendingId=crypto.randomUUID();await forget(pendingId);await post({...base,id:pendingId});
  assert.equal((await journeyReport(env,30)).summary.visits,0,"forget-before-collection also defeats late requests");

  // Fixed-time fixtures check conversion denominators, short exits and retention boundaries.
  sqlite.exec("DELETE FROM visitor_journeys");
  const now=new Date("2026-11-10T12:00:00.000Z"),old=new Date("2026-11-10T11:00:00.000Z");
  await storeJourney(env,"fixture-short",{...base,visibleMs:5000},old);
  await storeJourney(env,"fixture-active",{...base,source:"google",visibleMs:5000},now);
  await storeJourney(env,"fixture-converted",{...base,visibleMs:60000,emailEntered:true,draftSaved:true,regionSelected:true,subscribed:true},old);
  await storeJourney(env,"fixture-revoked",base,old);await forgetJourney(env,"fixture-revoked",now);
  await storeJourney(env,"fixture-expired",base,new Date("2026-10-01T12:00:00.000Z"));
  const fixed=await journeyReport(env,90,now);
  assert.equal(fixed.summary.visits,3);assert.equal(fixed.summary.ended,2);assert.equal(fixed.summary.shortExits,1);
  assert.equal(fixed.summary.subscribed,1);assert.equal(fixed.summary.averageMs,70000/3);
  assert.equal(fixed.sources.find(row=>row.source==="facebook").visits,2);
  assert.equal(fixed.landings[0].visits,3);
  assert.equal(fixed.recent.length,3);assert.equal(fixed.since,"2026-10-12");
  sqlite.exec("DELETE FROM visitor_journeys");
  console.log("Visitor journeys: consent, source sanitisation, deduplication, exclusion, reports and erasure passed.");
}
