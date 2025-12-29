import { env } from "$env/dynamic/public";

const env_endpoint = env.PUBLIC_LLM_ENDPOINT;
const env_key = env.PUBLIC_LLM_KEY || "";
const env_model = env.PUBLIC_LLM_MODEL || "";

export async function llm(
  prompt,
  endpoint = env_endpoint,
  key = env_key,
  model = env_model,
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
