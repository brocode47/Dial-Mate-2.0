/* __imports_rewritten__ */
import crypto from 'https://esm.sh/crypto';

export function verifyShopifyWebhook({ rawBody, hmacHeader, secret }) {
  if (!hmacHeader) return false;
  const digest = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');

  // Timing safe compare
  const a = Buffer.from(digest);
  const b = Buffer.from(hmacHeader);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
