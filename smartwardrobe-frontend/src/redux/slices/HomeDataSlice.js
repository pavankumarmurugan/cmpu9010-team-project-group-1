import { createSlice } from '@reduxjs/toolkit';

const HomeDataSlice = createSlice({
  name: 'HomeData',
  initialState: {
    homeData: [],
    headerSearchValue:"",
    user: null,
    error: null,
  },
  reducers: {
    homeDataSuccess: (state, action) => {
      state.homeData = action.payload.homeData;
      state.user = action.payload;
      state.error = null;
    },
    headerSearchValueSuccess: (state, action) => {
      state.headerSearchValue = action.payload.headerSearchValue;
      state.user = action.payload;
      state.error = null;
    },
  },
});

export const { homeDataSuccess, headerSearchValueSuccess } = HomeDataSlice.actions;

export default HomeDataSlice.reducer;
