import * as fs from 'fs';

/**
 * Check file is exists on location
 * @param location file local location
 */
export function checkValidFile(localPath: string): Promise<boolean | string> {
    return new Promise<boolean | string>((resolve, reject) => {
        try {
            if (fs.existsSync(localPath)) {
                fs.readFile(localPath, (err: any, data: any) => {
                    if (err) throw err;
                    resolve(JSON.parse(data.toString()));
                });
            } else {
                resolve(false);
            }
        } catch (err) {
            console.error(`ERROR_CHECK_FILE: ${err}`);
            reject(`ERROR_CHECK_FILE: ${err}`);
        }
    });
}
