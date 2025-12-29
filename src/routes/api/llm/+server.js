import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
  const { prompt} = await request.json();

  const endpoint = env.LLM_ENDPOINT;
  const key = env.LLM_KEY || '';
  const defaultModel = env.LLM_MODEL || '';

  if (!endpoint) {
    return json({ error: 'LLM endpoint not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: defaultModel,
        messages: [{ role: 'user', content: prompt }],
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return json(
        { error: `LLM API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return json({ content: data.choices[0].message.content });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
