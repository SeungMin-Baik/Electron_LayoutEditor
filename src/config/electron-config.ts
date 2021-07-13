import { getElectronDataPath } from '../utils/main/others';


let ROOT_URL: string;
let ROOT_URL_NOPROTOCOL: string;
let ROOT_SOCKET_URL: string;
const SOCKET_IO_AUTO_KEY: string = 'fhskjfenfnhpploemjase';


if (process.env.NODE_ENV === 'production') {
    ROOT_URL_NOPROTOCOL = 'api-test.cublick.com';
    ROOT_URL = `http://${ROOT_URL_NOPROTOCOL}`;
    ROOT_SOCKET_URL = `https://${ROOT_URL_NOPROTOCOL}`;
} else if (process.env.NODE_ENV === 'development') {
    ROOT_URL_NOPROTOCOL = 'api-test.cublick.com';
    ROOT_URL = `http://${ROOT_URL_NOPROTOCOL}`;
    ROOT_SOCKET_URL = `https://${ROOT_URL_NOPROTOCOL}`;
}

const electronConfig = {
    ROOT_URL,
    ROOT_URL_NOPROTOCOL,
    ROOT_SOCKET_URL,
    SOCKET_IO_AUTO_KEY,
    APP: {
        DIR_PATH: {
            /** Root directory */
            ROOT: getElectronDataPath('app_database'),
            FILE_PATH: getElectronDataPath('app_database/files'),
            ASSET_PATH: getElectronDataPath('app_database/assets'),
            THUMBNAIL_PATH: getElectronDataPath('app_database/thumbnails'),
            TMP_PATH: getElectronDataPath('app_database/tmp'),
            WIDGET_PATH: getElectronDataPath('app_database/widget'),
            PRESENTATION_PATH: getElectronDataPath('app_database/presentaion'),
            PLAYLIST_PATH: getElectronDataPath('app_database/playlist'),
            SCHEDULE_PATH: getElectronDataPath('app_database/schedule'),
            INSTANTMESSAGE_PATH: getElectronDataPath('app_database/instantMessage'),
            EVENT_PATH: getElectronDataPath('app_database/event'),
            FONT_PATH: getElectronDataPath('app_database/fonts'),
            THERMAL_PATH: getElectronDataPath('app_database/thermalImage'),
            FONT_CSS_PATH: getElectronDataPath('app_database/fonts/fonts.css'),
        },
        DB_PATH: {
            /** Database file of mirror media. */
            DISPLAYER_MEDIA: getElectronDataPath('app_database/app-asset.db'),
            PRESENTATION_MEDIA: getElectronDataPath('app_database/app-presentation.db'),
            INSTANTMESSAGE_DATA: getElectronDataPath('app_database/app-instantMessage.db'),
            WIDGET_DATA: getElectronDataPath('app_database/app-widget.db'),
            PLAYLIST_DATA: getElectronDataPath('app_database/app-playlist.db'),
            SCHEDULE_DATA: getElectronDataPath('app_database/app-schedule.db'),
            DEVICE_DATA: getElectronDataPath('app_database/app-device.db'),
            THERMAL_DATA: getElectronDataPath('app_database/app-thermal.db')
        },
        SERVICE: {
            PROXY_SERVER_PORT: 8080,
            UDP_SERVER_PORT: 51234,
            UDP_SERVER_HOST: '255.255.255.255',
            UDP_CLIENT_PORT: 51235
        }
    },

    CUBLICK: {
        APP_UPDATE: {
            /** New app release bucket. */
            RELEASES: 'https://storage.googleapis.com/cdn.cublick.com/public/binaries/'
        },
        API: {

            // ============== Schedule ==============
            /** Get presentation or playlist data in weekly */
            GET_SCHEDULE_INFO: (id: string, accessToken: string) => {
                return `${ROOT_URL}/v1/auth/schedules/${id}?access_token=${accessToken}`;
            },


            // ============== Playlist ==============
            /** Get presentation data in playlist */
            GET_PLAYLIST_INFO: (id: string, accessToken: string) => {
                return `${ROOT_URL}/v1/auth/playlists/${id}?access_token=${accessToken}`;
            },

            /** Get asset data information */
            GET_ASSET_INFO: (id: string, accessToken: string) => {
                return `${ROOT_URL}/v1/auth/assets/${id}?access_token=${accessToken}`;
            },


            // ============== Presentation ==============
            /** Get presentation design information */
            GET_PRESENTATION_DESIGN_INFO: (id: string, accessToken: string) => {
                return `${ROOT_URL}/v1/auth/presentations/${id}/design?access_token=${accessToken}`;
            },

            GET_PRESENTATION_THUMBNAIL: (id: string, accessToken: string) => {
                return `${ROOT_URL}/v1/auth/presentations/${id}/thumbnail?access_token=${accessToken}`;
            },

            // ============== Asset ===============
            GET_ASSET_THUMBNAIL: (id: string, accessToken: string) => {
                return `${ROOT_URL}/v1/auth/assets/${id}/thumbnail?access_token=${accessToken}`;
            },

            // ============== Widget ==============
            GET_WIDGET_THUMBNAIL: (id: string, accessToken: string) => {
                return `${ROOT_URL}/v1/auth/widgets/${id}/thumbnail?access_token=${accessToken}`;
            },


            // ============== Device ==============
            /** POST Device data */
            POST_DEVICE_INFO: () => {
                return `${ROOT_URL}/v1/devices`;
            },
            /** Get Device design information */
            GET_DEVICE_DESIGN_INFO: (id: string, accessToken: string) => {
                return `${ROOT_URL}/v1/auth/devices/${id}/playing_content?access_token=${accessToken}`;
            },
            /** Send snapshot */
            GET_SNAPSHOT_INFO: (id: string, accessToken: string) => {
                return `${ROOT_URL}/v1/auth/devices/${id}/snapshot?access_token=${accessToken}`;
            },


            // ============== Google Storage ==============
            /** Get asset information in googlestore */
            GET_ASSET_GOOGLESTORE_INFO: (id: string, accessToken: string) => {
                return `${ROOT_URL}/v1/auth/assets/urls?ids=${id}&access_token=${accessToken}`;
            }
        }
    }
};

export default electronConfig;