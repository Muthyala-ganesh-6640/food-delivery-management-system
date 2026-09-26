import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    unreadCount: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload.data || [];
      state.unreadCount = action.payload.unreadCount || 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markReadState: (state, action) => {
      const notif = state.notifications.find((n) => n._id === action.payload);
      if (notif && !notif.isRead) {
        notif.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
  },
});

export const { setNotifications, addNotification, markReadState } = notificationSlice.actions;
export default notificationSlice.reducer;
