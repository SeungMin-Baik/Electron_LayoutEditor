import { remote, ipcRenderer } from 'electron';
import * as Datastore from 'nedb';
import * as moment from 'moment';

import config from '../../../config/electron-config';
import { unlinkFile } from '../fileManager/unlinkFile';

/**
 * Delete DOC in DB
 * and then Delete asset file
 * @param id asset id
 */

    // ASSET

export function deleteInDB(id: string): Promise<void> {
    return new Promise<void> ((resolve, reject) => {
        try {
            if (!remote.getGlobal('APP_DB').assetMediaDb) {
                reject('ERR_DB_IS_UNDEFINED');
                return;
            }

            (remote.getGlobal('APP_DB').assetMediaDb as Datastore).remove(
                { _id: id },
                {},
                err => {
                    if (err) {
                        reject(`ERROR_DELETE_DB: ${err}`);
                        return;
                    }
                    ipcRenderer.send('AppDisplayer-mediaFiles-unlink', id);
                    resolve();
                }
            );
        }
        catch (err) {
            reject(`ERROR_DELETE_DB: ${err}`);
        }
    });
}

    // PRESENTATION

    export function deletePresentationDataInDB(id: string): Promise<void> {
        return new Promise<void> ((resolve, reject) => {
            try {
                if (!remote.getGlobal('PT_DB').presentationMediaDb) {
                    reject('ERR_DB_IS_UNDEFINED');
                    return;
                }

                (remote.getGlobal('PT_DB').presentationMediaDb as Datastore).remove(
                    { _id: id },
                    {},
                    err => {
                        if (err) {
                            reject(`ERROR_DELETE_DB: ${err}`);
                            return;
                        }
                        resolve();
                    }
                );
            }
            catch (err) {
                reject(`ERROR_DELETE_DB: ${err}`);
            }
        });
    }



/**
 * Delete Multi DOC in DB
 * @param list asset data list
 */
export function deleteMultiInDB(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        if (!remote.getGlobal('APP_DB').assetMediaDb) {
            reject();
            return;
        }

        // Create removal task of database.
        const task = (asset: any) => new Promise<any>((_resolve, _reject) => {
            /**
             * Description Timestamp
             * 86400 = 1 day
             * 604,800 = 1 week,
             * 1,209,600 = 2 week,
             */
            if ((JSON.parse(asset.timestamp) + (86400 * 7)) < JSON.parse(moment().format('X'))) {
                (remote.getGlobal('APP_DB').assetMediaDb as Datastore).remove(
                    { _id: asset._id },
                    {},
                    err => {
                        if (err) {
                            _reject(err);
                            return;
                        }
                        unlinkFile(asset._id, config.APP.DIR_PATH.FILE_PATH);
                        _resolve;
                    }
                );
            } else {
                _resolve;
            }
        });

        try {
            // search asset to db.
            (remote.getGlobal('APP_DB').assetMediaDb as Datastore)
                .find(
                    {},
                    async (err: Error, searchedAsset: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        for (const a of searchedAsset) {
                            // Remove from db.
                            await task(a);
                        }
                    }
                );
            resolve();
        } catch (err) {
            console.error('Failed unlink asset in database: ', err);
            reject();
        }
    });
}

export function initDB() {
    if (!remote.getGlobal('APP_DB').assetMediaDb) {
        return;
    }

    (remote.getGlobal('APP_DB').assetMediaDb as Datastore).remove(
        {},
        { multi: true },
        err => {
            if (err) {
                return;
            }
        }
    );
}
