import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';

import rootReducer from './root-reducer';
import {
    appAuthStateMiddleware,
    composeEnhancers,
    getAppAuthState
} from './utils';

const sagaMiddleware = createSagaMiddleware();
export const history = createBrowserHistory();

const store = createStore(
    rootReducer(history),
    getAppAuthState() as any,
    composeEnhancers(
        applyMiddleware(
            routerMiddleware(history),
            appAuthStateMiddleware,
            sagaMiddleware
        )
    )
);


export default store;
