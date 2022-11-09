import * as toolkitRaw from '@reduxjs/toolkit/dist/index.js';
const { createSlice, createSelector, createAction } =
    toolkitRaw.default ?? toolkitRaw;

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        players: {},
        currentTurn: null,
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
        createShip: (draft, action) => {
            const id = `${action.payload.playerId}-${
                Object.keys(draft.ships).length
            }`;
            draft.ships[id] = {
                id,
                playerId: action.payload.playerId,
                position: [],
                rotation: 0,
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
        },
    },
});

// Actions

export const { createPlayer, createShip, sync } = gameSlice.actions;
export const syncRequest = createAction('game/syncRequest');

export const actionsByType = Object.values(gameSlice.actions)
    .concat([syncRequest])
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

export const gameReducer = gameSlice.reducer;
