/**
 * LLM API Module
 * Handles all communication with the ch.at API
 */

const API_URL = "https://ch.at/v1/chat/completions";

/**
 * Makes a chat completion request to the ch.at API
 * @param {string} prompt - The prompt to send to the API
 * @returns {Promise<string>} - The API response text
 * @throws {Error} - Throws error with message and optional httpStatus property
 */
async function llm(prompt) {
  const temperature = 0.65;
  const maxTokens = 300;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: { message: response.statusText } }));
    const err = new Error(
      errorData.error?.message || `HTTP error ${response.status}`,
    );
    err.httpStatus = response.status;
    throw err;
  }

  const data = await response.json();
  const textResponse = data.choices?.[0]?.message?.content;

  if (!textResponse) {
    throw new Error("Could not parse response from API");
  }

  return textResponse;
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
