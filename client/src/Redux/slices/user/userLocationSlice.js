import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: null,
  coordinates: { lat: null, lng: null },
  status: 'idle',
  error: null,
};

const userLocationSlice = createSlice({
  name: 'userLocation',
  initialState,
  reducers: {
    setAddress(state, action) {
      state.address = action.payload;
    },
    setCoordinates(state, action) {
      state.coordinates = action.payload;
    },
    setLoading(state) {
      state.status = 'loading';
    },
    setSuccess(state) {
      state.status = 'idle';
      state.error = null;
    },
    setError(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    clearLocation(state) {
      state.address = null;
      state.coordinates = { lat: null, lng: null };
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const {
  setAddress,
  setCoordinates,
  setLoading,
  setSuccess,
  setError,
  clearLocation,
} = userLocationSlice.actions;

export const selectUserLocation = (state) => state.userLocation;

export default userLocationSlice.reducer;