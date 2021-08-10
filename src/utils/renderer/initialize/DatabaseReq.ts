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
