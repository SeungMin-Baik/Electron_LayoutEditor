export type PresentationAPIResponse = {
    name: string,
    desc: string,
    lock: boolean,
    accessRight: number,
    orientation: string,
    ratio: string,
    width: number,
    height: number,
    tags: any[],
    status: 'ACTIVATED' | 'DEACTIVATED',
    viewCount: number,
    sPrivate: boolean,
    isSystem: boolean,
    isGridTpl: boolean,
    mobility: boolean,
    _id: string,
    createdDate: Date,
    updatedDate: Date,
    owner: {
        displayName: string,
        _id: string,
        id: string
    },
    id: string
};


export type PresentationAPIResult = {
id: string;
name: string;
desc: string;
owner: {
    displayName: string,
    _id: string,
    id: string,
};
updatedDate: Date;
width: number;
height: number;
lock: boolean;
};
