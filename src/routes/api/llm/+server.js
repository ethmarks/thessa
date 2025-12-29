import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const MAX_PROMPT_LENGTH = 500;
const REQUEST_TIMEOUT = 5000;

export async function POST({ request }) {
  const { prompt } = await request.json();

  if (!prompt || typeof prompt !== 'string') {
    return json({ error: 'Invalid prompt' }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return json({ error: 'Prompt too long' }, { status: 400 });
  }

  const endpoint = env.LLM_ENDPOINT;
  const key = env.LLM_KEY || '';
  const defaultModel = env.LLM_MODEL || '';

  if (!endpoint) {
    return json({ error: 'LLM endpoint not configured' }, { status: 500 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: defaultModel,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('LLM API error:', response.status, await response.text());
      return json(
        { error: `LLM API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return json({ content: data.choices[0].message.content });
  } catch (error) {
    if (error.name === 'AbortError') {
      return json({ error: 'Request timeout' }, { status: 504 });
    }
    console.error('LLM request failed:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
