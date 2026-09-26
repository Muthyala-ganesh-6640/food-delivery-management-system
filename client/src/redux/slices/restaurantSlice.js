import { createSlice } from '@reduxjs/toolkit';

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    restaurants: [],
    selectedRestaurant: null,
    loading: false,
    filters: {
      search: '',
      cuisine: '',
      rating: '',
      veg: false,
      sortBy: 'rating',
    },
  },
  reducers: {
    setRestaurants: (state, action) => {
      state.restaurants = action.payload;
    },
    setSelectedRestaurant: (state, action) => {
      state.selectedRestaurant = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { search: '', cuisine: '', rating: '', veg: false, sortBy: 'rating' };
    },
  },
});

export const { setRestaurants, setSelectedRestaurant, setFilters, clearFilters } = restaurantSlice.actions;
export default restaurantSlice.reducer;
