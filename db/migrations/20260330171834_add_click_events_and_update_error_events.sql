-- migrate:up

ALTER TABLE error_events
  ADD COLUMN session_id TEXT,
  ADD COLUMN user_id TEXT;

CREATE INDEX idx_error_events_session_id
  ON error_events (session_id);

CREATE INDEX idx_error_events_user_id
  ON error_events (user_id);

CREATE TABLE click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id TEXT,
  event_name TEXT NOT NULL,
  page TEXT,
  element TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_click_events_session_id
  ON click_events (session_id);

CREATE INDEX idx_click_events_created_at
  ON click_events (created_at DESC);

-- migrate:down

DROP TABLE IF EXISTS click_events;

DROP INDEX IF EXISTS idx_error_events_user_id;
DROP INDEX IF EXISTS idx_error_events_session_id;

ALTER TABLE error_events
  DROP COLUMN IF EXISTS user_id,
  DROP COLUMN IF EXISTS session_id;
