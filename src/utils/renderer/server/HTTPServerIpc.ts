import axios from 'axios';
import config from '@app/config';
import store from '@app/store';

import * as path from 'path';

import * as fs from 'fs';

import electronConfig from '@app/config/electron-config';

import { getPresentationDesign } from '@app/apis/presentation/presentationApi';

import { createActivateToken, generateFileZip, createRequestToken, createPlaylistData, createScheduleData } from './others';
import { result } from 'lodash-es';

const { dialog } = require('electron').remote;
const errorOptions = {
    type: 'error',
    buttons: ['Yes'],
    title: 'error',
    message: 'Send Data Error'
};
const successOptions = {
    type: 'info',
    buttons: ['Yes'],
    title: 'success',
    message: 'Send Success'
};

// CONNECT

export function connectToPlayerHttp(playerIp: any, pinCode: any): Promise<void> {
    const body = {};
    const userId = store.getState().appAuth.userData.id;
    const header = {
        'x-access-token': createActivateToken(pinCode),
        'dashboard': userId
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/activate`,
        body,
            {
                headers: header,
            })
            .then (() => resolve())
            .catch ( reject );
    });
}

export function unconnectToPlayerHttp(playerIp: any, pinCode: any): Promise<void> {

    const body = {
        'cmd': 'DELETE'
    };

    const header = {
        'x-access-token': createRequestToken(pinCode)
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/request`,
            body,
            {
                headers: header,
            })
            .then (() => resolve())
            .catch ( reject );
    });
}

// ASSET

export function VerifyDataAssetHttp(playerIp: any, pinCode: any, contentData: any): Promise<void> {

    const data = {
        fileType: contentData.fileType,
            id: contentData.id,
            md5: contentData.md5
    };

    const body = {
        cmd: 'VERIFY_DATA',
        data: JSON.stringify([data])
    };

    const header = {
        'x-access-token': createRequestToken(pinCode)
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/request`,
            body,
            {
                headers: header,
            })
            .then(res => res.data)
            .then(res => res.data.message === 'OK' || 'ok' ? generateFileZip(contentData, playerIp, pinCode, 'ASSET') : console.log('ZIP err'))
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}

export function uploadAssetZipHttp(binary: any, playerIp: any, pinCode: any, md5: any, contentData: any ): Promise<void> {

    const formData = new FormData();
    formData.append('file', binary);

    const header = {
        'x-access-token': createRequestToken(pinCode),
        'md5': md5,
        'Content-Type': 'multipart/form-data;'
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/upload`,
            formData,
            {
                headers: header,
            })
            .then(res => res.data)
            .then(res => res.message === 'OK' || 'ok' ? ExecuteAssetHttp(playerIp, pinCode, contentData) : console.error('EXECUTE ERR'))
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}

export function ExecuteAssetHttp(playerIp: any, pinCode: any, contentData: any ): Promise<void> {

    const body = {
        cmd: 'EXECUTE',
        fileType: contentData.fileType,
        id: contentData.id,
        md5: contentData.md5,
        mimeType: contentData.mimeType,
        name: contentData.name,
        type: contentData.type
    };

    const header = {
        'x-access-token': createRequestToken(pinCode)
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/request`,
            body,
            {
                headers: header,
            })
            .then(res => console.log(res))
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}

// PRESENTATION

export function VerifyDataPresentationHttp(playerIp: any, pinCode: any, contentData: any): Promise<void> {

    console.log('contentData', contentData);

    let tmp = contentData.assets;

    tmp = tmp.concat({
        fileType: '.pre',
        id: contentData.id,
        md5: 'NONE'
    });

    let data: any = [];

    tmp.map((assets: any) => {
        data = data.concat({
            fileType: assets.fileType,
            id: assets.id,
            md5: assets.md5
        });
    });

    console.log('data', data);

    const userId = store.getState().appAuth.userData.id;

    const body = {
        cmd: 'VERIFY_DATA',
        data: JSON.stringify(data)
    };

    const header = {
        'x-access-token': createRequestToken(pinCode)
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/request`,
            body,
            {
                headers: header,
            })
            .then(res => res.data)
            .then(res => res.message === 'OK' || 'ok' ? generateFileZip(contentData, playerIp, pinCode, 'PRESENTATION') : console.log('ZIP err'))
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}

export function uploadPresentationZipHttp(binary: any, playerIp: any, pinCode: any, md5: any, contentData: any ): Promise<void> {

    const formData = new FormData();
    formData.append('file', binary);

    const header = {
        'x-access-token': createRequestToken(pinCode),
        'md5': md5,
        'Content-Type': 'multipart/form-data;'
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/upload`,
            formData,
            {
                headers: header,
            })
            .then(res => res.data)
            .then(res => res.message === 'OK' || 'ok' ? ExecutePresentationHttp(playerIp, pinCode, contentData) : console.error('EXECUTE ERR'))
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}

export function ExecutePresentationHttp(playerIp: any, pinCode: any, contentData: any ): Promise<void> {

    const body = {
        cmd: 'EXECUTE',
        fileType: contentData.fileType,
        id: contentData.id,
        md5: contentData.md5,
        mimeType: contentData.mimeType,
        name: contentData.name,
        type: contentData.type
    };

    const header = {
        'x-access-token': createRequestToken(pinCode)
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/request`,
            body,
            {
                headers: header,
            })
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}


// INSTANTMESSAGE

export function uploadInstantMessageZipHttp(binary: any, playerIp: any, pinCode: any, md5: any, contentData: any ): Promise<void> {

    const formData = new FormData();
    formData.append('file', binary);

    const header = {
        'x-access-token': createRequestToken(pinCode),
        'md5': md5,
        'Content-Type': 'multipart/form-data;'
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/upload`,
            formData,
            {
                headers: header,
            })
            .then(res => res.data)
            .then(res => res.message === 'OK' || 'ok' ? ExecuteInstantMessageHttp(playerIp, pinCode, contentData) : console.error('EXECUTE ERR'))
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}


export function ExecuteInstantMessageHttp(playerIp: any, pinCode: any, contentData: any ): Promise<void> {

    const body = {
        cmd: 'EXECUTE',
        id: contentData.id,
        name: contentData.name,
        type: contentData.type
    };

    const header = {
        'x-access-token': createRequestToken(pinCode)
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/request`,
            body,
            {
                headers: header,
            })
            .then(res => console.log(res))
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}


// PLAYLIST

export function VerifyDataPlaylistHttp(playerIp: any, pinCode: any, contentData: any): Promise<void> {
    return new Promise((resolve, reject) => {

    let body = {
        cmd: 'VERIFY_DATA',
        data: null
    };

    createPlaylistData(contentData)
    .then(res => {
        body = {
            cmd: 'VERIFY_DATA',
            data: JSON.stringify(res)
        };
    })
    .then(() => {
        const header = {
            'x-access-token': createRequestToken(pinCode)
        };

        axios.post(`http://${playerIp}:8080/request`,
        body,
        {
            headers: header,
        })
        .then(res => res.data)
        .then(res => res.message === 'OK' || 'ok' ? generateFileZip(contentData, playerIp, pinCode, 'PLAYLIST', JSON.parse(body.data)) : console.log('ZIP err'))
        .then (() => resolve())
        .catch(() => dialog.showMessageBox(null, errorOptions))
        .catch ( reject );
        });
    });
}

export function uploadPlaylistZipHttp(binary: any, playerIp: any, pinCode: any, md5: any, contentData: any ): Promise<void> {

    const formData = new FormData();
    formData.append('file', binary);

    const header = {
        'x-access-token': createRequestToken(pinCode),
        'md5': md5,
        'Content-Type': 'multipart/form-data;'
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/upload`,
            formData,
            {
                headers: header,
            })
            .then(res => res.data)
            .then(res => res.message === 'OK' || 'ok' ? ExecutePlaylistHttp(playerIp, pinCode, contentData) : console.error('EXECUTE ERR'))
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}

export function ExecutePlaylistHttp(playerIp: any, pinCode: any, contentData: any ): Promise<void> {

    const body = {
        cmd: 'EXECUTE',
        id: contentData.id,
        name: contentData.name,
        type: contentData.type
    };

    const header = {
        'x-access-token': createRequestToken(pinCode)
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/request`,
            body,
            {
                headers: header,
            })
            .then(res => console.log(res))
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}


// SCHEDULE

export function VerifyDataScheduleHttp(playerIp: any, pinCode: any, contentData: any): Promise<void> {
    return new Promise((resolve, reject) => {

    let body = {
        cmd: 'VERIFY_DATA',
        data: null
    };

    createScheduleData(contentData)
    .then(res => {
        body = {
            cmd: 'VERIFY_DATA',
            data: JSON.stringify(res)
        };
    })
    .then(() => {
        const header = {
            'x-access-token': createRequestToken(pinCode)
        };

        axios.post(`http://${playerIp}:8080/request`,
        body,
        {
            headers: header,
        })
        .then(res => res.data)
        .then(res => res.message === 'OK' || 'ok' ? generateFileZip(contentData, playerIp, pinCode, 'SCHEDULE', JSON.parse(body.data)) : console.log('ZIP err'))
        .then (() => resolve())
        .catch(() => dialog.showMessageBox(null, errorOptions))
        .catch ( reject );
        });
    });
}

export function uploadScheduleZipHttp(binary: any, playerIp: any, pinCode: any, md5: any, contentData: any ): Promise<void> {

    const formData = new FormData();
    formData.append('file', binary);

    const header = {
        'x-access-token': createRequestToken(pinCode),
        'md5': md5,
        'Content-Type': 'multipart/form-data;'
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/upload`,
            formData,
            {
                headers: header,
            })
            .then(res => res.data)
            .then(res => res.message === 'OK' || 'ok' ? ExecuteScheduleHttp(playerIp, pinCode, contentData) : console.error('EXECUTE ERR'))
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}

export function ExecuteScheduleHttp(playerIp: any, pinCode: any, contentData: any ): Promise<void> {

    const body = {
        cmd: 'EXECUTE',
        content: contentData,
        id: contentData.id,
        name: contentData.name,
        type: contentData.type
    };

    const header = {
        'x-access-token': createRequestToken(pinCode)
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/request`,
            body,
            {
                headers: header,
            })
            .then(res => console.log(res))
            .then (() => resolve())
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}


// Thermal

export function getThermalDataHttp(playerIp: any, pinCode: any, dateInfo: any): Promise<any> {

    const body = {
        cmd: 'GET_DATA',
        date: dateInfo
    };

    const header = {
        'x-access-token': createRequestToken(pinCode)
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/request`,
            body,
            {
                headers: header,
            })
            .then(res => res.data)
            .then (resolve)
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}

export function DelThermalDataHttp(playerIp: any, pinCode: any, dateInfo: any): Promise<any> {

    const body = {
        cmd: 'DEL_THERMAL',
        date: dateInfo
    };

    const header = {
        'x-access-token': createRequestToken(pinCode)
    };

    return new Promise((resolve, reject) => {
        axios.post(`http://${playerIp}:8080/request`,
            body,
            {
                headers: header,
            })
            .then(res => console.log(res))
            .then (resolve)
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch ( reject );
    });
}