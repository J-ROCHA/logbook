const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

let db;

/**
 * Initialize the SQLite database
 */
function initDatabase() {
  try {
    // Store database in user data directory
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'logbook.db');
    
    console.log('Initializing database at:', dbPath);
    
    db = new Database(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Create tables if they don't exist
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
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Get all log entries
 */
function getAllLogs() {
  try {
    const stmt = db.prepare('SELECT * FROM logs ORDER BY created_at DESC');
    return stmt.all();
  } catch (error) {
    console.error('Error getting logs:', error);
    return [];
  }
}

/**
 * Get a single log entry by ID
 */
function getLogById(id) {
  try {
    const stmt = db.prepare('SELECT * FROM logs WHERE id = ?');
    return stmt.get(id);
  } catch (error) {
    console.error('Error getting log by ID:', error);
    return null;
  }
}

/**
 * Add a new log entry
 */
function addLog(log) {
  try {
    const stmt = db.prepare(
      'INSERT INTO logs (title, content) VALUES (?, ?)'
    );
    const result = stmt.run(log.title, log.content);
    return { id: result.lastInsertRowid, ...log };
  } catch (error) {
    console.error('Error adding log:', error);
    throw error;
  }
}

/**
 * Update an existing log entry
 */
function updateLog(id, log) {
  try {
    const stmt = db.prepare(
      'UPDATE logs SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    const result = stmt.run(log.title, log.content, id);
    return result.changes > 0;
  } catch (error) {
    console.error('Error updating log:', error);
    throw error;
  }
}

/**
 * Delete a log entry
 */
function deleteLog(id) {
  try {
    const stmt = db.prepare('DELETE FROM logs WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting log:', error);
    throw error;
  }
}

/**
 * Search logs by keyword
 */
function searchLogs(keyword) {
  try {
    const stmt = db.prepare(
      'SELECT * FROM logs WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC'
    );
    const searchPattern = `%${keyword}%`;
    return stmt.all(searchPattern, searchPattern);
  } catch (error) {
    console.error('Error searching logs:', error);
    return [];
  }
}

/**
 * Close the database connection
 */
function closeDatabase() {
  if (db) {
    db.close();
    console.log('Database connection closed');
  }
}

module.exports = {
  initDatabase,
  getAllLogs,
  getLogById,
  addLog,
  updateLog,
  deleteLog,
  searchLogs,
  closeDatabase
};
