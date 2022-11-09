import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    totalEnergy: 10,
    remainingEnergy: 10,
    energyFlow: 3,
};

const shipSlice = createSlice({
    name: 'ship',
    initialState,
    reducers: {},
});

export const selectTotalEnergy = (state) => state.ship.totalEnergy;
export const selectRemainingEnergy = (state) => state.ship.remainingEnergy;

export const shipReducer = shipSlice.reducer;
