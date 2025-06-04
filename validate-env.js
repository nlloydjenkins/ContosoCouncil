#!/usr/bin/env node

/**
 * Environment Validation Script
 * 
 * This script validates that all required environment variables are properly configured
 * for the Contoso Council Planning Portal.
 * 
 * Usage: node validate-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Required environment variables
const requiredVars = [
  'VITE_AZURE_TENANT_ID',
  'VITE_AZURE_CLIENT_ID', 
  'VITE_AZURE_CLIENT_SECRET',
  'VITE_DIRECTLINE_SECRET'
];

// Optional environment variables with defaults
const optionalVars = {
  'VITE_APP_BASE_URL': 'http://localhost:3000'
};

console.log('🔍 Validating environment configuration...\n');

// Check if .env.local exists
const envLocalPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.error('❌ Error: .env.local file not found!');
  console.log('💡 Please create .env.local file using the provided template:');
  console.log('   cp .env.example .env.local');
  console.log('   Then edit .env.local with your actual Azure credentials');
  process.exit(1);
}

// Load environment variables from .env.local
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('📁 Found .env.local file\n');

// Validate required variables
let hasErrors = false;
const results = {
  required: [],
  optional: [],
  missing: [],
  placeholder: []
};

requiredVars.forEach(varName => {
  const value = envVars[varName];
  
  if (!value) {
    results.missing.push(varName);
    hasErrors = true;
  } else if (value.includes('your_') || value.includes('_here')) {
    results.placeholder.push({ name: varName, value });
    hasErrors = true;
  } else {
    results.required.push({ name: varName, value: maskSecret(value) });
  }
});

// Check optional variables
Object.entries(optionalVars).forEach(([varName, defaultValue]) => {
  const value = envVars[varName] || defaultValue;
  results.optional.push({ name: varName, value });
});

// Display results
console.log('📋 Validation Results:\n');

if (results.required.length > 0) {
  console.log('✅ Required variables configured:');
  results.required.forEach(({ name, value }) => {
    console.log(`   ${name}: ${value}`);
  });
  console.log('');
}

if (results.optional.length > 0) {
  console.log('ℹ️  Optional variables:');
  results.optional.forEach(({ name, value }) => {
    console.log(`   ${name}: ${value}`);
  });
  console.log('');
}

if (results.missing.length > 0) {
  console.log('❌ Missing required variables:');
  results.missing.forEach(name => {
    console.log(`   ${name}`);
  });
  console.log('');
}

if (results.placeholder.length > 0) {
  console.log('⚠️  Variables with placeholder values:');
  results.placeholder.forEach(({ name, value }) => {
    console.log(`   ${name}: ${value}`);
  });
  console.log('');
}

// Final status
if (!hasErrors) {
  console.log('🎉 All required environment variables are properly configured!');
  console.log('💡 You can now start the development server with: npm run dev');
} else {
  console.log('❌ Environment configuration incomplete!');
  console.log('📚 Please refer to AZURE_SETUP.md for detailed setup instructions');
  console.log('🔗 Or follow the Azure configuration guide in the README.md');
  process.exit(1);
}

/**
 * Mask sensitive values for display
 */
function maskSecret(value) {
  if (!value || value.length < 8) {
    return '***';
  }
  
  const start = value.substring(0, 4);
  const end = value.substring(value.length - 4);
  const middle = '*'.repeat(Math.min(value.length - 8, 8));
  
  return `${start}${middle}${end}`;
}
