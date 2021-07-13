import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';

import * as authActions from './actions';
import {
    AUTH_SIGN_IN_REQUEST,
    AUTH_SIGN_IN_SUCCESS,
    AUTH_SIGN_IN_FAIL,
    AUTH_SIGN_OUT
} from './constants';
import {
    AuthTokenState,
    AuthUserDataState,
    AuthStatusState
} from './models';
import {
    initialAuthTokenState,
    initialAuthUserDataState,
    initialAuthStatusState
} from './defaults';


export type AuthActions = ActionType<typeof authActions>;
export type AuthStates = {
    readonly token: AuthTokenState;
    readonly userData: AuthUserDataState;
    readonly status: AuthStatusState;
};

export default combineReducers<AuthStates, AuthActions>({
    token: (state = initialAuthTokenState, action) => {
        switch (action.type) {
            case AUTH_SIGN_IN_SUCCESS:
                return action.payload.token;

            case AUTH_SIGN_IN_REQUEST:
            case AUTH_SIGN_IN_FAIL:
            case AUTH_SIGN_OUT:
                return initialAuthTokenState;

            default:
                return state;
        }
    },

    userData: (state = initialAuthUserDataState, action) => {
        switch (action.type) {
            case AUTH_SIGN_IN_SUCCESS:
                return action.payload.userData;

            case AUTH_SIGN_IN_REQUEST:
            case AUTH_SIGN_IN_FAIL:
            case AUTH_SIGN_OUT:
                return initialAuthUserDataState;

            default:
                return state;
        }
    },

    status: (state = initialAuthStatusState, action) => {
        switch (action.type) {
            case AUTH_SIGN_IN_FAIL:
                return action.payload;

            case AUTH_SIGN_IN_SUCCESS:
            case AUTH_SIGN_IN_REQUEST:
            case AUTH_SIGN_OUT:
                return initialAuthStatusState;

            default:
                return state;
        }
    }
});
