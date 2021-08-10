import * as fs from 'fs';

import config from '../../../config/electron-config';

/**
 * Initialize media files directories.
 */
export function initAppDir() {
    // If root directory path not exist, create it.
    if (!fs.existsSync(config.APP.DIR_PATH.ROOT)) {
        fs.mkdirSync(config.APP.DIR_PATH.ROOT);
    }

    // If files directory path not exist, create it.
    if (!fs.existsSync(config.APP.DIR_PATH.FILE_PATH)) {
        fs.mkdirSync(config.APP.DIR_PATH.FILE_PATH);
    }

    // If files directory path not exist, create it.
    if (!fs.existsSync(config.APP.DIR_PATH.ASSET_PATH)) {
        fs.mkdirSync(config.APP.DIR_PATH.ASSET_PATH);
    }

    if (!fs.existsSync(config.APP.DIR_PATH.THUMBNAIL_PATH)) {
        fs.mkdirSync(config.APP.DIR_PATH.THUMBNAIL_PATH);
    }

    // If files directory path not exist, create it.
    if (!fs.existsSync(config.APP.DIR_PATH.TMP_PATH)) {
        fs.mkdirSync(config.APP.DIR_PATH.TMP_PATH);
    }

    // If files directory path not exist, create it.
    if (!fs.existsSync(config.APP.DIR_PATH.PRESENTATION_PATH)) {
        fs.mkdirSync(config.APP.DIR_PATH.PRESENTATION_PATH);
    }

    // If font directory path not exist, create it.
    if (!fs.existsSync(config.APP.DIR_PATH.FONT_CSS_PATH)) {
        fs.open(config.APP.DIR_PATH.FONT_CSS_PATH, 'a', function (err) {
            if (err) throw err;
        });
    }
}