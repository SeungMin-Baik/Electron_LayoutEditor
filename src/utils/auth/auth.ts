import config from '@app/config';

/**
 * Sign out.
 */
export function signout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            sessionStorage.removeItem(config.APP.STOR_KEY.AUTH);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}
