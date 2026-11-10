import { journeySnapshot, journeyIdleMs } from "../../../src/lib/journey-shared.mjs";

export async function storeJourney(env, hash, body, now = new Date()) {
  const s = journeySnapshot(body);
  if (!s) return false;
  const at = now.toISOString(), expires = new Date(+now + 30 * 86400000).toISOString();
  await env.DB.prepare(`INSERT INTO visitor_journeys
    (session_hash,started_at,last_seen_at,expires_at,seq,source,landing,last_page,pages,views,clicks,visible_ms,email_entered,draft_saved,region_selected,subscribed,signup_error,contact)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(session_hash) DO UPDATE SET
      seq=excluded.seq,last_seen_at=excluded.last_seen_at,last_page=excluded.last_page,pages=excluded.pages,
      views=MAX(visitor_journeys.views,excluded.views),clicks=MAX(visitor_journeys.clicks,excluded.clicks),
      visible_ms=MAX(visitor_journeys.visible_ms,excluded.visible_ms),
      email_entered=MAX(visitor_journeys.email_entered,excluded.email_entered),draft_saved=MAX(visitor_journeys.draft_saved,excluded.draft_saved),
      region_selected=MAX(visitor_journeys.region_selected,excluded.region_selected),subscribed=MAX(visitor_journeys.subscribed,excluded.subscribed),
      signup_error=MAX(visitor_journeys.signup_error,excluded.signup_error),contact=MAX(visitor_journeys.contact,excluded.contact)
    WHERE visitor_journeys.revoked=0 AND excluded.seq>visitor_journeys.seq AND visitor_journeys.expires_at>excluded.last_seen_at`)
    .bind(hash,at,at,expires,s.seq,s.source,s.pages[0],s.lastPage,JSON.stringify(s.pages),s.views,s.clicks,s.visibleMs,
      +s.emailEntered,+s.draftSaved,+s.regionSelected,+s.subscribed,+s.signupError,+s.contact).run();
  return true;
}

export async function forgetJourney(env, hash, now = new Date()) {
  // A tombstone prevents delayed in-flight updates from recreating a revoked visit.
  await env.DB.prepare(`INSERT INTO visitor_journeys(session_hash,started_at,last_seen_at,expires_at,revoked)
    VALUES (?,?,?,?,1) ON CONFLICT(session_hash) DO UPDATE SET revoked=1,source='',landing='',last_page='',pages='[]',
    views=0,clicks=0,visible_ms=0,email_entered=0,draft_saved=0,region_selected=0,subscribed=0,signup_error=0,contact=0`)
    .bind(hash,now.toISOString(),now.toISOString(),new Date(+now+30*86400000).toISOString()).run();
}

export async function journeyReport(env, days, now = new Date()) {
  const since = new Date(+now-(Math.min(days,30)-1)*86400000).toISOString().slice(0,10);
  const endedBefore = new Date(+now-journeyIdleMs).toISOString();
  const where = `FROM visitor_journeys WHERE revoked=0 AND started_at>=? AND expires_at>?`;
  const metrics = `COUNT(*) AS visits,COALESCE(SUM(email_entered),0) AS emailEntered,COALESCE(SUM(draft_saved),0) AS draftSaved,
    COALESCE(SUM(region_selected),0) AS regionSelected,COALESCE(SUM(subscribed),0) AS subscribed,
    COALESCE(SUM(signup_error),0) AS signupErrors,COALESCE(SUM(contact),0) AS contacts,
    COALESCE(AVG(visible_ms),0) AS averageMs,
    COALESCE(SUM(CASE WHEN last_seen_at<? THEN 1 ELSE 0 END),0) AS ended,
    COALESCE(SUM(CASE WHEN last_seen_at<? AND views=1 AND visible_ms<10000 AND clicks=0 AND email_entered=0 AND subscribed=0 AND contact=0 THEN 1 ELSE 0 END),0) AS shortExits`;
  const [summary,sources,landings,recent] = await env.DB.batch([
    env.DB.prepare(`SELECT ${metrics} ${where}`).bind(endedBefore,endedBefore,since,now.toISOString()),
    env.DB.prepare(`SELECT source,${metrics} ${where} GROUP BY source ORDER BY visits DESC,source`).bind(endedBefore,endedBefore,since,now.toISOString()),
    env.DB.prepare(`SELECT landing,${metrics} ${where} GROUP BY landing ORDER BY visits DESC,landing LIMIT 30`).bind(endedBefore,endedBefore,since,now.toISOString()),
    env.DB.prepare(`SELECT started_at,last_seen_at,source,landing,last_page,pages,views,clicks,visible_ms,email_entered,draft_saved,region_selected,subscribed,signup_error,contact,
      last_seen_at<? AS ended ${where} ORDER BY started_at DESC,session_hash LIMIT 100`).bind(endedBefore,since,now.toISOString()),
  ]);
  return {since,retentionDays:30,summary:summary.results[0],sources:sources.results,landings:landings.results,
    recent:recent.results.map(row=>({...row,pages:JSON.parse(row.pages)}))};
}
