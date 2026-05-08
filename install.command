#!/bin/zsh

cd -- "$(dirname "$0")"

echo "Starting installation for Constellation..."

# Install Root (if needed)
if [ -f "package.json" ]; then
    echo "Installing Root dependencies..."
    npm install
fi

# Install Frontend
echo "Installing Frontend dependencies..."
cd frontend && npm install && cd ..

# Install Backend
echo "Installing Backend dependencies..."
cd backend && npm install && cd ..

# Install Unit Tests
echo "Installing Unit Test dependencies..."
cd unitTests/frontend && npm install && cd ../..
cd unitTests/backend && npm install && cd ../..

# Install Integration Tests
echo "Installing Integration Test dependencies..."
cd integrationTests/frontend && npm install && cd ../..

echo "All dependencies installed successfully."