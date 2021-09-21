import * as path from 'path';
import * as fs from 'fs';
import config from '../../../config/electron-config';
import * as sharp from 'sharp';
import * as ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from 'ffmpeg-static';
import { path as ffprobePath } from 'ffprobe-static';

const { dialog } = require('electron');
const errorOptions = {
    type: 'error',
    buttons: ['Yes'],
    title: 'error',
    message: 'Create Thumbnail Error.'
};

// 이미지 썸네일 생성
export function imageThumbnail(event: any, filePath: string, media: any) {
    /** Destination path to save. */
    const DESTINATION_PATH = path.join(
        config.APP.DIR_PATH.THUMBNAIL_PATH,
        media.id ? media.id + '_thumb.png' : media  + '_thumb.png'
    );

    return new Promise<string>((resolve, reject) => {
        sharp(filePath)
            // Convert to jpg for shrink size.
            // .jpeg()

            // .flatten({
            //     background: { r: 0, g: 0, b: 0, alpha: 0}
            //   })

            // Resize height as 240px, keep aspect ratio.
            .resize(null, 240)
            .toFormat('png')
            .png({ quality: 100 })
            .toFile(DESTINATION_PATH)
            .then(() => resolve(DESTINATION_PATH))
            .then(() => console.log('sharp success'))
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch(reject);
    });
}

export function imageBase64Thumbnail(event: any, filePath: string, media: any, thumbnail: string) {
    /** Destination path to save. */
    const DESTINATION_PATH = path.join(
        config.APP.DIR_PATH.THUMBNAIL_PATH,
        media.id ? media.id + '_thumb.png' : media  + '_thumb.png'
    );

    return new Promise<string>((resolve, reject) => {
        const uri = thumbnail.split(';base64,').pop();
        const imgBuffer =  Buffer.from(uri, 'base64');
        sharp(imgBuffer)
            // Convert to jpg for shrink size.
            // .jpeg()

            // Resize height as 240px, keep aspect ratio.
            .resize(null, 240)
            .toFormat('png')
            .png({ quality: 100 })
            .toFile(DESTINATION_PATH)
            .then(() => resolve(DESTINATION_PATH))
            .then(() => console.log('sharp success'))
            .catch(() => dialog.showMessageBox(null, errorOptions))
            .catch(reject);
    });
}


/**
 * Generate video thumbnail.
 * @param filePath  Video file path.
 * @param metadata  Video metadata.
 */
// 동영상 썸네일 생성
export function videoThumbnail(filePath: string, media: any) {
    return new Promise<string>((resolve, reject) => {
        try {
            // Extract thumbnail with FFmpeg.
            // ref: https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#screenshotsoptions-dirname-generate-thumbnails
            ffmpeg(filePath)
                .setFfmpegPath(ffmpegPath)
                .setFfprobePath(ffprobePath)
                .screenshots({
                    timestamps: ['00:00:003'],
                    // Resize height as 240px, keep aspect ratio.
                    size: '?x240',
                    filename: `${media.id}_thumb.png`,
                    folder: config.APP.DIR_PATH.THUMBNAIL_PATH,
                })
                .once('error', reject)
                .once('end', () => resolve(
                    path.join(
                        config.APP.DIR_PATH.THUMBNAIL_PATH,
                        `${media.id}_thumb.png`
                    )
                ));
        } catch (err) {
            dialog.showMessageBox(null, errorOptions);
            reject(err);
        }
    });
}
