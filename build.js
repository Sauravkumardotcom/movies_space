#!/usr/bin/env node

/**
 * Build script for Vercel deployment
 * Copies movies_space dist to root vercel_out directory for proper serving
 */

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'movies_space', 'dist');
const outputDir = path.join(__dirname, 'vercel_out');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Recursive copy function
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    const stat = fs.statSync(srcFile);

    if (stat.isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

try {
  copyDir(sourceDir, outputDir);
  console.log('✅ Build successful! Copied dist files to vercel_out/');
  process.exit(0);
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
}
