import { query } from '../../db/query';

export type NewErrorEvent = {
  message: string;
  level: string;
  service?: string | null;
  payload?: unknown;
};

export type ErrorEventRow = {
  id: string;
  message: string;
  level: string;
  service: string | null;
  payload: unknown;
  created_at: string;
};

export async function selectRecentErrorEvents(): Promise<ErrorEventRow[]> {
  const result = await query<ErrorEventRow>(
    `
    SELECT id, message, level, service, payload, created_at
    FROM error_events
    ORDER BY created_at DESC
    LIMIT 100
    `,
  );

  return result.rows;
}

export async function insertErrorEvent(
  input: NewErrorEvent,
): Promise<ErrorEventRow> {
  const result = await query<ErrorEventRow>(
    `
    INSERT INTO error_events (message, level, service, payload)
    VALUES ($1, $2, $3, $4)
    RETURNING id, message, level, service, payload, created_at
    `,
    [input.message, input.level, input.service ?? null, input.payload ?? null],
  );

  return result.rows[0];
}
