// Urdu-first conversational state machine (high-level stub).
// In production: drive this with your telephony stream, ASR, LLM, and TTS.

export function buildSystemPrompt({ shopName, policiesSummary }) {
  return `You are an Urdu-first AI calling agent for ${shopName}.
- Speak polite, natural Urdu.
- Understand Roman Urdu.
- Confirm order details and intent: confirm/cancel/reschedule/change.
- Answer questions: price, variants, delivery ETA, returns/exchange policy, stock.
- If angry/suspicious or low confidence, offer human transfer.
Policies: ${policiesSummary || 'Not provided.'}`;
}

export function detectIntent(text) {
  const t = String(text || '').toLowerCase();
  if (t.includes('cancel') || t.includes('cancel karo') || t.includes('cancel kar')) return 'Cancel';
  if (t.includes('confirm') || t.includes('ok') || t.includes('theek')) return 'Confirm';
  if (t.includes('baad') || t.includes('shaam') || t.includes('kal') || t.includes('reschedule')) return 'Reschedule';
  if (t.includes('change') || t.includes('size') || t.includes('color')) return 'Edit';
  return 'Unknown';
}

export function detectSentiment(text) {
  const t = String(text || '').toLowerCase();
  if (t.includes('ghalat') || t.includes('bakwas') || t.includes('fraud') || t.includes('angry')) return 'Negative';
  if (t.includes('shukriya') || t.includes('theek') || t.includes('acha')) return 'Positive';
  return 'Neutral';
}
