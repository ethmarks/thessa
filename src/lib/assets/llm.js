import { PUBLIC_LLM_ENDPOINT, PUBLIC_LLM_KEY, PUBLIC_LLM_MODEL } from "$env/static/public";

export async function llm(
  prompt,
  endpoint = PUBLIC_LLM_ENDPOINT,
  key = PUBLIC_LLM_KEY,
  model = PUBLIC_LLM_MODEL,
  options = {}
) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
