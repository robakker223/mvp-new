// pages/api/ask.js
import { logPrompt } from '../../lib/logger';
import { validatePrompt } from '../../lib/validatePrompt';
import { rateLimit } from '../../lib/rateLimiter';
import { systemPrompt } from '../../lib/systemPrompt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { prompt } = req.body;

  const validationError = validatePrompt(prompt);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  logPrompt(ip, prompt);

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Missing OPENAI_API_KEY');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error('🔴 OpenAI Error:', data);
      return res.status(openaiRes.status).json({ error: data?.error?.message || 'Unknown error' });
    }

    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      return res.status(500).json({ error: 'No answer returned by AI' });
    }

    return res.status(200).json({ answer });
  } catch (err) {
    console.error('🔥 Unhandled Error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
