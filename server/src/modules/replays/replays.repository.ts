import { appendEntry, readEntries } from '../../db/file-store';

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
  return readEntries('replay') as unknown as ReplayRow[];
}

export async function insertReplay(input: NewReplay): Promise<ReplayRow> {
  return appendEntry('replay', {
    session_id: input.session_id,
    events: input.events,
  }) as unknown as ReplayRow;
}
