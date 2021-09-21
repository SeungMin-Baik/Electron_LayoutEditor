import { remote, ipcRenderer } from 'electron';
import * as Datastore from 'nedb';
import * as moment from 'moment';

/**
 * insert asset value to database
 * @param asset asset value
 */
export function updateInDB(assetList: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            if (!remote.getGlobal('APP_DB').assetMediaDb) {
                console.error('ERR_DB_IS_UNDEFINED');
                reject('ERR_DB_IS_UNDEFINED');
                return;
            }

            assetList.map((asset: any) => {
                (remote.getGlobal('APP_DB').assetMediaDb as Datastore).update(
                    {
                        _id: asset
                    },
                    {
                        timestamp: moment().format('X'),  // UNIX timestamp.
                    },
                    {},
                    (err: any, numReplaced: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve();
                    }
                );
            });
        } catch (err) {
            reject(err);
        }
    });
}


export function updatePresentationDataInDB(event: any, presentation: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            if (!remote.getGlobal('PT_DB').presentationMediaDb) {
                console.error('ERR_DB_IS_UNDEFINED');
                event.sender.send('log', 3, 'ERR_DB_IS_UNDEFINED');
                reject('ERR_DB_IS_UNDEFINED');
                return;
            }

            (remote.getGlobal('PT_DB').presentationMediaDb as Datastore).update(
                {
                    _id: presentation._id
                },
                {
                    $set: {
                    FileData: {
                            bgAudio: presentation.bgAudio,
                            bg: presentation.bg,
                            code: presentation.code,
                            name: presentation.name,
                            desc: presentation.desc,
                            lock: presentation.lock,
                            isLocal: presentation.isLocal,
                            accessRight: presentation.accessRight,
                            orientation: presentation.orientation,
                            ratio: presentation.ratio,
                            width: presentation.width,
                            height: presentation.height,
                            bgAudioEnable: presentation.bgAudioEnable,
                            bgEnable: presentation.bgEnable,
                            tags: presentation.tags,
                            regions: presentation.regions,
                            isPrivate: presentation.isPrivate,
                            isSystem: presentation.isSystem,
                            payLevelAccess: presentation.payLevelAccess,
                            isGridTpl: presentation.isGridTpl,
                            mobility: presentation.mobility,
                            rules: presentation.rules,
                            _id: presentation._id,
                            assets: presentation.assets,
                            createdDate: presentation.createdDate,
                            updatedDate: presentation.updatedDate,
                            type: 'presentation'
                        },
                        layoutinfo: presentation.layoutinfo,
                        timestamp: moment().format('LLL'),
                    }
                },
                {},
                (err: any, numReplaced: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve();
                }

            );
        } catch (err) {
            reject(err);
        }
    });
}
