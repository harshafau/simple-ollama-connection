import { useState } from 'react';
import { sendPrompt } from '../services/ollamaService';

/**
 * Component for sending prompts to the Ollama API
 */
function PromptForm({ ollamaUrl }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState('llama2');

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
        <input
          type="text"
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Enter model name (e.g., llama2)"
        />
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
            {response.response}
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
