import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';

import rootReducer from './root-reducer';
import {
    composeEnhancers,
} from './utils';

const sagaMiddleware = createSagaMiddleware();
export const history = createBrowserHistory();

const store = createStore(
    rootReducer(history),
    composeEnhancers(
        applyMiddleware(
            routerMiddleware(history),
            sagaMiddleware
        )
    )
);


export default store;
