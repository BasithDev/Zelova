import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    hasCompletedOrder: false,
  },
  reducers: {
    completeOrder(state) {
      state.hasCompletedOrder = true;
    },
    resetOrder(state) {
      state.hasCompletedOrder = false;
    },
  },
});

export const { completeOrder, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
