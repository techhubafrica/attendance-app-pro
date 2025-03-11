import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  totalPages: 0,
  currentPage: 1,
  totalCount: 0,
  loading: false,
  error: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchNotificationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess: (state, action) => {
      state.notifications = action.payload.notifications;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.totalCount = action.payload.totalCount;
      state.loading = false;
      state.error = null;
    },
    createNotificationSuccess: (state, action) => {
      state.notifications.unshift(action.payload);
      state.totalCount += 1;
      state.loading = false;
      state.error = null;
    },
    markNotificationReadSuccess: (state, action) => {
      const index = state.notifications.findIndex(
        (notification) => notification._id === action.payload._id
      );
      if (index !== -1) {
        state.notifications[index].read = true;
      }
      state.loading = false;
      state.error = null;
    },
    deleteNotificationSuccess: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload
      );
      state.totalCount -= 1;
      state.loading = false;
      state.error = null;
    },
    notificationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  createNotificationSuccess,
  markNotificationReadSuccess,
  deleteNotificationSuccess,
  notificationFailure
} = notificationSlice.actions;

export default notificationSlice.reducer;