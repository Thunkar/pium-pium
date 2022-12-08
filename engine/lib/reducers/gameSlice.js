import * as toolkitRaw from '@reduxjs/toolkit/dist/index.js';
const { createSlice, createSelector, createAction } =
    toolkitRaw.default ?? toolkitRaw;
import { get, set } from 'lodash-es';
import { SHIP_SIDES, addSpeeds } from '../utils/ship.js';
import Vec3 from 'vec3';

const PLAYER_TURN_TIME_SECONDS = 10;

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        players: {},
        currentTurn: null,
        currentTimer: 0,
        isRunning: false,
        map: {},
        ships: {},
    },
    reducers: {
        sync: (draft, action) => {
            return action.payload;
        },
        createPlayer: (draft, action) => {
            draft.players[action.payload.playerId] = {
                id: action.payload.playerId,
            };
        },
        removePlayer: (draft, action) => {
            delete draft.players[action.payload.playerId];
            Object.keys(draft.ships).forEach((shipId) => {
                if (draft.ships[shipId].playerId === action.payload.playerId) {
                    delete draft.ships[shipId];
                }
            });
        },
        shipCreated: (draft, action) => {
            draft.ships[action.payload.ship.id] = action.payload.ship;
        },
        startTurn: (draft, action) => {
            Object.keys(draft.ships).forEach((shipId) => {
                if (draft.ships[shipId].playerId === action.payload.playerId) {
                    draft.ships[shipId].reactor.vented = 0;
                    Object.values(SHIP_SIDES).forEach((side) => {
                        draft.ships[shipId][side].forEach((system) => {
                            system.status.power.used = 0;
                        });
                    });
                    const currentPosition = new Vec3(
                        draft.ships[shipId].position
                    );
                    draft.ships[shipId].position = currentPosition
                        .add(addSpeeds(draft.ships[shipId].speed.directional))
                        .toArray();
                    const currentRotation = draft.ships[shipId].rotation;
                    draft.ships[shipId].rotation =
                        currentRotation + draft.ships[shipId].speed.rotational;
                }
            });
            draft.currentTurn = action.payload.currentTurn;
            draft.currentTimer = PLAYER_TURN_TIME_SECONDS;
        },
        timerEllapsed: (draft, action) => {
            draft.currentTimer -= action.payload.ellapsed;
        },
        gameStarted: (draft) => {
            draft.isRunning = true;
        },
        routePower: (draft, action) => {
            const { shipId, value, subsystem } = action.payload;
            draft.ships[shipId].reactor.current -= value;
            const currentPower = get(
                draft.ships[shipId],
                `${subsystem}.status.power.current`
            );
            set(
                draft.ships[shipId],
                `${subsystem}.status.power.current`,
                currentPower + value
            );
        },
        ventPower: (draft, action) => {
            const { shipId, value, subsystem } = action.payload;
            draft.ships[shipId].reactor.current += value;
            draft.ships[shipId].reactor.vented += value;
            const currentPower = get(
                draft.ships[shipId],
                `${subsystem}.status.power.current`
            );
            set(
                draft.ships[shipId],
                `${subsystem}.status.power.current`,
                currentPower - value
            );
        },
        ventHeat: (draft, action) => {
            const { shipId, value, subsystem } = action.payload;
            draft.ships[shipId].reactor.vented += value;
            draft.ships[shipId].reactor.heat -= value;
            const currentPower = get(
                draft.ships[shipId],
                `${subsystem}.status.heat`
            );
            set(
                draft.ships[shipId],
                `${subsystem}.status.heat`,
                currentPower - value
            );
        },
        usePower: (draft, action) => {
            const { shipId, value, subsystem } = action.payload;
            const usedPower = get(
                draft.ships[shipId],
                `${subsystem}.status.power.used`
            );
            set(
                draft.ships[shipId],
                `${subsystem}.status.power.used`,
                usedPower + value
            );
        },
        overheat: (draft, action) => {
            const { shipId, value, subsystem } = action.payload;
            draft.ships[shipId].reactor.heat += value;
            const currentHeat = get(
                draft.ships[shipId],
                `${subsystem}.status.heat`
            );
            set(
                draft.ships[shipId],
                `${subsystem}.status.heat`,
                currentHeat + value
            );
        },
        setShipDirectionalSpeed: (draft, action) => {
            const { shipId, speed } = action.payload;
            draft.ships[shipId].speed.directional = speed;
        },
        setShipPosition: (draft, action) => {
            const { shipId, position } = action.payload;
            draft.ships[shipId].position = position;
        },
        setShipRotationalSpeed: (draft, action) => {
            const { shipId, speed } = action.payload;
            draft.ships[shipId].speed.rotational = speed;
        },
        setShipRotation: (draft, action) => {
            const { shipId, rotation } = action.payload;
            draft.ships[shipId].rotation = rotation;
        },
    },
});

// Actions

export const {
    createPlayer,
    removePlayer,
    shipCreated,
    sync,
    startTurn,
    timerEllapsed,
    gameStarted,
    routePower,
    ventPower,
    ventHeat,
    usePower,
    setShipDirectionalSpeed,
    setShipPosition,
    overheat,
    setShipRotationalSpeed,
    setShipRotation,
} = gameSlice.actions;
export const syncRequestAction = createAction('game/syncRequest');
export const seatPlayerAction = createAction('game/seatPlayer');
export const unseatPlayerAction = createAction('game/unseatPlayer');
export const powerManagementRequestAction = createAction(
    'game/powerManagementRequest'
);
export const abilityTriggerRequestAction = createAction(
    'game/abilityTriggerRequest'
);
export const ventHeatRequestAction = createAction('game/ventHeatRequest');
export const actionsByType = Object.values(gameSlice.actions)
    .concat([
        syncRequestAction,
        seatPlayerAction,
        unseatPlayerAction,
        powerManagementRequestAction,
    ])
    .reduce((previous, current) => {
        return { ...previous, ...{ [current.type]: current } };
    }, {});

// Selectors

export const selectGame = (state) => state.game;

export const selectPlayer = createSelector(
    [selectGame, (state, playerId) => playerId],
    (state, playerId) => state.players[playerId]
);

export const selectPlayerShips = createSelector(
    [selectGame, (state, playerId) => playerId],
    (state, playerId) => {
        const result = {};
        for (const shipId in state.ships) {
            const ship = state.ships[shipId];
            if (ship.playerId === playerId) {
                result[ship.id] = ship;
            }
        }
        return result;
    }
);

export const selectShips = createSelector(selectGame, (state) =>
    Object.values(state.ships).sort()
);

export const selectPlayers = createSelector(selectGame, (state) =>
    Object.values(state.players).sort()
);

export const selectIsRunning = createSelector(
    selectGame,
    (state) => state.isRunning
);

export const selectCurrentTurn = createSelector(
    selectGame,
    (state) => state.currentTurn
);

export const selectCurrentTimer = createSelector(
    selectGame,
    (state) => state.currentTimer
);

export const gameReducer = gameSlice.reducer;
