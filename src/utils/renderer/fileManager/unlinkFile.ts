
import * as fs from 'fs';
import * as path from 'path';
import electronConfig from '@app/config/electron-config';

export function initFiles(): Promise<any> {
    return new Promise((resolve, reject) => {
        // Init asset file
        fs.readdirSync(electronConfig.APP.DIR_PATH.FILE_PATH).forEach((file: any) => {
            // Remove media file.
            if (fs.existsSync(path.join(electronConfig.APP.DIR_PATH.FILE_PATH, file).replace(/\\/g, '/'))) {
                fs.unlinkSync(path.join(electronConfig.APP.DIR_PATH.FILE_PATH, file).replace(/\\/g, '/'));
            }
        });
        // Init presentation file
        fs.readdirSync(electronConfig.APP.DIR_PATH.PRESENTATION_PATH).forEach((file: any) => {
            // Remove media file.
            if (fs.existsSync(path.join(electronConfig.APP.DIR_PATH.PRESENTATION_PATH, file).replace(/\\/g, '/'))) {
                fs.unlinkSync(path.join(electronConfig.APP.DIR_PATH.PRESENTATION_PATH, file).replace(/\\/g, '/'));
            }
        });
    });
}