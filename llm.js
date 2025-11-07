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
  const prompt = `Provide a list of diverse English synonyms for "${word}", limited to a maximum of ${count}. Include some common synonyms as well as rare, esoteric ones. "${word}" cannot be in your list of synonyms. No repeats. Capitalize the first letter of each synonym. Newline separated. Each line should ONLY include the synonym. NEVER anything other than the synonym on the line. NEVER include parenthesis. Your response should only include the list without any introductory or concluding text. If none, say "No synonyms found for ${word}."`;

  return await llm(prompt);
}

export async function getDefinition(word) {
  const prompt = `Provide a CONCISE English definition for the word "${word}". Respond with only the definition text, without any introductory phrases or formatting. If the word could have multiple meanings, list them each in a separate sentence.`;

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
