import {
    takeLatest,
    select,
    call,
    takeEvery,
    put,
    fork,
    delay,
} from 'redux-saga/effects';
import { send } from '../../handlers/gameWS.js';
import {
    syncRequestAction,
    selectGame,
    sync,
    startGameAction,
    startTurn,
    selectCurrentTimer,
    timerEllapsed,
    selectCurrentTurn,
    selectPlayers,
} from 'pium-pium-engine';
import { serverDispatch } from '../sequencer.js';

function* syncPlayer({ payload: { playerId } }) {
    const gameState = yield select(selectGame);
    yield call(send, playerId, sync(gameState));
}

function* startGame() {
    yield call(serverDispatch, startTurn({ currentTurn: 0 }));
    yield fork(turnSaga);
}

function* turnSaga() {
    while (true) {
        const turnTimer = yield select(selectCurrentTimer);
        if (turnTimer > 0) {
            yield call(serverDispatch, timerEllapsed({ ellapsed: 1 }));
            yield delay(1000);
        } else {
            const currentTurn = yield select(selectCurrentTurn);
            const currentPlayers = yield select(selectPlayers);
            const nextTurn =
                currentTurn > currentPlayers.length - 2 ? 0 : currentTurn + 1;
            yield call(serverDispatch, startTurn({ currentTurn: nextTurn }));
        }
    }
}

export const gameSaga = function* () {
    yield takeEvery(syncRequestAction.type, syncPlayer);
    yield takeLatest(startGameAction.type, startGame);
};
