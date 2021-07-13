// ==================== Widget Instant ====================

/** Raw widget instant. */
export interface RawWidgetInstant {
    /** Widget instant ID. */
    id: string;
    /** Widget instant status. */
    status: 'ACTIVATED' | 'DEACTIVATED';
    /** Widget instant name. */
    name: { [lang: string]: string; };
    /** Widget instant updated date. */
    updatedDate: string;
    /** Widget instant created date. */
    createdDate: string;
    /** Owner of widget instant. */
    owner: {
        /** User ID. */
        _id: string;
        /** User ID. */
        id: string;
        /** User display name. */
        displayName: string;
    };
    /** Widget instant data. */
    data: RawWidgetInstantData[];
    /** Widget instant properties. */
    properties: RawWidgetInstantProperty[];
    /** Original base widget ID. */
    widget: string;
    /** Widget instant element tag name. */
    code: string;
    /** Widget instant type */
    type: 'NATIVE' | 'HTML5' | 'WEB_COMPONENT';
    /** Classification of widget instant kinds. */
    app: string;
    /** Usable players list of the widget instant. */
    players: string[];
    /** Patterns of widget instant properties to create UI from widget editor. */
    propertyPatterns: RawWidgetInstantPropertyPattern[];
    /** Patterns of widget instant data to create UI from widget editor. */
    dataPattern: any[];
    /** Assets and dependencies of widget instants. */
    assets: {
        /** Widget instant asset ID. */
        id: string;
        /** Widget instant asset MD5 value. */
        md5: string;
        /** Widget instant asset filename extension. */
        fileType: string;
        /** Widget instant asset file name. */
        name: string;
    }[];
}

/** Raw widget instant property. */
export interface RawWidgetInstantProperty {
    /** Widget instant property name. */
    code: string;
    /** Widget instant property value type. */
    dataType: RawWidgetInstantPropertyDataType;
    /** Widget instant property value. */
    value: string;
    /** Widget instant property ID */
    _id?: string;
}

/** Pattern of raw widget instant property. */
export interface RawWidgetInstantPropertyPattern {
    /** Widget instant property name. */
    code: string;
    /** Default of widget instant property value. */
    defVal: string | number | boolean;
    /** Widget instant property value type. */
    dataType: RawWidgetInstantPropertyDataType;
    /** Minimum of widget instant property value. */
    min: number;
    /** Maximum of widget instant property value. */
    max: number;
    /** Type of dashboard widget instant editor UI control. */
    ctrType: RawWidgetInstantPropertyCtrlType;
    /** Options of widget instant property value */
    options: {
        /** Option key. */
        key: string;
        /** Option value. */
        value: { [lang: string]: string; };
    }[];
    /** Is the widget instant property hidden? */
    isHidden: false;
    /** Widget instant property description. */
    desc: { [lang: string]: string; };
    /** Widget instant property name. */
    name: { [lang: string]: string; };
}

/** Control UI type of raw widget instant property. */
export type RawWidgetInstantPropertyCtrlType =
    'INPUT' |
    'NUMBER' |
    'COLOR' |
    'SWITCH' |
    'SELECT' |
    string;

/** Data type of raw widget instant property. */
export type RawWidgetInstantPropertyDataType =
    'STRING' |
    'INTEGER' |
    'FLOAT' |
    'BOOLEAN' |
    string;

/** Raw widget instant data. */
export interface RawWidgetInstantData {
    /** Data order in array. */
    order: number;
    /** Data. */
    data: {
        /** Widget instant property name. */
        code: string;
        /** Widget instant property value. */
        value: any;
        /** Data name. */
        dataName: string;
        /** Type of widget instant property value. */
        dataType: 'STRING' | 'IMAGE' | 'AUDIO' | 'VIDEO';
        /** Source of widget instant property value. */
        dataSrc: 'SDSS' | 'YOUTUBE' | 'GOOGLE_DRIVE' | 'REMOTE';
    }[];
    /** Item for slider */
    item: any;
}
