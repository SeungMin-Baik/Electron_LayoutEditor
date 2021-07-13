import { ipcMain } from 'electron';
import * as dgram from 'dgram';

import store from '../../../store';

import electronconfig from '../../../config/electron-config';
import { mainWindow } from '../../../electron.main';

// udp socket 생성 및 listen, send message, clear message 등
export function initAppUDPServer(): Promise<any> {
    return new Promise<any> ((resolve: any, reject: any) => {
        try {
            const SERVERPORT = electronconfig.APP.SERVICE.UDP_SERVER_PORT;
            const CLIENTPORT = electronconfig.APP.SERVICE.UDP_CLIENT_PORT;
            const UDPServer = dgram.createSocket('udp4');
            const HOST = electronconfig.APP.SERVICE.UDP_SERVER_HOST;

            let messageArray = [];
            let uniqueArray = [];

                UDPServer.on('message', (message: any, rinfo: any) => {
                    console.log('message', message);
                    console.log('rinfo', rinfo);

                    messageArray = messageArray.concat(message.toString());
                    uniqueArray = messageArray.filter((object, index) => index === messageArray.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
                    console.log(uniqueArray);

                    ipcMain.on('UDPServer-Search-Init', (event: any) => {
                        uniqueArray = [];
                        console.log('message init success');
                        event.sender.send('connectToPlayer', rinfo, uniqueArray);
                    });
                    mainWindow.webContents.send('connectToPlayer', rinfo, uniqueArray);

                    ipcMain.on('UDPServer-Search-Device', (event: any) => {
                        event.sender.send('UDPServer-Insert-Device');
                    });
                });

                UDPServer.on('error', (err) => {
                    console.log('ERROR: ', err);
                });

                UDPServer.on('listening', () => {
                    const address: any = UDPServer.address();
                    console.log(`UDPServer listening on ${address.address}:${CLIENTPORT}`);
                });

                UDPServer.on('close', () => {
                    console.log('Client UDP socket closed');
                });

                UDPServer.bind(CLIENTPORT, () => {
                    UDPServer.setBroadcast(true);
                });

                ipcMain.on('UDPServer-Message-Request', (event: any, key: any) => {
                    const sendData = `CUBLICK#product01#discovery#${key}`;
                        function sendToMessage () {
                            UDPServer.send(sendData, 0, sendData.length, SERVERPORT, HOST , (err) => {
                                if (err) {
                                    console.log('send message err');
                                }
                                console.log("Sent '" + sendData + "'");
                            });
                        }
                        const repeat = setInterval(sendToMessage, 4000);
                        ipcMain.on('UDPServer-Message-Close', (event: any) => {
                            mainWindow.webContents.send('clearDeviceData');
                            clearInterval(repeat);
                        });
                });
        } catch {
            reject();
        }
    });
}