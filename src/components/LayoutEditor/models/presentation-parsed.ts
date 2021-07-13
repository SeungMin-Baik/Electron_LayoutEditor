import {
    RawPresentationTextRegionAnimationProperties,
    RawPresentationRule,
    RawPresentationSensors
} from './presentation-raw';

// ==================== Presentation ====================

/** Presentation. */
export interface Presentation {
    _id?: number;
    width: number;
    height: number;
    background: PresentationBackground;
    regions: PresentationRegion[];
    rules: RawPresentationRule[];
    sensors: RawPresentationSensors;
}

/** Presentation background. */
export interface PresentationBackground {
    type: 'COLOR' | 'IMAGE';
    source: string;
}

/** Presentation region. */
export interface PresentationRegion {
    id: number;
    type: PresentationRegionDetailedType;
    zOrder: number;
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number;
    events?: PresentationRegionEvent[];
    property: PresentationRegionProperty;
}

/** Presentation region type. */
export type PresentationRegionType =
    'TEXT' |
    'IMAGE' |
    'VIDEO' |
    'WEBPAGE' |
    'WIDGET' |
    'SHAPE' |
    'SVG' |
    'FREE_DRAW';

/** Presentation region type in classified detail. */
export type PresentationRegionDetailedType =
    'TEXT' |
    'IMAGE_LOCAL' |
    'IMAGE_EXT' |
    'VIDEO_LOCAL' |
    'VIDEO_YOUTUBE' |
    'VIDEO_EXT' |
    'WEBPAGE' |
    'WEBPAGE_GOOGLE_SLIDE' |
    'WIDGET' |
    'SHAPE' |
    'SHAPE_SVG' |
    'SVG_LOCAL' |
    'SVG_EXT' |
    'FREE_DRAW' |
    'UNSPECIFIC';



// ==================== Presentation Region ====================

/** Presentation region property. */
export interface PresentationRegionProperty {
    src?: string;
    srcType?: string;
    srcThumbnail?: string;
    srcStyle?:
        PresentationRegionPropertyStyle |
        PresentationRegionPropertyStyleText |
        PresentationRegionPropertyStyleShape |
        PresentationRegionPropertyStyleVideo;
    srcDependencies?: string[];
}

/** Presentation region style. */
export interface PresentationRegionPropertyStyle {
    bgColor?: string;
}

export interface PresentationRegionPropertyStyleVideo {
    mute: boolean;
    repeat: boolean;
}

/** Presentation region text style. */
export interface PresentationRegionPropertyStyleText {
    align: 'left' | 'center' | 'right';
    animation: {
        in: RawPresentationTextRegionAnimationProperties,
        out: RawPresentationTextRegionAnimationProperties
    };
    fontColor: string;
    fontName: string;
    fontSize: number;
    fontStyle: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
        strikethrough: boolean;
    };
    shadowColor: string;
    strokeColor: string;
    strokeWidth: number;
    textEffect?: {
        speed: number;
        code: string;
        repeat: boolean;
    };
}

/** Presentation region shape style. */
export interface PresentationRegionPropertyStyleShape {
    fillColor: string;
    fillPattern: string;
    lineColor: string;
    linePattern: '' | 'DOTTED' | 'DASHED' | 'SOLID' | 'DOUBLE' | string;
    lineDepth: number;
    bgColor?: string;
    [key: string]: any;
}

/** Event on presentation region. */
export interface PresentationRegionEvent {
    id: number;
    name: string;
    enable: boolean;
    type: string;
    param: string;
    action: string;
}
