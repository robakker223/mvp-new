// src/pages/api/ask.js
import { logPrompt } from '@/lib/logger';
import { validatePrompt } from '@/lib/validatePrompt';
import { rateLimit } from '@/lib/rateLimiter';
import { getPromptTemplate } from '@/lib/promptTemplate';
import { routePrompt } from '@/config/promptRouter'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { prompt } = req.body;

  const validationError = validatePrompt(prompt);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  logPrompt(ip, prompt);

  // Route the prompt to determine the type of task (faq, copywriter, etc.)
  const task = routePrompt(prompt);

  // Get the system prompt for that task
  const systemPrompt = getPromptTemplate(task);

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
      console.error('OpenAI error:', data);
      return res.status(openaiRes.status).json({ error: data.error.message });
    }

    const message = data.choices?.[0]?.message?.content;

    if (!message) {
      return res.status(500).json({ error: 'No response from OpenAI' });
    }

    return res.status(200).json({ answer: message });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
