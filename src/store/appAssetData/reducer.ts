import { combineReducers } from 'redux';

import { AssetDataType, AssetDataOneType } from './models';
import { ActionType } from 'typesafe-actions';
import * as AssetDataAction from './actions';
import { initAssetData, initAssetDataOne } from './defaults';
import { CONFIG_ASSET_DATA, CONFIG_ASSET_DATAONE } from './constants';

export type ConfigAction = ActionType<typeof AssetDataAction>;
export type ConfigState = {
    readonly assetData: AssetDataType;
    readonly assetDataOne: AssetDataOneType;
};

export default combineReducers<ConfigState, ConfigAction>({
    assetData: (state = initAssetData, action) => {
        switch (action.type) {
            case CONFIG_ASSET_DATA:
                return {
                    data: action.payload
                };
            default:
                return state;
        }
    },

    assetDataOne: (state = initAssetDataOne, action) => {
        switch (action.type) {
            case CONFIG_ASSET_DATAONE:
                return {
                    dataOne: action.payload
                };
            default:
                return state;
        }
    }
});