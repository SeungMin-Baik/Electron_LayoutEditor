import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { History } from 'history';
import { assetReducer } from './appAssetData';
import { presentationReducer } from './appPresentationData';


export default (history: History) => combineReducers({
    router: connectRouter(history),
    appAssetData: assetReducer,
    appPresentation: presentationReducer,
});
