import {
    select,
    call,
    takeEvery,
    fork,
    delay,
    actionChannel,
    take,
    spawn,
} from 'redux-saga/effects';
import { send, serverDispatch } from '../../handlers/gameWS.js';
import {
    syncRequestAction,
    selectGame,
    sync,
    startTurn,
    selectCurrentTimer,
    timerEllapsed,
    selectCurrentTurn,
    selectPlayers,
    createPlayer,
    selectPlayer,
    selectShips,
    selectPlayerShips,
    createShip,
    selectIsRunning,
    removePlayer,
    seatPlayerAction,
    unseatPlayerAction,
    gameStarted,
} from 'pium-pium-engine';
import {
    uniqueNamesGenerator,
    adjectives,
    animals,
} from 'unique-names-generator';

const initialPositions = [
    { x: 0, y: -50 },
    { x: -50, y: 0 },
    { x: 0, y: 50 },
    { x: 50, y: 0 },
];
const initialRotations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

function* shipFactory(playerId) {
    const ships = yield select(selectShips);
    const totalShipNumber = Object.keys(ships).length;
    const playerShipNumber = Object.keys(ships).filter((shipId) =>
        shipId.startsWith(playerId)
    ).length;
    const id = `${playerId}-${playerShipNumber}`;
    return {
        id,
        name: `The ${uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            separator: ' ',
            style: 'capital',
        })}`,
        playerId: playerId,
        position: [
            initialPositions[totalShipNumber].x,
            2,
            initialPositions[totalShipNumber].y,
        ],
        rotation: initialRotations[totalShipNumber],
        reactor: {
            total: 10,
            remaining: 10,
        },
        deflectors: {
            power: 0,
            position: 0,
            width: 0,
        },
        thrusters: {
            front: {
                power: 0,
            },
            retro: {
                power: 0,
            },
        },
    };
}

function* seatPlayer({ payload: { playerId } }) {
    const player = yield select(selectPlayer, playerId);
    if (!player) {
        yield call(serverDispatch, createPlayer({ playerId }));
    }
    const playerShips = yield select(selectPlayerShips, playerId);
    if (Object.keys(playerShips).length === 0) {
        const ship = yield call(shipFactory, playerId);
        yield call(serverDispatch, createShip({ ship }));
    }
    const players = yield select(selectPlayers);
    const isGameRunning = yield select(selectIsRunning);
    if (players.length > 1 && !isGameRunning) {
        yield call(startGame);
    }
}

function* unseatPlayer({ payload: { playerId } }) {
    yield call(serverDispatch, removePlayer({ playerId }));
}

function* syncPlayer({ payload: { playerId } }) {
    const gameState = yield select(selectGame);
    yield call(send, playerId, sync(gameState));
}

function* startGame() {
    yield call(serverDispatch, gameStarted());
    yield call(serverDispatch, startTurn({ currentTurn: 0 }));
    yield spawn(turnSaga);
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

function* seatingSaga() {
    const seatChannel = yield actionChannel(seatPlayerAction.type);
    while (true) {
        const action = yield take(seatChannel);
        yield call(seatPlayer, action);
    }
}

export const gameSaga = function* () {
    yield takeEvery(unseatPlayerAction.type, unseatPlayer);
    yield takeEvery(syncRequestAction.type, syncPlayer);
    yield fork(seatingSaga);
};
