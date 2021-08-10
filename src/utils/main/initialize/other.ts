import { app, ipcMain, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';

import { mainWindow } from '../../../electron.main';
import config from '../../../config/electron-config';

/**
 * Observe other app IPC.
 */
export function initAppOtherIpcObservers() {
    // Toggle fullscreen.
    ipcMain.on('AppOther-toggleFullScreen', (event: any, val: boolean) => {
        mainWindow.setFullScreen(val);
    });

    // Toggle Devtool
    ipcMain.on('AppOther-toggleDevTool', (event: any) => {
        if (mainWindow.webContents.isDevToolsOpened()) {
            mainWindow.webContents.closeDevTools();
        } else {
            mainWindow.webContents.openDevTools();
        }
    });

    // Blobk click some keyboard
    if (mainWindow.isFocused()) {
        if (process.env.NODE_ENV !== 'development') {
            globalShortcut.register('CmdOrCtrl+w', () => { // Turn Off
            });
            globalShortcut.register('CmdOrCtrl+r', () => { // Refresh
            });
            globalShortcut.register('F5', () => { // Refresh
            });
            globalShortcut.register('F11', () => { // Resize Window
            });
        }
    }
}
