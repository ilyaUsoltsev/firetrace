import type { Request, Response, NextFunction } from 'express';
import { insertErrorEvent, selectRecentErrorEvents } from './errors.repository';

export async function listErrorEvents(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const rows = await selectRecentErrorEvents();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function createErrorEvent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { message, level, service, session_id, user_id, payload } = req.body ?? {};

    if (!message || !level) {
      res.status(400).json({
        error: 'message and level are required',
      });
      return;
    }

    const row = await insertErrorEvent({
      message,
      level,
      service,
      session_id,
      user_id,
      payload,
    });

    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}
