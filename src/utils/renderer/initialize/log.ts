import { ipcRenderer } from 'electron';
import { showToastMessage } from '@app/utils/renderer/others/toastMessage';

/**
 * When error happend on main process
 * * error code
 * * 1: MD5
 * * 2: WRITE
 * * 3: DB
 */
export function log() {
    ipcRenderer.on('log', (event: any, errCode: number, content: string) => {
        switch (errCode) {
            case 1:
                console.error('MAIN_LOG_ERROR: ', content);
                // showToastMessage('ERROR', 'DOWNLOAD FAILED', 'error');
                break;
            case 2:
                console.error('MAIN_LOG_ERROR: ', content);
                break;
            case 3:
                console.error('MAIN_LOG_ERROR: ', content);
                break;
            case 4:
                console.error('MAIN_LOG_ERROR: ', content);
                break;
        }
    });
}