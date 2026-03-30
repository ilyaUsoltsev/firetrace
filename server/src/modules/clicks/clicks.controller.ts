import type { Request, Response, NextFunction } from 'express';
import { insertClickEvent, selectRecentClickEvents } from './clicks.repository';

export async function listClickEvents(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const rows = await selectRecentClickEvents();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function createClickEvent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { session_id, user_id, event_name, page, element, payload } = req.body ?? {};

    if (!session_id || !event_name) {
      res.status(400).json({
        error: 'session_id and event_name are required',
      });
      return;
    }

    const row = await insertClickEvent({
      session_id,
      user_id,
      event_name,
      page,
      element,
      payload,
    });

    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}
