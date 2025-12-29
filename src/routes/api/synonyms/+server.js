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

    const prompt = `Provide a list of synonyms for "${query}". Include both common and rare alternatives. If the input is a phrase, provide synonymous phrases. If it's not a real word or phrase, provide creative alternatives or similar-sounding words. Format your response as a simple comma-separated list without explanations.`;

    const content = await callLLM(prompt, { temperature: 0.7 });

    return json({ content });
  } catch (error) {
    console.error('Synonyms API error:', error.message);

    if (error.message === 'Request timeout') {
      return json({ error: 'Request timeout' }, { status: 504 });
    }

    if (error.message.includes('LLM API error')) {
      return json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
