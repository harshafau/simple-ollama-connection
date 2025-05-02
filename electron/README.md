# Simple Ollama Connection - Desktop App

A desktop application that connects to your local Ollama LLM instance and allows you to interact with it through a clean, user-friendly interface.

## Features

- Connect to your local Ollama instance
- Send prompts to any model installed in your Ollama
- View responses in a clean, user-friendly interface
- Available for both macOS and Windows

## Development

1. Install dependencies:
   ```
   npm install
   cd electron && npm install
   ```

2. Run the app in development mode:
   ```
   cd electron && npm run dev
   ```

## Building the App

### For macOS:
```
cd electron && npm run build && npm run package-mac
```

### For Windows:
```
cd electron && npm run build && npm run package-win
```

### For both platforms:
```
cd electron && npm run build && npm run package-all
```

The packaged applications will be available in the `electron/dist` directory.

## Requirements

- Node.js 16+
- Ollama installed and running on your machine
