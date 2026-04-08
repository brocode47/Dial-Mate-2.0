// Provider-agnostic interface.
// Replace this file with your chosen LLM provider (OpenAI, etc.)

export async function generateAgentReply({ systemPrompt, userText, context }) {
  // IMPORTANT: This repo does NOT ship real API calls to avoid hardcoding keys.
  // Implement your provider call here.
  // Return: { text, confidence }.

  const safeUser = String(userText || '').trim();
  if (!safeUser) {
    return { text: 'Assalam-o-alaikum. Main aap ke order ki tasdeeq ke liye call kar raha/rahi hun. Kya aap baat kar sakte hain?', confidence: 0.6 };
  }

  // Minimal heuristic fallback:
  return {
    text: `Shukriya. Aap ne kaha: "${safeUser}". Kya aap apna order confirm kar rahe hain, cancel, ya reschedule?`,
    confidence: 0.4
  };
}
