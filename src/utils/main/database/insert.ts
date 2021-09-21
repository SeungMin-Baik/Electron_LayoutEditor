import { remote, ipcRenderer } from 'electron';
import * as Datastore from 'nedb';
import * as moment from 'moment';
import electronConfig from '@app/config/electron-config';
import store from '@app/store';

/**
 * insert asset value to database
 * @param asset asset value
 */

    // ASSET

export function insertClientAssetDataInDB(event: any, asset: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            if (!remote.getGlobal('APP_DB').assetMediaDb) {
                console.error('ERR_DB_IS_UNDEFINED');
                event.sender.send('log', 3, 'ERR_DB_IS_UNDEFINED');
                reject('ERR_DB_IS_UNDEFINED');
                return;
            }

            (remote.getGlobal('APP_DB').assetMediaDb as Datastore).insert(
                {
                    FileData: {
                        name: asset.name,
                        path: asset.path,
                        fileType: asset.fileType,
                        mimeType: asset.mimeType.toUpperCase(),
                        md5: asset.md5,
                        width: asset.width,
                        height: asset.height
                    },
                    timestamp: moment().format('LLL'),
                    _id: asset.id
                },
                err => {
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

    // PRESENTATION


export function insertLocalPresentationDataInDB(event: any, presentation: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            if (!remote.getGlobal('PT_DB').presentationMediaDb) {
                console.error('ERR_DB_IS_UNDEFINED');
                event.sender.send('log', 3, 'ERR_DB_IS_UNDEFINED');
                reject('ERR_DB_IS_UNDEFINED');
                return;
            }

            (remote.getGlobal('PT_DB').presentationMediaDb as Datastore).insert(
                {
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
                    _id: presentation._id,
                },
                err => {
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
