-- Let subscribers choose which local area they want offers for.
-- Existing subscribers remain valid and can have no tag until they update it.
ALTER TABLE newsletter_subscriptions
  ADD COLUMN region_tag TEXT
  CHECK (region_tag IS NULL OR region_tag IN ('leiden', 'voorschoten', 'anders'));

