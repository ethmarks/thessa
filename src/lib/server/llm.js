import { env } from "$env/dynamic/private";

const MAX_PROMPT_LENGTH = 1000;
const REQUEST_TIMEOUT = 5000; // 5 seconds

/**
 * Makes a request to the configured LLM API
 * @param {string} prompt - The prompt to send to the LLM
 * @param {Object} options - Optional configuration
 * @param {number} options.temperature - Temperature for response generation (0-2)
 * @param {number} options.maxTokens - Maximum tokens in response
 * @returns {Promise<string>} The LLM response content
 * @throws {Error} If the request fails
 */
export async function callLLM(prompt, options = {}) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("Invalid prompt");
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    throw new Error("Prompt too long");
  }

  const endpoint = env.LLM_ENDPOINT;
  const key = env.LLM_KEY || "";
  const model = env.LLM_MODEL || "gpt-oss-120b";

  if (!endpoint) {
    throw new Error("LLM endpoint not configured");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const requestBody = {
      model,
      messages: [{ role: "user", content: prompt }],
    };

    // Add optional parameters if provided
    if (options.temperature !== undefined) {
      requestBody.temperature = options.temperature;
    }
    if (options.maxTokens !== undefined) {
      requestBody.max_tokens = options.maxTokens;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LLM API error:", response.status, errorText);
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from LLM API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }

    throw error;
  }
}
