import { gameSaga } from './gameSaga.js';
import { fork } from 'redux-saga/effects';

export default function* rootSaga() {
    yield fork(gameSaga);
}
