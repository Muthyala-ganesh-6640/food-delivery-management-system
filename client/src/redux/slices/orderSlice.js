import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    activeOrder: null,
    loading: false,
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
    },
    updateActiveOrderStatus: (state, action) => {
      if (state.activeOrder && state.activeOrder._id === action.payload._id) {
        state.activeOrder = action.payload;
      }
    },
  },
});

export const { setOrders, setActiveOrder, updateActiveOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
