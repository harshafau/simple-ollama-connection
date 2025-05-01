import { useState } from 'react'
import './App.css'
import ConnectionForm from './components/ConnectionForm'
import PromptForm from './components/PromptForm'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [ollamaUrl, setOllamaUrl] = useState('')

  const handleConnectionSuccess = (url) => {
    setOllamaUrl(url)
    setIsConnected(true)
  }

  return (
    <div className="app-container">
      <header>
        <h1>Ollama Web Interface</h1>
        <p>Connect to your local Ollama instance and chat with your LLMs</p>
      </header>

      <main>
        {!isConnected ? (
          <ConnectionForm onConnectionSuccess={handleConnectionSuccess} />
        ) : (
          <>
            <div className="connection-info">
              <p>Connected to: <strong>{ollamaUrl}</strong></p>
              <button onClick={() => setIsConnected(false)}>Disconnect</button>
            </div>
            <PromptForm ollamaUrl={ollamaUrl} />
          </>
        )}
      </main>

      <footer>
        <p>
          Note: This app requires a local Ollama instance and CORS enabled in your browser.
        </p>
      </footer>
    </div>
  )
}

export default App
