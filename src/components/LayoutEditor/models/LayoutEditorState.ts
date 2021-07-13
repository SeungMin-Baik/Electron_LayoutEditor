import { RawPresentation } from './presentation-raw';

export enum LayoutThemeType {
    basic = 'basic',
    material = 'material',
  }
  export interface LayoutUIConfig {
    theme: LayoutThemeType;
  }

/** layout editor state. */
export type LayoutEditorState = {
    prstnData: RawPresentation,
    layoutUIConfig: LayoutUIConfig;
    apiConfig: {
        baseApi: string,
        accessToken: string,
        widgetApi?: string
    }
};

