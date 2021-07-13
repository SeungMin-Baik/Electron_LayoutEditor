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

/**
 * Observe auto-update signal and update app.
 */
// export function initAppAutoUpdater() {
//     ipcMain.once('autoUpdater', (event: any, platform: string, arch: string) => {
//         let architecher = '';

//         if (platform === 'win32') {
//             if (arch === 'ia32') {
//                 architecher = 'window32';
//             } else if (arch === 'x64') {
//                 architecher = 'window64';
//             }
//         } else if (platform === 'linux') {
//             if (arch === 'x64') {
//                 architecher = 'linux';
//             }
//         }

//         // Set release URL and init updater.
//         autoUpdater.setFeedURL({
//             provider: 'generic',
//             url: `${config.CUBLICK.APP_UPDATE.RELEASES}/${architecher}`
//         });

//         // Send request to check for new update.
//         autoUpdater.checkForUpdates();

//         autoUpdater.once('checking-for-update', () => {
//             event.sender.send('autoUpdater-log', 'Checking for update...');
//             event.sender.send('autoUpdater-show-log', 'Checking for update...');
//         });

//         autoUpdater.once('update-available', (ev: any, info: any) => {
//             event.sender.send('autoUpdater-log_dir', 'update-available', ev, info);
//             event.sender.send('autoUpdater-show-log', 'Update is available! Now try download new release...');
//         });

//         autoUpdater.once('update-not-available', (ev: any, info: any) => {
//             event.sender.send('autoUpdater-log_dir', 'update-not-available', ev, info);
//             event.sender.send('autoUpdater-show-log', 'Update is not available; no new latest release');
//         });

//         autoUpdater.once('error', (ev: any, err: any) => {
//             event.sender.send('autoUpdater-log', err);
//         });

//         autoUpdater.once('download-progress', (progressObj: any) => {
//             let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
//             logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
//             logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
//             event.sender.send('autoUpdater-log', logMessage);
//             event.sender.send('autoUpdater-show-log', 'Downloading next Version', logMessage);
//         });

//         autoUpdater.once('update-downloaded', () => {
//             event.sender.send('autoUpdater-will_be_updated');
//             event.sender.send('autoUpdater-show-log', 'download finished');
//             setImmediate(() => {
//                 app.removeAllListeners('window-all-closed');
//                 setTimeout(() => {
//                     autoUpdater.quitAndInstall(true, true);
//                 }, 2000);
//             });
//         });
//     });
// }