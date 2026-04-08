/* __imports_rewritten__ */
import express from 'https://esm.sh/express';
import { z } from 'https://esm.sh/zod@4.3.0';
import { shopify, normalizeShop } from '../lib/shopify.js';
import { getDb, initDb, now } from '../lib/db.js';
import { registerWebhooksForShop } from './webhooks.js';

export function authRouter() {
  const router = express.Router();

  router.get('/shopify', async (req, res) => {
    const shop = normalizeShop(req.query.shop);
    if (!shop) return res.status(400).send('Missing shop');

    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: '/auth/shopify/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res
    });

    return res.redirect(authRoute);
  });

  router.get('/shopify/callback', async (req, res) => {
    try {
      const callbackRes = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res
      });

      const shop = callbackRes.session.shop;
      const accessToken = callbackRes.session.accessToken;

      await initDb();
      const db = getDb();
      await db.run(
        `INSERT INTO shops(shop, accessToken, installedAt)
         VALUES(?, ?, ?)
         ON CONFLICT(shop) DO UPDATE SET accessToken=excluded.accessToken, installedAt=excluded.installedAt`,
        [shop, accessToken, now()]
      );

      await registerWebhooksForShop({ shop, accessToken });

      const front = process.env.FRONTEND_URL || '/';
      return res.redirect(`${front.replace(/\/$/, '')}/#/onboarding`);
    } catch (error) {
      return res.status(500).send(`Auth callback error: ${error?.message || String(error)}`);
    }
  });

  // Simple admin helper: list installed shops (protect in production)
  router.get('/shops', async (_req, res) => {
    await initDb();
    const db = getDb();
    const rows = await db.all('SELECT shop, installedAt FROM shops ORDER BY installedAt DESC');
    return res.json({ shops: rows });
  });

  return router;
}

export function requireShopParam(req) {
  const schema = z.object({ shop: z.string().min(1) });
  const parsed = schema.safeParse(req.params);
  if (!parsed.success) return { ok: false, error: 'Missing shop param' };
  return { ok: true, shop: parsed.data.shop };
}
