import { takeLatest, select, call } from 'redux-saga/effects';
import { send } from '../../handlers/gameWS.js';
import { syncRequest, selectGame, sync } from '../lib/reducers/gameSlice.js';

function* syncPlayer({ payload: { playerId } }) {
    const gameState = yield select(selectGame);
    yield call(send, playerId, sync(gameState));
}

export default function* gameSaga() {
    yield takeLatest(syncRequest.type, syncPlayer);
}
