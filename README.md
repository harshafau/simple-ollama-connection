# Ollama Web Interface

A web application that connects to your local Ollama LLM instance and allows you to interact with it through a browser.

## Features

- Connect to your local Ollama instance
- Send prompts to any model installed in your Ollama
- View responses in a clean, user-friendly interface
- Works from any web browser with CORS enabled

## Prerequisites

- [Ollama](https://ollama.ai/) installed and running on your local machine
- A web browser with CORS enabled (you can use extensions like "CORS Unblock" or "Allow CORS")

## Getting Started

### Development

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

### Production Build

1. Build the application:
   ```
   npm run build
   ```
2. The built files will be in the `dist` directory
3. You can serve these files using any static file server

## Deployment Options

### Option 1: GitHub Pages

1. Create a GitHub repository
2. Push your code to the repository
3. Set up GitHub Pages to serve from the `dist` folder

### Option 2: Netlify/Vercel

1. Create an account on [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/)
2. Connect your GitHub repository
3. Set the build command to `npm run build`
4. Set the publish directory to `dist`

### Option 3: Any Static File Server

1. Build the application using `npm run build`
2. Upload the contents of the `dist` directory to any static file server
3. Access your application through the server's URL

## Important Notes

- This application requires CORS to be enabled in your browser to connect to your local Ollama instance
- The application does not store any data; all communication happens directly between your browser and your local Ollama instance
- Make sure your Ollama instance is running before attempting to connect

## License

MIT
