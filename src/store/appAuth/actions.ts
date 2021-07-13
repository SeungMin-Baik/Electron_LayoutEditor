import { action } from 'typesafe-actions';
import {
    AUTH_SIGN_IN_REQUEST,
    AUTH_SIGN_IN_SUCCESS,
    AUTH_SIGN_IN_FAIL,
    AUTH_SIGN_OUT
} from './constants';
import { AuthState } from './models';


/**
 * Sign in and fetch token and user data.
 * @param credentials   User credentials.
 */
export const signIn = (
    credentials: {
        username: string;
        password: string;
    }
) => action(
    AUTH_SIGN_IN_REQUEST,
    credentials
);

export const signInSuccess = (authRes: AuthState) => action(
    AUTH_SIGN_IN_SUCCESS,
    authRes
);

export const signInFail = (err: string) => action(
    AUTH_SIGN_IN_FAIL,
    err
);


/**
 * Sign out and clear data.
 */
export const signOut = () => action(
    AUTH_SIGN_OUT
);
