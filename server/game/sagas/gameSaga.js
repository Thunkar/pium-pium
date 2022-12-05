import {
    select,
    call,
    takeEvery,
    fork,
    delay,
    actionChannel,
    take,
    spawn,
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
    Parts,
    SHIP_SIDES,
    SIDE_TO_ROTATION_MAP,
    setShipDirectionalSpeed,
    setShipPosition,
    overheat,
    ventHeat,
    ventHeatRequestAction,
    setShipRotationalSpeed,
    setShipRotation,
    ROTATION_INCREMENT,
    applyThrustVector,
    ALLOWED_AXES,
    applyRotation,
} from 'pium-pium-engine';
import { get } from 'lodash-es';
import {
    uniqueNamesGenerator,
    adjectives,
    animals,
} from 'unique-names-generator';
import Vec3 from 'vec3';

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
            directional: ALLOWED_AXES.slice(0, 4).reduce(
                (previous, current) => ({
                    ...previous,
                    [current.toFixed(5)]: 0,
                }),
                {}
            ),
            rotational: 0,
        },
        position: new Vec3(
            initialPositions[totalShipNumber].x,
            2,
            initialPositions[totalShipNumber].y
        ).toArray(),
        rotation: initialRotations[totalShipNumber],
        hull: 20,
        reactor: {
            total: 10,
            current: 10,
            maxVent: 3,
            vented: 0,
            heat: 0,
        },
        deflectors: {
            status: defaultStatus,
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
            {
                type: Subsystems.BALLISTIC_RACK,
                name: 'Aft ballistics',
                status: defaultStatus,
            },
        ],
        port: [
            {
                type: Subsystems.PLASMA_CANNONS,
                name: 'Port plasma cannons',
                status: defaultStatus,
            },
            {
                type: Subsystems.MISSILE_RACK,
                name: 'Port missiles',
                status: defaultStatus,
            },
            {
                type: Subsystems.BALLISTIC_RACK,
                name: 'Port ballistics',
                status: defaultStatus,
            },
        ],
        starboard: [
            {
                type: Subsystems.PLASMA_CANNONS,
                name: 'Starboard plasma cannons',
                status: defaultStatus,
            },
            {
                type: Subsystems.MISSILE_RACK,
                name: 'Starboard missiles',
                status: defaultStatus,
            },
            {
                type: Subsystems.BALLISTIC_RACK,
                name: 'Port ballistics',
                status: defaultStatus,
            },
        ],
        forward: [
            {
                type: Subsystems.THRUSTERS,
                name: 'Retro thrusters',
                status: defaultStatus,
            },
            {
                type: Subsystems.DISRUPTOR,
                name: 'Forward disruptor',
                status: defaultStatus,
            },
            {
                type: Subsystems.LASER,
                name: 'Forward laser',
                status: defaultStatus,
            },
            {
                type: Subsystems.RAILGUN,
                name: 'Railgun',
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
    if (players.length > 0 && !isGameRunning) {
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

function* manageHeat({ payload: { playerId, shipId, subsystem, value } }) {
    const ship = (yield select(selectPlayerShips, playerId))[shipId];
    const currentHeat = get(ship, `${subsystem}.status.heat`);
    if (currentHeat > 0 && ship.reactor.vented < ship.reactor.maxVent) {
        yield call(
            serverDispatch,
            ventHeat({ shipId, subsystem, value: -value })
        );
    } else {
        yield call(illegalActionHandler);
    }
}

function evaluateCosts(ship, subsystem, costs, target) {
    const sideEffects = [];
    const systemStatus = get(ship, `${subsystem}.status`);
    const areCostsMet = costs.every((cost) => {
        switch (cost.type) {
            case Costs.ENERGY: {
                sideEffects.push(
                    usePower({ shipId: ship.id, subsystem, value: cost.value })
                );
                return (
                    systemStatus.power.current >= cost.value &&
                    systemStatus.power.used < systemStatus.power.current
                );
            }
            case Costs.HEAT: {
                sideEffects.push(
                    overheat({ shipId: ship.id, subsystem, value: cost.value })
                );
                return true;
            }
            default: {
                return true;
            }
        }
    });
    return { areCostsMet, sideEffects };
}

function applyEffects(ship, subsystem, effects, effectIndex, target) {
    const toApply =
        effectIndex !== undefined ? [effects.or[effectIndex]] : effects.or;
    const sideEffects = [];
    toApply.forEach((effect) => {
        switch (effect.type) {
            case Effects.ACCELERATE: {
                const thrustAngle =
                    SIDE_TO_ROTATION_MAP[
                        Object.values(SHIP_SIDES).find((side) =>
                            subsystem.includes(side)
                        )
                    ] +
                    ship.rotation +
                    Math.PI;
                const { newSpeed, newPosition } = applyThrustVector(
                    ship.speed.directional,
                    ship.position,
                    thrustAngle,
                    effect.value
                );
                sideEffects.push(
                    setShipDirectionalSpeed({
                        shipId: ship.id,
                        speed: newSpeed,
                    })
                );
                sideEffects.push(
                    setShipPosition({
                        shipId: ship.id,
                        position: newPosition,
                    })
                );
                break;
            }
            case Effects.TURN_LEFT: {
                const angleDelta = effect.value * ROTATION_INCREMENT;
                const { newRotation, newRotationalSpeed } = applyRotation(
                    ship.speed.rotational,
                    ship.rotation,
                    angleDelta
                );
                sideEffects.push(
                    setShipRotationalSpeed({
                        shipId: ship.id,
                        speed: newRotationalSpeed,
                    })
                );
                sideEffects.push(
                    setShipRotation({
                        shipId: ship.id,
                        rotation: newRotation,
                    })
                );
                break;
            }
            case Effects.TURN_LEFT_THEN_STOP: {
                const angleDelta = effect.value * ROTATION_INCREMENT;
                const { newRotation } = applyRotation(
                    ship.speed.rotational,
                    ship.rotation,
                    angleDelta,
                    true
                );
                sideEffects.push(
                    setShipRotation({
                        shipId: ship.id,
                        rotation: newRotation,
                    })
                );
                break;
            }
            case Effects.TURN_RIGHT: {
                const angleDelta = -effect.value * ROTATION_INCREMENT;
                const { newRotation, newRotationalSpeed } = applyRotation(
                    ship.speed.rotational,
                    ship.rotation,
                    angleDelta
                );
                sideEffects.push(
                    setShipRotationalSpeed({
                        shipId: ship.id,
                        speed: newRotationalSpeed,
                    })
                );
                sideEffects.push(
                    setShipRotation({
                        shipId: ship.id,
                        rotation: newRotation,
                    })
                );
                break;
            }
            case Effects.TURN_RIGHT_THEN_STOP: {
                const angleDelta = -effect.value * ROTATION_INCREMENT;
                const { newRotation } = applyRotation(
                    ship.speed.rotational,
                    ship.rotation,
                    angleDelta,
                    true
                );
                sideEffects.push(
                    setShipRotation({
                        shipId: ship.id,
                        rotation: newRotation,
                    })
                );
                break;
            }
        }
    });
    return sideEffects;
}

function* triggerAbility({
    payload: { playerId, shipId, subsystem, abilityIndex, target, effectIndex },
}) {
    const ship = (yield select(selectPlayerShips, playerId))[shipId];
    const systemType = get(ship, `${subsystem}.type`);
    const ability = Parts[systemType].abilities[abilityIndex];
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
    yield all(sideEffects.map((action) => call(serverDispatch, action)));
    const effects = yield call(
        applyEffects,
        ship,
        subsystem,
        ability.effects,
        effectIndex,
        target
    );
    yield all(effects.map((action) => call(serverDispatch, action)));
}

export const gameSaga = function* () {
    yield takeEvery(unseatPlayerAction, unseatPlayer);
    yield takeEvery(syncRequestAction, syncPlayer);
    yield takeEvery(powerManagementRequestAction, managePower);
    yield takeEvery(ventHeatRequestAction, manageHeat);
    yield takeEvery(abilityTriggerRequestAction, triggerAbility);
    yield fork(seatingSaga);
};
