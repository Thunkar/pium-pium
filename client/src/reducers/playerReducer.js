import { createSlice, createSelector, createAction } from '@reduxjs/toolkit';
import { PARTS, SUBSYSTEMS } from 'pium-pium-engine';

export const CAMERA_MODES = {
    FOLLOW: 'FOLLOW',
    MAP: 'MAP',
    FREE: 'FREE',
};

export const PLAYER_MODE = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SPECTATOR: 'SPECTATOR',
    TARGETING: 'TARGETING',
};

const initialState = {
    playerId: null,
    selectedShip: null,
    camera: {
        mode: CAMERA_MODES.FOLLOW,
    },
    mode: PLAYER_MODE.INACTIVE,
    visualAids: {
        ranges: {},
        damage: {},
        weapons: {
            [SUBSYSTEMS.LASER]: {
                show: false,
                source: null,
                target: null,
            },
        },
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
        setPlayerMode: (draft, action) => {
            draft.mode = action.payload;
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
        rangeCleanupRequested: (draft, action) => {
            const { shipId } = action.payload;
            delete draft.visualAids.ranges[shipId];
        },
        weaponRenderRequested: (draft, action) => {
            const { type, source, target, damage } = action.payload;
            draft.visualAids.weapons[type] = {
                show: true,
                source,
                target,
            };
            draft.visualAids.damage[target] = {
                damage,
            };
        },
        weaponCleanupRequested: (draft, action) => {
            const { type, target } = action.payload;
            draft.visualAids.weapons[type].show = false;
            delete draft.visualAids.damage[target];
        },
    },
});

// Actions
export const targetSelectedAction = createAction('player/targetSelected');
export const requestTargetSelectionForEffectAction = createAction(
    'player/requestTargetSelectionForEffect'
);
export const {
    setPlayerId,
    setSelectedShip,
    setCameraMode,
    setPlayerMode,
    rangeRenderRequested,
    rangeCleanupRequested,
    weaponRenderRequested,
    weaponCleanupRequested,
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
export const selectPlayerMode = createSelector(
    selectPlayer,
    (state) => state.mode
);
export const selectRangeVisualAid = createSelector(
    [selectPlayer, (state, shipId) => shipId],
    (state, shipId) => state.visualAids.ranges[shipId]
);
export const selectLaserVisualAid = createSelector(
    selectPlayer,
    (state) => state.visualAids.weapons.laser
);

export const playerReducer = playerSlice.reducer;
