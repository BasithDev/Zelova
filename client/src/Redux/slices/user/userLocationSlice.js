import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  coordinates: null,
  address: null,
  loading: false,
  error: null,
};

const userLocationSlice = createSlice({
  name: 'userLocation',
  initialState,
  reducers: {
    setCoordinates: (state, action) => {
      state.coordinates = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetLocation: (state) => {
      state.coordinates = null;
      state.address = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setCoordinates,
  setAddress,
  setLoading,
  setError,
  resetLocation,
} = userLocationSlice.actions;

export const selectUserLocation = (state) => state.userLocation;

export default userLocationSlice.reducer;