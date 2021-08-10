import axios, { AxiosResponse } from 'axios';

import electronConfig from '@app/config/electron-config';
import store from '@app/store';

/**
 * get assetList Data using axios
 * @param assetList assetList
 */

/**
 * get Content Data using axios
 * ex) Get presentation, asset, somthings data
 * @param API cublick api
 */
export function getDataInAPI(API: string): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>((resolve, reject) => {
        axios({
            url: API,
            method: 'GET'
        })
        .then((data: AxiosResponse) => {
            resolve(data);
        })
        .catch((err) => {
            console.error(`ERROR_GET_DATA_IN_API: ${err}`);
            reject(`ERROR_GET_DATA_IN_API: ${err}`);
        });
    });
}

export interface GoogleStoreResponse {
    ext: string;
    id: string;
    md5: string;
    owner: string;
    url: string;
}


