import { CONFIG_PRESENTATION_DATA, CONFIG_PRESENTATION_DATAONE } from './constants';
import { PresentationDataType, PresentationDataOneType } from './models';
import { action } from 'typesafe-actions';

 export const configInit = (data: PresentationDataType) => action(
    CONFIG_PRESENTATION_DATA,
    data
);

export const configOneInit = (dataOne: PresentationDataOneType) => action(
    CONFIG_PRESENTATION_DATAONE,
    dataOne
);