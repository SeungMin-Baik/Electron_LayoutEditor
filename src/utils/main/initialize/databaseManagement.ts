import { ipcRenderer, ipcMain } from 'electron';


export function DatabaseInsertRes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            // ASSET

            ipcMain.on('App-DataBase-assetServer', (event: any, arg: any) => {
                event.sender.send('App-DataBase-InsertServerData', arg);
            });

            ipcMain.on('App-DataBase-assetClient', (event: any, arg: any) => {
                event.sender.send('App-DataBase-InsertClientData', arg);
            });

            // PRESENTATION

            ipcMain.on('Presentation-DataBase-presentationServer', (event: any, arg: any) => {
                event.sender.send('Presentation-DataBase-InsertServerData', arg);
            });

            ipcMain.on('Presentation-DataBase-presentationLocal', (event: any, arg: any) => {
                event.sender.send('Presentation-DataBase-InsertLocalData', arg);
            });

            // INSTANTMESSAGE

            ipcMain.on('InstantMessage-DataBase-tryInsert', (event: any, arg: any) => {
                event.sender.send('InstantMessage-DataBase-Insert', arg);
            });

            // WIDGET

            ipcMain.on('Widget-DataBase-tryInsert', (event: any, arg: any) => {
                event.sender.send('Widget-DataBase-Insert', arg);
            });

            // PLAYLIST

            ipcMain.on('Playlist-DataBase-tryInsert', (event: any, arg: any) => {
                event.sender.send('Playlist-DataBase-Insert', arg);
            });

            // SCHEDULE

            ipcMain.on('Schedule-DataBase-tryInsert', (event: any, arg: any) => {
                event.sender.send('Schedule-DataBase-Insert', arg);
            });

            // DEVICE

            ipcMain.on('Device-DataBase-tryInsert', (event: any, arg: any) => {
                event.sender.send('Device-DataBase-Insert', arg);
            });

            // THERMAL

            ipcMain.on('Thermal-DataBase-tryInsert', (event: any, arg: any, date: any) => {
                event.sender.send('Thermal-DataBase-Insert', arg, date);
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

            // DEVICE

            ipcMain.on('Device-DataBase-tryDelete', (event: any, arg: any) => {
                event.sender.send('Device-DataBase-Delete', arg);
            });

            // INSTANTMESSAGE

            ipcMain.on('InstantMessage-DataBase-tryDelete', (event: any, arg: any) => {
                event.sender.send('InstantMessage-DataBase-Delete', arg);
            });

            // SCHEDULE

            ipcMain.on('Schedule-DataBase-tryDelete', (event: any, arg: any) => {
                event.sender.send('Schedule-DataBase-Delete', arg);
            });

            // PLAYLIST

            ipcMain.on('Playlist-DataBase-tryDelete', (event: any, arg: any) => {
                event.sender.send('Playlist-DataBase-Delete', arg);
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

            // INSTANTMESSAGE

            ipcMain.on('InstantMessage-DataBase-tryFindAll', (event: any) => {
                event.sender.send('InstantMessage-DataBase-FindAll');
            });

            ipcMain.on('InstantMessage-DataBase-tryFindOne', (event: any, instantMessageId: any) => {
                event.sender.send('InstantMessage-DataBase-FindOne', instantMessageId);
            });

            // WIDGET

            ipcMain.on('Widget-DataBase-tryFindAll', (event: any) => {
                event.sender.send('Widget-DataBase-FindAll');
            });

            // PLAYLIST

            ipcMain.on('Playlist-DataBase-tryFindAll', (event: any) => {
                event.sender.send('Playlist-DataBase-FindAll');
            });

            ipcMain.on('Playlist-DataBase-tryFindOne', (event: any, playlistId: any) => {
                event.sender.send('Playlist-DataBase-FindOne', playlistId);
            });

            // SCHEDULE

            ipcMain.on('Schedule-DataBase-tryFindAll', (event: any) => {
                event.sender.send('Schedule-DataBase-FindAll');
            });

            ipcMain.on('Schedule-DataBase-tryFindOne', (event: any, scheduleId: string) => {
                event.sender.send('Schedule-DataBase-FindOne', scheduleId);
            });

            // DEVICE

            ipcMain.on('Device-DataBase-tryFindAll', (event: any) => {
                event.sender.send('Device-DataBase-FindAll');
            });

            ipcMain.on('Device-DataBase-tryFindOne', (event: any, deviceId: string) => {
                event.sender.send('Device-DataBase-FindOne', deviceId);
            });

            // THERMAL

            ipcMain.on('Thermal-DataBase-tryFindDate', (event: any, date: any) => {
                event.sender.send('Thermal-DataBase-FindDate', date);
            });

            ipcMain.on('Thermal-DataBase-tryFind-Filter', (event: any, date: any, device: any, mask: any, highTemp: any) => {
                event.sender.send('Thermal-DataBase-Find-Filter', date, device, mask, highTemp);
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

            // SCHEDULE

            ipcMain.on('Schedule-DataBase-tryUpdate', (event: any, arg: any) => {
                event.sender.send('Schedule-DataBase-Update', arg);
            });

            // PLAYLIST

            ipcMain.on('Playlist-DataBase-tryUpdate', (event: any, arg: any) => {
                event.sender.send('Playlist-DataBase-Update', arg);
            });

            // INSTANTMESSAGE

            ipcMain.on('InstantMessage-DataBase-tryUpdate', (event: any, arg: any) => {
                event.sender.send('InstantMessage-DataBase-Update', arg);
            });

            // PRESENTATION

            ipcMain.on('Presentation-DataBase-tryUpdate', (event: any, arg: any) => {
                event.sender.send('Presentation-DataBase-UpdateData', arg);
            });

            // DEVICE

            ipcMain.on('Device-DataBase-tryUpdate', (event: any, arg: any) => {
                event.sender.send('Device-DataBase-Update', arg);
            });





            resolve();
        } catch (err) {
            reject(`ERROR_INIT_FILE_MANAGE: ${err}`);
        }
    });
}