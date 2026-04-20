const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800
  });

  // Wait for server to boot
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3001');
  }, 2000);
}

app.whenReady().then(() => {
  serverProcess = spawn('node', ['server.js'], {
    stdio: 'inherit'
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  app.quit();
});