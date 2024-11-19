import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRestaurant} from '../../../Services/apiServices';

export const fetchRestaurantData = createAsyncThunk('restaurantData/fetchRestaurantData', async (userId) => {
  const response = await getRestaurant(userId)
  return response.data;
});

const restaurantDataSlice = createSlice({
  name: 'restaurantData',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updateRestaurantData(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRestaurantData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null
      })
      .addCase(fetchRestaurantData.rejected, (state, action) => {
        state.data = null
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updateRestaurantData } = restaurantDataSlice.actions;
export default restaurantDataSlice.reducer;