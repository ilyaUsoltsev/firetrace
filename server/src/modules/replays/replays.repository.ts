import { query } from '../../db/query';

export type NewReplay = {
  session_id: string;
  events: unknown;
};

export type ReplayRow = {
  id: string;
  session_id: string;
  events: unknown;
  created_at: string;
};

export async function selectRecentReplays(): Promise<ReplayRow[]> {
  const result = await query<ReplayRow>(
    `
    SELECT id, session_id, events, created_at
    FROM replays
    ORDER BY created_at DESC
    LIMIT 100
    `,
  );

  return result.rows;
}

export async function insertReplay(input: NewReplay): Promise<ReplayRow> {
  const result = await query<ReplayRow>(
    `
    INSERT INTO replays (session_id, events)
    VALUES ($1, $2)
    RETURNING id, session_id, events, created_at
    `,
    [input.session_id, JSON.stringify(input.events)],
  );

  return result.rows[0];
}
