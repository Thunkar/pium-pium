import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
    playerId: null,
    selectedShip: null,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setPlayerId: (draft, action) => {
            draft.playerId = action.payload.playerId;
        },
        setSelectedShip: (draft, action) => {
            draft.selectedShip = action.payload.shipId;
        },
    },
});

// Actions

export const { setPlayerId, setSelectedShip } = playerSlice.actions;

// Selectors

export const selectPlayer = (state) => state.player;
export const selectPlayerId = createSelector(
    selectPlayer,
    (state) => state.playerId
);
export const selectSelectedShip = createSelector(
    selectPlayer,
    (state) => state.selectedShip
);

export const playerReducer = playerSlice.reducer;
