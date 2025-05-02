# Simple Ollama Connection

A desktop application that connects to your local Ollama LLM instance and allows you to interact with it through a clean, user-friendly interface.

## Features

- Connect to your local Ollama instance
- Send prompts to any model installed in your Ollama
- View responses in a clean, user-friendly interface
- Available as a desktop application for macOS and Windows
- No CORS issues or browser extensions needed

## Prerequisites

- [Ollama](https://ollama.ai/) installed and running on your local machine

## Running the Desktop Application

### Quick Start

1. Make sure Ollama is running on your machine
2. Run the application using the provided script:
   ```
   ./run-app.sh
   ```
3. The application will open in a new window
4. Enter your Ollama URL (default: `http://localhost:11434`)
5. Connect to your Ollama instance
6. Start chatting with your local LLMs

### Development

1. Clone this repository
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Install Electron dependencies:
   ```
   cd electron && npm install && cd ..
   ```
4. Start the Electron app in development mode:
   ```
   cd electron && npm start
   ```

### Building the Desktop Application

1. Build the React app:
   ```
   npm run build
   ```
2. Package the application for your platform:
   ```
   cd electron && npm run package-mac    # For macOS
   cd electron && npm run package-win    # For Windows
   cd electron && npm run package-all    # For both platforms
   ```
3. The packaged applications will be available in the `electron/dist` directory

## Distribution Options

### Option 1: Direct Distribution

1. Package the application for the desired platforms (see "Building the Desktop Application" above)
2. Distribute the packaged applications directly to users
3. Users can run the application by:
   - macOS: Double-clicking the `.app` file or opening the `.dmg` file
   - Windows: Running the installer or extracting the zip file and running the `.exe` file

### Option 2: GitHub Releases

1. Package the application for all platforms
2. Create a new release on GitHub
3. Upload the packaged applications as release assets
4. Users can download the appropriate version for their platform

### Option 3: Custom Installer

1. Package the application for the desired platforms
2. Create a custom installer that:
   - Installs the application
   - Creates desktop shortcuts
   - Sets up auto-updates (if desired)
3. Distribute the installer to users

## Important Notes

- Make sure your Ollama instance is running before starting the application
- The application does not store any data; all communication happens directly with your local Ollama instance
- The desktop application includes a built-in proxy server to handle CORS issues

## How It Works

1. The Electron app runs a local proxy server in the background
2. The frontend sends requests to this proxy server
3. The proxy server forwards these requests to your local Ollama instance
4. The proxy server receives the response from Ollama and sends it back to the frontend
5. This approach avoids CORS issues that would normally occur when accessing a local API from a web browser

## Technical Details

- **Frontend**: React.js
- **Desktop Application**: Electron
- **Proxy Server**: Express.js
- **Communication**: RESTful API calls to Ollama

## License

MIT
