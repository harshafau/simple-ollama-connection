const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
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

  // Determine the correct path for static files
  const distPath = isDev
    ? path.join(__dirname, '../dist')
    : path.join(process.resourcesPath, 'dist');

  // Serve static files from the React app
  server.use(express.static(distPath));
  console.log('Serving static files from:', distPath);

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

  // Proxy endpoint for testing connection and getting models
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

  // Endpoint to get available models
  server.get('/api/models', async (req, res) => {
    try {
      const ollamaUrl = req.query.url;

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

      // Extract just the model names for easier use
      const models = response.data.models.map(model => ({
        name: model.name,
        size: model.size,
        modified_at: model.modified_at
      }));

      res.json({ models });
    } catch (error) {
      console.error('Error getting models from Ollama:', error.message);

      if (error.response) {
        // Forward Ollama's error response
        return res.status(error.response.status).json({
          error: error.response.data.error || error.message,
          status: error.response.status
        });
      }

      res.status(500).json({
        error: error.message,
        details: 'Could not get models from Ollama. Make sure Ollama is running and the URL is correct.'
      });
    }
  });

  // Catch-all route to serve the index.html file
  server.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath);
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
  // Always load from our proxy server
  mainWindow.loadURL('http://localhost:3001');

  // Open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create application menu
function createMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    // App menu (macOS only)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),

    // File menu
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },

    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },

    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },

    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },

    // Help menu
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://github.com/harshafau/simple-ollama-connection');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Version information
function getAppVersion() {
  return app.getVersion();
}

// Set the app name
app.name = "SimpleOllamaConnection";

// Start the proxy server and create the window when Electron is ready
app.whenReady().then(() => {
  // Start the proxy server
  createProxyServer();

  // Create the main window
  createWindow();

  // Create application menu
  createMenu();

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

// Special handling for Windows
if (process.platform === 'win32') {
  console.log('Running on Windows platform');
}

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  dialog.showErrorBox('Error', `An unexpected error occurred: ${error.message}`);
});
