/**
 * Fetches synonyms for a given query from the server-side API
 * @param {string} query - The word or phrase to get synonyms for
 * @returns {Promise<string>} The synonyms response content
 * @throws {Error} If the request fails
 */
export async function getSynonyms(query) {
  const response = await fetch("/api/synonyms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }

  const data = await response.json();
  return data.content;
}

/**
 * Fetches a definition for a given query from the server-side API
 * @param {string} query - The word or phrase to get a definition for
 * @returns {Promise<string>} The definition response content
 * @throws {Error} If the request fails
 */
export async function getDefinition(query) {
  const response = await fetch("/api/definitions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }

  const data = await response.json();
  return data.content;
}
