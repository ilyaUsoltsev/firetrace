import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';

const LOG_FILE = path.resolve(__dirname, '../../log.txt');

export async function appendEntry(
  type: string,
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const entry: Record<string, unknown> = {
    id: randomUUID(),
    type,
    created_at: new Date().toISOString(),
    ...data,
  };
  await fs.appendFile(LOG_FILE, JSON.stringify(entry) + '\n', 'utf8');
  return entry;
}

export async function readEntries(
  type: string,
  limit = 100,
): Promise<Record<string, unknown>[]> {
  let content: string;
  try {
    content = await fs.readFile(LOG_FILE, 'utf8');
  } catch {
    return [];
  }
  const entries = content
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as Record<string, unknown>)
    .filter((entry) => entry.type === type);
  return entries.slice(-limit).reverse();
}
