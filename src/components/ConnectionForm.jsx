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
        Make sure you have Ollama running locally on your machine.
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
          <div className="connection-help">
            <h3>Connection Issues?</h3>
            <p>
              Make sure:
              <ul>
                <li>Ollama is running on your machine</li>
                <li>The URL is correct (usually http://localhost:11434)</li>
                <li>Your firewall is not blocking the connection</li>
              </ul>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConnectionForm;
