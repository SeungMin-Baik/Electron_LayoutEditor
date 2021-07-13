import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { History } from 'history';
import { authReducer } from './appAuth';
import { assetReducer } from './appAssetData';
import { presentationReducer } from './appPresentationData';


export default (history: History) => combineReducers({
    router: connectRouter(history),
    appAuth: authReducer,
    appAssetData: assetReducer,
    appPresentation: presentationReducer,
});
