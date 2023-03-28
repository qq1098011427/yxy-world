import { app, BrowserWindow } from 'electron';
import { CustomScheme } from './CustomScheme'
import { CommonWindowEvent } from './CommonWindowEvent'
import { createSqlite3 } from './createSqlite3'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
let mainWindow: BrowserWindow | null = null;

app.on('browser-window-created', (e, win) => {
    CommonWindowEvent.regWinEvent(win)
    win.webContents.openDevTools({mode: 'undocked'})
})
app.whenReady().then(() => {
    const config: any = {
        frame: true,
        show: true,
        titleBarStyle: 'hidden',
        trafficLightPosition: { x: 10, y: 15 },
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
            webviewTag: true,
            spellcheck: false,
            disableHtmlFullscreenWindowResize: true,
            nativeWindowOpen: true
        }
    }
    mainWindow = new BrowserWindow(config)
    createSqlite3()
    if (process.argv[2]) {
        mainWindow.loadURL(process.argv[2])
    } else {
        CustomScheme.registerScheme()
        mainWindow.loadURL('app://index.html');
    }
    CommonWindowEvent.listen()
})
