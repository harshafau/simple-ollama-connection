const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Proxy endpoint for Ollama API
app.post('/proxy/api/generate', async (req, res) => {
  try {
    const { ollamaUrl, ...requestData } = req.body;
    
    if (!ollamaUrl) {
      return res.status(400).json({ error: 'Ollama URL is required' });
    }

    // Remove trailing slash if present
    const cleanBaseUrl = ollamaUrl.endsWith('/') ? ollamaUrl.slice(0, -1) : ollamaUrl;
    
    const response = await axios.post(`${cleanBaseUrl}/api/generate`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to Ollama:', error.message);
    
    if (error.response) {
      // Forward Ollama's error response
      return res.status(error.response.status).json({
        error: error.response.data.error || error.message,
        status: error.response.status
      });
    }
    
    res.status(500).json({ 
      error: error.message,
      details: 'Could not connect to Ollama. Make sure Ollama is running and the URL is correct.'
    });
  }
});

// Proxy endpoint for testing connection
app.post('/proxy/api/tags', async (req, res) => {
  try {
    const { ollamaUrl } = req.body;
    
    if (!ollamaUrl) {
      return res.status(400).json({ error: 'Ollama URL is required' });
    }

    // Remove trailing slash if present
    const cleanBaseUrl = ollamaUrl.endsWith('/') ? ollamaUrl.slice(0, -1) : ollamaUrl;
    
    const response = await axios.get(`${cleanBaseUrl}/api/tags`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error testing connection to Ollama:', error.message);
    
    if (error.response) {
      // Forward Ollama's error response
      return res.status(error.response.status).json({
        error: error.response.data.error || error.message,
        status: error.response.status
      });
    }
    
    res.status(500).json({ 
      error: error.message,
      details: 'Could not connect to Ollama. Make sure Ollama is running and the URL is correct.'
    });
  }
});

// For any other request, send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Access the app at http://localhost:${PORT}`);
});
