#!/usr/bin/env node

/**
 * Test Runner and Setup Script
 * This script helps set up and run tests for MovieSpace
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

async function setup() {
  log('\n🎬 MovieSpace Test Setup\n', 'blue');

  try {
    // Create test directories
    log('📁 Creating test directories...', 'yellow');
    mkdirSync('src/test', { recursive: true });
    log('✅ Frontend test directory created', 'green');

    // Install dependencies
    log('\n📦 Installing frontend dependencies...', 'yellow');
    await runCommand('npm', ['install', '--save-dev', 'vitest', '@testing-library/react', '@testing-library/jest-dom', '@vitest/ui', 'jsdom'], process.cwd());
    log('✅ Frontend dependencies installed', 'green');

    // Run tests
    log('\n🧪 Running frontend tests...', 'yellow');
    await runCommand('npm', ['run', 'test', '--', 'run'], process.cwd());

    log('\n✅ All tests completed!', 'green');
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

setup();
