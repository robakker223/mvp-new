// Determines the type of task based on the prompt.
// Add more logic as you support more task types.

export function routePrompt(input = '') {
  const lower = input.toLowerCase();

  // Example: You can later add "copy", "review", etc.
  if (
    lower.includes('hours') ||
    lower.includes('location') ||
    lower.includes('availability') ||
    lower.includes('services') ||
    lower.includes('product') ||
    lower.includes('mvp global')
  ) {
    return 'faq';
  }

  // Default fallback task
  return 'faq';
}
