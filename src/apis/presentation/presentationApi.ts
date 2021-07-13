import axios from 'axios';
import config from '@app/config';

// Helper utils
import { getAuthHeader } from '../helper';

import { APIList, APIListParams } from '../helper.model';

import {
    PresentationAPIResponse,
    PresentationAPIResult
} from './presentationApi.model';


export function apiPresentation(
    options: APIListParams = {}
): Promise<APIList<PresentationAPIResult>> {
    // Create api call body.
    const params = new URLSearchParams();
    if (options.filter)   params.append('filter', JSON.stringify(options.filter));
    if (options.order)   params.append('order', options.order);
    if (options.page)    params.append('page', `${options.page}`);
    if (options.perPage) params.append('perPage', `${options.perPage}`);
    if (options.sort)    params.append('sort', options.sort);

    return new Promise<APIList<PresentationAPIResult>>((resolve, reject) => {
        axios.get<APIList<PresentationAPIResponse>>(
            config.EXTERNAL.CUBLICK.PRESENTATION.PRE,
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
                height: datum.height
            }))
        }))
        .then(resolve as any)
        .catch(reject);
    });
}


//  @param deviceId  Device ID.

export function getPresentation(presentationId: string): Promise<PresentationAPIResponse> {
    return new Promise<PresentationAPIResponse>((resolve, reject) => {
        axios.get<PresentationAPIResponse>(
            `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}/${presentationId}`,
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
export function getPresentationIdSnapshot(presentationId: string): Promise<Blob> {
    const url = new URL(`${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}/${presentationId}/snapshot`);
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
 * @param presentationId      Device ID to update.
 * @param presentationInfo    Information to update.
 */
export function updatePresentationId(
    presentationId: string,
    presentationInfo: { [key: string]: string } = {}
): Promise<void> {
    // Append all device info to update at body.
    const body = new URLSearchParams();
    Object.keys(presentationInfo).map(info => {
        body.append(info, presentationInfo[info]);
    });

    return new Promise<void>((resolve, reject) => {
        axios.put<any>(
            `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}/${presentationId}`,
            body,
            { headers: getAuthHeader() }
        )
        .then(() => resolve())
        .catch(reject);
    });
}

export function getPresentationDesign(presentationId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        axios.get<any>(
            `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}/${presentationId}/design`,
            { headers: getAuthHeader() }
        )
        .then(res => res.data)
        .then(resolve)
        .catch(reject);
    });
}

export async function uploadPresentationInfo(prstnInfo: any): Promise<void> {
    const body = new URLSearchParams();

    body.append('code', prstnInfo.code);
    body.append('name', prstnInfo.name);
    body.append('desc', prstnInfo.desc);
    body.append('tags', JSON.stringify(prstnInfo.tags));
    body.append('lock', prstnInfo.lock);
    body.append('orientation', prstnInfo.orientation);
    body.append('ratio', prstnInfo.ratio);
    body.append('width', prstnInfo.width);
    body.append('height', prstnInfo.height);
    body.append('bgAudioEnable', prstnInfo.bgAudioEnable);
    body.append('bgEnable', prstnInfo.bgEnable);
    body.append('bg', JSON.stringify(prstnInfo.bg));
    body.append('bgAudio', JSON.stringify(prstnInfo.bgAudio));
    body.append('sharedList', JSON.stringify(prstnInfo.sharedList));
    body.append('mobility', prstnInfo.mobility);


    return new Promise((resolve, reject) => {
        axios.post(config.EXTERNAL.CUBLICK.PRESENTATION.PRE,
            body,
            {
                headers: getAuthHeader(),
            })
            .then((res) => {
                resolve(res.data.id);
            })
            .catch(reject);
    });

}

export async function uploadPresentationDesign(prstnId: any, prstnDesign: any): Promise<void> {

    const body = new URLSearchParams();

    body.append('designData', JSON.stringify(prstnDesign));

    return new Promise((resolve, reject) => {
        axios.post(config.EXTERNAL.CUBLICK.PRESENTATION.DESIGNDATA(prstnId),
            body,
            {
                headers: getAuthHeader(),
            })
            .then((res) => {
                resolve();
                console.log(res);
            })
            .catch(reject);
    });
}

export async function uploadPresentationAssetList(prstnId: any, prstnAssetList: any): Promise<void> {

    const body = new URLSearchParams();

    body.append('assets', JSON.stringify(prstnAssetList));

    return new Promise((resolve, reject) => {
        axios.put(config.EXTERNAL.CUBLICK.PRESENTATION.ASSETLIST(prstnId),
            body,
            {
                headers: getAuthHeader(),
            })
            .then(() => resolve())
            .catch(reject);
    });
}

export async function uploadPresentationThumbnail(prstnId: any, prstnThumbnail: File): Promise<void> {

    const body: FormData = new FormData();

    body.append('file', prstnThumbnail);

    return new Promise((resolve, reject) => {
        axios.post(config.EXTERNAL.CUBLICK.PRESENTATION.UPLOAD_THUMBNAIL(prstnId),
            body,
            {
                headers: getAuthHeader(),
            })
            .then(() => resolve())
            .catch((err) => {
                console.log(err);
                reject;
            });
    });
}