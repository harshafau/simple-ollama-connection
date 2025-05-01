# Ollama Web Interface

A web application that connects to your local Ollama LLM instance and allows you to interact with it through a browser.

## Features

- Connect to your local Ollama instance
- Send prompts to any model installed in your Ollama
- View responses in a clean, user-friendly interface
- Works from any web browser without requiring CORS extensions
- Uses a proxy server to handle CORS issues

## Prerequisites

- [Ollama](https://ollama.ai/) installed and running on your local machine

## Getting Started

### Development

1. Clone this repository
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Install proxy server dependencies:
   ```
   cd server && npm install && cd ..
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Start the proxy server in a separate terminal:
   ```
   cd server && node server.js
   ```
6. Open your browser and navigate to `http://localhost:3000`

### Production Build

1. Build the application:
   ```
   npm run build
   ```
2. The built files will be in the `dist` directory
3. Start the proxy server which will also serve the static files:
   ```
   cd server && node server.js
   ```
4. Access the application at `http://localhost:3001`

## Deployment Options

### Option 1: Heroku

1. Create a Heroku account and install the Heroku CLI
2. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```
3. Push your code to Heroku:
   ```
   git push heroku main
   ```
4. The Procfile will automatically start the proxy server

### Option 2: Render (Recommended)

1. Create an account on [Render](https://render.com/)
2. Go to the Dashboard and click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `ollama-web-interface` (or any name you prefer)
   - Environment: `Node`
   - Region: Choose the closest to you
   - Branch: `main`
   - Build Command: `npm install && npm run build && cd server && npm install`
   - Start Command: `cd server && node server.js`
   - Instance Type: Free
   - Environment Variables (optional, these are set in render.yaml):
     - `PORT`: 10000 (Render will set this automatically)
     - `NODE_ENV`: production
     - `CORS_ORIGIN`: * (allows requests from any origin)
5. Click "Create Web Service"
6. Wait for the deployment to complete (this may take a few minutes)
7. Once deployed, you can access your application at the URL provided by Render

### Option 3: Self-hosted Server

1. Build the application using `npm run build`
2. Install the server dependencies:
   ```
   cd server && npm install
   ```
3. Start the server:
   ```
   node server.js
   ```
4. Access your application through the server's URL

## Important Notes

- The application uses a proxy server to handle CORS issues, so you don't need a browser extension
- The application does not store any data; all communication happens securely through the proxy server
- Make sure your Ollama instance is running before attempting to connect
- The proxy server only forwards requests to your local Ollama instance and doesn't modify the data

## How It Works

1. The frontend sends requests to the proxy server
2. The proxy server forwards these requests to your local Ollama instance
3. The proxy server receives the response from Ollama and sends it back to the frontend
4. This approach avoids CORS issues that would normally occur when accessing a local API from a deployed website

## Environment Variables

The application uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | The port on which the server will run | 3001 |
| NODE_ENV | The environment mode (development/production) | development |
| CORS_ORIGIN | Allowed origins for CORS | * (all origins) |

These variables are automatically set when deploying to Render using the render.yaml configuration file.

## License

MIT
