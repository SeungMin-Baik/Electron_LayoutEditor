import * as decompress from 'decompress';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Decompress zip file
 * @param type Type
 * @param fileName zip file name
 * @param filePath To decompress file path
 */
export function decompressFile(id: string, startPoint: string, destination: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            await fs.mkdirSync(destination);

            decompress(startPoint, destination)
            .then(() => {
                setInCSSFile(id, destination)
                .then((content: any) => {
                    resolve(content);
                });
            });
        } catch (err) {
            console.log(`ERROR_DECOMPRESS_FILE: ${err}`);
            reject(`ERROR_DECOMPRESS_FILE: ${err}`);
        }
    });
}

/**
 * Make css file for font
 * @param fileName fileName
 * @param fontFolder font folder path
 */
function setInCSSFile(fileName: string, fontFolder: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let stream: any = '';
            stream += '@font-face {\n';
            stream += 'font-family: \'' + fileName + '\';\n';

            await fs.readdirSync(fontFolder).forEach((file: any) => {
                if (path.extname(file) === '.ttf') {
                    stream += 'src: url(\'' + `${fontFolder}/${file}` + '\') format(' + '\'truetype\'' + ');\n';
                }
            });

            stream += '}\n';
            resolve(stream);
        } catch (err) {
            console.log(`ERROR_MAKE_CSS_FILE: ${err}`);
            reject(`ERROR_MAKE_CSS_FILE: ${err}`);
        }
    });
}
