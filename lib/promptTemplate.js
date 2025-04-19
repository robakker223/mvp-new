// lib/promptTemplate.js
import { systemPrompt } from './promptConfig';

export function buildPrompt(userInput) {
  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userInput }
  ];
}
