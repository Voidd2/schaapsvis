CREATE TABLE IF NOT EXISTS varlaks_popup_v1 (
  exposure TEXT PRIMARY KEY,
  day TEXT NOT NULL,
  variant TEXT NOT NULL CHECK (variant IN ('a','b')),
  filled INTEGER NOT NULL DEFAULT 0 CHECK (filled IN (0,1)),
  acquired INTEGER NOT NULL DEFAULT 0 CHECK (acquired IN (0,1))
);
CREATE INDEX IF NOT EXISTS varlaks_popup_v1_day ON varlaks_popup_v1(day);
