#!/bin/bash
# Render build script

# Install server dependencies
cd server
npm install

# Go back to root
cd ..

echo "Build complete!"
