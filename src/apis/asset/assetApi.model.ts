export type AssetAPIResponse = {
    name: string,
    value: number,
    tags: any[],
    srcType: string,
    fileType: string,
    status: 'ACTIVATED' | 'DEACTIVATED',
    width: number,
    duration: number,
    height: number,
    md5: string,
    size: number,
    downloadCount: number,
    srcLink: string,
    metaData: string,
    copyright: string,
    hasThumbnail: boolean,
    isPrivate: boolean,
    isSystem: boolean,
    _id: string,
    owner: {
        displayName: string,
        _id: string,
        id: string,
    },
    mimeType: string,
    createdDate: Date,
    updatedDate: Date,
    id: string
};


export type AssetAPIResult = {
id: string;
name: string;
owner: {
    displayName: string,
    _id: string,
    id: string,
};
updatedDate: Date;
width: number;
height: number;
};
