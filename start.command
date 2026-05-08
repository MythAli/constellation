#!/bin/zsh

cd -- "$(dirname "$0")"

# Get the absolute path of the project root
ROOT_DIR=$(pwd)

echo "Launching Constellation Services..."

# Launch Backend in a new window
osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR/backend' && npm start\""

# Launch Frontend in a new window
osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR/frontend' && npm start\""

echo "Servers are booting up in separate windows."