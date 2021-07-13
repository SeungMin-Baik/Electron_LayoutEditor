import {
    AuthState,
    AuthTokenState,
    AuthUserDataState,
    AuthStatusState
} from './models';


/** Initial state of auth token. */
export const initialAuthTokenState: AuthTokenState = null;

/** Initial state of auth user data. */
export const initialAuthUserDataState: AuthUserDataState = {
    name: null,
    email: null,
    userRight: null,
    avatarUrl: null,
    lang: null,
    id: null
};

/** Initial state of auth status. */
export const initialAuthStatusState: AuthStatusState = null;

/** Initial state of auth. */
export const initialAuthState: AuthState = {
    token: initialAuthTokenState,
    userData: initialAuthUserDataState,
    status: initialAuthStatusState
};
