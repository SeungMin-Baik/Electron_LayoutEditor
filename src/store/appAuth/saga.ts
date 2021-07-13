import {
    all,
    call,
    fork,
    put,
    select,
    takeLatest
} from 'redux-saga/effects';
import { push } from 'connected-react-router';

import {
    AUTH_SIGN_IN_REQUEST,
    AUTH_SIGN_IN_SUCCESS,
    AUTH_SIGN_IN_FAIL,
    AUTH_SIGN_OUT
} from './constants';
import { AuthActions } from './reducer';
import { signIn as api_signIn } from '@app/apis/auth';
import {
    isTokenValid as util_isTokenValid,
    signout as util_signOut,
} from '@app/utils/auth';


/** Get current route pathname. */
const getCurrentRoute = (state: any) => state.router.location.pathname;

/** App auth sagas. */
export default function* () {
    yield all([
        fork(watchSignIn),
        fork(watchSignOut)
    ]);
}


/**
 * Sign in and fetch token and user data.
 */
function* signIn(action: AuthActions) {
    // If wrong action, skip it.
    if (action.type !== AUTH_SIGN_IN_REQUEST) { return; }

    try {
        // Request sign-in to API server.
        const authRes = yield call(
            api_signIn,
            action.payload
        );

        // Validate token.
        if (!authRes.token || !util_isTokenValid(authRes.token)) {
            throw new Error('ERR_INVALID_TOKEN');
        }

        // Put success action.
        yield put({
            type: AUTH_SIGN_IN_SUCCESS,
            payload: authRes
        });

        // Redirect to main page.
        yield put(push('/'));
    } catch (err) {
        yield put({
            type: AUTH_SIGN_IN_FAIL,
            payload: err
        });
    }
}

function* watchSignIn() {
    yield takeLatest(AUTH_SIGN_IN_REQUEST, signIn);
}


/**
 * Sign out and clear data.
 */
function* signOut(action: AuthActions) {
    // If wrong action, skip it.
    if (action.type !== AUTH_SIGN_OUT) { return; }

    try {
        // Sign out.
        yield call(util_signOut);

        // Redirect to sign-in page.
        const currentRoute = yield select(getCurrentRoute);
        if (!currentRoute.match(/^\/auth/)) {
            yield put(push('/auth'));
        }
    } catch {
        console.warn('ERR_SIGN_OUT');
    }
}

function* watchSignOut() {
    yield takeLatest(AUTH_SIGN_OUT, signOut);
}
