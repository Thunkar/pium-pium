import { fork } from 'redux-saga/effects';
import gameMessagesSaga from './gameMessagesSaga';
import { playerSaga } from './playerSaga';

export default function* rootSaga() {
    yield fork(gameMessagesSaga);
    yield fork(playerSaga);
}
