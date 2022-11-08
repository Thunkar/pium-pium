import { createSlice } from "@reduxjs/toolkit";

const initialState = {

};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    message: (state, action) => {
      state.data = action.payload;
    }
  },
});

export const { message } = gameSlice.actions;

export default gameSlice.reducer;
