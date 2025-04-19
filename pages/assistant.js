import { useState } from 'react';

export default function Assistant() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    setError('');
    setResponse('');

    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: question })
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Request failed');
      }

      const data = await res.json();
      setResponse(data.answer || 'No response received.');
    } catch (err) {
      console.error('Client error:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>MVP Global Assistant</h1>
      <p>Ask me anything about your product or service.</p>

      <form onSubmit={handleAsk} style={styles.form}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {response && (
        <div style={styles.responseBox}>
          <h3>Response</h3>
          <p>{response}</p>
        </div>
      )}

      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Inter, sans-serif'
  },
  form: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  responseBox: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px'
  }
};
