import * as path from 'path';
import axios from 'axios';
import * as fs from 'fs';
import * as http from 'http';
import { promisify } from 'util';

import { decompressFile } from '../fileManager/decompressFile';
import config from '../../../config/electron-config';
import { ipcRenderer } from 'electron';
import { imageThumbnail } from '../thumbnail';

const unlink = promisify(fs.unlink);
const append = promisify(fs.appendFile);

// let timer: number = 0;

export function writeMediaAsFile(event: any, media: any, type: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const promises: Promise<any>[] = [];

        console.log('media', media);

        const task = (media: any) => new Promise<void>((_resolve, _reject) => {
            let filePath = '';
            // LOCAL FILE PATH
            switch (type) {
                case 'ASSET':
                    filePath = path.join(config.APP.DIR_PATH.FILE_PATH, media.id);
                    break;

                case 'PRESENTATION':
                    filePath = path.join(config.APP.DIR_PATH.FILE_PATH, media.id);
                    break;

                case 'WIDGET':
                    filePath = path.join(config.APP.DIR_PATH.WIDGET_PATH, media.id);
                    break;
            }

            // Create asset file write stream.
            const fileWriteStream = fs.createWriteStream(
                filePath
            );

            setTimeout(() => {
                getMediaData(media.url, fileWriteStream)
                .then((stream: any) => {
                    _resolve();
                    // stream.once('close', () => {
                    //     const md5File = require('md5-file');
                    //     md5File(filePath, (err: any, hash: any) => {
                    //         if (err) throw err;
                    //         _resolve(null);
                    //         if (hash === media.md5 || media.md5 === 0) {
                    //             event.sender.send('AppDisplayer-DataBase-Insert', media);
                    //             _resolve(null);
                    //         } else {
                    //             console.log('log', 1, `MD5 ERROR: ${hash}|| ${media.md5}`);
                    //             // If failed write media file, Remove media file.
                    //             if (fs.existsSync(filePath)) {
                    //                 fs.unlinkSync(filePath);
                    //             }
                    //             _resolve(media);
                    //         }
                    //     });
                    // });
                })
                .catch((err) => {
                    console.error(err);
                    _reject();
                });
            }, 200);

        });

        // try {
        //     for (const m of media) {
        //         promises.push(task(m));
        //     }

        //     Promise.all(promises)
        //         .then((media) => {
        //             for (let i = 0; i < media.length; i++) {
        //                 if (media[i] === null) {
        //                     media.splice(i, 1);
        //                     i--;
        //                 }
        //             }
        //             if (media.length !== 0 && timer === 0) {
        //                 timer++;
        //                 setTimeout(() => {
        //                     writeMediaAsFile(media, event, type);
        //                 }, 5 * 1000);
        //                 reject();
        //             } else if (media.length === 0) {
        //                 timer = 0;
        //                 resolve(null);
        //             } else {
        //                 reject();
        //             }
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //             reject();
        //         });

        // } catch (err) {
        //     reject(err);
        // }

        try {
            media.map(media => {
                task(media);
            });
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

export function writeWidgetAsThumbnail(event: any, url: any, instantId): Promise<void> {
    return new Promise<void>((resolve, reject) => {
    try {
        const filePath = path.join(
            config.APP.DIR_PATH.WIDGET_PATH,
            instantId
        );
        const file = fs.createWriteStream(filePath);
        getMediaData(url, file)
        .then(() => resolve())
        .catch((err) => {
            console.log(err);
            reject();
        });
    } catch (err) {
        reject(`ERROR_INIT_FILE_MANAGE: ${err}`);
    }
    });
}

export function writeAssetAsThumbnail(event: any, url: any, assetId): Promise<void> {
    return new Promise<void>((resolve, reject) => {
    try {
        const filePath = path.join(
            config.APP.DIR_PATH.ASSET_PATH,
            assetId
        );
        const file = fs.createWriteStream(filePath);
        getMediaData(url, file)
        .then(() => resolve())
        .catch((err) => {
            console.log(err);
            reject();
        });
    } catch (err) {
        reject(`ERROR_INIT_FILE_MANAGE: ${err}`);
    }
    });
}

export function writePresentationAsThumbnail(event: any, url: any, presentationId): Promise<void> {
    return new Promise<void>((resolve, reject) => {
    try {
        const filePath = path.join(
            config.APP.DIR_PATH.PRESENTATION_PATH,
            presentationId
        );
        const file = fs.createWriteStream(filePath);
        getMediaData(url, file)
        .then(() => resolve())
        .catch((err) => {
            console.log(err);
            reject();
        });
    } catch (err) {
        reject(`ERROR_INIT_FILE_MANAGE: ${err}`);
    }
    });
}

export function writeLocalPresentationAsThumbnail(event: any, thumbnail: any, presentationId): Promise<void> {
    return new Promise<void>((resolve, reject) => {
    try {
        const filePath = path.join(
            config.APP.DIR_PATH.PRESENTATION_PATH,
            presentationId
        );
        console.log(filePath);
        const file = fs.createWriteStream(filePath);
        // console.log(thumbnail);
        file.write(thumbnail);
        resolve();
    } catch (err) {
        reject(`ERROR_INIT_FILE_MANAGE: ${err}`);
    }
    });
}


/**
 * Get Media Data
 * @param assetUrl asset url
 * @param fileWriteStream file stream
 */
function getMediaData(assetUrl: string, fileWriteStream: any): Promise<any> {
    return new Promise<void>((resolve, reject) => {
        axios({
            url: assetUrl,
            responseType: 'stream',
            method: 'GET'
        })
            .then((resp) => {
                resp.data.pipe(fileWriteStream);
                resolve();
            })
            .catch((err) => {
                reject(`ERROR_GET_MEDIA_DATA: ${err}`);
            });
    });
}

