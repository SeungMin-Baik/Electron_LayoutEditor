import { getElectronDataPath } from '../utils/main/others';

const electronConfig = {
    APP: {
        DIR_PATH: {
            /** Root directory */
            ROOT: getElectronDataPath('app_database'),
            FILE_PATH: getElectronDataPath('app_database/files'),
            ASSET_PATH: getElectronDataPath('app_database/assets'),
            THUMBNAIL_PATH: getElectronDataPath('app_database/thumbnails'),
            TMP_PATH: getElectronDataPath('app_database/tmp'),
            PRESENTATION_PATH: getElectronDataPath('app_database/presentaion'),
            EVENT_PATH: getElectronDataPath('app_database/event'),
            FONT_PATH: getElectronDataPath('app_database/fonts'),
            FONT_CSS_PATH: getElectronDataPath('app_database/fonts/fonts.css'),
        },
        DB_PATH: {
            /** Database file of mirror media. */
            DISPLAYER_MEDIA: getElectronDataPath('app_database/app-asset.db'),
            PRESENTATION_MEDIA: getElectronDataPath('app_database/app-presentation.db'),
        },
        SERVICE: {
            PROXY_SERVER_PORT: 8080,
            UDP_SERVER_PORT: 51234,
            UDP_SERVER_HOST: '255.255.255.255',
            UDP_CLIENT_PORT: 51235
        }
    },
};

export default electronConfig;