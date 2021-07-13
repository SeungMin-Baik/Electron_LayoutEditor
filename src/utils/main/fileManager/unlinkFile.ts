// ============================== Main ===========================

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const unlink = promisify(fs.unlinkSync);

/**
 * Delete media files.
 * @param mediae    Media files meda info.
 */
export function unlinkFile(id: string, localPath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) { resolve(); return; }

            // Get media file path.
            const filePath = path.resolve(
                localPath,
                id
            );

            // Remove media file.
            if (fs.existsSync(filePath)) {
                await unlink(filePath);
            } else {
                console.error(`file(${id}) is not exists in ${localPath}`);
            }

            resolve();
        } catch (err) {
            reject(`ERROR_UNLINK_ASSET: ${err}`);
        }
    });
}
