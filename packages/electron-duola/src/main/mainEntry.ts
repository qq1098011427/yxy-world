import { app, BrowserWindow } from 'electron';
import { CustomScheme } from './CustomScheme'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
let mainWindow: BrowserWindow | null = null;

app.whenReady().then(() => {
    const config = {
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
            webviewTag: true,
            spellcheck: false,
            disableHtmlFullscreenWindowResize: true
        }
    }
    mainWindow = new BrowserWindow(config)
    if (process.argv[2]) {
        mainWindow.loadURL(process.argv[2])
        mainWindow.webContents.openDevTools({mode: 'undocked'})
    } else {
        CustomScheme.registerScheme()
        mainWindow.loadURL('app://index.html');
    }
})
