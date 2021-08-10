import { ipcMain } from 'electron';

import {
    writeMediaAsFile,
    unlinkFile,
    writeWidgetAsThumbnail,
    writePresentationAsThumbnail,
    writeLocalPresentationAsThumbnail,
    writeAssetAsThumbnail
} from '../fileManager';

import { imageThumbnail, imageBase64Thumbnail, videoThumbnail } from '../thumbnail';

import config from '../../../config/electron-config';

import * as fs from 'fs';

/**
 * Initialize app media task observers
 */
export function initAppMediaFiles(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            // Write file.
            ipcMain.on('AppDisplayer-Asset-Write', async (event: any, arg: any, type: string) => {
                await writeMediaAsFile(event, arg, type)
                .then(() => {
                    switch (type) {
                        case 'ASSET':
                            console.log('arg', arg);
                            setTimeout(() => {
                                if (arg[0].ext === '.mp4' || arg[0].ext === '.avi' || arg[0].ext === '.mov' ||
                                    arg[0].ext === '.flv' || arg[0].ext === '.wmv') {
                                        console.log('videothumb');
                                        videoThumbnail(config.APP.DIR_PATH.FILE_PATH + '/' + arg[0].id, arg[0]);
                                } else if (arg[0].ext === '.jpg' || arg[0].ext === '.png' || arg[0].ext === '.webp' || arg[0].ext === '.svg') {
                                        console.log('imagethumb');
                                        imageThumbnail(event, config.APP.DIR_PATH.FILE_PATH + '/' + arg[0].id, arg[0]);
                                } else {
                                    console.log('fileType error');
                                }
                                }, 1000);
                            break;

                        case 'PRESENTATION':
                            break;
                        case 'WIDGET':
                            break;
                    }
                    console.log('initAppMediaFiles success');
                })
                .catch(() => {
                    console.log('initAppMediaFiles Err');
                });
            });


            ipcMain.on('AppAsset-Thumbnail-Write', async (event: any, url: string, id: string) => {
                await writeAssetAsThumbnail(event, url, id)
                .then(() => {
                    console.log('Thumbnail-Write success');
                    setTimeout(() => {
                        imageThumbnail(event, config.APP.DIR_PATH.ASSET_PATH + '/' + id, id )
                            .then(() => unlinkFile(id, config.APP.DIR_PATH.ASSET_PATH));
                    }, 1000);
                })
                .catch(() => {
                    console.log('Thumbnail-Write err');
                });
            });


            ipcMain.on('AppPresentation-Thumbnail-Write', async (event: any, url: string, id: string) => {
                await writePresentationAsThumbnail(event, url, id)
                .then(() => {
                    console.log('Thumbnail-Write success');
                    setTimeout(() => {
                        imageThumbnail(event, config.APP.DIR_PATH.PRESENTATION_PATH + '/' + id, id )
                            .then(() => unlinkFile(id, config.APP.DIR_PATH.PRESENTATION_PATH));
                    }, 1000);
                })
                .catch(() => {
                    console.log('Thumbnail-Write err');
                });
            });

            ipcMain.on('AppLocalPresentation-Thumbnail-Write', async (event: any, thumbnail: string, id: string) => {
                imageBase64Thumbnail(event, config.APP.DIR_PATH.PRESENTATION_PATH + '/' + id, id, thumbnail);
            });

            // Unlink media file.
            ipcMain.on('AppDisplayer-Asset-Unlink', async (event: any, id: string, localPath: string) => {
                await unlinkFile(id, localPath)
                .then(() => {
                    event.sender.send('AppDisplayer-Asset-Unlink-reply', {
                        success: true
                    });
                })
                .catch(() => {
                    event.sender.send('AppDisplayer-Asset-Unlink-reply', {
                        success: false
                    });
                });
            });

            resolve();
        } catch (err) {
            reject(`ERROR_INIT_FILE_MANAGE: ${err}`);
        }
    });
}


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
