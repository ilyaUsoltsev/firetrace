-- migrate:up

CREATE TABLE replays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    events JSONB NOT NULL,
    session_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- migrate:down

DROP TABLE IF EXISTS replays;

