import { ipcRenderer } from 'electron';

import store from '../../../store';
import { getMediaForDownload } from '../../main/database/search';
import { updateInDB } from '../../main/database/update';
import { FileMetadata } from '@app/utils/main/thumbnail';

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