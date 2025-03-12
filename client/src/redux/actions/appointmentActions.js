import api from '@/utils/server';
import { toast } from 'sonner';

// Create a new appointment
export const createAppointment = (appointmentData) => async (dispatch) => {
  try {
    dispatch({ type: 'appointments/setLoading', payload: true });
    
    const response = await api.post('/appointments', appointmentData);
    
    dispatch({
      type: 'appointments/createAppointmentSuccess',
      payload: response.data,
    });
    
    toast.success('Appointment booked successfully');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to book appointment';
    
    dispatch({
      type: 'appointments/appointmentError',
      payload: message,
    });
    
    toast.error(message);
    throw error;
  }
};

// Get all appointments (admin/faculty only)
export const getAllAppointments = () => async (dispatch) => {
  try {
    dispatch({ type: 'appointments/setLoading', payload: true });
    
    const response = await api.get('/appointments');
    
    dispatch({
      type: 'appointments/getAllAppointmentsSuccess',
      payload: response.data,
    });
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch appointments';
    
    dispatch({
      type: 'appointments/appointmentError',
      payload: message,
    });
    
    toast.error(message);
    throw error;
  }
};

// Get user appointments
export const getUserAppointments = () => async (dispatch) => {
  try {
    dispatch({ type: 'appointments/setLoading', payload: true });
    
    const response = await api.get('/appointments/user');
    
    dispatch({
      type: 'appointments/getUserAppointmentsSuccess',
      payload: response.data,
    });
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch your appointments';
    
    dispatch({
      type: 'appointments/appointmentError',
      payload: message,
    });
    
    toast.error(message);
    throw error;
  }
};

// Get single appointment
export const getAppointmentById = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'appointments/setLoading', payload: true });
    
    const response = await api.get(`/appointments/${id}`);
    
    dispatch({
      type: 'appointments/getAppointmentSuccess',
      payload: response.data,
    });
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch appointment details';
    
    dispatch({
      type: 'appointments/appointmentError',
      payload: message,
    });
    
    toast.error(message);
    throw error;
  }
};

// Approve appointment (admin/faculty only)
export const approveAppointment = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'appointments/setLoading', payload: true });
    
    const response = await api.put(`/appointments/approve/${id}`);
    
    dispatch({
      type: 'appointments/approveAppointmentSuccess',
      payload: response.data,
    });
    
    toast.success('Appointment approved successfully');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to approve appointment';
    
    dispatch({
      type: 'appointments/appointmentError',
      payload: message,
    });
    
    toast.error(message);
    throw error;
  }
};

// Check in for appointment
export const checkInAppointment = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'appointments/setLoading', payload: true });
    
    const response = await api.put(`/appointments/${id}/checkin`);
    
    dispatch({
      type: 'appointments/checkInAppointmentSuccess',
      payload: response.data,
    });
    
    toast.success('Successfully checked in');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to check in';
    
    dispatch({
      type: 'appointments/appointmentError',
      payload: message,
    });
    
    toast.error(message);
    throw error;
  }
};

// Check out from appointment
export const checkOutAppointment = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'appointments/setLoading', payload: true });
    
    const response = await api.put(`/appointments/${id}/checkout`);
    
    dispatch({
      type: 'appointments/checkOutAppointmentSuccess',
      payload: response.data,
    });
    
    toast.success('Successfully checked out');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to check out';
    
    dispatch({
      type: 'appointments/appointmentError',
      payload: message,
    });
    
    toast.error(message);
    throw error;
  }
};
