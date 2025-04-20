const fs = require('fs');
const path = require('path');

const ENABLE_LOGGING = process.env.ENABLE_LOGGING === 'true';
const LOG_PATH = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_PATH, 'chat.log');

// --- Redaction helper ---
function redact(input = '') {
  return input
    .replace(/\b\d{12,19}\b/g, '[REDACTED_CARD]')
    .replace(/\b[\w.-]+@[\w.-]+\.\w{2,}\b/g, '[REDACTED_EMAIL]')
    .replace(/\+?\d[\d\s().-]{7,}/g, '[REDACTED_PHONE]')
    .replace(/(?:\d{1,3}\.){3}\d{1,3}/g, '[REDACTED_IP]');
}

// --- Logging function ---
export function logPrompt(ip, prompt) {
  if (!ENABLE_LOGGING) return;

  const entry = {
    timestamp: new Date().toISOString(),
    ip,
    prompt: redact(prompt),
  };

  const logLine = JSON.stringify(entry) + '\n';

  try {
    if (!fs.existsSync(LOG_PATH)) fs.mkdirSync(LOG_PATH);
    fs.appendFileSync(LOG_FILE, logLine);
  } catch (err) {
    console.error('🛑 Logging error:', err);
    console.log('Fallback Log:', logLine); // Fallback in console
  }
}
