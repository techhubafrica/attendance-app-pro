import { toast } from 'sonner';
import {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  createNotificationSuccess,
  markNotificationReadSuccess,
  deleteNotificationSuccess,
  notificationFailure
} from '../slices/notificationSlice';
import api from '@/utils/server';

// Get all notifications for a user
export const getUserNotifications = (userId, params = {}) => async (dispatch) => {
  try {
    dispatch(fetchNotificationsStart());
    
    const { page = 1, limit = 10, read } = params;
    let url = `/api/notifications/user/${userId}?page=${page}&limit=${limit}`;
    
    if (read !== undefined) {
      url += `&read=${read}`;
    }
    
    const { data } = await api.get(url);
    dispatch(fetchNotificationsSuccess(data));
    return data;
  } catch (error) {
    const message = 
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(notificationFailure(message));
    toast.error(message);
    return null;
  }
};

// Create a new notification
export const createNotification = (notificationData) => async (dispatch) => {
  try {
    dispatch(fetchNotificationsStart());
    const { data } = await api.post('/api/notifications', notificationData);
    dispatch(createNotificationSuccess(data));
    toast.success('Notification created successfully');
    return data;
  } catch (error) {
    const message = 
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(notificationFailure(message));
    toast.error(message);
    return null;
  }
};

// Mark a notification as read
export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    dispatch(fetchNotificationsStart());
    const { data } = await api.put(`/api/notifications/${notificationId}/read`);
    dispatch(markNotificationReadSuccess(data));
    return data;
  } catch (error) {
    const message = 
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(notificationFailure(message));
    toast.error(message);
    return null;
  }
};

// Delete a notification
export const deleteNotification = (notificationId) => async (dispatch) => {
  try {
    dispatch(fetchNotificationsStart());
    await api.delete(`/api/notifications/${notificationId}`);
    dispatch(deleteNotificationSuccess(notificationId));
    toast.success('Notification deleted successfully');
    return true;
  } catch (error) {
    const message = 
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(notificationFailure(message));
    toast.error(message);
    return null;
  }
};