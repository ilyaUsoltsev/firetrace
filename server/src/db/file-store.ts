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

function extractJsonObjects(content: string): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (content[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        try {
          results.push(JSON.parse(content.slice(start, i + 1)) as Record<string, unknown>);
        } catch {
          // skip malformed objects
        }
        start = -1;
      }
    }
  }
  return results;
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
  const entries = extractJsonObjects(content).filter((entry) => entry.type === type);
  return entries.slice(-limit).reverse();
}
