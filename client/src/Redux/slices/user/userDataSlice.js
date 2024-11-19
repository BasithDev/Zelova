import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUser } from '../../../Services/apiServices';
// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk('userData/fetchUserData', async (userId) => {
  const response = await getUser(userId)
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
        state.error = null
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.data = null
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updateUserData } = userDataSlice.actions;
export default userDataSlice.reducer;