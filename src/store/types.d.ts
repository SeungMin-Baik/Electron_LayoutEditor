import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';
import { AuthActions } from './appAuth';

declare module 'Types' {
    export type RootStates = StateType<ReturnType<typeof rootReducer>>;
    export type RootActions =
        AuthActions;
}
