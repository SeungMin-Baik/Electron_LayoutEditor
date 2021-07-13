import { ipcRenderer, ipcMain } from 'electron';

// DB
import {
    insertClientAssetDataInDB,
    insertServerAssetDataInDB,
    deleteInDB,
    findOneAssetInDB,
    findAllAssetInDB,
    findAllPresentationInDB,
    insertServerPresentationDataInDB,
    insertLocalPresentationDataInDB,
    updateScheduleInDB,
    deletePresentationDataInDB,
    updatePresentationDataInDB,
    updatePlaylistInDB,
    updateInstantMessageInDB,
    updateDeviceInDB,
    findOnePresentationInDB
} from '@app/utils/main/database';

// Initialize IPC for DB

const { dialog } = require('electron').remote;
const errorOptions = {
    type: 'error',
    buttons: ['Yes'],
    title: 'error',
    message: 'The file already exists or the download has been installed.'
};
const notFoundOptions = {
    type: 'error',
    buttons: ['Yes'],
    title: 'error',
    message: 'The presentation information could not be found.'
};
const downSuccessOptions = {
    type: 'info',
    buttons: ['Yes'],
    title: 'info',
    message: 'The download was successful.'
};
const saveSuccessOptions = {
    type: 'info',
    buttons: ['Yes'],
    title: 'info',
    message: 'Save was successful.'
};

export function initAppDatabaseInsertIpc(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            // ASSET

            ipcRenderer.on('App-DataBase-Insert', (event: any, asset: any) => {
                insertClientAssetDataInDB(event, asset)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            ipcRenderer.on('App-DataBase-InsertClientData', (event: any, asset: any) => {
                insertClientAssetDataInDB(event, asset)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            ipcRenderer.on('App-DataBase-InsertServerData', (event: any, asset: any) => {
                insertServerAssetDataInDB(event, asset)
                    .then(() => {
                        dialog.showMessageBox(null, downSuccessOptions);
                        console.log('insert assetDB success');
                    })
                    .catch(() => {
                        console.log('insert assetDB err');
                        dialog.showMessageBox(null, errorOptions);
                    });
            });

            // PRESENTATION

            ipcRenderer.on('Presentation-DataBase-InsertServerData', (event: any, presentation: any) => {
                insertServerPresentationDataInDB(event, presentation)
                    .then(() => {
                        console.log('insert presentationDB success');
                        dialog.showMessageBox(null, downSuccessOptions);
                    })
                    .catch(() => {
                        console.log('insert presentationDB err');
                        dialog.showMessageBox(null, errorOptions);
                    });
            });

            ipcRenderer.on('Presentation-DataBase-InsertLocalData', (event: any, presentation: any) => {
                insertLocalPresentationDataInDB(event, presentation)
                    .then(() => {
                        console.log('insert presentationDB success');
                    })
                    .catch(() => {
                        console.log('insert presentationDB err');
                        dialog.showMessageBox(null, errorOptions);
                    });
            });

            resolve();
        } catch (err) {
            reject(`ERROR_INIT_IPC_DB: ${err}`);
        }
    });
}


export function initAppDatabaseDeleteIpc(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            // ASSET

            ipcRenderer.on('App-DataBase-Delete', (event: any, id: any) => {
                deleteInDB(id)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            // PRESENTATION

            ipcRenderer.on('Presentation-DataBase-Delete', (event: any, id: any) => {
                deletePresentationDataInDB(id)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            resolve();
        } catch (err) {
            reject(`ERROR_INIT_IPC_DB: ${err}`);
        }
    });
}

export function initAppDatabaseFindIpc(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            // ASSET

            ipcRenderer.on('App-DataBase-Find', (event: any, asset: any) => {
                findOneAssetInDB(event, asset)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            ipcRenderer.on('App-DataBase-FindAll', (event: any) => {
                findAllAssetInDB(event)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            // PRESENTATION

            ipcRenderer.on('Presentation-DataBase-FindAll', (event: any) => {
                findAllPresentationInDB(event)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            ipcRenderer.on('Presentation-DataBase-FindOne', (event: any, presentationId) => {
                findOnePresentationInDB(event, presentationId)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            resolve();
        } catch (err) {
            reject(`ERROR_INIT_IPC_DB: ${err}`);
        }
    });
}

export function initAppDatabaseUpdateIpc(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            // SCHEDULE

            ipcRenderer.on('Schedule-DataBase-Update', (event: any, schedule: any) => {
                updateScheduleInDB(event, schedule)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            // PLAYLIST

            ipcRenderer.on('Playlist-DataBase-Update', (event: any, playlist: any) => {
                updatePlaylistInDB(event, playlist)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            // INSTANTMESSAGE

            ipcRenderer.on('InstantMessage-DataBase-Update', (event: any, instantMessage: any) => {
                updateInstantMessageInDB(event, instantMessage)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            // DEVICE

            ipcRenderer.on('Device-DataBase-Update', (event: any, device: any) => {
                updateDeviceInDB(event, device)
                    .then(() => {
                        console.log('success');
                    })
                    .catch(() => {
                        console.log('err');
                    });
            });

            // PRESENTATION

            ipcRenderer.on('Presentation-DataBase-UpdateData', (event: any, presentation: any) => {
                updatePresentationDataInDB(event, presentation)
                    .then(() => {
                        console.log('update presentationDB success');
                    })
                    .catch(() => {
                        console.log('update presentationDB err');
                        dialog.showMessageBox(null, notFoundOptions);
                    });
            });
            resolve();
        } catch (err) {
            reject(`ERROR_INIT_IPC_DB: ${err}`);
        }
    });
}