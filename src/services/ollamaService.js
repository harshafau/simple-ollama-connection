/**
 * Service to handle communication with the Ollama API
 */

/**
 * Send a prompt to the Ollama API
 * @param {string} baseUrl - The base URL of the Ollama API (e.g., http://localhost:11434)
 * @param {string} prompt - The prompt to send to the model
 * @param {string} model - The model to use (default: "llama2")
 * @returns {Promise} - A promise that resolves to the API response
 */
export const sendPrompt = async (baseUrl, prompt, model = "llama2") => {
  try {
    // Remove trailing slash if present
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    const response = await fetch(`${cleanBaseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
    // Remove trailing slash if present
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    const response = await fetch(`${cleanBaseUrl}/api/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // If we get here, the connection was successful
    return true;
  } catch (error) {
    console.error('Error testing connection to Ollama:', error);
    throw error;
  }
};
