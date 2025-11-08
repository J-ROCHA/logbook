# Quick Installation Guide - Electron Desktop App + SQLite

This guide will help you quickly set up the Logbook Electron Desktop Application with SQLite database.

## Prerequisites Check

Before you begin, verify you have Node.js installed:

```bash
node --version
```

You should see version 16.x or higher. If not installed, download from [nodejs.org](https://nodejs.org/)

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd /path/to/logbook
```

### 2. Install Dependencies

```bash
npm install
```

This command installs:
- ✅ Electron (v28.0.0) - Desktop app framework
- ✅ better-sqlite3 (v9.2.2) - SQLite database
- ✅ electron-builder (v24.9.1) - Build tool

**Expected output:**
```
added 330 packages in ~30s
```

### 3. Verify Installation

Check that all files are present:

```bash
ls -la *.js *.json
```

You should see:
- `main.js` - Electron main process
- `preload.js` - IPC communication layer
- `database.js` - SQLite operations
- `package.json` - Project configuration

### 4. Run the Application

Start the app in development mode:

```bash
npm start
```

**What happens:**
1. Electron window opens
2. SQLite database is created automatically at:
   - Windows: `%APPDATA%/logbook-desktop/logbook.db`
   - macOS: `~/Library/Application Support/logbook-desktop/logbook.db`
   - Linux: `~/.config/logbook-desktop/logbook.db`
3. You can now create, view, update, and delete log entries

## Testing the SQLite Database

Once the app is running:

1. **Add a log entry:**
   - Enter a title (e.g., "First Entry")
   - Enter content (e.g., "This is my first log")
   - Click "Add Entry"

2. **Verify storage:**
   - Close the app
   - Reopen with `npm start`
   - Your entry should still be there (data persisted in SQLite)

## Building for Distribution

Create distributable packages:

```bash
# For your current platform
npm run build

# For specific platforms
npm run build:mac      # macOS .dmg
npm run build:win      # Windows installer
npm run build:linux    # Linux AppImage
```

Output will be in the `dist/` folder.

## Troubleshooting

### Problem: `better-sqlite3` won't compile

**Solution:** Install build tools

**Windows:**
```bash
npm install --global windows-build-tools
```

**macOS:**
```bash
xcode-select --install
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install build-essential python3
```

Then rebuild:
```bash
npm rebuild better-sqlite3
```

### Problem: "Cannot find module 'electron'"

**Solution:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: Permission errors on Linux/macOS

**Solution:** Fix npm permissions
```bash
sudo chown -R $USER ~/.npm
```

## Verification Checklist

- [ ] Node.js v16+ installed
- [ ] `npm install` completed successfully
- [ ] All 4 JavaScript files present (main.js, preload.js, database.js)
- [ ] `npm start` opens Electron window
- [ ] Can add log entries
- [ ] Log entries persist after restart
- [ ] No console errors in Developer Tools (Ctrl+Shift+I)

## Next Steps

1. **Customize the UI**: Edit `main.js` to customize the built-in HTML interface
2. **Integrate React frontend**: Connect to the existing React app in `frontend/`
3. **Add more features**: Extend `database.js` with search, tags, categories
4. **Create icons**: Add app icons in `build/` folder for professional builds

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm start` | Run app in development |
| `npm run dev` | Run app with dev flag |
| `npm run build` | Build for current platform |
| `npm run build:mac` | Build macOS app |
| `npm run build:win` | Build Windows app |
| `npm run build:linux` | Build Linux app |

## Database Schema

```sql
CREATE TABLE logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Need Help?

- Check the full README.md for detailed documentation
- Open an issue on GitHub
- Review Electron docs: https://electronjs.org
- Review better-sqlite3 docs: https://github.com/WiseLibs/better-sqlite3

---

**Success!** 🎉 You now have a working Electron desktop app with SQLite database.
