import { createSlice, createSelector } from '@reduxjs/toolkit';

const CAMERA_MODES = {
    FOLLOW: 'FOLLOW',
    MAP: 'MAP',
    TARGET: 'TARGET',
};

const initialState = {
    playerId: null,
    selectedShip: null,
    camera: {
        mode: CAMERA_MODES.FOLLOW,
        target: null,
    },
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
        setCameraMode: (draft, action) => {
            draft.camera.mode = action.payload.mode;
            draft.camera.target = action.payload.target;
        },
    },
});

// Actions

export const { setPlayerId, setSelectedShip, setCameraMode } =
    playerSlice.actions;

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
