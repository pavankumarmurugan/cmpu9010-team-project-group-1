import { createSlice } from '@reduxjs/toolkit';

const HomeDataSlice = createSlice({
  name: 'HomeData',
  initialState: {
    homeData: [],
    user: null,
    error: null,
  },
  reducers: {
    homeDataSuccess: (state, action) => {
      state.homeData = action.payload.homeData;
      state.user = action.payload;
      state.error = null;
    },
  },
});

export const { homeDataSuccess } = HomeDataSlice.actions;

export default HomeDataSlice.reducer;
