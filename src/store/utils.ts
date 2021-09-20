import { compose } from 'redux';

/**
 * Store enhancer.
 * ref: https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup
 */
export const composeEnhancers =
    (process.env.NODE_ENV === 'development' &&
        window &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;
