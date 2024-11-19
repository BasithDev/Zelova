import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getAdmin} from '../../../Services/apiServices'
// Async thunk to fetch user data
export const fetchAdminData = createAsyncThunk('adminData/fetchAdminData', async (adminId) => {
  const response = await getAdmin(adminId)
  return response.data;
});

const adminDataSlice = createSlice({
  name: 'adminData',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    updateAdminData(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updateAdminData } = adminDataSlice.actions;
export default adminDataSlice.reducer;