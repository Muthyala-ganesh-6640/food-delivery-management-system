import { createSlice } from '@reduxjs/toolkit';

const storedUser = localStorage.getItem('foodexpress_user')
  ? JSON.parse(localStorage.getItem('foodexpress_user'))
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    isAuthenticated: !!storedUser,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('foodexpress_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('foodexpress_user');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('foodexpress_user', JSON.stringify(state.user));
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
