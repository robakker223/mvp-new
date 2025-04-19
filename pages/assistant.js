// pages/api/ask.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt' });
  }

  try {
    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (!apiRes.ok) {
      const err = await apiRes.text();
      return res.status(500).json({ error: 'OpenAI Error: ' + err });
    }

    const data = await apiRes.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || 'No response from model';

    return res.status(200).json({ answer });
  } catch (err) {
    console.error('API Route Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
