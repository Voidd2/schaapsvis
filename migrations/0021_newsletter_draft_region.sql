-- Keep the optional region on the same short-lived signup draft.
-- Choosing a region does not create or activate a marketing subscription.
ALTER TABLE newsletter_signup_drafts ADD COLUMN region_tag TEXT
  CHECK (region_tag IS NULL OR region_tag IN ('leiden', 'voorschoten', 'wassenaar', 'leidschendam', 'regio-071', 'elders'));
