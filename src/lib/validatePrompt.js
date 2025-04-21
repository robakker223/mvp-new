// lib/validatePrompt.js
export function validatePrompt(prompt) {
  if (typeof prompt !== 'string') return 'Prompt must be a string.';
  if (prompt.trim().length === 0) return 'Prompt cannot be empty.';
  if (prompt.length > 500) return 'Prompt is too long (max 500 characters).';
  return null;
}
