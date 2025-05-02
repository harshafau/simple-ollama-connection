const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

// Create the Express app for the proxy server
const createProxyServer = () => {
  const server = express();
  const PORT = 3001;

  // Enable CORS
  server.use(cors());
  server.use(express.json());

  // Proxy endpoint for Ollama API generate
  server.post('/proxy/api/generate', async (req, res) => {
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
  server.post('/proxy/api/tags', async (req, res) => {
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

  // Start the server
  server.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
  });

  return server;
};

// Create the main browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icons/icon.png')
  });

  // Load the app
  if (isDev) {
    // In development, load from the dev server
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Start the proxy server and create the window when Electron is ready
app.whenReady().then(() => {
  // Start the proxy server
  createProxyServer();
  
  // Create the main window
  createWindow();

  // On macOS, re-create the window when the dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  dialog.showErrorBox('Error', `An unexpected error occurred: ${error.message}`);
});
