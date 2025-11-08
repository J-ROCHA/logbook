const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase, getAllLogs, addLog, deleteLog, updateLog } = require('./database');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load the frontend HTML file
  const frontendPath = path.join(__dirname, 'frontend', 'public', 'index.html');
  mainWindow.loadFile(frontendPath).catch(() => {
    // Fallback: create a simple HTML page if frontend doesn't exist
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Logbook</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
            }
            h1 { color: #333; }
            .log-entry {
              background: #f5f5f5;
              padding: 10px;
              margin: 10px 0;
              border-radius: 5px;
            }
            input, textarea {
              width: 100%;
              padding: 8px;
              margin: 5px 0;
              box-sizing: border-box;
            }
            button {
              background: #4CAF50;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            button:hover { background: #45a049; }
          </style>
        </head>
        <body>
          <h1>Logbook Desktop Application</h1>
          <div id="app">
            <h2>Add Log Entry</h2>
            <input type="text" id="title" placeholder="Title" />
            <textarea id="content" rows="4" placeholder="Content"></textarea>
            <button onclick="addEntry()">Add Entry</button>
            
            <h2>Log Entries</h2>
            <div id="logs"></div>
          </div>
          
          <script>
            async function loadLogs() {
              const logs = await window.electronAPI.getLogs();
              const logsDiv = document.getElementById('logs');
              logsDiv.innerHTML = logs.map(log => \`
                <div class="log-entry">
                  <h3>\${log.title}</h3>
                  <p>\${log.content}</p>
                  <small>\${new Date(log.created_at).toLocaleString()}</small>
                  <button onclick="deleteEntry(\${log.id})">Delete</button>
                </div>
              \`).join('');
            }
            
            async function addEntry() {
              const title = document.getElementById('title').value;
              const content = document.getElementById('content').value;
              if (title && content) {
                await window.electronAPI.addLog({ title, content });
                document.getElementById('title').value = '';
                document.getElementById('content').value = '';
                loadLogs();
              }
            }
            
            async function deleteEntry(id) {
              await window.electronAPI.deleteLog(id);
              loadLogs();
            }
            
            loadLogs();
          </script>
        </body>
      </html>
    `));
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialize database when app is ready
app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for database operations
ipcMain.handle('get-logs', async () => {
  return getAllLogs();
});

ipcMain.handle('add-log', async (event, log) => {
  return addLog(log);
});

ipcMain.handle('update-log', async (event, id, log) => {
  return updateLog(id, log);
});

ipcMain.handle('delete-log', async (event, id) => {
  return deleteLog(id);
});
