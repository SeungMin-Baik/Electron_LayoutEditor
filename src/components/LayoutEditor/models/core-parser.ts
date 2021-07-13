/** Options of Cublick Parser. */
export type CublickParserOptions = {
    /** URLs of Cublick presentation API. */
    apis?: CublickParserApiOptions;
    /** Token of Cublick presentation API. */
    apiToken?: string;
};

/** API urls or local storage path of Cublick Parser. */
export type CublickParserApiOptions = {
    /**
     * URL or local storage path for presentation assets.
     * default: `https://api.cublick.com/v1/auth/assets/{id}/data`
     */
    asset?: string;
    /**
     * URL or local storage path for presentation asset thumbnails.
     * default: `https://api.cublick.com/v1/auth/assets/{id}/thumbnail`
     */
    assetThumbnail?: string;
};
