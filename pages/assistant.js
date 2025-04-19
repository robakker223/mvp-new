import { useState } from 'react';

export default function Assistant() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResponse('');
    setError('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question }) // ✅ Key must be "prompt"
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Request failed');
      }

      const data = await res.json();
      setResponse(data.answer || '[No response]');
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>MVP Global Assistant</h1>
      <p>Ask me anything about your business or products.</p>

      <form onSubmit={handleAsk} style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #ccc'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Thinking…' : 'Ask'}
          </button>
        </div>
      </form>

      {response && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Response:</h2>
          <p style={{ lineHeight: '1.6' }}>{response}</p>
        </div>
      )}

      {error && (
        <p style={{ marginTop: '1rem', color: 'red' }}>⚠️ {error}</p>
      )}
    </div>
  );
}
