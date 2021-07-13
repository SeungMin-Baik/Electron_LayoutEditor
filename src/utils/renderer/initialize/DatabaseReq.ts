import { ipcRenderer, ipcMain } from 'electron';

const { dialog } = require('electron').remote;
const errorOptions = {
    type: 'error',
    buttons: ['Yes'],
    title: 'error',
    message: 'Request Database Error'
};

// ASSET

export function ClientAssetDataInsertReq (assetData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('App-DataBase-assetClient', assetData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function ServerAssetDataInsertReq (assetData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('App-DataBase-assetServer', assetData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function AssetDatabaseDeletetReq (assetData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('App-DataBase-tryDelete', assetData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function AssetDatabaseFindOneReq (assetData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('App-DataBase-tryFind', assetData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function AssetDatabaseFindAllReq (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('App-DataBase-tryFindAll');
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}


// PRESENTATION

export function PresentationDatabaseFindAllReq (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Presentation-DataBase-tryFindAll');
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function PresentationDatabaseFindOneReq (presentationId): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Presentation-DataBase-tryFindOne', presentationId);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function ServerPresentationDataInsertReq (presentationData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Presentation-DataBase-presentationServer', presentationData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function LocalPresentationDataInsertReq (presentationData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Presentation-DataBase-presentationLocal', presentationData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function PresentationDataUpdateReq (presentation: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Presentation-DataBase-tryUpdate', presentation);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function PresentationDatabaseDeletetReq (presentationId: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Presentation-DataBase-tryDelete', presentationId);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

// INSTANTMESSAGE

export function InstantMessageDataInsertReq (messageData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('InstantMessage-DataBase-tryInsert', messageData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function InstantMessageDatabaseFindAllReq (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('InstantMessage-DataBase-tryFindAll');
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function InstantMessageDatabaseFindOneReq (instantMessageId: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('InstantMessage-DataBase-tryFindOne', instantMessageId);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function InstantMessageDatabaseDeletetReq (messageData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('InstantMessage-DataBase-tryDelete', messageData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function InstantMessageDatabaseUpdateReq (messageData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('InstantMessage-DataBase-tryUpdate', messageData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

// WIDGET

export function WidgetDataInsertReq (widgetData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Widget-DataBase-tryInsert', widgetData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function WidgetDatabaseFindAllReq (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Widget-DataBase-tryFindAll');
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

// PLAYLIST

export function PlaylistDataInsertReq (playlistData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Playlist-DataBase-tryInsert', playlistData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function PlaylistDatabaseFindAllReq (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Playlist-DataBase-tryFindAll');
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function PlaylistDatabaseFindOneReq (playlistId: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Playlist-DataBase-tryFindOne', playlistId);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function PlaylistDatabaseDeletetReq (playlistId: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Playlist-DataBase-tryDelete', playlistId);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function PlaylistDatabaseUpdateReq (playlist: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Playlist-DataBase-tryUpdate', playlist);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

// SCHEDULE

export function ScheduleDataInsertReq (scheduleData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Schedule-DataBase-tryInsert', scheduleData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function ScheduleDatabaseFindAllReq (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Schedule-DataBase-tryFindAll');
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function ScheduleDatabaseFindOneReq (scheduleId: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Schedule-DataBase-tryFindOne', scheduleId);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function ScheduleDatabaseDeletetReq (scheduleId: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Schedule-DataBase-tryDelete', scheduleId);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function ScheduleDatabaseUpdateReq (scheduleData): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Schedule-DataBase-tryUpdate', scheduleData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

// DEVICE

export function DeviceDataInsertReq (deviceData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Device-DataBase-tryInsert', deviceData);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function DeviceDatabaseFindAllReq (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Device-DataBase-tryFindAll');
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function DeviceDatabaseFindOneReq (deviceId): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Device-DataBase-tryFindOne', deviceId);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function DeviceDatabaseDeleteReq (deviceId: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Device-DataBase-tryDelete', deviceId);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function DeviceDatabaseUpdateReq (device: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Device-DataBase-tryUpdate', device);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}


// THERMAL

export function ThermalDataInsertReq (thermalData: any, date: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Thermal-DataBase-tryInsert', thermalData, date);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function ThermalDatabaseFindDateReq (date: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Thermal-DataBase-tryFindDate', date);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}

export function ThermalDatabaseFindFilterReq (date: any, device: any, mask: any, highTemp: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcRenderer.send('Thermal-DataBase-tryFind-Filter', date, device, mask, highTemp);
            resolve();
        } catch {
            dialog.showMessageBox(null, errorOptions);
            reject();
        }
    });
}