import axios from 'axios';
import config from '@app/config';

// Helper utils
import { getAuthHeader } from '../helper';

import { APIList, APIListParams } from '../helper.model';

import {
    AssetAPIResponse,
    AssetAPIResult
} from './assetApi.model';


export function apiAsset(
    options: APIListParams = {}
): Promise<APIList<AssetAPIResult>> {
    // Create api call body.
    const params = new URLSearchParams();
    if (options.filter)   params.append('filter', JSON.stringify(options.filter));
    if (options.order)   params.append('order', options.order);
    if (options.page)    params.append('page', `${options.page}`);
    if (options.perPage) params.append('perPage', `${options.perPage}`);
    if (options.sort)    params.append('sort', options.sort);

    return new Promise<APIList<AssetAPIResult>>((resolve, reject) => {
        axios.get<APIList<AssetAPIResponse>>(
            config.EXTERNAL.CUBLICK.ASSET.AST,
            {
                headers: getAuthHeader(),
                params
            }
        )
        .then(res => res.data)
        .then(res => ({
            ...res,
            data: res.data.map(datum => ({
                id: datum.id,
                name: datum.name,
                owner: datum.owner,
                updatedDate: datum.updatedDate,
                width: datum.width,
                height: datum.height,
                md5: datum.md5,
                fileType: datum.fileType,
                mimeType: datum.mimeType
            }))
        }))
        .then(resolve as any)
        .catch(reject);
    });
}


//  @param deviceId  Device ID.

export function getAsset(assetId: string): Promise<AssetAPIResponse> {
    return new Promise<AssetAPIResponse>((resolve, reject) => {
        axios.get<AssetAPIResponse>(
            `${config.EXTERNAL.CUBLICK.ASSET.AST}/${assetId}`,
            { headers: getAuthHeader() }
        )
        .then(res => res.data)
        .then(resolve)
        .catch(reject);
    });
}


/**
 * Get current device screen snapshot image.
 * @param deviceId  Device ID.
 */
export function getAssetSnapshot(assetId: string): Promise<Blob> {
    const url = new URL(`${config.EXTERNAL.CUBLICK.ASSET.AST}/${assetId}/snapshot`);
    url.searchParams.append('access_token', getAuthHeader()['X-Access-Token']);

    return new Promise<Blob>((resolve, reject) => {
        fetch(url.href)
            .then(res => res.blob())
            .then(resolve)
            .catch(reject);
    });
}


/**
 * Update device information.
 * @param assetId      Device ID to update.
 * @param assetInfo    Information to update.
 */
export function updateAsset(
    assetId: string,
    assetInfo: { [key: string]: string } = {}
): Promise<void> {
    // Append all device info to update at body.
    const body = new URLSearchParams();
    Object.keys(assetInfo).map(info => {
        body.append(info, assetInfo[info]);
    });

    return new Promise<void>((resolve, reject) => {
        axios.put<any>(
            `${config.EXTERNAL.CUBLICK.ASSET.AST}/${assetId}`,
            body,
            { headers: getAuthHeader() }
        )
        .then(() => resolve())
        .catch(reject);
    });
}

export function getPolicy(fileName: string): Promise<any> {
    const params = new URLSearchParams();
    params.append('filename', fileName);
    return new Promise<any>((resolve, reject) => {
        axios.get<any>(
            `${config.EXTERNAL.CUBLICK.ASSET.UPL}`,
            { headers: getAuthHeader(),
              params
            }
        )
        .then(res => res.data)
        .then(resolve)
        .catch(reject);
    });
}
