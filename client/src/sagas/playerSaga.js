import { createShip, sync } from 'pium-pium-engine';
import { put, select, takeLatest } from 'redux-saga/effects';
import {
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
            const playerShips = Object.keys(payload.ships).filter((shipId) =>
                shipId.startsWith(playerId)
            );
            if (playerShips.length === 0) return;
            [{ id: shipId }] = Object.values(playerShips).sort();
        }
        yield put(setSelectedShip({ shipId }));
    }
}

export function* playerSaga() {
    yield takeLatest([createShip, sync], onShipCreated);
}
