import { Router } from 'express';
import { createReplay, listReplays } from './replays.controller';

export const replaysRouter = Router();

replaysRouter.get('/', listReplays);
replaysRouter.post('/', createReplay);
