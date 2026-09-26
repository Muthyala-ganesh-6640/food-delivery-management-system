import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    restaurant: null,
    subtotal: 0,
    deliveryFee: 40,
    tax: 0,
    discount: 0,
    coupon: null,
    total: 0,
    loading: false,
  },
  reducers: {
    setCart: (state, action) => {
      const data = action.payload;
      state.items = data.items || [];
      state.restaurant = data.restaurant || null;
      state.subtotal = data.subtotal || 0;
      state.discount = data.discount || 0;
      state.coupon = data.coupon || null;
      state.deliveryFee = data.restaurant?.deliveryFee || 40;
      state.tax = Math.round(state.subtotal * 0.05);
      state.total = Math.max(0, state.subtotal + state.tax + state.deliveryFee - state.discount);
    },
    clearCartState: (state) => {
      state.items = [];
      state.restaurant = null;
      state.subtotal = 0;
      state.discount = 0;
      state.coupon = null;
      state.total = 0;
    },
    applyCouponState: (state, action) => {
      state.coupon = action.payload.code;
      state.discount = action.payload.discount;
      state.total = Math.max(0, state.subtotal + state.tax + state.deliveryFee - action.payload.discount);
    },
    removeCouponState: (state) => {
      state.coupon = null;
      state.discount = 0;
      state.total = Math.max(0, state.subtotal + state.tax + state.deliveryFee);
    },
  },
});

export const { setCart, clearCartState, applyCouponState, removeCouponState } = cartSlice.actions;
export default cartSlice.reducer;
