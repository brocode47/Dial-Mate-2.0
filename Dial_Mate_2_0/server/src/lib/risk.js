// Very simple baseline risk model. Replace with your real model.
// Inputs can include: previous cancellations, phone duplicates, COD+high value, address anomalies, etc.

export function computeRiskScore(order) {
  let score = 0;

  const payment = (order?.payment_gateway_names || []).join(',').toLowerCase();
  const isCOD = payment.includes('cod') || String(order?.gateway || '').toLowerCase().includes('cod');
  const total = Number(order?.current_total_price || order?.total_price || 0);

  if (isCOD) score += 15;
  if (total >= 20000) score += 20;

  const phone = String(order?.phone || order?.customer?.phone || '').replace(/\s+/g, '');
  if (!phone) score += 10;

  const city = String(order?.shipping_address?.city || '').toLowerCase();
  if (!city) score += 6;

  // Cap 0-100
  return Math.max(0, Math.min(100, score));
}
