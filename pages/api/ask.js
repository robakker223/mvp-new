// pages/api/ask.js

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { question } = req.body

    // Input validation
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "question"' })
    }

    const trimmedQuestion = question.trim()
    console.log('[ASK]', trimmedQuestion)

    // TODO: Replace this with your actual logic (e.g., OpenAI call, vector search, etc.)
    const answer = await handleAsk(trimmedQuestion)

    return res.status(200).json({ answer })
  } catch (err) {
    console.error('Error in /api/ask:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Modular logic so it's testable and clean
async function handleAsk(question) {
  // Placeholder logic
  return `You asked: "${question}". This is a placeholder response.`
}
