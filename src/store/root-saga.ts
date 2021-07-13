import { all, fork } from 'redux-saga/effects';
import { authSaga } from './appAuth';

export default function* () {
    yield all([
        fork(authSaga)
    ]);
}
