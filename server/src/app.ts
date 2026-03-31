import express from 'express';
import { errorsRouter } from './modules/errors/errors.routes';
import { clicksRouter } from './modules/clicks/clicks.routes';
import { notFound } from './middleware/not-found';
import { errorHandler } from './middleware/error-handler';
import cors from 'cors';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/errors', errorsRouter);
app.use('/api/clicks', clicksRouter);

app.use(notFound);
app.use(errorHandler);
