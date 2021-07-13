import * as path from 'path';
import * as fs from 'fs';
import config from '../../../config/electron-config';
import * as sharp from 'sharp';
import * as ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from 'ffmpeg-static';
import { path as ffprobePath } from 'ffprobe-static';

// export default function (filePath: string, metadata: FileMetadata) {
//     /** Thumbnail path on local storage. */
//     let thumbPath: string;

//     return new Promise<FileMetadata>(async (resolve, reject) => {
//         // Determine function to generate thumbnail, according to media type.
//         const thumbnailFunc = (() => {
//             switch (metadata.type) {
//                 case 'image':  return imageThumbnail;
//                 case 'video':  return videoThumbnail;
//                 default:       return null;
//             }
//         })();

//         // If thumbnail generate function not determined, skip gen.
//         if (!thumbnailFunc) {
//             resolve(metadata);
//             return;
//         }

//         try {
//             // Generate function and get saved path.
//             thumbPath = await thumbnailFunc.apply(null, arguments);

//             // Upload data to cloud storage.
//             await new Promise<void>((_resolve, _reject) => {
//                 fs.createReadStream(thumbPath)
//                     .pipe(
//                         appSvcs.storage.cdnBucket
//                             .file(`userdata/${metadata.storage.ownerId}/asset/${metadata.storage.id}_thumb.png`)
//                             .createWriteStream({
//                                 contentType: 'image/jpeg'
//                             })
//                     )
//                     .on('error', _reject)
//                     .on('finish', _resolve);
//             });

//             // Finish generating thumbnail.
//             resolve(metadata);
//         } catch (err) {
//             reject(err);
//         }
//     })
//     .finally(() => {
//         // Clean up thumbnail after upload to cloud.
//         if (fs.existsSync(thumbPath)) {
//             fs.unlink(thumbPath, err => {
//                 if (err) {
//                     console.log('Fail to remove thumbnail after upload!');
//                 }
//             });
//         }
//     });
// }

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
            .jpeg()
            // Resize height as 240px, keep aspect ratio.
            .resize(null, 240)
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

export interface FileMetadata {
    /** Name of file. */
    name: string;
    /** Extension of file. */
    ext: string;
    /** Size of file. */
    size: number;
    /** Type of file. */
    type: FileType;
    /** MIME type of file. */
    mime: string;
    /** MD5 value. */
    md5: string;
    /** Metadata related with Google storage. */
    storage?: {
        /** ID for Google cloud uploading. */
        id?: string;
        /** Owner ID for Google cloud uploading. */
        ownerId?: string;
    };
    /** Metadata related with media files. */
    media: MediaMetaData;
    filePath?: string;
    outputPath?: string;
}

export type FileType =
    'image' |
    'video' |
    'audio' |
    'other';

export interface MediaMetaData {
    /** Width of media file. */
    width?: number;
    /** Height of media file. */
    height?: number;
    /** Duration of media file.  */
    duration?: number;
    /** Is media file needs to be transcoded. */
    needTranscode?: boolean;
}