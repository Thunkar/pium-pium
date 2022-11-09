import { takeLatest, select, call } from 'redux-saga/effects';
import { send } from '../../handlers/gameWS.js';
import { syncRequest, selectGame, sync } from 'pium-pium-engine';

function* syncPlayer({ payload: { playerId } }) {
    const gameState = yield select(selectGame);
    yield call(send, playerId, sync(gameState));
}

export const gameSaga = function* () {
    yield takeLatest(syncRequest.type, syncPlayer);
};
