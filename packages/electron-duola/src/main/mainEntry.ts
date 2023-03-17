import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({})
    console.log('process.argv', process.argv)
    mainWindow.loadURL(process.argv[2])
})
