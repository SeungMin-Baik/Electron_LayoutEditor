import { ipcRenderer, ipcMain } from 'electron';


export function DatabaseInsertRes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            // ASSET

            ipcMain.on('App-DataBase-assetClient', (event: any, arg: any) => {
                event.sender.send('App-DataBase-InsertClientData', arg);
            });

            // PRESENTATION

            ipcMain.on('Presentation-DataBase-presentationLocal', (event: any, arg: any) => {
                event.sender.send('Presentation-DataBase-InsertLocalData', arg);
            });

            resolve();
        } catch (err) {
            reject(`ERROR_INIT_FILE_MANAGE: ${err}`);
        }
    });
}

export function DatabaseDeletetRes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            // ASSET

            ipcMain.on('App-DataBase-tryDelete', (event: any, arg: any) => {
                event.sender.send('App-DataBase-Delete', arg);
            });

            // PRESENTATION

            ipcMain.on('Presentation-DataBase-tryDelete', (event: any, arg: any) => {
                event.sender.send('Presentation-DataBase-Delete', arg);
            });

            resolve();
        } catch (err) {
            reject(`ERROR_INIT_FILE_MANAGE: ${err}`);
        }
    });
}

export function DatabaseFindRes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            // ASSET

            ipcMain.on('App-DataBase-tryFind', (event: any, arg: any) => {
                event.sender.send('App-DataBase-Find', arg);
            });

            ipcMain.on('App-DataBase-tryFindAll', (event: any) => {
                event.sender.send('App-DataBase-FindAll');
            });

            // PRESENTATION

            ipcMain.on('Presentation-DataBase-tryFindAll', (event: any) => {
                event.sender.send('Presentation-DataBase-FindAll');
            });

            ipcMain.on('Presentation-DataBase-tryFindOne', (event: any, presentationId: any) => {
                event.sender.send('Presentation-DataBase-FindOne', presentationId);
            });

            resolve();
        } catch (err) {
            reject(`ERROR_INIT_FILE_MANAGE: ${err}`);
        }
    });
}

export function DatabaseUpdateRes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            // PRESENTATION

            ipcMain.on('Presentation-DataBase-tryUpdate', (event: any, arg: any) => {
                event.sender.send('Presentation-DataBase-UpdateData', arg);
            });

            resolve();
        } catch (err) {
            reject(`ERROR_INIT_FILE_MANAGE: ${err}`);
        }
    });
}