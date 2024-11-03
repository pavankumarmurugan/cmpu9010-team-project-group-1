import { createSlice } from '@reduxjs/toolkit';

const HomeDataSlice = createSlice({
  name: 'HomeData',
  initialState: {
    homeData: [],
    headerSearchValue:"",
    wishListValue:0,
    cartValue:0,
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
    wishListValueSuccess: (state, action) => {
      state.wishListValue = action.payload.wishListValue;
      state.user = action.payload;
      state.error = null;
    },
    addToCartValueSuccess: (state, action) => {
      state.cartValue = action.payload.cartValue;
      state.user = action.payload;
      state.error = null;
    },
  },
});

export const { homeDataSuccess, headerSearchValueSuccess, wishListValueSuccess, addToCartValueSuccess } = HomeDataSlice.actions;

export default HomeDataSlice.reducer;
