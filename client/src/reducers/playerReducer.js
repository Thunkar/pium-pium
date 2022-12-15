import { createSlice, createSelector } from '@reduxjs/toolkit';

export const CAMERA_MODES = {
    FOLLOW: 'FOLLOW',
    MAP: 'MAP',
    FREE: 'FREE',
};

const initialState = {
    playerId: null,
    selectedShip: null,
    camera: {
        mode: CAMERA_MODES.FOLLOW,
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
            draft.camera.mode = action.payload;
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
export const selectCameraMode = createSelector(
    selectPlayer,
    (state) => state.camera.mode
);

export const playerReducer = playerSlice.reducer;
