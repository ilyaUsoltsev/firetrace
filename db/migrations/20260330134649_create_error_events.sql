-- migrate:up
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE error_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  level TEXT NOT NULL,
  service TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_error_events_created_at
  ON error_events (created_at DESC);

CREATE INDEX idx_error_events_level
  ON error_events (level);

CREATE INDEX idx_error_events_service
  ON error_events (service);

CREATE INDEX idx_error_events_payload
  ON error_events USING GIN (payload);


-- migrate:down

DROP TABLE IF EXISTS error_events;
DROP EXTENSION IF EXISTS pgcrypto;


