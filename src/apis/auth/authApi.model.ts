/** Option parameters of `signin`. */
export type AuthAPISignInParams = {
    username: string;
    password: string;
};

/** Response of `signin`. */
export type AuthAPISignInResponse = {
    avatarUrl: string;
    defLanguage: string;
    displayName: string;
    email: string;
    id: string;
    payLevel: string;
    token: string;
    userRight: string;
    username: string;
};

/** Result of `signin`. */
export type AuthAPISignInResult = {
    token: string;
    userData: {
        name: string;
        email: string;
        userRight: string;
        avatarUrl: string;
        lang: string;
        id: string;
    };
};
