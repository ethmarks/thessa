import { json } from '@sveltejs/kit';
import { callLLM } from '$lib/server/llm.js';

const MAX_QUERY_LENGTH = 200;

export async function POST({ request }) {
  try {
    const { query } = await request.json();

    // Validate query
    if (!query || typeof query !== 'string') {
      return json({ error: 'Query is required' }, { status: 400 });
    }

    if (query.trim().length === 0) {
      return json({ error: 'Query cannot be empty' }, { status: 400 });
    }

    if (query.length > MAX_QUERY_LENGTH) {
      return json({ error: 'Query too long' }, { status: 400 });
    }

    const prompt = `You are a sophisticated AI dictionary that provides a definition for any input.

The input is: "${query}". You are to respond with a definition for the input.

If the input is a word, simply define it. Your definition should be clear, concise, and easily understandable. Provide the part of speech if applicable. If the word is from a non-English language, define it in English. If the word has multiple definitions, list them separated by double newlines. If the word is not a recognized word in any language, provide a plausible and creative definition.

If the input is a phrase, rephrase it in simpler terms and optionally add extra explanation and analysis.

Your response will be displayed to the user as plain text. Capitalize the first word. You must not include *any* text before or after the definition. You must not use Markdown formatting. Simply response with the plain text definition.

Example for input "marvelous":

Marvelous (adjective): Causing great wonder, admiration, or astonishment; inspiring awe because of its excellence or extraordinary quality.
`;

    const content = await callLLM(prompt, { temperature: 0.5, maxTokens: 150 });

    return json({ content });
  } catch (error) {
    console.error('Definitions API error:', error.message);

    if (error.message === 'Request timeout') {
      return json({ error: 'Request timeout' }, { status: 504 });
    }

    if (error.message.includes('LLM API error')) {
      return json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
