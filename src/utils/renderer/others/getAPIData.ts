import axios, { AxiosResponse } from 'axios';

import electronConfig from '@app/config/electron-config';
import store from '@app/store';

/**
 * get assetList Data using axios
 * @param assetList assetList
 */
export function getUrlInGoogleStore(assets: any): Promise<Array<GoogleStoreResponse>> {
    return new Promise<Array<GoogleStoreResponse>>((resolve, reject) => {
        try {
            axios({
                url: electronConfig.CUBLICK.API.GET_ASSET_GOOGLESTORE_INFO(
                    JSON.stringify(assets),
                    store.getState().appAuth.token
                ),
                method: 'GET'
            })
            // .then(res => console.log('getUrlInGoogleStore', res));
            .then((response) => {
                resolve(response.data.assets);
            });
        } catch (err) {
            console.error(`ERROR_GET_DATA_IN_GOOGLE_STORE: ${err}`);
            reject(`ERROR_GET_DATA_IN_GOOGLE_STORE: ${err}`);
        }
    });
}

export function getWidgetThumbnailInGoogleStore(data: any): Promise<Array<GoogleStoreResponse>> {
    return new Promise<Array<GoogleStoreResponse>>((resolve, reject) => {
        try {
            axios({
                url: electronConfig.CUBLICK.API.GET_WIDGET_THUMBNAIL(
                    data,
                    store.getState().appAuth.token
                ),
                method: 'GET'
            })
            .then((response) => {
                resolve(response.request.responseURL);
            });
        } catch (err) {
            console.error(`ERROR_GET_DATA_IN_GOOGLE_STORE: ${err}`);
            reject(`ERROR_GET_DATA_IN_GOOGLE_STORE: ${err}`);
        }
    });
}

export function getPresentationThumbnailInGoogleStore(data: any): Promise<Array<GoogleStoreResponse>> {
    return new Promise<Array<GoogleStoreResponse>>((resolve, reject) => {
        try {
            axios({
                url: electronConfig.CUBLICK.API.GET_PRESENTATION_THUMBNAIL(
                    data,
                    store.getState().appAuth.token
                ),
                method: 'GET'
            })
            .then((response) => {
                resolve(response.request.responseURL);
            });
        } catch (err) {
            console.error(`ERROR_GET_DATA_IN_GOOGLE_STORE: ${err}`);
            reject(`ERROR_GET_DATA_IN_GOOGLE_STORE: ${err}`);
        }
    });
}

export function getAssetThumbnailInGoogleStore(data: any): Promise<Array<GoogleStoreResponse>> {
    return new Promise<Array<GoogleStoreResponse>>((resolve, reject) => {
        try {
            axios({
                url: electronConfig.CUBLICK.API.GET_ASSET_THUMBNAIL(
                    data,
                    store.getState().appAuth.token
                ),
                method: 'GET'
            })
            .then((response) => {
                resolve(response.request.responseURL);
            });
        } catch (err) {
            console.error(`ERROR_GET_DATA_IN_GOOGLE_STORE: ${err}`);
            reject(`ERROR_GET_DATA_IN_GOOGLE_STORE: ${err}`);
        }
    });
}

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


