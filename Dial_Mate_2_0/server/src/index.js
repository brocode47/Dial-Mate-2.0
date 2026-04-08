/* __imports_rewritten__ */
import 'dotenv/config';
import express from 'https://esm.sh/express';
import cors from 'https://esm.sh/cors';
import morgan from 'https://esm.sh/morgan';
import { initDb } from './lib/db.js';
import { authRouter } from './routes/auth.js';
import { webhooksRouter } from './routes/webhooks.js';
import { apiRouter } from './routes/api.js';

const PORT = Number(process.env.PORT || 8787);
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: FRONTEND_URL === '*' ? true : FRONTEND_URL, credentials: true }));
app.use(morgan('tiny'));

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Routers
app.use('/auth', authRouter());
app.use('/webhooks', webhooksRouter());
app.use('/api', apiRouter());

await initDb();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on :${PORT}`);
});
