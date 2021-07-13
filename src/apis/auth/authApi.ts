import axios from 'axios';
import config from '@app/config';

import { getAuthHeader } from '../helper';

// Types
import {
    AuthAPISignInParams,
    AuthAPISignInResponse,
    AuthAPISignInResult
} from './authApi.model';
import { userInfo } from 'os';


/**
 * Sign-in and get token and user data.
 * @param credentials   User credentials.
 */
export function signIn(
    credentials: AuthAPISignInParams
): Promise<AuthAPISignInResult> {
    // Create api call body.
    const body = new URLSearchParams();
    body.append('username', credentials.username);
    body.append('password', credentials.password);

    return new Promise<AuthAPISignInResult>((resolve, reject) => {
        axios.post<AuthAPISignInResponse>(
            config.EXTERNAL.CUBLICK.AUTH.SIGN_IN,
            body
        )
        .then(res => res.data)
        .then(res => {
            // If token not exist, return error.
            if (!res.token) {
                reject('ERR_INVALID_TOKEN');
                return;
            }

            // Set user data to session storage.
            resolve({
                token: res.token,
                userData: {
                    name: res.displayName,
                    email: res.email,
                    userRight: res.userRight,
                    avatarUrl: `${config.EXTERNAL.CUBLICK._ROOT}${res.avatarUrl}`,
                    lang: res.defLanguage,
                    id: res.id
                }
            });
        })
        .catch(err => {
            if (!err || !err.response) {
                reject('ERR_NETWORK');
                return;
            }

            switch (err.response.status) {
                case 404:
                case 422:
                    reject('ERR_WRONG_CREDENTIALS');
                    return;

                default:
                    reject('ERR_SERVER');
                    return;
            }
        });
    });
}


export function registUser(contentData: any): Promise<any> {
    const body = new URLSearchParams();

    body.append('username', contentData.username);
    body.append('password', contentData.password);
    body.append('email', contentData.email);
    body.append('defLanguage', contentData.defLanguage);

    return new Promise((resolve, reject) => {
        axios.post(config.EXTERNAL.CUBLICK.REGIST.REGIST_IN,
            body,
            {
                headers: '',
            })
            .then (resolve)
            .catch (reject);
    });
}
export function registEmailRequest(contentData: any): Promise<void> {
    const body = new URLSearchParams();

    body.append('username', contentData.username);
    body.append('password', contentData.password);
    body.append('email', contentData.email);

    return new Promise((resolve, reject) => {
        axios.post(config.EXTERNAL.CUBLICK.REGIST.REGIST_RE,
            body,
            {
                headers: '',
            })
            .then (() => resolve)
            .catch (reject);
    });
}
export function passwordResetEmailRequest(contentData: any): Promise<any> {
    const body = new URLSearchParams();
    body.append('email', contentData.email);

    return new Promise((resolve, reject) => {
        axios.post(config.EXTERNAL.CUBLICK.FORGET.FORGET_IN,
            body,
            {
                headers: '',
            })
            .then (resolve)
            .catch (reject);
    });
}

export function changeUserNameRequest(userData: any): Promise<void> {
    const body = new URLSearchParams();
    body.append('displayName', userData.displayName);

    return new Promise((resolve, reject) => {
        axios.put<any>(
            `${config.EXTERNAL.CUBLICK.USER.UDT}/${userData.userId}`,
            body,
            { headers: getAuthHeader() }
        )
        .then(() => resolve())
        .catch(reject);
    });
}

export function changeUserPasswordRequest(userData: any): Promise<void> {
    const body = new URLSearchParams();
    body.append('oldPassword', userData.oldPassword);
    body.append('newPassword', userData.newPassword);

    return new Promise((resolve, reject) => {
        axios.put<any>(
            `${config.EXTERNAL.CUBLICK.USER.UDT}/${userData.userId}/password`,
            body,
            { headers: getAuthHeader() }
        )
        .then(() => resolve())
        .catch(reject);
    });
}
