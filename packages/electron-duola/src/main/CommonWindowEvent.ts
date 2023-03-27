import { BrowserWindow, ipcMain, app } from 'electron'

export class CommonWindowEvent {
    private static getWin(event: any) {
        return BrowserWindow.fromWebContents(event.sender)
    }
    // 主进程公共消息处理逻辑
    public static listen() {
        ipcMain.handle('minimizeWindow', (e) => {
            this.getWin(e)?.minimize()
        })
        ipcMain.handle('maximizeWindow', e => {
            this.getWin(e)?.maximize()
        })
        ipcMain.handle('unmaximizeWindow', e => {
            this.getWin(e)?.unmaximize()
        })
        ipcMain.handle('closeWindow', e => {
            this.getWin(e)?.close()
        })
        ipcMain.handle('resizeable', e => {
            return this.getWin(e)?.isResizable();
        })
        ipcMain.handle('hideWindow', (e) => {
            this.getWin(e)?.hide();
        });
        ipcMain.handle('showWindow', (e) => {
            this.getWin(e)?.show();
        });
        ipcMain.handle('getPath', (e, name) => {
            return app.getPath(name);
        })
    }
    // 主进程公共事件处理逻辑
    public static regWinEvent(win: BrowserWindow) {
        // this.getWin(e)?.maximize() 触发此事件，从而发送消息给渲染进程
        win.on('maximize', () => {
            win.webContents.send('windowMaximized')
        })
        win.on('unmaximize', () => {
            win.webContents.send('windowUnmaximized')
        })
        // @ts-ignore
        win.webContents.setWindowOpenHandler(param => {
            let config: any = {
                frame: true, // 默认标题
                show: true, // 是否显示
                modal: false, // 是否为模态框
                parent: null,
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
            const features = JSON.parse(param.features)
            for (let f in features) {
                if (f === 'webPreferences') {
                    config.webPreferences = {
                        ...config.webPreferences,
                        ...features[f]
                    }
                } else {
                    config[f] = features[f]
                }
            }
            if (config['modal']) config.parent = win
            return {
                action: 'allow',
                overrideBrowserWindowOptions: config
            }
        })
    }
}
