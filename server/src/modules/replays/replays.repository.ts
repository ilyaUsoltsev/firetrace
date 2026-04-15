import { appendEntry, readEntries } from '../../db/file-store';

export type NewReplay = {
  events: unknown;
  message?: string;
};

export type ReplayRow = {
  id: string;
  events: unknown;
  created_at: string;
  message: string | null;
};

export async function selectRecentReplays(): Promise<ReplayRow[]> {
  return readEntries('replay') as unknown as ReplayRow[];
}

export async function insertReplay(input: NewReplay): Promise<ReplayRow> {
  return appendEntry('replay', {
    message: input.message ?? null,
    events: input.events,
  }) as unknown as ReplayRow;
}
