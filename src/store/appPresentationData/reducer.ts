import { combineReducers } from 'redux';

import { PresentationDataType, PresentationDataOneType } from './models';
import { ActionType } from 'typesafe-actions';
import * as PresentationDataAction from './actions';
import { initPresentationData, initPresentationDataOne } from './defaults';
import { CONFIG_PRESENTATION_DATA, CONFIG_PRESENTATION_DATAONE } from './constants';

export type ConfigAction = ActionType<typeof PresentationDataAction>;
export type ConfigState = {
    readonly presentationData: PresentationDataType;
    readonly presentationDataOne: PresentationDataOneType;
};

export default combineReducers<ConfigState, ConfigAction>({
    presentationData: (state = initPresentationData, action) => {
        switch (action.type) {
            case CONFIG_PRESENTATION_DATA:
                return {
                    data: action.payload
                };
            default:
                return state;
        }
    },

    presentationDataOne: (state = initPresentationDataOne, action) => {
        switch (action.type) {
            case CONFIG_PRESENTATION_DATAONE:
                return {
                    dataOne: action.payload
                };

            default:
                return state;
        }
    },
});