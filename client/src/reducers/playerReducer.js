import { createSlice, createSelector } from '@reduxjs/toolkit';
import { createShip } from 'pium-pium-engine';

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

export const { setPlayerId, setSelectedShip } = playerSlice.actions;

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
