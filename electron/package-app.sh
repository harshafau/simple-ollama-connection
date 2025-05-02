#!/bin/bash

# Build the React app
echo "Building React app..."
cd ..
npm run build

# Return to electron directory
cd electron

# Package for macOS
echo "Packaging for macOS..."
npm run package-mac

# Package for Windows
echo "Packaging for Windows..."
npm run package-win

echo "Packaging complete! Check the dist directory for the packaged applications."
