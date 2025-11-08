#!/usr/bin/env node

/**
 * Validation script to check if the Electron + SQLite installation is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Electron + SQLite Installation\n');
console.log('='.repeat(50));

let allChecksPass = true;

// Check 1: package.json exists and has required fields
console.log('\n✓ Checking package.json...');
try {
  const packageJson = require('./package.json');
  
  if (!packageJson.dependencies || !packageJson.dependencies['better-sqlite3']) {
    console.log('  ❌ Missing better-sqlite3 dependency');
    allChecksPass = false;
  } else {
    console.log('  ✓ better-sqlite3 dependency found');
  }
  
  if (!packageJson.devDependencies || !packageJson.devDependencies['electron']) {
    console.log('  ❌ Missing electron devDependency');
    allChecksPass = false;
  } else {
    console.log('  ✓ electron devDependency found');
  }
  
  if (!packageJson.devDependencies || !packageJson.devDependencies['electron-builder']) {
    console.log('  ❌ Missing electron-builder devDependency');
    allChecksPass = false;
  } else {
    console.log('  ✓ electron-builder devDependency found');
  }
  
  if (packageJson.main !== 'main.js') {
    console.log('  ❌ Main entry point should be main.js');
    allChecksPass = false;
  } else {
    console.log('  ✓ Main entry point correctly set to main.js');
  }
  
  const requiredScripts = ['start', 'dev', 'build', 'build:mac', 'build:win', 'build:linux'];
  for (const script of requiredScripts) {
    if (!packageJson.scripts || !packageJson.scripts[script]) {
      console.log(`  ❌ Missing script: ${script}`);
      allChecksPass = false;
    }
  }
  console.log('  ✓ All required scripts present');
  
} catch (error) {
  console.log('  ❌ Error reading package.json:', error.message);
  allChecksPass = false;
}

// Check 2: Required files exist
console.log('\n✓ Checking required files...');
const requiredFiles = [
  'main.js',
  'preload.js',
  'database.js',
  'README.md',
  'INSTALL.md',
  '.gitignore'
];

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${file} exists`);
  } else {
    console.log(`  ❌ ${file} is missing`);
    allChecksPass = false;
  }
}

// Check 3: node_modules exists
console.log('\n✓ Checking dependencies installation...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('  ✓ node_modules directory exists');
  
  // Check for specific critical modules
  const criticalModules = ['electron', 'better-sqlite3', 'electron-builder'];
  for (const module of criticalModules) {
    const modulePath = path.join(nodeModulesPath, module);
    if (fs.existsSync(modulePath)) {
      console.log(`  ✓ ${module} installed`);
    } else {
      console.log(`  ❌ ${module} not installed`);
      allChecksPass = false;
    }
  }
} else {
  console.log('  ❌ node_modules directory does not exist');
  console.log('  ℹ️  Run "npm install" to install dependencies');
  allChecksPass = false;
}

// Check 4: Validate JavaScript files syntax
console.log('\n✓ Validating JavaScript syntax...');
const jsFiles = ['main.js', 'preload.js', 'database.js'];
const { execSync } = require('child_process');

for (const file of jsFiles) {
  try {
    execSync(`node --check ${file}`, { stdio: 'pipe' });
    console.log(`  ✓ ${file} syntax is valid`);
  } catch (error) {
    console.log(`  ❌ ${file} has syntax errors`);
    allChecksPass = false;
  }
}

// Check 5: Test database functionality
console.log('\n✓ Testing database functionality...');
try {
  const Database = require('better-sqlite3');
  const testDb = new Database(':memory:');
  testDb.close();
  console.log('  ✓ better-sqlite3 is working correctly');
} catch (error) {
  console.log('  ❌ Error testing SQLite:', error.message);
  console.log('  ℹ️  You may need to rebuild: npm rebuild better-sqlite3');
  allChecksPass = false;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(50));

if (allChecksPass) {
  console.log('\n✅ All checks passed! Your Electron + SQLite setup is ready.');
  console.log('\nNext steps:');
  console.log('  1. Run "npm start" to launch the application');
  console.log('  2. Run "npm run build" to create distributable packages');
  console.log('  3. Check README.md for more information\n');
  process.exit(0);
} else {
  console.log('\n❌ Some checks failed. Please review the errors above.');
  console.log('\nCommon fixes:');
  console.log('  - Run "npm install" to install dependencies');
  console.log('  - Run "npm rebuild better-sqlite3" if SQLite fails');
  console.log('  - Check README.md for troubleshooting tips\n');
  process.exit(1);
}
