import { faqPrompt } from './faqPrompt.js';
// import copyPrompt from './copyPrompt'; // Uncomment when you build this

export function getPromptTemplate(task) {
  switch (task) {
    case 'faq':
      return faqPrompt;

    // case 'copywriter':
    //   return copyPrompt;

    default:
      return 'You are a helpful assistant. Please answer clearly and concisely.';
  }
}
