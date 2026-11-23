ALTER TABLE signup_visits ADD COLUMN traffic_source TEXT
  CHECK (traffic_source IN ('facebook', 'instagram', 'google', 'bing', 'newsletter', 'other', 'direct_unknown'));
ALTER TABLE signup_visits ADD COLUMN entry_path TEXT;
ALTER TABLE signup_visits ADD COLUMN signup_path TEXT;
