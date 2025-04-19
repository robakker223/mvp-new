export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  // Validate prompt
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid prompt. Please provide a non-empty string.' });
  }

  try {
    // Example placeholder logic (for now, it just echoes back the prompt)
    // Later, replace this with a real OpenAI or other LLM call
    const simulatedResponse = `You asked: "${prompt}". This is where the AI response would go.`;

    // Success response
    return res.status(200).json({ answer: simulatedResponse });

  } catch (error) {
    console.error('API Error in /api/ask:', error);
    return res.status(500).json({ error: 'An unexpected error occurred while processing your request.' });
  }
}
