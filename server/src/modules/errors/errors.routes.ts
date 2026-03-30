import { Router } from 'express';
import { createErrorEvent, listErrorEvents } from './errors.controller';

export const errorsRouter = Router();

errorsRouter.get('/', listErrorEvents);
errorsRouter.post('/', createErrorEvent);
