/** Asset values to replace with marker on URL. */
interface MarkerValues {
    /** Content source ID. */
    id?: string;
    /** Content source name. */
    name?: string;
}


/**
 * Replace URL on marker.
 * @param srcUrl        Content source URL
 * @param markerValues  Asset values to replace with marker on URL
 */
export function replaceUrlMarker(srcUrl: string, markerValues: MarkerValues): string {
    srcUrl = (srcUrl || /* istanbul ignore next */ '').toString();

    return srcUrl
        .replace(/\{id\}/gi, markerValues.id || /* istanbul ignore next */ '')
        .replace(/\{name\}/gi, markerValues.name || /* istanbul ignore next */ '');
}


/**
 * Normalize path and create URL with protocol for content loading.
 * @param srcUrl    Content source URL
 * @param token     Access token for content.
 */
export function sanitizeUrl(srcUrl: string, token: string): string {
    srcUrl = (srcUrl || /* istanbul ignore next */ '').toString();

    /* istanbul ignore next */
    const URL = typeof window === 'undefined' ?
        require('url').URL :
        window.URL;

    // HTTP or HTTPS
    try {
        const url = new URL(srcUrl);
        switch (url.protocol) {
            case 'http:':
            case 'https:':
                // If token exist, append token as search params.
                if (token) {
                    url.searchParams.append('access_token', token);
                }

                return url.href;

            case 'file:':
            default:
                break;
        }
    } catch (_) { }

    // FILE
    try {
        srcUrl = `file://${
            srcUrl
                //
                .replace(/^(file:|FILE:)\/{0,2}/, '')
                //
                .replace(/(\/|\\)/gi, '/')
        }`;

        return new URL(srcUrl).href;
    } catch (_) {
        /* istanbul ignore next */
        return srcUrl;
    }
}