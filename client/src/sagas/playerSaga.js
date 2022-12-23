import { get } from 'lodash';
import {
    abilityTriggerRequestAction,
    COSTS,
    PARTS,
    ROTATION_INCREMENT,
    selectShip,
    shipCreated,
    SHIP_SIDES,
    SIDE_TO_ROTATION_MAP,
    startTurn,
    sync,
    weaponFiredAction,
} from 'pium-pium-engine';
import { put, select, takeLatest, take } from 'redux-saga/effects';
import {
    PLAYER_MODE,
    rangeCleanupRequested,
    rangeRenderRequested,
    requestTargetSelectionForEffectAction,
    selectPlayerId,
    selectSelectedShip,
    setPlayerMode,
    setSelectedShip,
    targetSelectedAction,
    weaponRenderRequested,
} from '../reducers/playerReducer';

function* onShipCreated({ payload }) {
    const selectedShip = yield select(selectSelectedShip);
    if (!selectedShip) {
        let shipId = payload?.ship?.id;
        if (!shipId) {
            const playerId = yield select(selectPlayerId);
            const playerShips = Object.values(payload.ships).filter(
                (ship) => ship.playerId === playerId
            );
            if (playerShips.length === 0) return;
            [{ id: shipId }] = playerShips.sort();
        }
        yield put(setSelectedShip({ shipId }));
    }
}

function* handleTargetSelectionForEffect({
    payload: { subsystem, shipId, abilityIndex, effectIndex },
}) {
    const ship = yield select(selectShip, shipId);
    const subsystemType = get(ship, `${subsystem}.type`);
    const subsystemAngle =
        SIDE_TO_ROTATION_MAP[
            Object.values(SHIP_SIDES).find((side) => subsystem.includes(side))
        ];
    const costs = PARTS[subsystemType].abilities[abilityIndex].costs;
    const angle =
        costs.find((cost) => cost.type === COSTS.ANGLE).value *
        ROTATION_INCREMENT;
    const range = costs.find((cost) => cost.type === COSTS.RANGE).value * 5;
    yield put(setPlayerMode(PLAYER_MODE.TARGETING));
    yield put(
        rangeRenderRequested({
            shipId,
            angle,
            range,
            orientation: subsystemAngle,
        })
    );
    const { payload: targetId } = yield take(targetSelectedAction);
    yield put(rangeCleanupRequested({ shipId }));
    yield put(
        abilityTriggerRequestAction({
            subsystem,
            shipId: ship.id,
            abilityIndex,
            effectIndex,
            target: targetId,
        })
    );
}

function* onTurnStarted({ payload }) {
    const playerId = yield select(selectPlayerId);
    if (playerId === payload.playerId) {
        yield put(setPlayerMode(PLAYER_MODE.ACTIVE));
    } else {
        yield put(setPlayerMode(PLAYER_MODE.INACTIVE));
    }
}

function* onWeaponFired({ payload }) {
    const { type, source, target, damage } = payload;
    yield put(
        weaponRenderRequested({
            type,
            source,
            target,
            damage,
        })
    );
}

export function* playerSaga() {
    yield takeLatest([shipCreated, sync], onShipCreated);
    yield takeLatest(
        requestTargetSelectionForEffectAction,
        handleTargetSelectionForEffect
    );
    yield takeLatest(startTurn, onTurnStarted);
    yield takeLatest(weaponFiredAction, onWeaponFired);
}
