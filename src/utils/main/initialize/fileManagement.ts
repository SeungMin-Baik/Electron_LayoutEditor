import { ipcMain } from 'electron';

import {
    writeMediaAsFile,
    unlinkFile,
    writeLocalPresentationAsThumbnail,
} from '../fileManager';

import { imageThumbnail, imageBase64Thumbnail, videoThumbnail } from '../thumbnail';

import config from '../../../config/electron-config';

import * as fs from 'fs';


export function initAppMediaThumbnails(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            ipcMain.on('App-DataBase-Asset-thumbnail', async (event: any, filePath: string, metadata: any) => {
                console.log(metadata.fileType);
                if (metadata.fileType === '.mp4' || metadata.fileType === '.mov' || metadata.fileType === '.MP4' ||
                    metadata.fileType === '.MOV' || metadata.fileType === '.wmv' || metadata.fileType === '.WMV') {
                    console.log('video');
                    await videoThumbnail(filePath, metadata)
                    .then(() => {
                        console.log('initAppMediaThumbnails success');
                    })
                    .catch(() => {
                        console.log('initAppMediaThumbnails Err');
                    });
                } else if (metadata.fileType === '.png' || metadata.fileType === '.jpg' || metadata.fileType === '.jpeg') {
                    console.log('image');
                    await imageThumbnail(event, filePath, metadata)
                    .then(() => {
                        console.log('initAppMediaThumbnails success');
                    })
                    .catch(() => {
                        console.log('initAppMediaThumbnails Err');
                    });
                } else {
                    console.log('metadata.fileType error');
                }
            });
            resolve();
        } catch (err) {
            reject(`ERROR_INIT_FILE_MANAGE: ${err}`);
        }
    });
}
