// lib/logger.js

const fs = require('fs');
const path = require('path');

const LOGGING_ENABLED = process.env.LOGGING_ENABLED === 'true';
const LOG_PATH = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_PATH, 'chat.log');

// Redacts sensitive data from input
function redact(input = '') {
  return input
    .replace(/\b\d{12,19}\b/g, '[REDACTED_CARD]')
    .replace(/\b[\w.-]+@[\w.-]+\.\w{2,}\b/g, '[REDACTED_EMAIL]')
    .replace(/\+?\d[\d\s().-]{7,}/g, '[REDACTED_PHONE]')
    .replace(/(?:\d{1,3}\.){3}\d{1,3}/g, '[REDACTED_IP]'); // IPv4
}

// Logs the prompt to console and optionally to file
export function logPrompt(ip, prompt) {
  if (!LOGGING_ENABLED) return;

  const redactedPrompt = redact(prompt);
  const timestamp = new Date().toISOString();

  const logEntry = {
    timestamp,
    ip: redact(ip),
    prompt: redactedPrompt,
  };

  // Console logging
  console.log(`[PROMPT] ${timestamp} | IP: ${logEntry.ip} | Prompt: "${logEntry.prompt}"`);

  // File logging
  try {
    if (!fs.existsSync(LOG_PATH)) fs.mkdirSync(LOG_PATH, { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
  } catch (err) {
    console.error('⚠️ Logging error:', err);
  }
}
