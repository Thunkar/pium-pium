import { configureStore } from '@reduxjs/toolkit';
import shipReducer from '../reducers/shipSlice';

export const store = configureStore({
  reducer: {
    ship: shipReducer,
  },
});
