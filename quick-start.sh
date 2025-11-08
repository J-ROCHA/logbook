#!/bin/bash

# Quick Start Script for Logbook Electron App
# This script automates the installation and setup process

set -e  # Exit on error

echo "================================================"
echo "  Logbook Desktop App - Quick Start"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version is too old (found v$NODE_VERSION)"
    echo "Please upgrade to Node.js v16 or higher"
    exit 1
fi

echo "✓ Node.js $(node --version) detected"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✓ Dependencies installed successfully"
    echo ""
else
    echo "✓ Dependencies already installed"
    echo ""
fi

# Verify critical files exist
echo "🔍 Verifying installation..."
REQUIRED_FILES=("main.js" "preload.js" "database.js")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file found"
    else
        echo "❌ $file missing!"
        exit 1
    fi
done
echo ""

# Run database tests
echo "🧪 Running database tests..."
if node test-database.js; then
    echo ""
    echo "✓ All tests passed!"
else
    echo ""
    echo "❌ Tests failed!"
    exit 1
fi
echo ""

echo "================================================"
echo "  Installation Complete! 🎉"
echo "================================================"
echo ""
echo "To start the application, run:"
echo ""
echo "  npm start"
echo ""
echo "To build for distribution:"
echo ""
echo "  npm run build        # Current platform"
echo "  npm run build:mac    # macOS"
echo "  npm run build:win    # Windows"
echo "  npm run build:linux  # Linux"
echo ""
echo "For more information, see README.md or INSTALL.md"
echo "================================================"
