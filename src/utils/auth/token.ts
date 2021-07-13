/**
 * Is auth token valid or not expired?
 * @param token Token.
 * @returns     Is token valid?
 */
export function isTokenValid(token: string): boolean {
    try {
        // Is token exist?
        if (!token) { return false; }

        // Split token.
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        // Decode token payload part.
        let output = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: break;
            case 2: output += '=='; break;
            case 3: output += '='; break;
            default: throw new Error('Illegal base64url string');
        }
        const decoded = JSON.parse(decodeURIComponent(window.atob(output)));

        // Check is expired.
        if (!decoded.hasOwnProperty('exp')) {
            throw new Error('No expired time');
        }
        const date = new Date(0).setUTCSeconds(decoded.exp);
        return date !== null ? date.valueOf() > (new Date().valueOf()) : true;
    } catch (err) {
        return false;
    }
}
