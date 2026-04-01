import type { Request, Response, NextFunction } from 'express';
import { insertReplay, selectRecentReplays } from './replays.repository';

export async function listReplays(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const rows = await selectRecentReplays();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function createReplay(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { session_id, events } = req.body ?? {};

    if (!session_id || !events) {
      res.status(400).json({ error: 'session_id and events are required' });
      return;
    }

    const row = await insertReplay({ session_id, events });
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}
