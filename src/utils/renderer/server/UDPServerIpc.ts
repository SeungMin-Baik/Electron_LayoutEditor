import { ipcRenderer, ipcMain } from 'electron';
import { Base64 } from 'js-base64';
import { createDecryptionKey } from '@app/utils/renderer/server/others';
import { decrypt } from '@app/utils/others';
import store from '@app/store';
import { keyBy } from 'lodash-es';

export function connectToDashboardIpc() {
    ipcRenderer.on('connectToPlayer', (event: any, rInfo: any, message: any) => {
        let tmp: any = [];
        let tmp2: any = [];

        if (message === []) {
            // store.dispatch(deviceActions.configInit(tmp));
            tmp2 = [];
        } else {
            message.map(message => {
                const confirmMessage: Array<any> = message.toString().split('#');

                const playerMessage = confirmMessage[3].replace(/\n/g, '');
                const key = createDecryptionKey();

                const decryptMessage = decrypt(key, playerMessage);
                tmp = JSON.parse(decryptMessage);

                tmp2 = tmp2.concat(tmp);
            });

            const uniqueArray = tmp2.filter((object, index) => index === tmp2.findIndex(obj => JSON.stringify(obj.pinCode) === JSON.stringify(object.pinCode)));

            for (let i = 0; i < uniqueArray.length; i++) {
                if ((uniqueArray[i].name === tmp.name) && (uniqueArray[i].playStatus !== tmp.playStatus)) {
                    uniqueArray[i] = tmp;
                }
            }

            // ipcRenderer.on('UDPServer-Insert-Device', (event: any) => {
            //     store.dispatch(deviceActions.configInit(uniqueArray));
            //     tmp2 = [];
            // });
        }
    });
}

// export function clearDeviceData() {
//     ipcRenderer.on('clearDeviceData', (event: any) => {
//         store.dispatch(deviceActions.configInit(null));
//     });
// }
