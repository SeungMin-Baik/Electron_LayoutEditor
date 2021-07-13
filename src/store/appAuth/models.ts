export type AuthState = Readonly<{
    token: AuthTokenState;
    userData: AuthUserDataState;
    status?: AuthStatusState;
}>;

/** App auth token. */
export type AuthTokenState = Readonly<string>;

/** App auth user data. */
export type AuthUserDataState = Readonly<{
    name: string;
    email: string;
    userRight: string;
    avatarUrl: string;
    lang: string;
    id: string;
}>;

/** App auth status. */
export type AuthStatusState = Readonly<string>;