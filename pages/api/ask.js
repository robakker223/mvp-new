export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' }); // 👈 this is what you're hitting now
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt' });
  }

  try {
    const fakeResponse = `Pretend GPT says something about: "${prompt}"`;
    return res.status(200).json({ answer: fakeResponse });
  } catch (err) {
    console.error('❌ API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
