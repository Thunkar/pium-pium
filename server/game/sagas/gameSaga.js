import {
    select,
    call,
    takeEvery,
    fork,
    delay,
    actionChannel,
    take,
    spawn,
    put,
    all,
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
    Subsystems,
    powerManagementRequestAction,
    ventPower,
    routePower,
    abilityTriggerRequestAction,
    Costs,
    usePower,
    Effects,
} from 'pium-pium-engine';
import { get } from 'lodash-es';
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

const defaultStatus = {
    power: {
        current: 0,
        used: 0,
    },
    heat: 0,
};

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
        speed: {
            direction: 0,
            magnitude: 0,
            rotational: 0,
        },
        position: [
            initialPositions[totalShipNumber].x,
            2,
            initialPositions[totalShipNumber].y,
        ],
        rotation: initialRotations[totalShipNumber],
        reactor: {
            total: 10,
            current: 10,
            maxVent: 3,
            vented: 0,
        },
        deflectors: {
            power: 0,
            position: 0,
            width: 0,
        },
        aft: [
            {
                type: Subsystems.THRUSTERS,
                name: 'Main thrusters',
                status: defaultStatus,
            },
            {
                type: Subsystems.MANEUVERING_THRUSTERS,
                name: 'Maneuvering thrusters',
                status: defaultStatus,
            },
        ],
        port: [
            {
                type: Subsystems.MISSILE_RACK,
                name: 'Port missile rack',
                status: defaultStatus,
            },
        ],
        starboard: [],
        forward: [
            {
                type: Subsystems.THRUSTERS,
                name: 'Retro thrusters',
                status: defaultStatus,
            },
        ],
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
            yield call(
                serverDispatch,
                startTurn({
                    currentTurn: nextTurn,
                    playerId: currentPlayers[nextTurn].id,
                })
            );
        }
    }
}

function* seatingSaga() {
    const seatChannel = yield actionChannel(seatPlayerAction);
    while (true) {
        const action = yield take(seatChannel);
        yield call(seatPlayer, action);
    }
}

function illegalActionHandler() {
    console.error("Hey! That's illegal");
}

function* managePower({ payload: { playerId, shipId, subsystem, value } }) {
    const ship = (yield select(selectPlayerShips, playerId))[shipId];
    const isVenting = value < 0;
    const currentPower = get(ship, `${subsystem}.status.power.current`);
    const usedPower = get(ship, `${subsystem}.status.power.used`);
    if (
        isVenting &&
        currentPower - usedPower > 0 &&
        ship.reactor.vented < ship.reactor.maxVent &&
        ship.reactor.current < ship.reactor.total
    ) {
        yield call(
            serverDispatch,
            ventPower({ shipId, subsystem, value: -value })
        );
    } else if (!isVenting && ship.reactor.current > 0) {
        yield call(serverDispatch, routePower({ shipId, subsystem, value }));
    } else {
        yield call(illegalActionHandler);
    }
}

function evaluateCosts(ship, subsystem, costs, target) {
    const sideEffects = [];
    const systemStatus = get(ship, `${subsystem}`);
    const areCostsMet = costs.every((cost) => {
        switch (cost.type) {
            case Costs.ENERGY: {
                sideEffects.push(
                    usePower({ shipId: ship.id, subsystem, value: cost.value })
                );
                return systemStatus.power.current <= cost.value;
            }
            default: {
                return true;
            }
        }
    });
    return { areCostsMet, sideEffects };
}

function applyEffects(ship, subsystem, effects, effectIndex, target) {
    const toApply = effectIndex ? [effects.or[effectIndex]] : effects.or;
    const sideEffects = [];
    toApply.forEach((effect) => {
        switch (effect.type) {
            case Effects.ACCELERATE: {
                effects.push();
            }
        }
    });
    return sideEffects;
}

function* triggerAbility({
    payload: { playerId, shipId, subsystem, ability, target, effectIndex },
}) {
    const ship = (yield select(selectPlayerShips, playerId))[shipId];
    const { areCostsMet, sideEffects } = yield call(
        evaluateCosts,
        ship,
        subsystem,
        ability.costs,
        target
    );
    if (!areCostsMet) {
        yield call(illegalActionHandler);
        return;
    }
    yield all(sideEffects.map((action) => put(action)));
    const effects = yield call(
        applyEffects,
        ship,
        subsystem,
        ability.effects,
        effectIndex,
        target
    );
    yield all(effects.map((action) => put(action)));
}

export const gameSaga = function* () {
    yield takeEvery(unseatPlayerAction, unseatPlayer);
    yield takeEvery(syncRequestAction, syncPlayer);
    yield takeEvery(powerManagementRequestAction, managePower);
    yield takeEvery(abilityTriggerRequestAction, triggerAbility);
    yield fork(seatingSaga);
};
