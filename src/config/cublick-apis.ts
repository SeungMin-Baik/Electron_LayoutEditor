const __ = {
    protocol: 'https',
    hostname: 'api-test.cublick.com',
    apiVersion: 1
};
// const __ = {
//     protocol: 'http',
//     hostname: window.location.host,
//     apiVersion: 1
// };
// const __ = {
//     protocol: 'http',
//     hostname: 'localhost:8080',
//     apiVersion: 1
// };
const __API_ROOT = `${__.protocol}://${__.hostname}`;
const __API_END_POINT = `${__API_ROOT}/v${__.apiVersion}`;

const CUBLICK_APIS = {
    _ROOT: __API_ROOT,
    _END_POINT: __API_END_POINT,

    AUTH: {
        /** [POST] Sign-in */
        SIGN_IN: __API_END_POINT + '/login'
    },
    FORGET: {
        FORGET_IN: __API_END_POINT + '/users/request_reset_password'
    },

    REGIST: {
        REGIST_IN: __API_END_POINT + '/users',
        REGIST_RE: __API_END_POINT + '/users/request_verify_email'
    },

    USER: {
        UDT: __API_END_POINT + '/auth/users'
    },

    HOME: {
        CONT: __API_END_POINT + '/auth/statistics/my_total_content',
        DEVS: __API_END_POINT + '/auth/statistics/my_total_device',
        STOR: __API_END_POINT + '/auth/statistics/my_coin_storage'
    },

    DEVICE: {
        SELF: __API_END_POINT + '/auth/devices',
        SEND: __API_END_POINT + '/auth/devices/request'
    },

    PLAYLISTS: {
        PLS: __API_END_POINT + '/auth/playlists'
    },

    SCHEDULE: {
        SCH: __API_END_POINT + '/auth/schedules'
    },

    INSTANTMESSAGE: {
        ISM: __API_END_POINT + '/auth/display_events'
    },

    ASSET: {
        AST: __API_END_POINT + '/auth/assets',
        UPL:  __API_END_POINT + '/auth/assets/upload/policy',
        THUMBNAIL: (id: string, access_token: string) => {
            return __API_END_POINT + '/auth/assets/' + id + '/thumbnail?access_token=' + access_token;
        }
    },

    PRESENTATION: {
        PRE: __API_END_POINT + '/auth/presentations',
        DESIGNDATA: (id: string) => {
            return __API_END_POINT + '/auth/presentations/' + id + '/design';
        },
        ASSETLIST: (id: string) => {
            return __API_END_POINT + '/auth/presentations/' + id + '/assets';
        },
        UPLOAD_THUMBNAIL: (id: string) => {
            return __API_END_POINT + '/auth/presentations/' + id + '/thumbnail';
        },
        THUMBNAIL: (id: string, access_token: string) => {
            return __API_END_POINT + '/auth/presentations/' + id + '/thumbnail?access_token=' + access_token;
        }
    },

    WIDGET: {
        BASE: __API_END_POINT + '/auth/widgets',
        WID: __API_END_POINT + '/auth/widget_instants',
        THUMBNAIL: (widget: string, access_token: string) => {
            return __API_END_POINT + '/auth/widgets/' + widget + '/thumbnail?access_token=' + access_token;
        }
    },

    RULE: {
        BASE: __API_END_POINT + '/auth/rules',
        INST: __API_END_POINT + '/auth/rule_instants'
        // INST: 'https://cef40036.ngrok.io/v1/auth/rule_instants'
    },

};

'https://api-test.cublick.com/v1/login';

export default CUBLICK_APIS;
