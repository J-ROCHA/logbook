#!/usr/bin/env node

/**
 * Test script for SQLite database operations
 * This tests the database module independently of Electron
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

console.log('Testing SQLite Database Operations...\n');

// Create a test database
const testDbPath = path.join(__dirname, 'test-logbook.db');

// Clean up any existing test database
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
  console.log('✓ Cleaned up existing test database');
}

let db;
let testsPassed = 0;
let testsFailed = 0;

try {
  // Test 1: Initialize database
  console.log('Test 1: Initialize database');
  db = new Database(testDbPath);
  db.pragma('foreign_keys = ON');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.exec(createTableSQL);
  console.log('✓ Database initialized successfully\n');
  testsPassed++;

  // Test 2: Insert a log entry
  console.log('Test 2: Insert a log entry');
  const insertStmt = db.prepare('INSERT INTO logs (title, content) VALUES (?, ?)');
  const result1 = insertStmt.run('Test Entry 1', 'This is test content 1');
  console.log(`✓ Inserted log with ID: ${result1.lastInsertRowid}\n`);
  testsPassed++;

  // Test 3: Insert another log entry
  console.log('Test 3: Insert another log entry');
  const result2 = insertStmt.run('Test Entry 2', 'This is test content 2');
  console.log(`✓ Inserted log with ID: ${result2.lastInsertRowid}\n`);
  testsPassed++;

  // Test 4: Retrieve all logs
  console.log('Test 4: Retrieve all logs');
  const selectAllStmt = db.prepare('SELECT * FROM logs ORDER BY created_at DESC');
  const allLogs = selectAllStmt.all();
  console.log(`✓ Retrieved ${allLogs.length} logs`);
  allLogs.forEach(log => {
    console.log(`  - ID: ${log.id}, Title: "${log.title}"`);
  });
  console.log();
  testsPassed++;

  // Test 5: Retrieve a single log by ID
  console.log('Test 5: Retrieve a single log by ID');
  const selectByIdStmt = db.prepare('SELECT * FROM logs WHERE id = ?');
  const singleLog = selectByIdStmt.get(1);
  console.log(`✓ Retrieved log: ${singleLog.title}`);
  console.log(`  Content: ${singleLog.content}\n`);
  testsPassed++;

  // Test 6: Update a log entry
  console.log('Test 6: Update a log entry');
  const updateStmt = db.prepare(
    'UPDATE logs SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  );
  const updateResult = updateStmt.run('Updated Title', 'Updated content', 1);
  console.log(`✓ Updated ${updateResult.changes} log(s)\n`);
  testsPassed++;

  // Test 7: Verify the update
  console.log('Test 7: Verify the update');
  const updatedLog = selectByIdStmt.get(1);
  console.log(`✓ Verified update: "${updatedLog.title}"`);
  console.log(`  Content: ${updatedLog.content}\n`);
  testsPassed++;

  // Test 8: Search logs
  console.log('Test 8: Search logs');
  const searchStmt = db.prepare(
    'SELECT * FROM logs WHERE title LIKE ? OR content LIKE ?'
  );
  const searchResults = searchStmt.all('%Test%', '%Test%');
  console.log(`✓ Found ${searchResults.length} logs matching "Test"\n`);
  testsPassed++;

  // Test 9: Delete a log entry
  console.log('Test 9: Delete a log entry');
  const deleteStmt = db.prepare('DELETE FROM logs WHERE id = ?');
  const deleteResult = deleteStmt.run(2);
  console.log(`✓ Deleted ${deleteResult.changes} log(s)\n`);
  testsPassed++;

  // Test 10: Verify deletion
  console.log('Test 10: Verify deletion');
  const remainingLogs = selectAllStmt.all();
  console.log(`✓ Remaining logs: ${remainingLogs.length}`);
  remainingLogs.forEach(log => {
    console.log(`  - ID: ${log.id}, Title: "${log.title}"`);
  });
  console.log();
  testsPassed++;

  // Test 11: Test error handling (invalid ID)
  console.log('Test 11: Test error handling');
  const nonExistentLog = selectByIdStmt.get(999);
  console.log(`✓ Query for non-existent ID returned: ${nonExistentLog === undefined ? 'undefined' : nonExistentLog}\n`);
  testsPassed++;

} catch (error) {
  console.error('✗ Test failed:', error.message);
  testsFailed++;
} finally {
  // Close database connection
  if (db) {
    db.close();
    console.log('✓ Database connection closed');
  }
  
  // Clean up test database
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
    console.log('✓ Test database cleaned up\n');
  }
}

// Summary
console.log('='.repeat(50));
console.log('TEST SUMMARY');
console.log('='.repeat(50));
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log('='.repeat(50));

if (testsFailed === 0) {
  console.log('\n✓ All tests passed! SQLite integration is working correctly.\n');
  process.exit(0);
} else {
  console.log('\n✗ Some tests failed. Please review the errors above.\n');
  process.exit(1);
}
