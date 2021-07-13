import { ipcRenderer, ipcMain } from 'electron';

export async function getThumbnailtReq (filePath: string, metadata: any) {
    console.log('getThumbnail', metadata);
    ipcRenderer.send('App-DataBase-Asset-thumbnail', filePath, metadata);
}