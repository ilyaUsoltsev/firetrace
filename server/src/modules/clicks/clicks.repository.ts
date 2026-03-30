import { query } from '../../db/query';

export type NewClickEvent = {
  session_id: string;
  user_id?: string | null;
  event_name: string;
  page?: string | null;
  element?: string | null;
  payload?: unknown;
};

export type ClickEventRow = {
  id: string;
  session_id: string;
  user_id: string | null;
  event_name: string;
  page: string | null;
  element: string | null;
  payload: unknown;
  created_at: string;
};

export async function selectRecentClickEvents(): Promise<ClickEventRow[]> {
  const result = await query<ClickEventRow>(
    `
    SELECT id, session_id, user_id, event_name, page, element, payload, created_at
    FROM click_events
    ORDER BY created_at DESC
    LIMIT 100
    `,
  );

  return result.rows;
}

export async function insertClickEvent(
  input: NewClickEvent,
): Promise<ClickEventRow> {
  const result = await query<ClickEventRow>(
    `
    INSERT INTO click_events (session_id, user_id, event_name, page, element, payload)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, session_id, user_id, event_name, page, element, payload, created_at
    `,
    [
      input.session_id,
      input.user_id ?? null,
      input.event_name,
      input.page ?? null,
      input.element ?? null,
      input.payload ?? null,
    ],
  );

  return result.rows[0];
}
