import { ipcRenderer, ipcMain } from 'electron';

export async function getThumbnailtReq (filePath: string, metadata: any) {
    ipcRenderer.send('App-DataBase-Asset-thumbnail', filePath, metadata);
}

export function writeLocalPresentationAsThumbnail(thumbnail: string, id: string) {
    ipcRenderer.send('AppLocalPresentation-Thumbnail-Write', thumbnail, id);
}