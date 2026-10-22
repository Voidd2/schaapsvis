-- Privacy-first, consent-gated aggregate usage counts. No visitor/session IDs,
-- query strings, referrers, user agents, or raw client addresses are persisted.
CREATE TABLE site_analytics_daily (
  day TEXT NOT NULL,
  event TEXT NOT NULL CHECK (event IN ('page_view', 'link_click')),
  path TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT '',
  count INTEGER NOT NULL DEFAULT 1 CHECK (count > 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (day, event, path, target)
);
CREATE INDEX site_analytics_daily_day ON site_analytics_daily(day DESC);
