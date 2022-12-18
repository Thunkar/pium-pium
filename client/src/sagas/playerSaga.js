import { get } from 'lodash';
import {
    COSTS,
    PARTS,
    ROTATION_INCREMENT,
    selectShip,
    selectShips,
    shipCreated,
    SHIP_SIDES,
    SIDE_TO_ROTATION_MAP,
    sync,
} from 'pium-pium-engine';
import { put, select, takeLatest } from 'redux-saga/effects';
import {
    rangeRenderRequested,
    requestTargetSelectionForEffect,
    selectPlayerId,
    selectSelectedShip,
    setSelectedShip,
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
    yield put(
        rangeRenderRequested({
            shipId,
            angle,
            range,
            orientation: subsystemAngle,
        })
    );
}

export function* playerSaga() {
    yield takeLatest([shipCreated, sync], onShipCreated);
    yield takeLatest(
        requestTargetSelectionForEffect,
        handleTargetSelectionForEffect
    );
}
