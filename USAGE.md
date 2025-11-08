# Usage Examples - Logbook Electron Desktop App

This guide provides practical examples of how to use the Logbook desktop application and integrate with the SQLite database.

## Quick Start

### Starting the Application

```bash
# Option 1: Use quick start script (recommended)
./quick-start.sh        # Linux/macOS
quick-start.bat         # Windows

# Option 2: Manual start
npm start
```

### Validating Installation

```bash
# Run validation script
node validate-setup.js

# Run database tests
node test-database.js
```

## Using the Built-in UI

When you run `npm start`, the application opens with a simple built-in interface:

1. **Add a Log Entry:**
   - Enter a title in the "Title" field
   - Enter content in the "Content" textarea
   - Click "Add Entry" button

2. **View Log Entries:**
   - All entries appear in the "Log Entries" section
   - Sorted by date (newest first)

3. **Delete an Entry:**
   - Click the "Delete" button on any entry

## Database Operations

### Using the electronAPI (in renderer process)

If you're building a custom UI, you can use these APIs:

```javascript
// Get all logs
const logs = await window.electronAPI.getLogs();
console.log(logs); // Array of log objects

// Add a new log
const newLog = await window.electronAPI.addLog({
  title: 'My First Entry',
  content: 'This is the content of my first log entry'
});

// Update a log
await window.electronAPI.updateLog(1, {
  title: 'Updated Title',
  content: 'Updated content'
});

// Delete a log
await window.electronAPI.deleteLog(1);
```

### Direct Database Access (in main process)

If you need to extend the functionality in `database.js`:

```javascript
const { initDatabase, getAllLogs, addLog, updateLog, deleteLog } = require('./database');

// Initialize the database
initDatabase();

// Get all logs
const logs = getAllLogs();

// Add a log
const newLog = addLog({
  title: 'Sample Title',
  content: 'Sample content'
});

// Update a log
updateLog(1, {
  title: 'Updated Title',
  content: 'Updated content'
});

// Delete a log
deleteLog(1);

// Search logs (extend database.js)
const results = searchLogs('keyword');
```

## Building for Distribution

### Build for Current Platform

```bash
npm run build
```

This creates a distributable package in the `dist/` folder:
- **macOS**: `.dmg` file
- **Windows**: `.exe` installer
- **Linux**: `.AppImage` file

### Build for Specific Platform

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

### Installing the Built Package

1. Navigate to `dist/` folder
2. Run the installer for your platform:
   - **macOS**: Open the `.dmg` file and drag to Applications
   - **Windows**: Run the `.exe` installer
   - **Linux**: Make the `.AppImage` executable and run it

## Customizing the Application

### Changing the Window Size

Edit `main.js`:

```javascript
mainWindow = new BrowserWindow({
  width: 1600,    // Change from 1200
  height: 1000,   // Change from 800
  // ... other options
});
```

### Adding New Database Fields

1. Update the schema in `database.js`:

```javascript
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,              // New field
    priority INTEGER DEFAULT 0, // New field
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;
```

2. Update the `addLog` function:

```javascript
function addLog(log) {
  const stmt = db.prepare(
    'INSERT INTO logs (title, content, category, priority) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(log.title, log.content, log.category, log.priority);
  return { id: result.lastInsertRowid, ...log };
}
```

3. Expose the new functionality in `preload.js` and `main.js`

### Using a Custom Frontend

To use the React frontend instead of the built-in HTML:

1. Build the React frontend:
```bash
cd frontend
npm install
npm run build
```

2. Update `main.js` to load the React build:
```javascript
const frontendPath = path.join(__dirname, 'frontend', 'build', 'index.html');
mainWindow.loadFile(frontendPath);
```

## Database Location

The SQLite database is stored in:

- **Windows**: `C:\Users\<username>\AppData\Roaming\logbook-desktop\logbook.db`
- **macOS**: `/Users/<username>/Library/Application Support/logbook-desktop/logbook.db`
- **Linux**: `/home/<username>/.config/logbook-desktop/logbook.db`

### Accessing the Database File

```bash
# macOS/Linux
sqlite3 ~/Library/Application\ Support/logbook-desktop/logbook.db

# Windows (using SQLite command line)
sqlite3 %APPDATA%\logbook-desktop\logbook.db
```

### Querying the Database

```sql
-- View all logs
SELECT * FROM logs ORDER BY created_at DESC;

-- Search by title
SELECT * FROM logs WHERE title LIKE '%keyword%';

-- Get recent logs
SELECT * FROM logs WHERE created_at > datetime('now', '-7 days');

-- Count total logs
SELECT COUNT(*) as total FROM logs;
```

## Common Use Cases

### 1. Daily Journal Application

```javascript
// Add daily entry
await window.electronAPI.addLog({
  title: new Date().toLocaleDateString(),
  content: 'Today\'s activities and notes...'
});
```

### 2. Project Log

```javascript
// Add project update
await window.electronAPI.addLog({
  title: 'Project Milestone Reached',
  content: 'Completed feature X, moved to testing phase'
});
```

### 3. Error/Bug Tracking

```javascript
// Log an error
await window.electronAPI.addLog({
  title: 'Bug: Login issue',
  content: 'Users unable to login after password reset. Stack trace: ...'
});
```

## Advanced Features

### Export Logs to JSON

Add this to your renderer process:

```javascript
async function exportLogs() {
  const logs = await window.electronAPI.getLogs();
  const json = JSON.stringify(logs, null, 2);
  
  // Create download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'logbook-export.json';
  a.click();
}
```

### Import Logs from JSON

Add to main process (`main.js`):

```javascript
ipcMain.handle('import-logs', async (event, logsArray) => {
  for (const log of logsArray) {
    addLog({ title: log.title, content: log.content });
  }
  return getAllLogs();
});
```

### Search Functionality

Already implemented in `database.js`:

```javascript
const results = searchLogs('keyword');
```

Add IPC handler in `main.js`:

```javascript
ipcMain.handle('search-logs', async (event, keyword) => {
  return searchLogs(keyword);
});
```

## Troubleshooting

### Issue: Database locked

**Cause**: Multiple instances trying to access the database

**Solution**: Close all instances and restart

### Issue: Logs not persisting

**Cause**: Database not initialized properly

**Solution**: 
```bash
# Check database location
# Delete the database file and restart the app
# It will create a fresh database
```

### Issue: Cannot build for other platforms

**Cause**: Platform-specific build tools not available

**Solution**: 
- macOS builds require macOS
- Windows builds work on Windows or macOS with Wine
- Linux builds work on any platform

## Performance Tips

1. **Limit results**: When displaying logs, paginate for better performance
2. **Index searches**: If you add search, create indexes in SQLite
3. **Archive old data**: Move old logs to archive table for faster queries

## Security Best Practices

1. **Don't store sensitive data** in plain text
2. **Use encryption** if storing passwords or API keys
3. **Validate input** before adding to database
4. **Keep Electron updated** for security patches

## Next Steps

- Explore the React frontend integration
- Add categories/tags to logs
- Implement search and filtering
- Add export/import functionality
- Create custom themes
- Add keyboard shortcuts

For more information, see the main README.md file.
