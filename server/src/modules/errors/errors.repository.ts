import { appendEntry, readEntries } from '../../db/file-store';

export type NewErrorEvent = {
  message: string;
  level: string;
  service?: string | null;
  session_id?: string | null;
  user_id?: string | null;
  payload?: unknown;
};

export type ErrorEventRow = {
  id: string;
  message: string;
  level: string;
  service: string | null;
  session_id: string | null;
  user_id: string | null;
  payload: unknown;
  created_at: string;
};

export async function selectRecentErrorEvents(): Promise<ErrorEventRow[]> {
  return readEntries('error_event') as unknown as ErrorEventRow[];
}

export async function insertErrorEvent(
  input: NewErrorEvent,
): Promise<ErrorEventRow> {
  return appendEntry('error_event', {
    message: input.message,
    level: input.level,
    service: input.service ?? null,
    session_id: input.session_id ?? null,
    user_id: input.user_id ?? null,
    payload: input.payload ?? null,
  }) as unknown as ErrorEventRow;
}
