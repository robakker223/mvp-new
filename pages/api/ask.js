export default async function handler(req, res) {
  console.log("API Route Called");
  console.log("Request body:", JSON.stringify(req.body));
  console.log("OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  console.log("User input:", prompt);

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt' });
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
        messages: [{ role: 'user', content: prompt }],
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
