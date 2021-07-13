import { ipcRenderer, ipcMain } from 'electron';

export function UDPServerToMessage (key: any) {
    ipcRenderer.send('UDPServer-Message-Request', key);
}

export function UDPServerToClose () {
    ipcRenderer.send('UDPServer-Message-Close');
}

export function UDPServerToSearchDevice () {
    ipcRenderer.send('UDPServer-Search-Device');
}

export function UDPServerToInit () {
    ipcRenderer.send('UDPServer-Search-Init');
}