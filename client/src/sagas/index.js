import { fork } from 'redux-saga/effects'
import gameMessagesSaga from './gameMessagesSaga';


export default function* rootSaga() {
    yield fork(gameMessagesSaga);
}