const { app, BrowserWindow } = require('electron');
const { createServer } = require('./backend/server.js');
const { isDev, getUIPath } = require('./util.js')

let mainWindow;
let server;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      devTools: isDev()
    },
  });

  mainWindow.setMenu(null)
  mainWindow.maximize()
};

// const startServer = async () => {
//   try {
//     server = await createServer();
//   } catch (error) {
//     console.error('Error while starting the server', error);
//   }
// };

function showErrorWindow(errorMessage) {
  const errorWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  errorWindow.loadURL(`data:text/html;charset=utf-8,<html><body><h1>Error</h1><p>${errorMessage}</p></body></html>`);
  
  errorWindow.on('closed', () => {
    if (server) {
      server.close()
    }
    app.quit();
  });
}

app.whenReady().then(async () => {
  try {
    server = await createServer();
    createWindow();
    
    if (isDev()) {
      mainWindow.loadURL('http://localhost:5173');
    } else {
      mainWindow.loadFile(getUIPath());
    }
  } catch (err) {
    showErrorWindow(err.message); 
  }
});


app.on('window-all-closed', () => {
  if (server) {
    server.close()
  }
  app.quit();
});
