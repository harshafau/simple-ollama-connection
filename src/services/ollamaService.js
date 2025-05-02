/**
 * Service to handle communication with the Ollama API through a proxy server
 */

// Get the proxy server URL - always use localhost:3001 since we're in an Electron app
// The Electron app runs the proxy server on port 3001
const PROXY_URL = 'http://localhost:3001';

/**
 * Send a prompt to the Ollama API
 * @param {string} baseUrl - The base URL of the Ollama API (e.g., http://localhost:11434)
 * @param {string} prompt - The prompt to send to the model
 * @param {string} model - The model to use (default: "llama2")
 * @returns {Promise} - A promise that resolves to the API response
 */
export const sendPrompt = async (baseUrl, prompt, model = "llama2") => {
  try {
    const response = await fetch(`${PROXY_URL}/proxy/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ollamaUrl: baseUrl, // Pass the Ollama URL to the proxy
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending prompt to Ollama:', error);
    throw error;
  }
};

/**
 * Test the connection to the Ollama API
 * @param {string} baseUrl - The base URL of the Ollama API
 * @returns {Promise<boolean>} - A promise that resolves to true if the connection is successful
 */
export const testConnection = async (baseUrl) => {
  try {
    const response = await fetch(`${PROXY_URL}/proxy/api/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ollamaUrl: baseUrl, // Pass the Ollama URL to the proxy
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Error: ${response.status} ${response.statusText}`);
    }

    // If we get here, the connection was successful
    return true;
  } catch (error) {
    console.error('Error testing connection to Ollama:', error);
    throw error;
  }
};

/**
 * Get available models from the Ollama API
 * @param {string} baseUrl - The base URL of the Ollama API
 * @returns {Promise<Array>} - A promise that resolves to an array of available models
 */
export const getModels = async (baseUrl) => {
  try {
    const response = await fetch(`${PROXY_URL}/api/models?url=${encodeURIComponent(baseUrl)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Error getting models from Ollama:', error);
    throw error;
  }
};
