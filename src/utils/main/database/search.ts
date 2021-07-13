import { remote } from 'electron';
import * as Datastore from 'nedb';

import { deleteInDB } from './delete';

import store from '@app/store';
import { assetActions } from '@app/store/appAssetData';
import { presentationActions } from '@app/store/appPresentationData';
/**
 * Get media list for download by asset lists.
 * @param user  User ID.
 */
export function getMediaForDownload(media: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        const promises: Promise<any>[] = [];
        const assetForDownload: any[] = [];
        const assetForUpdate: any[] = [];

        if (!remote.getGlobal('APP_DB').assetMediaDb) {
            reject();
            return;
        }

        // Create removal task of database.
        const task = (media: any) => new Promise<void>((_resolve, _reject) => {
            (remote.getGlobal('APP_DB').assetMediaDb as Datastore).findOne(
                { _id: media.id },
                {},
                (err, result: any) => {
                    if (err) {
                        _reject(err);
                        return;
                    }
                    if (!result) {
                        assetForDownload.push(media.id);
                        _resolve();

                    // If widget js file something changed, replace widget
                    } else if (media.fileType === '.js' &&
                        media.md5 !== result.md5
                    ) {
                        deleteInDB(media.id);
                        assetForDownload.push(media.id);
                        _resolve();
                    } else {
                        assetForUpdate.push(media.id);
                        _resolve();
                    }
                }
            );
        });

        try {
            for (const m of media) {
                // Remove from db.
                await promises.push(task(m));
            }

            Promise.all(promises)
                .then((media) => {
                    resolve({ assetForDownload, assetForUpdate });
                })
                .catch(reject);
        } catch (err) {
            reject(err);
        }
    });
}


    // ASSET

export function findOneAssetInDB(event: any, assetId): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            if (!remote.getGlobal('APP_DB').assetMediaDb) {
                console.error('ERR_DB_IS_UNDEFINED');
                event.sender.send('log', 3, 'ERR_DB_IS_UNDEFINED');
                reject('ERR_DB_IS_UNDEFINED');
                return;
            }

            (remote.getGlobal('APP_DB').assetMediaDb as Datastore).findOne(
                { _id: assetId },
                {},
                (err, result: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    store.dispatch(assetActions.configOneInit(result));
                    console.log(result);

                    resolve();
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}

export function findAllAssetInDB(event: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            if (!remote.getGlobal('APP_DB').assetMediaDb) {
                console.error('ERR_DB_IS_UNDEFINED');
                event.sender.send('log', 3, 'ERR_DB_IS_UNDEFINED');
                reject('ERR_DB_IS_UNDEFINED');
                return;
            }

            (remote.getGlobal('APP_DB').assetMediaDb as Datastore).find(
                {},
                (err, result: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    store.dispatch(assetActions.configInit(result));
                    console.log(result);

                    resolve();
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}

    // PRESENTATION

export function findAllPresentationInDB(event: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            if (!remote.getGlobal('PT_DB').presentationMediaDb) {
                console.error('ERR_DB_IS_UNDEFINED');
                event.sender.send('log', 3, 'ERR_DB_IS_UNDEFINED');
                reject('ERR_DB_IS_UNDEFINED');
                return;
            }

            (remote.getGlobal('PT_DB').presentationMediaDb as Datastore).find(
                {},
                (err, result: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    store.dispatch(presentationActions.configInit(result));
                    console.log(result);

                    resolve();
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}

export function findOnePresentationInDB(event: any, presentationId: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            if (!remote.getGlobal('PT_DB').presentationMediaDb) {
                console.error('ERR_DB_IS_UNDEFINED');
                event.sender.send('log', 3, 'ERR_DB_IS_UNDEFINED');
                reject('ERR_DB_IS_UNDEFINED');
                return;
            }

            (remote.getGlobal('PT_DB').presentationMediaDb as Datastore).findOne(
                { _id: presentationId },
                {},
                (err, result: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    store.dispatch(presentationActions.configOneInit(result));
                    console.log('findOnePresentationMessageInDB', result);

                    resolve();
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}