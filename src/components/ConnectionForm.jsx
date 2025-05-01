import { useState } from 'react';
import { testConnection } from '../services/ollamaService';

/**
 * Component for connecting to the Ollama API
 */
function ConnectionForm({ onConnectionSuccess }) {
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    setError(null);

    try {
      await testConnection(ollamaUrl);
      onConnectionSuccess(ollamaUrl);
    } catch (err) {
      setError(err.message || 'Failed to connect to Ollama. Please check the URL and ensure Ollama is running.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="connection-form">
      <h2>Connect to Your Local Ollama Instance</h2>
      <p>
        Make sure you have Ollama running locally and have enabled CORS in your browser.
      </p>
      
      <form onSubmit={handleConnect}>
        <div className="form-group">
          <label htmlFor="ollamaUrl">Ollama URL:</label>
          <input
            type="text"
            id="ollamaUrl"
            value={ollamaUrl}
            onChange={(e) => setOllamaUrl(e.target.value)}
            placeholder="http://localhost:11434"
            required
          />
        </div>
        
        <button type="submit" disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <div className="cors-help">
            <h3>CORS Issues?</h3>
            <p>
              If you're seeing CORS errors, you need to enable CORS in your browser.
              You can use a browser extension like "CORS Unblock" or "Allow CORS".
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConnectionForm;
