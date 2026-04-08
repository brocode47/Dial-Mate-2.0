/* __imports_rewritten__ */
import { shopifyApi, LATEST_API_VERSION } from 'https://esm.sh/@shopify/shopify-api';

const apiVersion = process.env.SHOPIFY_API_VERSION || LATEST_API_VERSION;

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || 'your-shopify-api-key-here',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || 'your-shopify-api-secret-here',
  scopes: (process.env.SHOPIFY_SCOPES || 'read_orders,write_orders').split(',').map((s) => s.trim()).filter(Boolean),
  hostName: new URL(process.env.APP_URL || 'http://localhost:8787').host,
  apiVersion,
  isEmbeddedApp: false,
  logger: {
    log: (_severity, message) => console.log(message)
  }
});

export function normalizeShop(shop) {
  if (!shop) return '';
  const raw = String(shop).trim();
  return raw.endsWith('.myshopify.com') ? raw : `${raw}.myshopify.com`;
}
