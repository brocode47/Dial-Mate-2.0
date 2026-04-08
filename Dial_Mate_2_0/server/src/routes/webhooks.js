/* __imports_rewritten__ */
import express from 'https://esm.sh/express';
import bodyParser from 'https://esm.sh/body-parser';
import { shopify } from '../lib/shopify.js';
import { initDb, getDb, now, uid } from '../lib/db.js';
import { verifyShopifyWebhook } from '../lib/webhookVerify.js';
import { computeRiskScore } from '../lib/risk.js';

// Registers webhooks with Shopify after OAuth.
export async function registerWebhooksForShop({ shop, accessToken }) {
  const client = new shopify.clients.Rest({ session: { shop, accessToken } });

  const baseUrl = (process.env.APP_URL || 'http://localhost:8787').replace(/\/$/, '');

  const webhooks = [
    { topic: 'orders/create', address: `${baseUrl}/webhooks/orders/create` },
    { topic: 'orders/updated', address: `${baseUrl}/webhooks/orders/updated` }
  ];

  for (const hook of webhooks) {
    // REST admin webhooks endpoint.
    // https://shopify.dev/docs/api/admin-rest/latest/resources/webhook
    await client.post({
      path: 'webhooks',
      data: {
        webhook: {
          topic: hook.topic,
          address: hook.address,
          format: 'json'
        }
      }
    });
  }

  await initDb();
  const db = getDb();
  await db.run(
    'INSERT INTO compliance_logs(id, shop, event, detail, createdAt) VALUES(?,?,?,?,?)',
    [uid('log'), shop, 'Webhook registered', `orders/create + orders/updated -> ${baseUrl}`, now()]
  );
}

export function webhooksRouter() {
  const router = express.Router();

  // Need raw body for signature check
  router.use(bodyParser.raw({ type: 'application/json' }));

  router.post('/orders/create', async (req, res) => {
    try {
      await handleOrderWebhook(req, res, 'orders/create');
    } catch (error) {
      res.status(500).send(error?.message || String(error));
    }
  });

  router.post('/orders/updated', async (req, res) => {
    try {
      await handleOrderWebhook(req, res, 'orders/updated');
    } catch (error) {
      res.status(500).send(error?.message || String(error));
    }
  });

  return router;
}

async function handleOrderWebhook(req, res, topic) {
  const shop = req.get('X-Shopify-Shop-Domain');
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const secret = process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return res.status(500).send('Webhook secret not configured');

  const rawBody = req.body.toString('utf8');
  const ok = verifyShopifyWebhook({ rawBody, hmacHeader: hmac, secret });
  if (!ok) return res.status(401).send('Invalid webhook signature');

  const payload = JSON.parse(rawBody);
  const orderId = String(payload?.name || payload?.id);

  await initDb();
  const db = getDb();

  const riskScore = computeRiskScore(payload);

  await db.run(
    `INSERT INTO orders(id, shop, payload, createdAt, updatedAt, status, tag, riskScore)
     VALUES(?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET payload=excluded.payload, updatedAt=excluded.updatedAt, riskScore=excluded.riskScore`,
    [orderId, shop, rawBody, now(), now(), 'Pending Confirmation', 'Retry', riskScore]
  );

  await db.run(
    'INSERT INTO compliance_logs(id, shop, event, detail, createdAt) VALUES(?,?,?,?,?)',
    [uid('log'), shop, 'Webhook verified', `${topic} accepted for ${orderId}`, now()]
  );

  // Acknowledge Shopify quickly
  return res.status(200).send('ok');
}
