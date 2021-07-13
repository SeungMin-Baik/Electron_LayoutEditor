import { remote, ipcRenderer } from 'electron';
import * as Datastore from 'nedb';
import * as moment from 'moment';
import electronConfig from '@app/config/electron-config';
import config from '@app/config/cublick-apis';
import store from '@app/store';
import { propertiesToInclude } from '@app/components/LayoutEditor/canvas/constants/defaults';

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

export function insertServerAssetDataInDB(event: any, asset: any): Promise<void> {
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
                        desc: asset.desc,
                        customTags: asset.customTags,
                        value: asset.value,
                        tags: asset.value,
                        mimeType: asset.mimeType,
                        srcType: asset.srcType,
                        fileType: asset.fileType,
                        status: asset.status,
                        width: asset.width,
                        duration: asset.duration,
                        height: asset.height,
                        md5: asset.md5,
                        size: asset.size,
                        downloadCount: asset.downloadCount,
                        srcLink: asset.srcLink,
                        metaData: asset.metaData,
                        copyright: asset.copyright,
                        hasThumbnail: asset.hasThumbnail,
                        isPrivate: asset.isPrivate,
                        isSystem: asset.isSystem,
                        _id: asset._id,
                        owner: asset.owner,
                        createdDate: asset.createdDate,
                        updatedDate: asset.updatedDate,
                        id: asset.id,
                        path: electronConfig.APP.DIR_PATH.FILE_PATH,
                        type: asset.type
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

export function insertServerPresentationDataInDB(event: any, presentation: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            if (!remote.getGlobal('PT_DB').presentationMediaDb) {
                console.error('ERR_DB_IS_UNDEFINED');
                event.sender.send('log', 3, 'ERR_DB_IS_UNDEFINED');
                reject('ERR_DB_IS_UNDEFINED');
                return;
            }

            let tmpRegions = [];

            tmpRegions = tmpRegions.concat(
                {
                    angle: 0,
                    backgroundColor: '#fff',
                    clipTo: null,
                    cropX: 0,
                    cropY: 0,
                    crossOrigin: '',
                    fill: 'rgb(0,0,0)',
                    fillRule: 'nonzero',
                    filters: [],
                    flipX: false,
                    flipY: false,
                    globalCompositeOperation: 'source-over',
                    height: presentation.height,
                    id: 'workarea',
                    layout: 'fixed',
                    left: presentation.orientation === 'LANDSCAPE' ? -384 : -337,
                    link: {},
                    name: '',
                    opacity: 1,
                    originX: 'left',
                    originY: 'top',
                    paintFirst: 'fill',
                    scaleX: 1,
                    scaleY: 1,
                    shadow: null,
                    skewX: 0,
                    skewY: 0,
                    src: '',
                    stroke: null,
                    strokeDashArray: null,
                    strokeDashOffset: 0,
                    strokeLineCap: 'butt',
                    strokeLineJoin: 'miter',
                    strokeMiterLimit: 4,
                    strokeWidth: 0,
                    tooltip: {
                        enabled: false
                    },
                    top: presentation.orientation === 'LANDSCAPE' ? -216 : -600,
                    transformMatrix: null,
                    type: 'image',
                    version: '3.6.6',
                    visible: true,
                    width: presentation.width
                }
            );

            if (presentation.regions && presentation.regions.length > 0) {
                presentation.regions.map(region => {

                if (region.type === 'IMAGE' || region.type === 'VIDEO') {
                    tmpRegions = tmpRegions.concat({
                        angle: region.rotate,
                        assetid: region.properties ? region.properties.id : '',
                        backgroundColor: '',
                        clipTo: null,
                        cropX: 0,
                        cropY: 0,
                        crossOrigin: 'anonymous',
                        editable: true,
                        fileType: region.properties ? region.properties.fileType : '.jpg',
                        fill: 'rgb(0,0,0)',
                        fillRule: 'nonzero',
                        filters: [],
                        flipX: false,
                        flipY: false,
                        globalCompositeOperation: 'source-over',
                        id: region.id,
                        width: presentation.orientation === 'LANDSCAPE' ? region.width * 2 / (presentation.width / 1152) : region.width * 2 / (presentation.width / 405),
                        height: presentation.orientation === 'LANDSCAPE' ? region.height * 2 / (presentation.height / 648) : region.height * 2 / (presentation.height / 720),
                        left: presentation.orientation === 'LANDSCAPE' ? region.x * 2 / (presentation.width / 1152) - 576 : region.x * 2 / (presentation.width / 405) - 202.5,
                        top: presentation.orientation === 'LANDSCAPE' ? region.y * 2 / (presentation.height / 648) - 324 : region.y * 2 / (presentation.height / 720) - 360,
                        md5: region.properties ? region.properties.md5 : '',
                        mimeType: 'IMAGE',
                        name: region.properties ? region.properties.name : '',
                        opacity: 1,
                        originX: 'left',
                        originY: 'top',
                        paintFirst: 'fill',
                        scaleX: 1,
                        scaleY: 1,
                        shadow: null,
                        skewX: 0,
                        skewY: 0,
                        src: 'file:///' + electronConfig.APP.DIR_PATH.THUMBNAIL_PATH + '/' + region.properties.id + '_thumb.png',
                        stroke: null,
                        strokeDashArray: null,
                        strokeDashOffset: 0,
                        strokeLineCap: 'butt',
                        strokeLineJoin: 'miter',
                        strokeMiterLimit: 4,
                        strokeWidth: 0,
                        transformMatrix: null,
                        type: 'image',
                        version: '3.6.6',
                        visible: true,
                        zOrder: region.zOrder
                    });
                } else if (region.type === 'TEXT') {
                    tmpRegions = tmpRegions.concat({
                        angle: region.rotate,
                        backgroundColor: '',
                        charSpacing: 0,
                        clipTo: null,
                        crossOrigin: 'anonymous',
                        editable: true,
                        fill: region.properties ? region.properties.fontColor : '#000000',
                        fillRule: 'nonzero',
                        flipX: false,
                        flipY: false,
                        fontFamily: region.properties ? region.properties.fontName : 'Anton',
                        fontSize:
                            region.properties ?
                                presentation.orientation === 'LANDSCAPE' ?
                                  (region.properties.fontSize * (((1152 / presentation.width) + (648 / presentation.height)) / 2)) * 1.8
                                : (region.properties.fontSize * (((405 / presentation.width) + (720 / presentation.height)) / 2)) * 1.8
                            : '60',
                        fontStyle: region.properties ? region.properties.fontStyle.italic === true ? 'italic' : 'normal' : 'normal',
                        fontWeight: region.properties ? region.properties.fontStyle.bold === true ? 'bold' : 'normal' : 'normal',
                        globalCompositeOperation: 'source-over',
                        id: region.id,
                        width: presentation.orientation === 'LANDSCAPE' ? region.width / (presentation.width / 1152) * 3.2 : region.width * 2 / (presentation.width / 405) * 1.2,
                        height: presentation.orientation === 'LANDSCAPE' ? region.height / (presentation.height / 648) : region.height * 2 / (presentation.height / 720),
                        left: presentation.orientation === 'LANDSCAPE' ? region.x * 2 / (presentation.width / 1152) - 576 : region.x * 2 / (presentation.width / 405) - 202.5,
                        top: presentation.orientation === 'LANDSCAPE' ? region.y * 2 / (presentation.height / 648) - 324 : region.y * 2 / (presentation.height / 720) - 360,
                        lineHeight: 1.16,
                        linethrough: region.properties ? region.properties.fontStyle.strikethrough === true ? true : false : false,
                        minWidth: 20,
                        opacity: 1,
                        originX: 'left',
                        originY: 'top',
                        overline: false,
                        paintFirst: 'fill',
                        scaleX: 1,
                        scaleY: 1,
                        shadow: null,
                        skewX: 0,
                        skewY: 0,
                        splitByGrapheme: false,
                        stroke: null,
                        strokeDashArray: null,
                        strokeDashOffset: 0,
                        strokeLineCap: 'butt',
                        strokeLineJoin: 'miter',
                        strokeMiterLimit: 4,
                        strokeWidth: 1,
                        styles: {},
                        text: region.properties ? region.properties.text : 'New Text',
                        textAlign: 'left',
                        textBackgroundColor: '',
                        transformMatrix: null,
                        type: 'textbox',
                        underline: region.properties ? region.properties.fontStyle.underline === true ? true : false : false,
                        version: '3.6.6',
                        visible: true,
                        zOrder: region.zOrder
                    });
                } else if (region.type === 'FRAME') {
                    tmpRegions = tmpRegions.concat({
                        angle: region.rotate,
                        backgroundColor: '',
                        clipTo: null,
                        fill: region.properties ? region.properties.fillColor : '#7f8590',
                        fillRule: 'nonzero',
                        flipX: false,
                        flipY: false,
                        globalCompositeOperation: 'source-over',
                        width: presentation.orientation === 'LANDSCAPE' ? (region.width) * 2 / (presentation.width / 1152) : (region.width - 32) * 2 / (presentation.width / 405),
                        height: presentation.orientation === 'LANDSCAPE' ? (region.height) * 2 / (presentation.height / 648) : (region.height - 32) * 2 / (presentation.height / 720),
                        scaleX: 1,
                        scaleY: 1,
                        left: presentation.orientation === 'LANDSCAPE' ? region.x * 2 / (presentation.width / 1152) - 576 : region.x * 2 / (presentation.width / 405) - 202.5,
                        top: presentation.orientation === 'LANDSCAPE' ? region.y * 2 / (presentation.height / 648) - 324 : region.y * 2 / (presentation.height / 720) - 360,
                        id: region.id,
                        mimeType: 'FRAME',
                        name: region.properties ? region.properties.name : '',
                        opacity: 1,
                        originX: 'left',
                        originY: 'top',
                        paintFirst: 'fill',
                        path: [],
                        shadow: null,
                        skewX: 0,
                        skewY: 0,
                        data: region.properties ? region.properties.data : '',
                        src: region.properties && region.properties.id ? `${config.ASSET.AST}/${region.properties.id}/data?access_token=${store.getState().appAuth.token}` : '',
                        stroke: region.properties ? region.properties.lineColor : '#000000',
                        strokeDashArray: region.properties ? region.properties.linePattern === 'SOLID' ? [0, 0] : region.properties.linePattern === 'DOTTED' ? [5, 5]
                                        : region.properties.linePattern === 'DASHED' ? [10, 5] : [0, 0] : [0, 0],
                        strokeDashOffset: 0,
                        strokeLineCap: 'butt',
                        strokeLineJoin: 'miter',
                        strokeMiterLimit: 4,
                        strokeWidth: region.properties ? region.properties.lineDepth : 10,
                        transformMatrix: null,
                        type: 'path',
                        version: '3.6.6',
                        visible: true,
                        oriWidth: 480,
                        oriHeight: 480
                    });
                }
                });
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
                        isLocal: true,
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
                        id: presentation.id,
                        type: 'presentation'
                    },
                    layoutinfo: tmpRegions,
                    timestamp: moment().format('LLL'),
                    _id: presentation.id
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
