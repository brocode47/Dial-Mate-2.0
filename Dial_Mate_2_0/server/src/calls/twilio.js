/* __imports_rewritten__ */
import twilio from 'https://esm.sh/twilio';

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error('Twilio credentials missing. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
  }
  return twilio(sid, token);
}

// Outbound call stub.
// In production you typically connect Twilio to a webhook/TwiML that streams audio to your agent.
export async function placeOutboundCall({ to, from, webhookUrl, statusCallbackUrl }) {
  const client = getClient();
  return client.calls.create({
    to,
    from,
    url: webhookUrl,
    statusCallback: statusCallbackUrl,
    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed']
  });
}
