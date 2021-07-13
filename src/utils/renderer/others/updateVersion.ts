import { remote, ipcRenderer } from 'electron';
import axios from 'axios';
import * as os from 'os';

import electronConfig from '@app/config/electron-config';
// import { showToastMessage } from '@app/utils/renderer/others/toastMessage';

/**
 * Confirm Update version
 */
export function updateVersion() {
    let isUpdate: boolean = false;
    getNewVersionValue(os.platform(), os.arch())
        .then((nextVersion: any) => {
            for (let i = 0; i < 3; i++) {
                if (nextVersion.split('.')[i] > remote.app.getVersion().split('.')[i]) {
                    ipcRenderer.send('autoUpdater', os.platform(), os.arch());
                    isUpdate = true;
                    break;
                } else if (nextVersion.split('.')[i] < remote.app.getVersion().split('.')[i]) {
                    if ((i - 1) <= 0) {
                        return;
                    }
                }
            }
            if (isUpdate) {
                // showToastMessage('autoUpdater-show-log', 'Update is not available; no new latest release', 'success');
            }
        });
}

/**
 * get next version value in google cloud
 */
export function getNewVersionValue(platform: string, arch: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let architecher = '';

        if (platform === 'win32') {
            if (arch === 'ia32') {
                architecher = 'window32';
            } else if (arch === 'x64') {
                architecher = 'window64';
            }
        } else if (platform === 'linux') {
            if (arch === 'x64') {
                architecher = 'linux';
            }
        }

        axios.get(
            `${electronConfig.CUBLICK.APP_UPDATE.RELEASES}${architecher}/latest.yml`
        )
            .then((res: any) => {
                const version = (res.data.split(/['\n', ' ']/))[1];
                resolve(version);
            })
            .catch(() => {
                reject();
            });
    });
}