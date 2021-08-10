import { app, BrowserWindow } from 'electron';
import * as path from 'path';


/* ==============================
 * MAIN PROCESS FUNCTIONS
 * Functions for main process and electron browser window.
 * ============================== */
import {
    initAppMediaThumbnails,
    initAppOtherIpcObservers,
    // initAppAutoUpdater,
    initAppDatabase,
    initAppDir,
    DatabaseInsertRes,
    DatabaseDeletetRes,
    DatabaseFindRes,
    DatabaseUpdateRes
} from './utils/main/initialize';


/** Main electron window. */
export let mainWindow: Electron.BrowserWindow;

// To disable security warnings.
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

/**
 * Create electron window.
 */
function createWindow() {
    const iconPath = process.platform === 'darwin' ? path.join(__dirname, './app.icns') : path.join(__dirname, '../resources/cublick.ico');
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 1200,
        // titleBarStyle: 'hiddenInset',
        icon: iconPath,
        // autoHideMenuBar: true,
        resizable: true,
        // Error: Solved process error
        webPreferences: {
            nodeIntegration: true,
            // webviewTag: true
        }
    });

    // mainWindow.setMenu(null);
    mainWindow.loadURL(path.join('file://', __dirname, '/../public/index.html'));

    if (process.env.NODE_ENV === 'development') {
        // Open developer tool when in development mode.
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = undefined;
    });
}

/**
 * Initialize app utilities.
 */
function initAppUtilities() {
    try {
        // Init app database.
        initAppDatabase();

        initAppMediaThumbnails();

        // Observe other app IPC.
        initAppOtherIpcObservers();

        // Observe app update signal.
        // initAppAutoUpdater();

        // Create dir for app
        initAppDir();

        DatabaseInsertRes();

        DatabaseDeletetRes();

        DatabaseFindRes();

        DatabaseUpdateRes();

    } catch (err) {
        console.error(
            `ERROR_INIT_APP_UTILITIES: ${err}`
        );
    }
}

/* ==============================
 * APP EVENT OBSERVERS
 * Observe events to initialize or quit application.
 * ============================== */

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.

app.on('ready', async () => {
    createWindow();
    initAppUtilities();
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
        initAppUtilities();
    }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});