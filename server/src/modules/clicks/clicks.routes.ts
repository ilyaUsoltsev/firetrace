import { Router } from 'express';
import { createClickEvent, listClickEvents } from './clicks.controller';

export const clicksRouter = Router();

clicksRouter.get('/', listClickEvents);
clicksRouter.post('/', createClickEvent);
