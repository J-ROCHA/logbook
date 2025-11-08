# Logbook Desktop Application

A desktop application for managing logbook entries, built with Electron and SQLite.

## Features

- 📝 Create, read, update, and delete log entries
- 💾 Local SQLite database storage
- 🖥️ Cross-platform desktop application (Windows, macOS, Linux)
- 🔒 Secure data storage in user's local directory
- ⚡ Fast and lightweight

## Prerequisites

Before installing, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/J-ROCHA/logbook.git
cd logbook
```

### Step 2: Install Dependencies

Install the main Electron and SQLite dependencies:

```bash
npm install
```

This will install:
- **Electron** - Framework for building desktop apps
- **better-sqlite3** - Fast SQLite3 library for Node.js
- **electron-builder** - Package and build the app for distribution

### Step 3: Run the Application

Start the application in development mode:

```bash
npm start
```

Or use the dev script:

```bash
npm run dev
```

## Building for Distribution

Build the application for your platform:

### Build for macOS
```bash
npm run build:mac
```

### Build for Windows
```bash
npm run build:win
```

### Build for Linux
```bash
npm run build:linux
```

### Build for all platforms
```bash
npm run build
```

The built application will be available in the `dist` folder.

## Project Structure

```
logbook/
├── main.js              # Electron main process
├── preload.js           # Preload script for secure IPC
├── database.js          # SQLite database operations
├── package.json         # Project dependencies and scripts
├── backend/             # Backend server (Express + Socket.io)
│   ├── server.js
│   └── package.json
└── frontend/            # React frontend
    └── src/
        ├── App.js
        ├── index.js
        └── services/
```

## Database

The application uses SQLite for local data storage. The database file is automatically created at:

- **Windows**: `%APPDATA%/logbook-desktop/logbook.db`
- **macOS**: `~/Library/Application Support/logbook-desktop/logbook.db`
- **Linux**: `~/.config/logbook-desktop/logbook.db`

### Database Schema

```sql
CREATE TABLE logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API

The application exposes the following API methods through `window.electronAPI`:

- `getLogs()` - Retrieve all log entries
- `addLog({ title, content })` - Add a new log entry
- `updateLog(id, { title, content })` - Update an existing log entry
- `deleteLog(id)` - Delete a log entry

## Development

### Running in Development Mode

```bash
npm run dev
```

### Debugging

Open Developer Tools in the Electron window:
- macOS: `Cmd + Option + I`
- Windows/Linux: `Ctrl + Shift + I`

## Troubleshooting

### Issue: `better-sqlite3` compilation errors

If you encounter compilation errors with `better-sqlite3`, try:

```bash
npm rebuild better-sqlite3
```

Or install build tools for your platform:

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
sudo apt-get install build-essential
```

### Issue: Electron app won't start

1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Check Node.js version:
```bash
node --version
```
Ensure you're using Node.js v16 or higher.

## Technology Stack

- **Electron** - Desktop application framework
- **SQLite** (better-sqlite3) - Local database
- **Node.js** - Runtime environment
- **React** - Frontend UI (optional)
- **Express** - Backend API server (optional)

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions, please open an issue on the GitHub repository.
