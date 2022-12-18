import { createSlice, createSelector, createAction } from '@reduxjs/toolkit';

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
    visualAids: {
        ranges: {},
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
        rangeRenderRequested: (draft, action) => {
            const { shipId, angle, range, orientation } = action.payload;
            draft.visualAids.ranges[shipId] = {
                show: true,
                angle,
                range,
                orientation,
            };
        },
    },
});

// Actions

export const requestTargetSelectionForEffect = createAction(
    'player/requestTargetSelectionForEffect'
);
export const {
    setPlayerId,
    setSelectedShip,
    setCameraMode,
    rangeRenderRequested,
} = playerSlice.actions;

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
export const selectRangeVisualAid = createSelector(
    [selectPlayer, (state, shipId) => shipId],
    (state, shipId) => state.visualAids.ranges[shipId]
);

export const playerReducer = playerSlice.reducer;
