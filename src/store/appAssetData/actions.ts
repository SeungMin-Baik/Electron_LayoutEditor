import { CONFIG_ASSET_DATA, CONFIG_ASSET_DATAONE } from './constants';
import { AssetDataType, AssetDataOneType } from './models';
import { action } from 'typesafe-actions';

 export const configInit = (data: AssetDataType) => action(
    CONFIG_ASSET_DATA,
    data
);

export const configOneInit = (dataOne: AssetDataOneType) => action(
    CONFIG_ASSET_DATAONE,
    dataOne
);