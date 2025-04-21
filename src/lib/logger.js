// lib/logger.js
const fs = require('fs');
const path = require('path');

const LOGGING_ENABLED = process.env.ENABLE_LOGGING === 'true';
const LOG_PATH = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_PATH, 'chat.log');

// Basic redactor (extend this if needed)
function redact(input = '') {
  return input
    .replace(/\b\d{12,19}\b/g, '[REDACTED_CARD]')
    .replace(/\b[\w.-]+@[\w.-]+\.\w{2,}\b/g, '[REDACTED_EMAIL]')
    .replace(/\+?\d[\d\s().-]{7,}/g, '[REDACTED_PHONE]')
    .replace(/(?:\d{1,3}\.){3}\d{1,3}/g, '[REDACTED_IP]');
}

function writeToLog(entry) {
  const logLine = JSON.stringify(entry) + '\n';

  try {
    if (!fs.existsSync(LOG_PATH)) fs.mkdirSync(LOG_PATH);
    fs.appendFileSync(LOG_FILE, logLine);
  } catch (err) {
    console.error('❌ Logging error:', err);
  }
}

// Exported logger
export function logPrompt(ip, prompt) {
  if (!LOGGING_ENABLED) return;

  const redactedPrompt = redact(prompt);

  const entry = {
    timestamp: new Date().toISOString(),
    ip: redact(ip),
    prompt: redactedPrompt
  };

  console.log(`[PROMPT] ${entry.timestamp} | IP: ${entry.ip} | Prompt: "${entry.prompt}"`);

  writeToLog(entry);
}
