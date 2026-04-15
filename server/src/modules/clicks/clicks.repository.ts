import { appendEntry, readEntries } from '../../db/file-store';

export type NewClickEvent = {
  user_id?: string | null;
  event_name: string;
  page?: string | null;
  element?: string | null;
  payload?: unknown;
};

export type ClickEventRow = {
  id: string;
  user_id: string | null;
  event_name: string;
  page: string | null;
  element: string | null;
  payload: unknown;
  created_at: string;
};

export async function selectRecentClickEvents(): Promise<ClickEventRow[]> {
  return readEntries('click_event') as unknown as ClickEventRow[];
}

export async function insertClickEvent(
  input: NewClickEvent,
): Promise<ClickEventRow> {
  return appendEntry('click_event', {
    user_id: input.user_id ?? null,
    event_name: input.event_name,
    page: input.page ?? null,
    element: input.element ?? null,
    payload: input.payload ?? null,
  }) as unknown as ClickEventRow;
}
