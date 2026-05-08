#!/bin/zsh

cd -- "$(dirname "$0")"

echo "Starting Cypress for React App (Frontend) Integration Tests..."
npm run cypress:open