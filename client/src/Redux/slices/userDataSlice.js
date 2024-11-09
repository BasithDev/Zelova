import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk('userData/fetchUserData', async (userId) => {
  const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
  return response.data;
});

const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    updateUserData(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updateUserData } = userDataSlice.actions;
export default userDataSlice.reducer;