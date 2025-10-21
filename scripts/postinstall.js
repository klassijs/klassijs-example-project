#!/usr/bin/env node

/**
 * Post-install script to automatically install dependencies for klassijs-AI
 * This ensures that frontend, backend, and root dependencies are all installed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Running post-install script...');

// Check if klassijs-AI is installed
const klassijsAiPath = path.join(__dirname, '..', 'node_modules', 'klassijs-AI');

if (!fs.existsSync(klassijsAiPath)) {
  console.log('ℹ️  klassijs-AI not found, skipping post-install');
  process.exit(0);
}

console.log('📦 Found klassijs-AI, installing workspace dependencies...');

try {
  // Change to the klassijs-AI directory and install workspace dependencies
  process.chdir(klassijsAiPath);
  
  console.log('🔄 Installing workspace dependencies...');
  execSync('pnpm install', { 
    stdio: 'inherit',
    cwd: klassijsAiPath 
  });
  
  console.log('✅ klassijs-AI workspace dependencies installed successfully!');
  console.log('🚀 You can now run: pnpm run ai');
  
} catch (error) {
  console.error('❌ Error installing klassijs-AI dependencies:', error.message);
  process.exit(1);
}
