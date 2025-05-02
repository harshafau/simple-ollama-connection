import { useState, useEffect } from 'react';
import { sendPrompt, getModels } from '../services/ollamaService';
import Markdown from 'markdown-to-jsx';

/**
 * Component for sending prompts to the Ollama API
 */
function PromptForm({ ollamaUrl }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState('llama2');
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState(null);

  // Fetch available models when the URL changes
  useEffect(() => {
    if (ollamaUrl) {
      fetchModels();
    }
  }, [ollamaUrl]);

  // Function to fetch available models
  const fetchModels = async () => {
    setIsLoadingModels(true);
    setModelError(null);

    try {
      const models = await getModels(ollamaUrl);
      setAvailableModels(models);

      // Set the default model to the first available model if there are any
      if (models.length > 0) {
        setModel(models[0].name);
      }
    } catch (err) {
      console.error('Error fetching models:', err);
      setModelError(err.message || 'Failed to fetch available models');
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await sendPrompt(ollamaUrl, prompt, model);
      setResponse(result);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your prompt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prompt-container">
      <h2>Chat with Your Local LLM</h2>

      <div className="model-selector">
        <label htmlFor="model">Model:</label>
        {isLoadingModels ? (
          <div className="loading-models">Loading available models...</div>
        ) : modelError ? (
          <div className="model-error">
            <p>{modelError}</p>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Enter model name (e.g., llama2)"
            />
          </div>
        ) : availableModels.length > 0 ? (
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="model-dropdown"
          >
            {availableModels.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name} ({(model.size / (1024 * 1024 * 1024)).toFixed(1)} GB)
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Enter model name (e.g., llama2)"
          />
        )}
        <button
          type="button"
          className="refresh-models-btn"
          onClick={fetchModels}
          disabled={isLoadingModels}
        >
          {isLoadingModels ? "Loading..." : "Refresh Models"}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="prompt">Your Prompt:</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            rows={5}
            required
          />
        </div>

        <button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? 'Generating...' : 'Send Prompt'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="response">
          <h3>Response:</h3>
          <div className="response-content">
            <Markdown options={{
              forceBlock: true,
              overrides: {
                pre: {
                  props: {
                    className: 'code-block'
                  }
                },
                code: {
                  props: {
                    className: 'code'
                  }
                }
              }
            }}>
              {response.response}
            </Markdown>
          </div>
          {response.eval_count && (
            <div className="response-meta">
              <p>Tokens: {response.eval_count}</p>
              <p>Time: {(response.eval_duration / 1000000000).toFixed(2)}s</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PromptForm;
