/**
 * LLM API Module
 * Handles communication with multiple OpenAI-compatible API providers with automatic fallback
 */

// List of OpenAI-compatible API endpoints to try in order
// These are free, no-auth endpoints that may have varying reliability
const API_PROVIDERS = [
  "https://api.llm7.io/v1/chat/completions",
  "https://ch.at/v1/chat/completions",
];

/**
 * Makes a chat completion request with automatic provider fallback
 * @param {string} prompt - The prompt to send to the API
 * @returns {Promise<string>} - The API response text
 * @throws {Error} - Throws error if all providers fail
 */
async function llm(prompt) {
  const temperature = 0.65;
  const maxTokens = 300;
  const timeoutMs = 5000; // 5 second timeout

  const requestBody = {
    messages: [{ role: "user", content: prompt }],
    temperature,
    max_tokens: maxTokens,
  };

  let lastError = null;

  // Try each provider in sequence until one succeeds
  for (let i = 0; i < API_PROVIDERS.length; i++) {
    const apiUrl = API_PROVIDERS[i];
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: { message: response.statusText } }));
        const err = new Error(
          errorData.error?.message || `HTTP error ${response.status}`,
        );
        err.httpStatus = response.status;
        err.provider = apiUrl;
        throw err;
      }

      const data = await response.json();
      const textResponse = data.choices?.[0]?.message?.content;

      if (!textResponse) {
        throw new Error("Could not parse response from API");
      }

      return textResponse;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle timeout errors
      if (error.name === "AbortError") {
        lastError = new Error(`Request timed out after ${timeoutMs}ms`);
        lastError.provider = apiUrl;
        console.warn(`Provider ${apiUrl} timed out`);
      } else {
        // Store the error and try the next provider
        lastError = error;
        console.warn(`Provider ${apiUrl} failed:`, error.message);
      }

      // If this isn't the last provider, continue to the next one
      if (i < API_PROVIDERS.length - 1) {
        continue;
      }
    }
  }

  // If we get here, all providers failed
  const err = new Error(
    `All API providers failed. Last error: ${lastError?.message || "Unknown error"}`,
  );
  if (lastError?.httpStatus) {
    err.httpStatus = lastError.httpStatus;
  }
  throw err;
}

export async function getSynonyms(word, count = 8) {
  const prompt = `You are a sophisticated thesaurus that provides ${count} diverse alternatives for any input.

Input: "${word}"

Instructions:
1. If the input is a SINGLE WORD:
   - Provide ${count} diverse synonyms
   - Mix common everyday words and rare archaic words

   <example>
   "happy":
   Joyful
   Elated
   Euphoric
   Blissful
   Cheerful
   Content
   Jubilant
   Exultant
   </example>

2. If the input is a PHRASE or MULTIPLE WORDS:
   - Provide ${count} synonymous phrases or expressions

  <example>
  "break down":
  Fall apart
  Collapse
  Deteriorate
  Malfunction
  Disintegrate
  Deconstruct
  Breach
  Dissolve
  </example>

Always return exactly ${count} synonyms, newline separated. Your response will be interpreted by a script, so include only the newline-separated list without any other text. Do not use commas, asterisks, or dashes.`;

  return await llm(prompt);
}

export async function getDefinition(word) {
  const prompt = `You are a comprehensive dictionary that defines any input intelligently.

Input: "${word}"

Instructions:
1. If the input is a REAL WORD:
   - Provide (part of speech) followed by concise definition
   - For multiple meanings, separate with semicolons
   - Use clear, accessible language

2. If the input is a PHRASE:
   - Provide (phrase) followed by explanation of meaning/usage
   - Focus on the overall concept or idiom meaning

Examples:
"bank" → "(noun) A financial institution; the edge of a river"
"sprint" → "(verb) To run at full speed over a short distance; (noun) A short, fast run"
"break down" → "(phrase) To stop functioning; to analyze in detail"

Return only the definition without introductory text.`;

  return await llm(prompt);
}

export function formatError(error) {
  if (
    error.name === "TypeError" &&
    error.message.toLowerCase().includes("fetch")
  ) {
    return "Network error. Please check your internet connection.";
  }

  if (error.httpStatus) {
    return `API Error (${error.httpStatus}): ${error.message}`;
  }

  return `Error: ${error.message || "Unknown API error."}`;
}
