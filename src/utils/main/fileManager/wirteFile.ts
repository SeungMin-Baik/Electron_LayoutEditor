import * as path from 'path';
import axios from 'axios';
import * as fs from 'fs';
import * as http from 'http';
import { promisify } from 'util';

import config from '../../../config/electron-config';

const unlink = promisify(fs.unlink);
const append = promisify(fs.appendFile);

// let timer: number = 0;

export function writeMediaAsFile(event: any, media: any, type: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const promises: Promise<any>[] = [];

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

            }

            // Create asset file write stream.
            const fileWriteStream = fs.createWriteStream(
                filePath
            );

            setTimeout(() => {
                getMediaData(media.url, fileWriteStream)
                .then((stream: any) => {
                    _resolve();
                })
                .catch((err) => {
                    console.error(err);
                    _reject();
                });
            }, 200);

        });

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

