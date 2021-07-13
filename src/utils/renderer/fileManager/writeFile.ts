import { ipcRenderer } from 'electron';

import store from '../../../store';
import { getMediaForDownload } from '../../main/database/search';
import {
    getUrlInGoogleStore,
    getWidgetThumbnailInGoogleStore,
    getPresentationThumbnailInGoogleStore,
    getAssetThumbnailInGoogleStore
} from '../others/getAPIData';
import { updateInDB } from '../../main/database/update';
import { FileMetadata } from '@app/utils/main/thumbnail';

/**
 * Download File from google storage
 * @param type content type
 * @param object content object data
 */
export function writeMediaAsFile(type: string, data: any): Promise<void> {
    console.log(data);
    return new Promise<void>((resolve, reject) => {
        try {
            const assetList: Array<any> = [];

            switch (type) {
                case 'ASSET':
                    getUrlInGoogleStore([data.id])
                        .then((response: any) => {
                            ipcRenderer.send('AppDisplayer-Asset-Write', response, 'ASSET');
                            console.log('res', response);
                        })
                        .catch((err: Error) => {
                            console.error(`ERROR_DOWNLOAD_FILE: ${err}`);
                            reject(`ERROR_DOWNLOAD_FILE: ${err}`);
                        });
                    break;

                case 'PRESENTATION':
                    for (let i = 0; i < data.assets.length; i++) {
                        assetList.push(data.assets[i].id);
                    }
                    for (let i = 0; i < data.regions.length; i++) {
                        if (data.regions[i].type === 'VECTOR_GRAPHIC' &&
                            data.regions[i].properties.srcType === 'SDSS'
                        ) {
                            assetList.push({
                                id: data.regions[i].properties.id
                                // name: data.regions[i].properties.name,
                                // md5: 0,
                                // fileType: '.svg'
                            });
                        }
                    }
                    getUrlInGoogleStore(assetList)
                        .then((response: any) => {
                            ipcRenderer.send('AppDisplayer-Asset-Write', response, 'PRESENTATION');
                            console.log('res', response);
                        })
                        .catch((err: Error) => {
                            console.error(`ERROR_DOWNLOAD_FILE: ${err}`);
                            reject(`ERROR_DOWNLOAD_FILE: ${err}`);
                        });
                    break;

                case 'WIDGET':
                    for (let i = 0; i < data.assets.length; i++) {
                        assetList.push(data.assets[i].id);
                    }
                    getUrlInGoogleStore(assetList)
                        .then((response: any) => {
                            ipcRenderer.send('AppDisplayer-Asset-Write', response, 'WIDGET');
                            console.log('res', response);
                        })
                        .catch((err: Error) => {
                            console.error(`ERROR_DOWNLOAD_FILE: ${err}`);
                            reject(`ERROR_DOWNLOAD_FILE: ${err}`);
                        });
                    break;
            }
        } catch (err) {
            console.error(`ERROR_DOWNLOAD_FILE: ${err}`);
            reject(`ERROR_DOWNLOAD_FILE: ${err}`);
        }
    });
}

export function writeWidgetAsThumbnail(baseId: string, instantId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            getWidgetThumbnailInGoogleStore(baseId)
                .then((response: any) => {
                    ipcRenderer.send('AppWidget-Thumbnail-Write', response, instantId);
                    console.log('writeWidgetAsThumbnail', response);
                })
                .catch((err: Error) => {
                    console.error(`ERROR_DOWNLOAD_FILE: ${err}`);
                    reject(`ERROR_DOWNLOAD_FILE: ${err}`);
                });
        } catch (err) {
            console.error(`ERROR_DOWNLOAD_FILE: ${err}`);
            reject(`ERROR_DOWNLOAD_FILE: ${err}`);
        }
    });
}

export function writePresentationAsThumbnail(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            getPresentationThumbnailInGoogleStore(id)
                .then((response: any) => {
                    ipcRenderer.send('AppPresentation-Thumbnail-Write', response, id);
                    console.log('writePresentationAsThumbnail', response);
                })
                .catch((err: Error) => {
                    console.error(`ERROR_DOWNLOAD_FILE: ${err}`);
                    reject(`ERROR_DOWNLOAD_FILE: ${err}`);
                });
        } catch (err) {
            console.error(`ERROR_DOWNLOAD_FILE: ${err}`);
            reject(`ERROR_DOWNLOAD_FILE: ${err}`);
        }
    });
}

export function writeAssetAsThumbnail(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            getAssetThumbnailInGoogleStore(id)
                .then((response: any) => {
                    ipcRenderer.send('AppAsset-Thumbnail-Write', response, id);
                    console.log('writeAssetAsThumbnail', response);
                })
                .catch((err: Error) => {
                    console.error(`ERROR_DOWNLOAD_FILE: ${err}`);
                    reject(`ERROR_DOWNLOAD_FILE: ${err}`);
                });
        } catch (err) {
            console.error(`ERROR_DOWNLOAD_FILE: ${err}`);
            reject(`ERROR_DOWNLOAD_FILE: ${err}`);
        }
    });
}

export function writeLocalPresentationAsThumbnail(thumbnail: string, id: string) {
    // console.log(thumbnail);
    ipcRenderer.send('AppLocalPresentation-Thumbnail-Write', thumbnail, id);
}


export interface AssetListType {
    id: string;
    name: string;
    md5: string | number;
    fileType: string;
}

export interface GoogleStoreResponse {
    ext: string;
    id: string;
    md5: string;
    owner: string;
    url: string;
}